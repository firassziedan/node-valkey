# valkey-json

This package provides support for the [ValkeyJSON](https://valkey.io/docs/stack/json/) module, which adds JSON as a native data type to Valkey.  It extends the [Node Valkey client](https://github.com/firassziedan/node-valkey) to include functions for each of the ValkeyJSON commands.

To use these extra commands, your Valkey server must have the ValkeyJSON module installed.

## Usage

For a complete example, see [`managing-json.js`](https://github.com/firassziedan/node-valkey/blob/master/examples/managing-json.js) in the Node Valkey examples folder.

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

For more information about ValkeyJSON's path syntax, [check out the documentation](https://valkey.io/docs/stack/json/path/).

### Retrieving JSON Documents from Valkey

With ValkeyJSON, we can retrieve all or part(s) of a JSON document using the [`JSON.GET`](https://valkey.io/commands/json.get/) command and one or more JSON Paths.  Let's get the name and age of one of the pets:

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

ValkeyJSON includes commands that can atomically update values in a JSON document, in place in Valkey without having to first retrieve the entire document.

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
