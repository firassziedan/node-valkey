import { ValkeyCommandArgument } from 'valkey-client/dist/lib/commands';
import { transformTuplesReply } from 'valkey-client/dist/lib/commands/generic-transformers';

export function transformArguments(index: string): Array<string> {
    return ['FT.INFO', index];
}

/** Flat list of `name, value` pairs. The set of names differs between valkey-search and RediSearch. */
export type InfoRawReply = Array<any>;

export interface InfoReply {
    indexName: ValkeyCommandArgument;
    indexDefinition: Record<string, ValkeyCommandArgument>;
    attributes: Array<Record<string, ValkeyCommandArgument>>;
    numDocs: ValkeyCommandArgument;
    numTerms?: ValkeyCommandArgument;
    numRecords?: ValkeyCommandArgument;
    hashIndexingFailures?: ValkeyCommandArgument;
    stopWords?: Array<ValkeyCommandArgument>;

    // reported by valkey-search
    totalTermOccurrences?: ValkeyCommandArgument;
    backfillInProgress?: ValkeyCommandArgument;
    backfillCompletePercent?: ValkeyCommandArgument;
    mutationQueueSize?: ValkeyCommandArgument;
    recentMutationsQueueDelay?: ValkeyCommandArgument;
    state?: ValkeyCommandArgument;
    punctuation?: ValkeyCommandArgument;
    withOffsets?: ValkeyCommandArgument;
    minStemSize?: ValkeyCommandArgument;
    language?: ValkeyCommandArgument;

    // reported by RediSearch (kept so that replies from a RediSearch-compatible server still parse)
    indexOptions?: Array<ValkeyCommandArgument>;
    maxDocId?: ValkeyCommandArgument;
    invertedSzMb?: ValkeyCommandArgument;
    vectorIndexSzMb?: ValkeyCommandArgument;
    totalInvertedIndexBlocks?: ValkeyCommandArgument;
    offsetVectorsSzMb?: ValkeyCommandArgument;
    docTableSizeMb?: ValkeyCommandArgument;
    sortableValuesSizeMb?: ValkeyCommandArgument;
    keyTableSizeMb?: ValkeyCommandArgument;
    recordsPerDocAvg?: ValkeyCommandArgument;
    bytesPerRecordAvg?: ValkeyCommandArgument;
    offsetsPerTermAvg?: ValkeyCommandArgument;
    offsetBitsPerRecordAvg?: ValkeyCommandArgument;
    indexing?: ValkeyCommandArgument;
    percentIndexed?: ValkeyCommandArgument;
    gcStats?: {
        bytesCollected?: ValkeyCommandArgument;
        totalMsRun?: ValkeyCommandArgument;
        totalCycles?: ValkeyCommandArgument;
        averageCycleTimeMs?: ValkeyCommandArgument;
        lastRunTimeMs?: ValkeyCommandArgument;
        gcNumericTreesMissed?: ValkeyCommandArgument;
        gcBlocksDenied?: ValkeyCommandArgument;
    };
    cursorStats?: {
        globalIdle?: number;
        globalTotal?: number;
        indexCapacity?: number;
        idnexTotal?: number;
    };
}

const SCALAR_FIELDS: Record<string, keyof InfoReply> = {
    index_name: 'indexName',
    index_options: 'indexOptions',
    num_docs: 'numDocs',
    max_doc_id: 'maxDocId',
    num_terms: 'numTerms',
    num_records: 'numRecords',
    total_term_occurrences: 'totalTermOccurrences',
    inverted_sz_mb: 'invertedSzMb',
    vector_index_sz_mb: 'vectorIndexSzMb',
    total_inverted_index_blocks: 'totalInvertedIndexBlocks',
    offset_vectors_sz_mb: 'offsetVectorsSzMb',
    doc_table_size_mb: 'docTableSizeMb',
    sortable_values_size_mb: 'sortableValuesSizeMb',
    key_table_size_mb: 'keyTableSizeMb',
    records_per_doc_avg: 'recordsPerDocAvg',
    bytes_per_record_avg: 'bytesPerRecordAvg',
    offsets_per_term_avg: 'offsetsPerTermAvg',
    offset_bits_per_record_avg: 'offsetBitsPerRecordAvg',
    hash_indexing_failures: 'hashIndexingFailures',
    indexing: 'indexing',
    percent_indexed: 'percentIndexed',
    backfill_in_progress: 'backfillInProgress',
    backfill_complete_percent: 'backfillCompletePercent',
    mutation_queue_size: 'mutationQueueSize',
    recent_mutations_queue_delay: 'recentMutationsQueueDelay',
    state: 'state',
    punctuation: 'punctuation',
    stop_words: 'stopWords',
    stopwords_list: 'stopWords',
    with_offsets: 'withOffsets',
    min_stem_size: 'minStemSize',
    language: 'language'
};

const GC_STATS_FIELDS: Record<string, string> = {
    bytes_collected: 'bytesCollected',
    total_ms_run: 'totalMsRun',
    total_cycles: 'totalCycles',
    average_cycle_time_ms: 'averageCycleTimeMs',
    last_run_time_ms: 'lastRunTimeMs',
    gc_numeric_trees_missed: 'gcNumericTreesMissed',
    gc_blocks_denied: 'gcBlocksDenied'
};

const CURSOR_STATS_FIELDS: Record<string, string> = {
    global_idle: 'globalIdle',
    global_total: 'globalTotal',
    index_capacity: 'indexCapacity',
    index_total: 'idnexTotal'
};

function transformNamedTuples(reply: Array<any>, fields: Record<string, string>): Record<string, any> {
    const result: Record<string, any> = {};
    for (let i = 0; i + 1 < reply.length; i += 2) {
        const name = fields[reply[i]];
        if (name) result[name] = reply[i + 1];
    }

    return result;
}

// The reply is parsed by field name rather than by position: valkey-search returns a different set of
// fields than RediSearch, so positional access threw or returned garbage against a Valkey server.
export function transformReply(rawReply: InfoRawReply): InfoReply {
    const reply: Record<string, any> = {};
    for (let i = 0; i + 1 < rawReply.length; i += 2) {
        const name = rawReply[i],
            value = rawReply[i + 1];
        switch (name) {
            case 'index_definition':
                reply.indexDefinition = transformTuplesReply(value);
                break;

            case 'attributes':
                reply.attributes = (value as Array<Array<ValkeyCommandArgument>>).map(attribute => transformTuplesReply(attribute));
                break;

            case 'gc_stats':
                reply.gcStats = transformNamedTuples(value, GC_STATS_FIELDS);
                break;

            case 'cursor_stats':
                reply.cursorStats = transformNamedTuples(value, CURSOR_STATS_FIELDS);
                break;

            default: {
                const field = SCALAR_FIELDS[name];
                if (field) reply[field] = value;
            }
        }
    }

    return reply as InfoReply;
}
