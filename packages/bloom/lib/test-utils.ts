import TestUtils from 'valkey-test-utils';
import ValkeyBloomModules from '.';

// valkey-bloom ships in the official `valkey/valkey-bundle` image (Valkey >= 8.1).
export default new TestUtils({
    dockerImageName: 'valkey/valkey-bundle',
    dockerImageVersionArgument: 'valkey-bundle-version',
    defaultDockerVersion: '9.1'
});

const OPEN = {
    serverArguments: ['--loadmodule /usr/lib/valkey/libvalkey_bloom.so'],
    clientOptions: {
        modules: ValkeyBloomModules
    }
};

export const GLOBAL = {
    SERVERS: {
        OPEN,
        /**
         * valkey-bloom only implements the Bloom filter (`BF.*`) commands. Cuckoo filters, Count-Min Sketch,
         * Top-K and t-digest commands are kept in the API but have no Valkey server implementation.
         */
        UNSUPPORTED: {
            ...OPEN,
            skip: 'command is not implemented by valkey-bloom'
        }
    }
};
