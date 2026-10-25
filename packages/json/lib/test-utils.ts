import TestUtils from 'valkey-test-utils';
import ValkeyJSON from '.';

// valkey-json ships in the official `valkey/valkey-bundle` image (Valkey >= 8.1).
export default new TestUtils({
    dockerImageName: 'valkey/valkey-bundle',
    dockerImageVersionArgument: 'valkey-bundle-version',
    defaultDockerVersion: '9.1'
});

const OPEN = {
    serverArguments: ['--loadmodule /usr/lib/valkey/libjson.so'],
    clientOptions: {
        modules: {
            json: ValkeyJSON
        }
    }
};

export const GLOBAL = {
    SERVERS: {
        OPEN,
        /** For commands that exist in the API but are not implemented by valkey-json. */
        UNSUPPORTED: {
            ...OPEN,
            skip: 'command is not implemented by valkey-json'
        }
    }
};
