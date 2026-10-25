import { ValkeyModules, ValkeyFunctions, ValkeyScripts } from 'valkey-client/lib/commands';
import ValkeyClient, { ValkeyClientOptions, ValkeyClientType } from 'valkey-client/lib/client';
import ValkeyCluster, { ValkeyClusterOptions, ValkeyClusterType } from 'valkey-client/lib/cluster';
import { ValkeySocketCommonOptions } from 'valkey-client/lib/client/socket';
import { ValkeyServerDockerConfig, spawnValkeyServer, spawnValkeyCluster } from './dockers';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface TestUtilsConfig {
    /**
     * Docker image to run the integration tests against (e.g. `valkey/valkey`, `valkey/valkey-bundle`).
     * Leave undefined when no Valkey server image exists for the package: every integration test
     * is then reported as skipped with `unavailableReason`.
     */
    dockerImageName?: string;
    /** CLI argument (without `--`) used to pick the image tag, e.g. `valkey-version`. */
    dockerImageVersionArgument?: string;
    defaultDockerVersion?: string;
    /** Shown in the title of skipped tests when `dockerImageName` is undefined. */
    unavailableReason?: string;
}

interface CommonTestOptions {
    minimumDockerVersion?: Array<number>;
    /**
     * When set, the integration test is registered as skipped (with this reason in its title) instead of
     * being executed. Used for commands that the Valkey module does not implement.
     */
    skip?: string;
}

interface ClientTestOptions<
    M extends ValkeyModules,
    F extends ValkeyFunctions,
    S extends ValkeyScripts
> extends CommonTestOptions {
    serverArguments: Array<string>;
    clientOptions?: Partial<Omit<ValkeyClientOptions<M, F, S>, 'socket'> & { socket: ValkeySocketCommonOptions }>;
    disableClientSetup?: boolean;
}

interface ClusterTestOptions<
    M extends ValkeyModules,
    F extends ValkeyFunctions,
    S extends ValkeyScripts
> extends CommonTestOptions {
    serverArguments: Array<string>;
    clusterConfiguration?: Partial<ValkeyClusterOptions<M, F, S>>;
    numberOfMasters?: number;
    numberOfReplicas?: number;
}

interface Version {
    string: string;
    numbers: Array<number>;
}

export default class TestUtils {
    static #parseVersionNumber(version: string): Array<number> {
        if (version === 'latest' || version === 'edge' || version === 'unstable') return [Infinity];

