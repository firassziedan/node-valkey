import { pushVerdictArguments } from 'valkey-client/dist/lib/commands/generic-transformers';
import { ValkeyCommandArgument, ValkeyCommandArguments } from 'valkey-client/dist/lib/commands';

export const FIRST_KEY_INDEX = 1;

interface InsertOptions {
    CAPACITY?: number;
    ERROR?: number;
    EXPANSION?: number;
    NOCREATE?: true;
    NONSCALING?: true;
}

export function transformArguments(
    key: string,
    items: ValkeyCommandArgument | Array<ValkeyCommandArgument>,
    options?: InsertOptions
): ValkeyCommandArguments {
    const args = ['BF.INSERT', key];

    if (options?.CAPACITY) {
        args.push('CAPACITY', options.CAPACITY.toString());
    }

    if (options?.ERROR) {
        args.push('ERROR', options.ERROR.toString());
    }

    if (options?.EXPANSION) {
        args.push('EXPANSION', options.EXPANSION.toString());
    }

    if (options?.NOCREATE) {
        args.push('NOCREATE');
    }

    if (options?.NONSCALING) {
        args.push('NONSCALING');
    }

    args.push('ITEMS');
    return pushVerdictArguments(args, items);
}

export { transformBooleanArrayReply as transformReply } from 'valkey-client/dist/lib/commands/generic-transformers';
