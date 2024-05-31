import { ValkeyCommandArguments } from 'valkey-client/dist/lib/commands';
import { Timestamp, MRangeWithLabelsOptions, pushMRangeWithLabelsArguments } from '.';

export const IS_READ_ONLY = true;

export function transformArguments(
    fromTimestamp: Timestamp,
    toTimestamp: Timestamp,
    filters: string | Array<string>,
    options?: MRangeWithLabelsOptions
): ValkeyCommandArguments {
    return pushMRangeWithLabelsArguments(
        ['TS.MRANGE'],
        fromTimestamp,
        toTimestamp,
        filters,
        options
    );
}

export { transformMRangeWithLabelsReply as transformReply } from '.';
