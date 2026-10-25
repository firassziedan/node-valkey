# Node Valkey: Examples

This folder contains example scripts showing how to use Node Valkey in different scenarios.

Examples that use a module need a server with that module loaded: start one with `docker run -p 6379:6379 valkey/valkey-bundle:latest` (Valkey with valkey-json, valkey-bloom and valkey-search). A few examples inherited from node-redis use commands that no Valkey module provides; they are marked below and cannot run against a Valkey server.

| File Name                                | Description                                                                                                                                          |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `blocking-list-pop.js`                   | Block until an element is pushed to a list.                                                                                                          |
| `bloom-filter.js`                        | Space efficient set membership checks with a [Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter) using [valkey-bloom](https://valkey.io/topics/bloomfilters/) (needs the `valkey/valkey-bundle` image). |
| `check-connection-status.js`             | Check the client's connection status.                                                                                                                |
| `command-with-modifiers.js`              | Define a script that allows to run a command with several modifiers.                                                                                 |
| `connect-as-acl-user.js`                 | Connect to Valkey 6 using an ACL user.                                                                                                                |
| `connect-to-cluster.js`                  | Connect to a Valkey cluster.                                                                                                                          |
| `count-min-sketch.js`                    | Estimate the frequency of a given event with a Count-Min Sketch. **No Valkey module implements `CMS.*`**; kept for reference only.                   |
| `cuckoo-filter.js`                       | Space efficient set membership checks with a [Cuckoo Filter](https://en.wikipedia.org/wiki/Cuckoo_filter). **No Valkey module implements `CF.*`**; kept for reference only. |
| `dump-and-restore.js`                    | Demonstrates the use of the [`DUMP`](https://valkey.io/commands/dump/) and [`RESTORE`](https://valkey.io/commands/restore/) commands                   |
| `get-server-time.js`                     | Get the time from the Valkey server.                                                                                                                  |
| `hyperloglog.js`                         | Showing use of Hyperloglog commands [PFADD, PFCOUNT and PFMERGE](https://valkey.io/commands/?group=hyperloglog).                                      |
| `lua-multi-incr.js`                      | Define a custom lua script that allows you to perform INCRBY on multiple keys.                                                                       |
| `managing-json.js`                       | Store, retrieve and manipulate JSON data atomically with [valkey-json](https://valkey.io/topics/valkey-json/) (needs the `valkey/valkey-bundle` image).  |
| `pubsub-publisher.js`                    | Adds multiple messages on 2 different channels messages to Valkey.                                                                                    |
| `pubsub-subscriber.js`                   | Reads messages from channels using `PSUBSCRIBE` command.                                                                                             |
| `search-hashes.js`                       | Uses [valkey-search](https://valkey.io/topics/search/) to index and search data in hashes (needs the `valkey/valkey-bundle` image).                    |
| `search-json.js`                         | Uses [valkey-search](https://valkey.io/topics/search/) and [valkey-json](https://valkey.io/topics/valkey-json/) to index and search JSON data (needs the `valkey/valkey-bundle` image). |
| `search-knn.js`                          | Uses [valkey-search vector similarity](https://valkey.io/topics/search/) to index and run KNN queries (needs the `valkey/valkey-bundle` image).       |
| `set-scan.js`                            | An example script that shows how to use the SSCAN iterator functionality.                                                                            |
| `sorted-set.js`                          | Add members with scores to a Sorted Set and retrieve them using the ZSCAN iteractor functionality.                                                   |
| `stream-producer.js`                     | Adds entries to a [Valkey Stream](https://valkey.io/topics/streams-intro) using the `XADD` command.                                                    |
| `stream-consumer.js`                     | Reads entries from a [Valkey Stream](https://valkey.io/topics/streams-intro) using the blocking `XREAD` command.                                       |
| `time-series.js`                         | Create, populate and query time series data. **No released Valkey module implements `TS.*`**; kept for reference only.                              |
| `topk.js`                                | Track the most frequently seen items with Top-K. **No Valkey module implements `TOPK.*`**; kept for reference only.                                   |
| `stream-consumer-group.js`               | Reads entries from a [Valkey Stream](https://valkey.io/topics/streams-intro) as part of a consumer group using the blocking `XREADGROUP` command.      |
| `transaction-with-arbitrary-commands.js` | Mix and match supported commands with arbitrary command strings in a Valkey transaction.                                                              |
| `transaction-with-watch.js`              | An Example of [Valkey transaction](https://valkey.io/topics/transactions/) with `WATCH` command on isolated connection with optimistic locking.    |

## Contributing

We'd love to see more examples here. If you have an idea that you'd like to see included here, submit a Pull Request and we'll be sure to review it! Don't forget to check out our [contributing guide](../CONTRIBUTING.md).

## Setup

To set up the examples folder so that you can run an example / develop one of your own:

```
$ git clone https://github.com/firassziedan/node-valkey.git
$ cd node-valkey
$ npm install -ws && npm run build-all
$ cd examples
$ npm install
```

### Coding Guidelines for Examples

When adding a new example, please follow these guidelines:

- Add your code in a single JavaScript or TypeScript file per example, directly in the `examples` folder
- Do not introduce other dependencies in your example
- Give your `.js` file a meaningful name using `-` separators e.g. `adding-to-a-stream.js` / `adding-to-a-stream.ts`
- Indent your code using 2 spaces
- Use the single line `//` comment style and comment your code
- Add a comment at the top of your `.js` / `.ts` file describing what your example does
- Add a comment at the top of your `.js` / `.ts` file describing any Valkey commands that need to be run to set up data for your example (try and keep this minimal)
- Use semicolons
- Use `async` and `await`
- Use single quotes, `'hello'` not `"hello"`
- Use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) when embedding expressions in strings
- Unless your example requires a connection string, assume Valkey is on the default localhost port 6379 with no password
- Use meaningful example data, let's not use `foo`, `bar`, `baz` etc!
- Leave an empty line at the end of your `.js` file
- Update this `README.md` file to add your example to the table

Use [connect-as-acl-user.js](./connect-as-acl-user.js) as a guide to develop a well formatted example script.

### Example Template

Here's a starter template for adding a new example, imagine this is stored in `do-something.js`:

```javascript
// This comment should describe what the example does
// and can extend to multiple lines.

// Set up the data in valkey-cli using these commands:
//   <add your command(s) here, one per line>
//
// Alternatively, add code that sets up the data.

import { createClient } from 'valkey';

const client = createClient();

await client.connect();

// Add your example code here...

await client.quit();
```
