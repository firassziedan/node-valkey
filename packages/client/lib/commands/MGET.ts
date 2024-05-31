import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';

export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(
    keys: Array<ValkeyCommandArgument>
): ValkeyCommandArguments {
    return ['MGET', ...keys];
}

export declare function transformReply(): Array<ValkeyCommandArgument | null>;
