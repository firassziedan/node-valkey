# valkey-json

This package provides support for the [valkey-json](https://valkey.io/topics/valkey-json/) module, which adds JSON as a native data type to Valkey.  It extends the [Node Valkey client](https://github.com/firassziedan/node-valkey) to include functions for each of the `JSON.*` commands.

To use these extra commands, your Valkey server must have the valkey-json module loaded. The easiest way to get it is the [`valkey/valkey-bundle`](https://hub.docker.com/r/valkey/valkey-bundle) docker image (Valkey 8.1 and later).

## Valkey compatibility

Every command of this package is implemented by valkey-json except `JSON.MERGE` (`client.json.merge()`), which fails with `ERR unknown command` on a Valkey server.

## Usage

For a complete example, see [`managing-json.js`](https://github.com/firassziedan/node-valkey/blob/main/examples/managing-json.js) in the Node Valkey examples folder.

### Storing JSON Documents in Valkey

The [`JSON.SET`](https://valkey.io/commands/json.set/) command stores a JSON value at a given JSON Path in a Valkey key.

Here, we'll store a JSON document in the root of the Valkey key "`mydoc`":

```javascript
import { createClient } from 'valkey';

...
await client.json.set('nodevalkey:jsondata', '$', {
  name: 'Roberta McDonald',
  pets: [
    {
    name: 'Rex',
    species: 'dog',
    age: 3,
    isMammal: true
    },
    {
    name: 'Goldie',
    species: 'fish',
    age: 2,
    isMammal: false
    }
  ]
});
```

For more information about valkey-json's path syntax, [check out the documentation](https://valkey.io/topics/valkey-json/).

### Retrieving JSON Documents from Valkey

With valkey-json, we can retrieve all or part(s) of a JSON document using the [`JSON.GET`](https://valkey.io/commands/json.get/) command and one or more JSON Paths.  Let's get the name and age of one of the pets:

```javascript
const results = await client.json.get('nodevalkey:jsondata', {
  path: [
    '.pets[1].name',
    '.pets[1].age'
  ]
});
```

`results` will contain the following:

```javascript
 { '.pets[1].name': 'Goldie', '.pets[1].age': 2 }
```

### Performing Atomic Updates on JSON Documents Stored in Valkey

valkey-json includes commands that can atomically update values in a JSON document, in place in Valkey without having to first retrieve the entire document.

Using the [`JSON.NUMINCRBY`](https://valkey.io/commands/json.numincrby/) command, we can update the age of one of the pets like this:

```javascript
await client.json.numIncrBy('nodevalkey:jsondata', '.pets[1].age', 1);
```

And we can add a new object to the pets array with the [`JSON.ARRAPPEND`](https://valkey.io/commands/json.arrappend/) command:

```javascript
await client.json.arrAppend('nodevalkey:jsondata', '.pets', {
  name: 'Robin',
  species: 'bird',
  age: 1,
  isMammal: false
});
```
