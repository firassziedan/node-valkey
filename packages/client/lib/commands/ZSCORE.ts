import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';

export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(
    key: ValkeyCommandArgument,
    member: ValkeyCommandArgument
): ValkeyCommandArguments {
    return ['ZSCORE', key, member];
}

export { transformNumberInfinityNullReply as transformReply } from './generic-transformers';
