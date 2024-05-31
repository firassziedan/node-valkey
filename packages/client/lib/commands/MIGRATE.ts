import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';
import { AuthOptions } from './AUTH';

interface MigrateOptions {
    COPY?: true;
    REPLACE?: true;
    AUTH?: AuthOptions;
}

export function transformArguments(
    host: ValkeyCommandArgument,
    port: number,
    key: ValkeyCommandArgument | Array<ValkeyCommandArgument>,
    destinationDb: number,
    timeout: number,
    options?: MigrateOptions
): ValkeyCommandArguments {
    const args = ['MIGRATE', host, port.toString()],
        isKeyArray = Array.isArray(key);

    if (isKeyArray) {
        args.push('');
    } else {
        args.push(key);
    }

    args.push(
        destinationDb.toString(),
        timeout.toString()
    );

    if (options?.COPY) {
        args.push('COPY');
    }

    if (options?.REPLACE) {
        args.push('REPLACE');
    }

    if (options?.AUTH) {
        if (options.AUTH.username) {
            args.push(
                'AUTH2',
                options.AUTH.username,
                options.AUTH.password
            );
        } else {
            args.push(
                'AUTH',
                options.AUTH.password
            );
        }
    }

    if (isKeyArray) {
        args.push(
            'KEYS',
            ...key
        );
    }

    return args;
}

export declare function transformReply(): string;
