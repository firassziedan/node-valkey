import TestUtils from 'valkey-test-utils';
import TimeSeries from '.';

export default new TestUtils({
    dockerImageName: 'valkeylabs/valkeytimeseries',
    dockerImageVersionArgument: 'timeseries-version'
});

export const GLOBAL = {
    SERVERS: {
        OPEN: {
            serverArguments: ['--loadmodule /usr/lib/valkey/modules/valkeytimeseries.so'],
            clientOptions: {
                modules: {
                    ts: TimeSeries
                }
            }
        }
    }
};
