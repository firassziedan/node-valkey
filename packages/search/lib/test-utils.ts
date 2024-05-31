import TestUtils from 'valkey-test-utils';
import ValkeySearch from '.';

export default new TestUtils({
    dockerImageName: 'valkeylabs/valkeyearch',
    dockerImageVersionArgument: 'valkeyearch-version',
    defaultDockerVersion: '2.4.9'
});

export const GLOBAL = {
    SERVERS: {
        OPEN: {
            serverArguments: ['--loadmodule /usr/lib/valkey/modules/valkeyearch.so'],
            clientOptions: {
                modules: {
                    ft: ValkeySearch
                }
            }
        }
    }
};
