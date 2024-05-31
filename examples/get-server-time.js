// Get the time from the Valkey Server.

import { createClient } from 'valkey';

const client = createClient();
await client.connect();

const serverTime = await client.time();
// 2022-02-25T12:57:40.000Z { microseconds: 351346 }
console.log(serverTime);

await client.quit();
