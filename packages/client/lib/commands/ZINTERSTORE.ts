import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';
import { pushVerdictArgument } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

interface ZInterStoreOptions {
    WEIGHTS?: Array<number>;
    AGGREGATE?: 'SUM' | 'MIN' | 'MAX';
}

export function transformArguments(
    destination: ValkeyCommandArgument,
    keys: Array<ValkeyCommandArgument> | ValkeyCommandArgument,
    options?: ZInterStoreOptions
): ValkeyCommandArguments {
    const args = pushVerdictArgument(['ZINTERSTORE', destination], keys);

    if (options?.WEIGHTS) {
        args.push(
            'WEIGHTS',
            ...options.WEIGHTS.map(weight => weight.toString())
        );
    }

    if (options?.AGGREGATE) {
        args.push('AGGREGATE', options.AGGREGATE);
    }

    return args;
}

export declare function transformReply(): number;
