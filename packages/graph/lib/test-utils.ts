import TestUtils from 'valkey-test-utils';
import ValkeyGraph from '.';

// There is no graph module for Valkey (RedisGraph is end-of-life and was never ported), so the
// integration tests of this package cannot run against any Valkey server and are reported as skipped.
export default new TestUtils({
    unavailableReason: 'no Valkey module implements the GRAPH.* commands'
});

export const GLOBAL = {
    SERVERS: {
        OPEN: {
            serverArguments: [],
            clientOptions: {
                modules: {
                    graph: ValkeyGraph
                }
            }
        }
    }
};
