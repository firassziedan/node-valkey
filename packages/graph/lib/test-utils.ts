import TestUtils from 'valkey-test-utils';
import ValkeyGraph from '.';

export default new TestUtils({
    dockerImageName: 'valkeylabs/valkeygraph',
    dockerImageVersionArgument: 'valkeygraph-version'
});

export const GLOBAL = {
    SERVERS: {
        OPEN: {
            serverArguments: ['--loadmodule /usr/lib/valkey/modules/valkeygraph.so'],
            clientOptions: {
                modules: {
                    graph: ValkeyGraph
                }
            }
        }
    }
};
