import { transformValkeyJsonArgument } from '.';

export const FIRST_KEY_INDEX = 1;

type AppendArguments = [key: string, append: string];

type AppendWithPathArguments = [key: string, path: string, append: string];

export function transformArguments(...[key, pathOrAppend, append]: AppendArguments | AppendWithPathArguments): Array<string> {
    const args = ['JSON.STRAPPEND', key];

    if (append !== undefined && append !== null) {
        args.push(pathOrAppend, transformValkeyJsonArgument(append));
    } else {
        args.push(transformValkeyJsonArgument(pathOrAppend));
    }

    return args;
}

export declare function transformReply(): number | Array<number>;
