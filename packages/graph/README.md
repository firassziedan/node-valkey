# valkey-graph

Example usage:
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
