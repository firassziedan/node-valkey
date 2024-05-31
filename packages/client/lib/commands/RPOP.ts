import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: ValkeyCommandArgument): ValkeyCommandArguments {
    return ['RPOP', key];
}

export declare function transformReply(): ValkeyCommandArgument | null;
