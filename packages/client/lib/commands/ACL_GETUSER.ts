import { ValkeyCommandArgument, ValkeyCommandArguments } from '.';

export function transformArguments(username: ValkeyCommandArgument): ValkeyCommandArguments {
    return ['ACL', 'GETUSER', username];
}

/** Flat list of `name, value` pairs; the set of names depends on the server version. */
type AclGetUserRawReply = Array<any>;

interface AclUser {
    flags: Array<ValkeyCommandArgument>;
    passwords: Array<ValkeyCommandArgument>;
    commands: ValkeyCommandArgument;
    keys: Array<ValkeyCommandArgument> | ValkeyCommandArgument;
    channels: Array<ValkeyCommandArgument> | ValkeyCommandArgument;
    selectors?: Array<Array<string>>;
    /** Valkey 9.0 and up (per-database ACL rules). */
    databases?: ValkeyCommandArgument;
}

// Parsed by field name rather than by position: Valkey 9 inserts `databases` before `selectors`,
// which made the positional parser return the wrong value for `selectors`.
export function transformReply(reply: AclGetUserRawReply): AclUser {
    const fields: Record<string, any> = {};
    for (let i = 0; i + 1 < reply.length; i += 2) {
        fields[reply[i]] = reply[i + 1];
    }

    const user: AclUser = {
        flags: fields.flags,
        passwords: fields.passwords,
        commands: fields.commands,
        keys: fields.keys,
        channels: fields.channels,
        selectors: fields.selectors
    };

    if (fields.databases !== undefined) {
        user.databases = fields.databases;
    }

    return user;
}
