// This example demonstrates how to use ValkeySearch to index and query data
// stored in Valkey hashes.

import { createClient, SchemaFieldTypes } from 'valkey';

const client = createClient();

await client.connect();

// Create an index...
try {
  // Documentation: https://valkey.io/commands/ft.create/
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
} catch (e) {
  if (e.message === 'Index already exists') {
    console.log('Index exists already, skipped creation.');
  } else {
    // Something went wrong, perhaps ValkeySearch isn't installed...
    console.error(e);
    process.exit(1);
  }
}

// Add some sample data...
// https://valkey.io/commands/hset/
await Promise.all([
  client.hSet('nodevalkey:animals:1', {name: 'Fluffy', species: 'cat', age: 3}),
  client.hSet('nodevalkey:animals:2', {name: 'Ginger', species: 'cat', age: 4}),
  client.hSet('nodevalkey:animals:3', {name: 'Rover', species: 'dog', age: 9}),
  client.hSet('nodevalkey:animals:4', {name: 'Fido', species: 'dog', age: 7})
]);

// Perform a search query, find all the dogs... sort by age, descending.
// Documentation: https://valkey.io/commands/ft.search/
// Query syntax: https://valkey.io/docs/stack/search/reference/query_syntax/
const results = await client.ft.search(
  'idx:animals',
  '@species:{dog}',
  {
    SORTBY: {
      BY: 'age',
      DIRECTION: 'DESC' // or 'ASC (default if DIRECTION is not present)
    }
  }
);

// results:
// {
//   total: 2,
//   documents: [
//     {
//       id: 'nodevalkey:animals:3',
//       value: {
//         name: 'Rover',
//         species: 'dog',
//         age: '9'
//       }
//     },
//     {
//       id: 'nodevalkey:animals:4',
//       value: {
//         name: 'Fido',
//         species: 'dog',
//         age: '7'
//       }
//     }
//   ]
// }

console.log(`Results found: ${results.total}.`);

for (const doc of results.documents) {
  // nodevalkey:animals:3: Rover, 9 years old.
  // nodevalkey:animals:4: Fido, 7 years old.
  console.log(`${doc.id}: ${doc.value.name}, ${doc.value.age} years old.`);
}

await client.quit();
