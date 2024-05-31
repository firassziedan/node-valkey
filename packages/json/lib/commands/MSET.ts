import { ValkeyJSON, transformValkeyJsonArgument } from '.';
import { ValkeyCommandArgument } from 'valkey-client/dist/lib/commands';

export const FIRST_KEY_INDEX = 1;

interface JsonMSetItem {
    key: ValkeyCommandArgument;
    path: ValkeyCommandArgument;
    value: ValkeyJSON;
}

export function transformArguments(items: Array<JsonMSetItem>): Array<string> {

    const args = new Array(1 + items.length * 3);
    args[0] = 'JSON.MSET';

    let argsIndex = 1;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        args[argsIndex++] = item.key;
        args[argsIndex++] = item.path;
        args[argsIndex++] = transformValkeyJsonArgument(item.value);
    }

    return args;
}

export declare function transformReply(): 'OK';
