import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: ValkeyCommandArgument): ValkeyCommandArguments {
    return ['DUMP', key];
}

export declare function transformReply(): ValkeyCommandArgument;
