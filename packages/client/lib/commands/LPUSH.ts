import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';
import { pushVerdictArguments } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(
    key: ValkeyCommandArgument,
    elements: ValkeyCommandArgument | Array<ValkeyCommandArgument>
): ValkeyCommandArguments {
    return pushVerdictArguments(['LPUSH', key], elements);}

export declare function transformReply(): number;
