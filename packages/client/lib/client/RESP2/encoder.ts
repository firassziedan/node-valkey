import { ValkeyCommandArgument, ValkeyCommandArguments } from '../../commands';

const CRLF = '\r\n';

export default function encodeCommand(args: ValkeyCommandArguments): Array<ValkeyCommandArgument> {
    const toWrite: Array<ValkeyCommandArgument> = [];

    let strings = '*' + args.length + CRLF;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg === 'string') {
            strings += '$' + Buffer.byteLength(arg) + CRLF + arg + CRLF;
        } else if (arg instanceof Buffer) {
            toWrite.push(
                strings + '$' + arg.length.toString() + CRLF,
                arg
            );
            strings = CRLF;
        } else {
            throw new TypeError('Invalid argument type');
        }
    }

    toWrite.push(strings);

    return toWrite;
}
