export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(key: string): Array<string> {
    return ['BF.INFO', key];
}

/** Flat list of `name, value` pairs; the set of names depends on the server implementation. */
export type InfoRawReply = Array<string | number | null>;

export interface InfoReply {
    capacity: number;
    size: number;
    numberOfFilters: number;
    numberOfInsertedItems: number;
    /** `null` for non-scaling filters. */
    expansionRate: number | null;
    /** Reported by valkey-bloom only. */
    errorRate?: number;
    /** Reported by valkey-bloom only. */
    tighteningRatio?: number;
    /** Reported by valkey-bloom only. */
    maxScaledCapacity?: number;
}

const FIELDS: Record<string, keyof InfoReply> = {
    'Capacity': 'capacity',
    'Size': 'size',
    'Number of filters': 'numberOfFilters',
    'Number of items inserted': 'numberOfInsertedItems',
    'Expansion rate': 'expansionRate',
    'Error rate': 'errorRate',
    'Tightening ratio': 'tighteningRatio',
    'Max scaled capacity': 'maxScaledCapacity'
};

// The reply is parsed by field name rather than by position: valkey-bloom returns more fields than
// RedisBloom did (and in a different order), so positional access returned the wrong values.
export function transformReply(reply: InfoRawReply): InfoReply {
    const info: Record<string, number | null> = {};
    for (let i = 0; i + 1 < reply.length; i += 2) {
        const field = FIELDS[String(reply[i])];
        if (!field) continue;

        const value = reply[i + 1];
        info[field] = value === null ? null : Number(value);
    }

    return info as unknown as InfoReply;
}
