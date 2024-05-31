import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';
import { pushVerdictArguments } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(
    keys: ValkeyCommandArgument | Array<ValkeyCommandArgument>
): ValkeyCommandArguments {
    return pushVerdictArguments(['EXISTS'], keys);
}

export declare function transformReply(): number;
