# valkey-search

This package provides support for the [ValkeySearch](https://valkeyearch.io) module, which adds indexing and querying support for data stored in Valkey Hashes or as JSON documents with the ValkeyJSON module.  It extends the [Node Valkey client](https://github.com/firassziedan/node-valkey) to include functions for each of the ValkeySearch commands.

To use these extra commands, your Valkey server must have the ValkeySearch module installed.  To index and query JSON documents, you'll also need to add the ValkeyJSON module.

## Usage

For complete examples, see [`search-hashes.js`](https://github.com/firassziedan/node-valkey/blob/master/examples/search-hashes.js) and [`search-json.js`](https://github.com/firassziedan/node-valkey/blob/master/examples/search-json.js) in the Node Valkey examples folder.

### Indexing and Querying Data in Valkey Hashes

#### Creating an Index

Before we can perform any searches, we need to tell ValkeySearch how to index our data, and which Valkey keys to find that data in.  The [FT.CREATE](https://valkey.io/commands/ft.create) command creates a ValkeySearch index.  Here's how to use it to create an index we'll call `idx:animals` where we want to index hashes containing `name`, `species` and `age` fields, and whose key names in Valkey begin with the prefix `nodevalkey:animals`:

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

See the [`FT.CREATE` documentation](https://valkey.io/commands/ft.create/#description) for information about the different field types and additional options.

#### Querying the Index

Once we've created an index, and added some data to Valkey hashes whose keys begin with the prefix `nodevalkey:animals`, we can start writing some search queries.  ValkeySearch supports a rich query syntax for full-text search, faceted search, aggregation and more.  Check out the [`FT.SEARCH` documentation](https://valkey.io/commands/ft.search) and the [query syntax reference](https://valkey.io/docs/interact/search-and-query/query) for more information.

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

### Indexing and Querying Data with ValkeyJSON

ValkeySearch can also index and query JSON documents stored in Valkey using the ValkeyJSON module.  The approach is similar to that for indexing and searching data in hashes, but we can now use JSON Path like syntax and the data no longer has to be flat name/value pairs - it can contain nested objects and arrays.

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

We'll use the [ValkeySearch query language](https://valkey.io/docs/interact/search-and-query/query) and [`FT.SEARCH`](https://valkey.io/commands/ft.search) command.  Here's a query to find users under the age of 30:

```javascript
await client.ft.search('idx:users', '@age:[0 30]');
```
