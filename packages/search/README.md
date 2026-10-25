# valkey-search

This package provides support for the [valkey-search](https://valkey.io/topics/search/) module, which adds indexing and querying support for data stored in Valkey Hashes or as JSON documents with the valkey-json module.  It extends the [Node Valkey client](https://github.com/firassziedan/node-valkey) to include functions for the `FT.*` commands.

To use these extra commands, your Valkey server must have the valkey-search module loaded.  To index and query JSON documents, you'll also need the valkey-json module. The easiest way to get both is the [`valkey/valkey-bundle`](https://hub.docker.com/r/valkey/valkey-bundle) docker image (Valkey 8.1 and later; valkey-search 1.1+ for `FT.AGGREGATE` and `TEXT` fields).

## Valkey compatibility

This package was forked from `@redis/search`, which targeted RediSearch. valkey-search implements a subset of that command set and query language:

| Commands                                                                                                                                                             | Status on Valkey                                                                                 |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `FT.CREATE`, `FT.DROPINDEX`, `FT.INFO`, `FT._LIST`, `FT.SEARCH`, `FT.AGGREGATE`                                                                                      | Supported by valkey-search                                                                       |
| `FT.ALIAS*`, `FT.ALTER`, `FT.CONFIG`, `FT.CURSOR*`, `FT.DICT*`, `FT.EXPLAIN*`, `FT.PROFILE`, `FT.SPELLCHECK`, `FT.SUG*`, `FT.SYN*`, `FT.TAGVALS`, aggregate cursors | Not implemented by valkey-search. Kept in the API for compatibility but fail with `ERR unknown command` |

Differences to keep in mind when using the supported commands against valkey-search:

- Field types: `TEXT`, `TAG`, `NUMERIC` and `VECTOR` are supported; `GEO` is not. `SORTABLE`, `NOSTEM`, `SEPARATOR` and `CASESENSITIVE` are accepted; `WEIGHT` other than `1`, `PHONETIC` and `NOINDEX` are rejected.
- `FT.CREATE` options `FILTER`, `TEMPORARY`, `MAXTEXTFIELDS`, `NOHL`, `NOFIELDS` and `NOFREQS` are rejected.
- The match-all query `*` is not accepted on its own (it is only valid as the pre-filter of a vector query such as `*=>[KNN 10 @vec $BLOB]`). Use a filter such as `@field:[-inf +inf]` or `@tag:{a|b}` instead.
- `FT.AGGREGATE`: fields have to be `LOAD`ed before they can be used in `GROUPBY`/`REDUCE`/`APPLY`, and `GROUPBY` needs at least one property (`GROUPBY 0` is rejected). For reducers over all documents, `APPLY '1' AS all` and group by `@all`.
- `client.ft.info()` is parsed by field name and returns the fields reported by valkey-search (`indexName`, `indexDefinition`, `attributes`, `numDocs`, `numRecords`, `numTerms`, `state`, `backfillInProgress`, ...).

## Usage

For complete examples, see [`search-hashes.js`](https://github.com/firassziedan/node-valkey/blob/main/examples/search-hashes.js) and [`search-json.js`](https://github.com/firassziedan/node-valkey/blob/main/examples/search-json.js) in the Node Valkey examples folder.

### Indexing and Querying Data in Valkey Hashes

#### Creating an Index

Before we can perform any searches, we need to tell valkey-search how to index our data, and which Valkey keys to find that data in.  The [FT.CREATE](https://valkey.io/commands/ft.create) command creates a valkey-search index.  Here's how to use it to create an index we'll call `idx:animals` where we want to index hashes containing `name`, `species` and `age` fields, and whose key names in Valkey begin with the prefix `nodevalkey:animals`:

```javascript
await client.ft.create('idx:animals', {
  name: {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true
  },
  species: SchemaFieldTypes.TAG,
  age: SchemaFieldTypes.NUMERIC
}, {
  ON: 'HASH',
  PREFIX: 'nodevalkey:animals'
});
```

See the [`FT.CREATE` documentation](https://valkey.io/commands/ft.create/) for information about the different field types and additional options.

#### Querying the Index

Once we've created an index, and added some data to Valkey hashes whose keys begin with the prefix `nodevalkey:animals`, we can start writing some search queries.  valkey-search supports a rich query syntax for full-text search, faceted search, aggregation and more.  Check out the [`FT.SEARCH` documentation](https://valkey.io/commands/ft.search) and the [query syntax reference](https://valkey.io/topics/search/) for more information.

Let's write a query to find all the animals where the `species` field has the value `dog`:

```javascript
const results = await client.ft.search('idx:animals', '@species:{dog}');
```

`results` looks like this:

```javascript
{
  total: 2,
  documents: [
    {
      id: 'nodevalkey:animals:4',
      value: {
        name: 'Fido',
        species: 'dog',
        age: '7'
      }
    },
    {
      id: 'nodevalkey:animals:3',
      value: {
        name: 'Rover',
        species: 'dog',
        age: '9'
      }
    }
  ]
}
```

### Indexing and Querying Data with valkey-json

valkey-search can also index and query JSON documents stored in Valkey using the valkey-json module.  The approach is similar to that for indexing and searching data in hashes, but we can now use JSON Path like syntax and the data no longer has to be flat name/value pairs - it can contain nested objects and arrays.

#### Creating an Index

As before, we create an index with the `FT.CREATE` command, this time specifying we want to index JSON documents that look like this:

```javascript
{
  name: 'Alice',
  age: 32,
  coins: 100
}
```

Each document represents a user in some system, and users have name, age and coins properties.

One way we might choose to index these documents is as follows:

```javascript
await client.ft.create('idx:users', {
  '$.name': {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: 'UNF'
  },
  '$.age': {
    type: SchemaFieldTypes.NUMERIC,
    AS: 'age'
  },
  '$.coins': {
    type: SchemaFieldTypes.NUMERIC,
    AS: 'coins'
  }
}, {
  ON: 'JSON',
  PREFIX: 'nodevalkey:users'
});
```

Note that we're using JSON Path to specify where the fields to index are in our JSON documents, and the `AS` clause to define a name/alias for each field.  We'll use these when writing queries.

#### Querying the Index

Now we have an index and some data stored as JSON documents in Valkey (see the [JSON package documentation](https://github.com/firassziedan/node-valkey/tree/main/packages/json) for examples of how to store JSON), we can write some queries...

We'll use the [valkey-search query language](https://valkey.io/topics/search/) and [`FT.SEARCH`](https://valkey.io/commands/ft.search) command.  Here's a query to find users under the age of 30:

```javascript
await client.ft.search('idx:users', '@age:[0 30]');
```
