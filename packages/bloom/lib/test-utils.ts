import TestUtils from 'valkey-test-utils';
import ValkeyBloomModules from '.';

export default new TestUtils({
    dockerImageName: 'valkeylabs/rebloom',
    dockerImageVersionArgument: 'valkeybloom-version',
    defaultDockerVersion: 'edge'
});

export const GLOBAL = {
    SERVERS: {
        OPEN: {
            serverArguments: ['--loadmodule /usr/lib/valkey/modules/valkeybloom.so'],
            clientOptions: {
                modules: ValkeyBloomModules
            }
        }
    }
};
