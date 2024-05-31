// Store, retrieve and manipulate JSON data atomically with ValkeyJSON.

import { createClient } from 'valkey';

const client = createClient();

await client.connect();
await client.del('nodevalkey:jsondata');

// Store a JSON object...
await client.json.set('nodevalkey:jsondata', '$', {
  name: 'Roberta McDonald',
  pets: [
    {
      name: 'Fluffy',
      species: 'dog',
      age: 5,
      isMammal: true
    },
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
  ],
  address: {
    number: 99,
    street: 'Main Street',
    city: 'Springfield',
    state: 'OH',
    country: 'USA'
  }
});

// Retrieve the name and age of the second pet in the pets array.
let results = await client.json.get('nodevalkey:jsondata', {
  path: [
    '$.pets[1].name',
    '$.pets[1].age'
  ]
});

// { '$.pets[1].name': [ 'Rex' ], '$.pets[1].age': [ 3 ] }
console.log(results);

// Goldie had a birthday, increment the age...
await client.json.numIncrBy('nodevalkey:jsondata', '$.pets[2].age', 1);
results = await client.json.get('nodevalkey:jsondata', {
  path: '$.pets[2].age'
});

// Goldie is 3 years old now.
console.log(`Goldie is ${JSON.stringify(results[0])} years old now.`);

// Add a new pet...
await client.json.arrAppend('nodevalkey:jsondata', '$.pets', {
  name: 'Robin',
  species: 'bird',
  isMammal: false,
  age: 1
});

// How many pets do we have now?
const numPets = await client.json.arrLen('nodevalkey:jsondata', '$.pets');

// We now have 4 pets.
console.log(`We now have ${numPets} pets.`);

await client.quit();
