// This example demonstrates how to use valkey-search and valkey-json together.
// Requires both modules (both ship in the valkey/valkey-bundle docker image):
// https://valkey.io/topics/search/
// https://valkey.io/topics/valkey-json/

import { createClient, SchemaFieldTypes, AggregateGroupByReducers, AggregateSteps } from 'valkey';

const client = createClient();

await client.connect();

// Create an index.
// https://valkey.io/commands/ft.create/
try {
  await client.ft.create('idx:users', {
    '$.name': {
      type: SchemaFieldTypes.TEXT,
      SORTABLE: true
    },
    '$.age': {
      type: SchemaFieldTypes.NUMERIC,
      AS: 'age'
    },
    '$.coins': {
      type: SchemaFieldTypes.NUMERIC,
      AS: 'coins'
    },
    '$.email': {
      type: SchemaFieldTypes.TAG,
      AS: 'email'
    }
  }, {
    ON: 'JSON',
    PREFIX: 'nodevalkey:users'
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

// Add some users.
// https://valkey.io/commands/json.set/
await Promise.all([
  client.json.set('nodevalkey:users:1', '$', {
    name: 'Alice',
    age: 32,
    coins: 100,
    email: 'alice@nonexist.com'
  }),
  client.json.set('nodevalkey:users:2', '$', {
    name: 'Bob',
    age: 23,
    coins: 15,
    email: 'bob@somewhere.gov'
  })
]);

// Search all users under 30
console.log('Users under 30 years old:');
console.log(
  // https://valkey.io/commands/ft.search/
  JSON.stringify(
    await client.ft.search('idx:users', '@age:[0 30]'),
    null,
    2
  )
);
// {
//   "total": 1,
//   "documents": [
//     {
//       "id": "nodevalkey:users:2",
//       "value": {
//         "name": "Bob",
//         "age": 23,
//         "coins": 15,
//         "email": "bob@somewhere.gov"
//       }
//     }
//   ]
// }

// Find a user by email - note we need to escape . and @ characters
// in the email address.  This applies for other punctuation too.
// https://valkey.io/topics/search/ (TAG fields)
console.log('Users with email "bob@somewhere.gov":');
const emailAddress = 'bob@somewhere.gov'.replace(/[.@\\]/g, '\\$&');
console.log(
  JSON.stringify(
    await client.ft.search('idx:users', `@email:{${emailAddress}}`),
    null,
    2
  )
);
// {
//   "total": 1,
//   "documents": [
//     {
//       "id": "nodevalkey:users:2",
//       "value": {
//         "name": "Bob",
//         "age": 23,
//         "coins": 15,
//         "email": "bob@somewhere.gov"
//       }
//     }
//   ]
// }

// Some aggregrations, what's the average age and total number of coins...
// https://valkey.io/commands/ft.aggregate/
// valkey-search does not accept the match-all query `*` nor `GROUPBY 0`, and fields have to be
// LOADed before they can be reduced, so a constant is APPLYed and used as the single group key.
console.log('Aggregation Demo:');
console.log(
  JSON.stringify(
    await client.ft.aggregate('idx:users', '@age:[-inf +inf]', {
      LOAD: ['@age', '@coins'],
      STEPS: [{
        type: AggregateSteps.APPLY,
        expression: '1',
        AS: 'all'
      }, {
        type: AggregateSteps.GROUPBY,
        properties: '@all',
        REDUCE: [{
          type: AggregateGroupByReducers.AVG,
          property: '@age',
          AS: 'averageAge'
        }, {
          type: AggregateGroupByReducers.SUM,
          property: '@coins',
          AS: 'totalCoins'
        }]
      }]
    }),
    null,
    2
  )
);
// {
//   "total": 1,
//   "results": [
//     {
//       "all": "1",
//       "averageAge": "27.5",
//       "totalCoins": "115"
//     }
//   ]
// }

await client.quit();