        const dashIndex = version.indexOf('-');
        return (dashIndex === -1 ? version : version.substring(0, dashIndex))
            .split('.')
            .map(x => {
                const value = Number(x);
                if (Number.isNaN(value)) {
                    throw new TypeError(`${version} is not a valid valkey version`);
                }

                return value;
            });
    }

    static #getVersion(argumentName: string, defaultVersion = 'latest'): Version {
        return yargs(hideBin(process.argv))
            .option(argumentName, {
                type: 'string',
                default: defaultVersion
            })
            .coerce(argumentName, (version: string) => {
                return {
                    string: version,
                    numbers: TestUtils.#parseVersionNumber(version)
                };
            })
            .demandOption(argumentName)
            .parseSync()[argumentName];
    }

    readonly #VERSION_NUMBERS: Array<number>;
    readonly #DOCKER_IMAGE: ValkeyServerDockerConfig | undefined;
    readonly #UNAVAILABLE_REASON: string;

    constructor(config: TestUtilsConfig) {
        this.#UNAVAILABLE_REASON = config.unavailableReason ?? 'no Valkey docker image is configured for this package';

        if (!config.dockerImageName || !config.dockerImageVersionArgument) {
            this.#VERSION_NUMBERS = [Infinity];
            this.#DOCKER_IMAGE = undefined;
            return;
        }

        const { string, numbers } = TestUtils.#getVersion(config.dockerImageVersionArgument, config.defaultDockerVersion);
        this.#VERSION_NUMBERS = numbers;
        this.#DOCKER_IMAGE = {
            image: config.dockerImageName,
            version: string
        };
    }

    /** `true` when a docker image is configured, i.e. integration tests can actually run. */
    get hasServer(): boolean {
        return this.#DOCKER_IMAGE !== undefined;
    }

    isVersionGreaterThan(minimumVersion: Array<number> | undefined): boolean {
        if (minimumVersion === undefined) return true;

        const lastIndex = Math.min(this.#VERSION_NUMBERS.length, minimumVersion.length) - 1;
        for (let i = 0; i < lastIndex; i++) {
            if (this.#VERSION_NUMBERS[i] > minimumVersion[i]) {
                return true;
            } else if (minimumVersion[i] > this.#VERSION_NUMBERS[i]) {
                return false;
            }
        }

        return this.#VERSION_NUMBERS[lastIndex] >= minimumVersion[lastIndex];
    }

    isVersionGreaterThanHook(minimumVersion: Array<number> | undefined): void {
        const isVersionGreaterThan = this.isVersionGreaterThan.bind(this);
        before(function () {
            if (!isVersionGreaterThan(minimumVersion)) {
                return this.skip();
            }
        });
    }

    #skipReason(options: CommonTestOptions): string | undefined {
        if (options.skip) return options.skip;
        if (!this.#DOCKER_IMAGE) return this.#UNAVAILABLE_REASON;
        return undefined;
    }

    static #registerSkipped(title: string, reason: string): void {
        it(`${title} [skipped: ${reason}]`, function () {
            this.skip();
        });
    }

    testWithClient<
        M extends ValkeyModules,
        F extends ValkeyFunctions,
        S extends ValkeyScripts
    >(
        title: string,
        fn: (client: ValkeyClientType<M, F, S>) => unknown,
        options: ClientTestOptions<M, F, S>
    ): void {
        const skipReason = this.#skipReason(options);
        if (skipReason !== undefined) {
            return TestUtils.#registerSkipped(title, skipReason);
        }

        let dockerPromise: ReturnType<typeof spawnValkeyServer>;
        if (this.isVersionGreaterThan(options.minimumDockerVersion)) {
            const dockerImage = this.#DOCKER_IMAGE!;
            before(function () {
                this.timeout(30000);

                dockerPromise = spawnValkeyServer(dockerImage, options.serverArguments);
                return dockerPromise;
            });
        }

        it(title, async function() {
            if (!dockerPromise) return this.skip();

            const client = ValkeyClient.create({
                ...options?.clientOptions,
                socket: {
                    ...options?.clientOptions?.socket,
                    port: (await dockerPromise).port
                }
            });

            if (options.disableClientSetup) {
                return fn(client);
            }

            await client.connect();

            try {
                await client.flushAll();
                await fn(client);
            } finally {
                if (client.isOpen) {
                    await client.flushAll();
                    await client.disconnect();
                }
            }
        });
    }

    static async #clusterFlushAll<
        M extends ValkeyModules,
        F extends ValkeyFunctions,
        S extends ValkeyScripts
    >(cluster: ValkeyClusterType<M, F, S>): Promise<unknown> {
        return Promise.all(
            cluster.masters.map(async ({ client }) => {
                if (client) {
                    await (await client).flushAll();
                }
            })
        );
    }

    testWithCluster<
        M extends ValkeyModules,
        F extends ValkeyFunctions,
        S extends ValkeyScripts
    >(
        title: string,
        fn: (cluster: ValkeyClusterType<M, F, S>) => unknown,
        options: ClusterTestOptions<M, F, S>
    ): void {
        const skipReason = this.#skipReason(options);
        if (skipReason !== undefined) {
            return TestUtils.#registerSkipped(title, skipReason);
        }

        let dockersPromise: ReturnType<typeof spawnValkeyCluster>;
        if (this.isVersionGreaterThan(options.minimumDockerVersion)) {
            const dockerImage = this.#DOCKER_IMAGE!;
            before(function () {
                this.timeout(30000);

                dockersPromise = spawnValkeyCluster({
                    ...dockerImage,
                    numberOfMasters: options?.numberOfMasters,
                    numberOfReplicas: options?.numberOfReplicas
                }, options.serverArguments);
                return dockersPromise;
            });
        }

        it(title, async function () {
            if (!dockersPromise) return this.skip();

            const dockers = await dockersPromise,
                cluster = ValkeyCluster.create({
                    rootNodes: dockers.map(({ port }) => ({
                        socket: {
                            port
                        }
                    })),
                    minimizeConnections: true,
                    ...options.clusterConfiguration
                });

            await cluster.connect();

            try {
                await TestUtils.#clusterFlushAll(cluster);
                await fn(cluster);
            } finally {
                await TestUtils.#clusterFlushAll(cluster);
                await cluster.disconnect();
            }
        });
    }
}
