import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';

export const FIRST_KEY_INDEX = 1;

export type MSetArguments =
    Array<[ValkeyCommandArgument, ValkeyCommandArgument]> |
    Array<ValkeyCommandArgument> |
    Record<string, ValkeyCommandArgument>;

export function transformArguments(toSet: MSetArguments): ValkeyCommandArguments {
    const args: ValkeyCommandArguments = ['MSET'];

    if (Array.isArray(toSet)) {
        args.push(...toSet.flat());
    } else {
        for (const key of Object.keys(toSet)) {
            args.push(key, toSet[key]);
        }
    }

    return args;
}

export declare function transformReply(): ValkeyCommandArgument;
