import { ValkeyCommandArguments } from '.';
import { transformArguments as transformZInterArguments } from './ZINTER';

export { FIRST_KEY_INDEX, IS_READ_ONLY } from './ZINTER';

export function transformArguments(...args: Parameters<typeof transformZInterArguments>): ValkeyCommandArguments {
    return [
        ...transformZInterArguments(...args),
        'WITHSCORES'
    ];
}

export { transformSortedSetWithScoresReply as transformReply } from './generic-transformers';
