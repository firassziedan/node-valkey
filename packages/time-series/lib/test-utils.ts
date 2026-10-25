import TestUtils from 'valkey-test-utils';
import TimeSeries from '.';

// No released Valkey module provides the TS.* commands (the ValkeyTimeSeries project has no release or
// docker image yet), so the integration tests of this package are reported as skipped.
export default new TestUtils({
    unavailableReason: 'no released Valkey module implements the TS.* commands'
});

export const GLOBAL = {
    SERVERS: {
        OPEN: {
            serverArguments: [],
            clientOptions: {
                modules: {
                    ts: TimeSeries
                }
            }
        }
    }
};
