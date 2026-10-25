# valkey-graph

> **There is no graph module for Valkey.** This package was forked from `@redis/graph`, which targeted RedisGraph; RedisGraph is end-of-life and was never ported to Valkey. The package is kept so that code written against `@redis/graph` keeps compiling, but every `GRAPH.*` command fails with `ERR unknown command` on a Valkey server. Its integration tests are therefore skipped.

Example usage (requires a server that implements the `GRAPH.*` commands):
```javascript
import { createClient, Graph } from 'valkey';

const client = createClient();
client.on('error', (err) => console.log('Valkey Client Error', err));

await client.connect();

const graph = new Graph(client, 'graph');

await graph.query(
  'CREATE (:Rider { name: $riderName })-[:rides]->(:Team { name: $teamName })',
  {
    params: {
      riderName: 'Buzz Aldrin',
      teamName: 'Apollo'
    }
  }
);

const result = await graph.roQuery(
  'MATCH (r:Rider)-[:rides]->(t:Team { name: $name }) RETURN r.name AS name',
  {
    params: {
      name: 'Apollo'
    }
  }
);

console.log(result.data); // [{ name: 'Buzz Aldrin' }]
```
