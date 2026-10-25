import TestUtils from 'valkey-test-utils';
import ValkeySearch from '.';

// valkey-search ships in the official `valkey/valkey-bundle` image (Valkey >= 8.1).
// valkey-json is loaded as well so that JSON documents can be indexed.
export default new TestUtils({
    dockerImageName: 'valkey/valkey-bundle',
    dockerImageVersionArgument: 'valkey-bundle-version',
    defaultDockerVersion: '9.1'
});

const OPEN = {
    serverArguments: [
        '--loadmodule /usr/lib/valkey/libjson.so',
        '--loadmodule /usr/lib/valkey/libsearch.so'
    ],
    clientOptions: {
        modules: {
            ft: ValkeySearch
        }
    }
};

export const GLOBAL = {
    SERVERS: {
        OPEN,
        /**
         * valkey-search implements FT.CREATE, FT.DROPINDEX, FT.INFO, FT._LIST, FT.SEARCH and FT.AGGREGATE.
         * The remaining commands are kept in the API but have no Valkey server implementation.
         */
        UNSUPPORTED: {
            ...OPEN,
            skip: 'command is not implemented by valkey-search'
        }
    }
};
