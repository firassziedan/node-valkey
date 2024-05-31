import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';
import { transformStringNumberInfinityArgument } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

interface ZRangeStoreOptions {
    BY?: 'SCORE' | 'LEX';
    REV?: true;
    LIMIT?: {
        offset: number;
        count: number;
    };
    WITHSCORES?: true;
}

export function transformArguments(
    dst: ValkeyCommandArgument,
    src: ValkeyCommandArgument,
    min: ValkeyCommandArgument | number,
    max: ValkeyCommandArgument | number,
    options?: ZRangeStoreOptions
): ValkeyCommandArguments {
    const args = [
        'ZRANGESTORE',
        dst,
        src,
        transformStringNumberInfinityArgument(min),
        transformStringNumberInfinityArgument(max)
    ];

    switch (options?.BY) {
        case 'SCORE':
            args.push('BYSCORE');
            break;

        case 'LEX':
            args.push('BYLEX');
            break;
    }

    if (options?.REV) {
        args.push('REV');
    }

    if (options?.LIMIT) {
        args.push('LIMIT', options.LIMIT.offset.toString(), options.LIMIT.count.toString());
    }

    if (options?.WITHSCORES) {
        args.push('WITHSCORES');
    }

    return args;
}

export function transformReply(reply: number): number {
    if (typeof reply !== 'number') {
        throw new TypeError(`Upgrade to Valkey 6.2.5 and up (https://github.com/valkey/valkey/pull/9089)`);
    }

    return reply;
}
