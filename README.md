# Node-Valkey

[![Tests](https://img.shields.io/github/actions/workflow/status/valkey/node-valkey/tests.yml?branch=master)](https://github.com/valkey/node-valkey/actions/workflows/tests.yml)
[![Coverage](https://codecov.io/gh/valkey/node-valkey/branch/master/graph/badge.svg?token=xcfqHhJC37)](https://codecov.io/gh/valkey/node-valkey)
[![License](https://img.shields.io/github/license/firassziedan/node-valkey.svg)](https://github.com/firassziedan/node-valkey/blob/master/LICENSE)

node-valkey is a modern, high performance [Valkey](https://valkey.io) client for Node.js.

## How do I Valkey?

[Download Valkey](https://valkey.io/download/)

[Valkey Blog](https://valkey.io/blog/)

[developer Documentation](https://valkey.io/docs/)

[Join the Valkey community](https://github.com/orgs/valkey-io/discussions)


## Packages

| Name                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                    |
|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [valkey](./)                                  | [![Downloads](https://img.shields.io/npm/dm/valkey.svg)](https://www.npmjs.com/package/valkey) [![Version](https://img.shields.io/npm/v/valkey.svg)](https://www.npmjs.com/package/valkey)                                                                                                                                                                                                                                         |
| [valkey-client](./packages/client)           | [![Downloads](https://img.shields.io/npm/dm/valkey-client.svg)](https://www.npmjs.com/package/valkey-client) [![Version](https://img.shields.io/npm/v/valkey-client.svg)](https://www.npmjs.com/package/valkey-client) [![Docs](https://img.shields.io/badge/-documentation-dc382c)](https://valkey.js.org/documentation/client/)                                                                                               |
| [valkey-bloom](./packages/bloom)             | [![Downloads](https://img.shields.io/npm/dm/valkey-bloom.svg)](https://www.npmjs.com/package/valkey-bloom) [![Version](https://img.shields.io/npm/v/valkey-bloom.svg)](https://www.npmjs.com/package/valkey-bloom) [![Docs](https://img.shields.io/badge/-documentation-dc382c)](https://valkey.js.org/documentation/bloom/) [Valkey Bloom](https://oss.valkey.com/valkeybloom/) commands                                          |
| [valkey-graph](./packages/graph)             | [![Downloads](https://img.shields.io/npm/dm/valkey-graph.svg)](https://www.npmjs.com/package/valkey-graph) [![Version](https://img.shields.io/npm/v/valkey-graph.svg)](https://www.npmjs.com/package/valkey-graph) [![Docs](https://img.shields.io/badge/-documentation-dc382c)](https://valkey.js.org/documentation/graph/) [Valkey Graph](https://oss.valkey.com/valkeygraph/) commands                                          |
| [valkey-json](./packages/json)               | [![Downloads](https://img.shields.io/npm/dm/valkey-json.svg)](https://www.npmjs.com/package/valkey-json) [![Version](https://img.shields.io/npm/v/valkey-json.svg)](https://www.npmjs.com/package/valkey-json) [![Docs](https://img.shields.io/badge/-documentation-dc382c)](https://valkey.js.org/documentation/json/) [Valkey JSON](https://oss.valkey.com/valkeyjson/) commands                                                 |
| [valkey-search](./packages/search)           | [![Downloads](https://img.shields.io/npm/dm/valkey-search.svg)](https://www.npmjs.com/package/valkey-search) [![Version](https://img.shields.io/npm/v/valkey-search.svg)](https://www.npmjs.com/package/valkey-search) [![Docs](https://img.shields.io/badge/-documentation-dc382c)](https://valkey.js.org/documentation/search/) [ValkeySearch](https://oss.valkey.com/valkeyearch/) commands                                    |
| [valkey-time-series](./packages/time-series) | [![Downloads](https://img.shields.io/npm/dm/valkey-time-series.svg)](https://www.npmjs.com/package/valkey-time-series) [![Version](https://img.shields.io/npm/v/valkey-time-series.svg)](https://www.npmjs.com/package/valkey-time-series) [![Docs](https://img.shields.io/badge/-documentation-dc382c)](https://valkey.js.org/documentation/time-series/) [Valkey Time-Series](https://oss.valkey.com/valkeytimeseries/) commands |

> :warning: In version 4.1.0 we moved our subpackages from `@node-valkey` to `@valkey`. If you're just using `npm install valkey`, you don't need to do anything—it'll upgrade automatically. If you're using the subpackages directly, you'll need to point to the new scope (e.g. `valkey-client` instead of `@node-valkey/client`).

## Installation

Start a valkey via docker:

``` bash
docker run -p 6379:6379 -it valkey/valkey-stack-server:latest
```

To install node-valkey, simply:

```bash
npm install valkey
```

> :warning: The new interface is clean and cool, but if you have an existing codebase, you'll want to read the [migration guide](./docs/v3-to-v4.md).

Looking for a high-level library to handle object mapping? See [valkey-om-node](https://github.com/valkey/valkey-om-node)!

## Usage

### Basic Example

```typescript
import { createClient } from 'valkey';

const client = await createClient()
  .on('error', err => console.log('Valkey Client Error', err))
  .connect();

await client.set('key', 'value');
const value = await client.get('key');
await client.disconnect();
```

The above code connects to localhost on port 6379. To connect to a different host or port, use a connection string in the format `valkey[s]://[[username][:password]@][host][:port][/db-number]`:

```typescript
createClient({
  url: 'valkey://alice:foobared@awesome.valkey.server:6380'
});
```

You can also use discrete parameters, UNIX sockets, and even TLS to connect. Details can be found in the [client configuration guide](./docs/client-configuration.md).

To check if the the client is connected and ready to send commands, use `client.isReady` which returns a boolean. `client.isOpen` is also available.  This returns `true` when the client's underlying socket is open, and `false` when it isn't (for example when the client is still connecting or reconnecting after a network error).

### Valkey Commands

There is built-in support for all of the [out-of-the-box Valkey commands](https://valkey.io/commands). They are exposed using the raw Valkey command names (`HSET`, `HGETALL`, etc.) and a friendlier camel-cased version (`hSet`, `hGetAll`, etc.):

```typescript
// raw Valkey commands
await client.HSET('key', 'field', 'value');
await client.HGETALL('key');

// friendly JavaScript commands
await client.hSet('key', 'field', 'value');
await client.hGetAll('key');
```

Modifiers to commands are specified using a JavaScript object:

```typescript
await client.set('key', 'value', {
  EX: 10,
  NX: true
});
```

Replies will be transformed into useful data structures:

```typescript
await client.hGetAll('key'); // { field1: 'value1', field2: 'value2' }
await client.hVals('key'); // ['value1', 'value2']
```

`Buffer`s are supported as well:

```typescript
await client.hSet('key', 'field', Buffer.from('value')); // 'OK'
await client.hGetAll(
  commandOptions({ returnBuffers: true }),
  'key'
); // { field: <Buffer 76 61 6c 75 65> }
```

### Unsupported Valkey Commands

If you want to run commands and/or use arguments that Node Valkey doesn't know about (yet!) use `.sendCommand()`:

```typescript
await client.sendCommand(['SET', 'key', 'value', 'NX']); // 'OK'

await client.sendCommand(['HGETALL', 'key']); // ['key1', 'field1', 'key2', 'field2']
```

### Transactions (Multi/Exec)

Start a [transaction](https://valkey.io/topics/transactions) by calling `.multi()`, then chaining your commands. When you're done, call `.exec()` and you'll get an array back with your results:

```typescript
await client.set('another-key', 'another-value');

const [setKeyReply, otherKeyValue] = await client
  .multi()
  .set('key', 'value')
  .get('another-key')
  .exec(); // ['OK', 'another-value']
```

You can also [watch](https://valkey.io/topics/transactions#optimistic-locking-using-check-and-set) keys by calling `.watch()`. Your transaction will abort if any of the watched keys change.

To dig deeper into transactions, check out the [Isolated Execution Guide](./docs/isolated-execution.md).

### Blocking Commands

Any command can be run on a new connection by specifying the `isolated` option. The newly created connection is closed when the command's `Promise` is fulfilled.

This pattern works especially well for blocking commands—such as `BLPOP` and `BLMOVE`:

```typescript
import { commandOptions } from 'valkey';

const blPopPromise = client.blPop(
  commandOptions({ isolated: true }),
  'key',
  0
);

await client.lPush('key', ['1', '2']);

await blPopPromise; // '2'
```

To learn more about isolated execution, check out the [guide](./docs/isolated-execution.md).

### Pub/Sub

See the [Pub/Sub overview](./docs/pub-sub.md).

### Scan Iterator

[`SCAN`](https://valkey.io/commands/scan) results can be looped over using [async iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator):

```typescript
for await (const key of client.scanIterator()) {
  // use the key!
  await client.get(key);
}
```

This works with `HSCAN`, `SSCAN`, and `ZSCAN` too:

```typescript
for await (const { field, value } of client.hScanIterator('hash')) {}
for await (const member of client.sScanIterator('set')) {}
for await (const { score, value } of client.zScanIterator('sorted-set')) {}
```

You can override the default options by providing a configuration object:

```typescript
client.scanIterator({
  TYPE: 'string', // `SCAN` only
  MATCH: 'patter*',
  COUNT: 100
});
```

### [Programmability](https://valkey.io/docs/manual/programmability/)

Valkey provides a programming interface allowing code execution on the valkey server.

#### [Functions](https://valkey.io/docs/manual/programmability/functions-intro/)

The following example retrieves a key in valkey, returning the value of the key, incremented by an integer. For example, if your key _foo_ has the value _17_ and we run `add('foo', 25)`, it returns the answer to Life, the Universe and Everything.

```lua
#!lua name=library

valkey.register_function {
  function_name = 'add',
  callback = function(keys, args) return valkey.call('GET', keys[1]) + args[1] end,
  flags = { 'no-writes' }
}
```

Here is the same example, but in a format that can be pasted into the `valkey-cli`.

```
FUNCTION LOAD "#!lua name=library\nvalkey.register_function{function_name=\"add\", callback=function(keys, args) return valkey.call('GET', keys[1])+args[1] end, flags={\"no-writes\"}}"
```

Load the prior valkey function on the _valkey server_ before running the example below.

```typescript
import { createClient } from 'valkey';

const client = createClient({
  functions: {
    library: {
      add: {
        NUMBER_OF_KEYS: 1,
        transformArguments(key: string, toAdd: number): Array<string> {
          return [key, toAdd.toString()];
        },
        transformReply(reply: number): number {
          return reply;
        }
      }
    }
  }
});

await client.connect();

await client.set('key', '1');
await client.library.add('key', 2); // 3
```

#### [Lua Scripts](https://valkey.io/docs/manual/programmability/eval-intro/)

The following is an end-to-end example of the prior concept.

```typescript
import { createClient, defineScript } from 'valkey';

const client = createClient({
  scripts: {
    add: defineScript({
      NUMBER_OF_KEYS: 1,
      SCRIPT:
        'return valkey.call("GET", KEYS[1]) + ARGV[1];',
      transformArguments(key: string, toAdd: number): Array<string> {
        return [key, toAdd.toString()];
      },
      transformReply(reply: number): number {
        return reply;
      }
    })
  }
});

await client.connect();

await client.set('key', '1');
await client.add('key', 2); // 3
```

### Disconnecting

There are two functions that disconnect a client from the Valkey server. In most scenarios you should use `.quit()` to ensure that pending commands are sent to Valkey before closing a connection.

#### `.QUIT()`/`.quit()`

Gracefully close a client's connection to Valkey, by sending the [`QUIT`](https://valkey.io/commands/quit) command to the server. Before quitting, the client executes any remaining commands in its queue, and will receive replies from Valkey for each of them.

```typescript
const [ping, get, quit] = await Promise.all([
  client.ping(),
  client.get('key'),
  client.quit()
]); // ['PONG', null, 'OK']

try {
  await client.get('key');
} catch (err) {
  // ClosedClient Error
}
```

#### `.disconnect()`

Forcibly close a client's connection to Valkey immediately. Calling `disconnect` will not send further pending commands to the Valkey server, or wait for or parse outstanding responses.

```typescript
await client.disconnect();
```

### Auto-Pipelining

Node Valkey will automatically pipeline requests that are made during the same "tick".

```typescript
client.set('Tm9kZSBSZWRpcw==', 'users:1');
client.sAdd('users:1:tokens', 'Tm9kZSBSZWRpcw==');
```

Of course, if you don't do something with your Promises you're certain to get [unhandled Promise exceptions](https://nodejs.org/api/process.html#process_event_unhandledrejection). To take advantage of auto-pipelining and handle your Promises, use `Promise.all()`.

```typescript
await Promise.all([
  client.set('Tm9kZSBSZWRpcw==', 'users:1'),
  client.sAdd('users:1:tokens', 'Tm9kZSBSZWRpcw==')
]);
```

### Clustering

Check out the [Clustering Guide](./docs/clustering.md) when using Node Valkey to connect to a Valkey Cluster.

### Events

The Node Valkey client class is an Nodejs EventEmitter and it emits an event each time the network status changes:

| Name                    | When                                                                               | Listener arguments                                         |
|-------------------------|------------------------------------------------------------------------------------|------------------------------------------------------------|
| `connect`               | Initiating a connection to the server                                              | *No arguments*                                             |
| `ready`                 | Client is ready to use                                                             | *No arguments*                                             |
| `end`                   | Connection has been closed (via `.quit()` or `.disconnect()`)                      | *No arguments*                                             |
| `error`                 | An error has occurred—usually a network issue such as "Socket closed unexpectedly" | `(error: Error)`                                           |
| `reconnecting`          | Client is trying to reconnect to the server                                        | *No arguments*                                             |
| `sharded-channel-moved` | See [here](./docs/pub-sub.md#sharded-channel-moved-event)                          | See  [here](./docs/pub-sub.md#sharded-channel-moved-event) |

> :warning: You **MUST** listen to `error` events. If a client doesn't have at least one `error` listener registered and an `error` occurs, that error will be thrown and the Node.js process will exit. See the [`EventEmitter` docs](https://nodejs.org/api/events.html#events_error_events) for more details.

> The client will not emit [any other events](./docs/v3-to-v4.md#all-the-removed-events) beyond those listed above.

## Supported Valkey versions

Node Valkey is supported with the following versions of Valkey:

| Version | Supported          |
|---------|--------------------|
| 7.0.z   | :heavy_check_mark: |

> Node Valkey should work with older versions of Valkey, but it is not fully tested and we cannot offer support.

## Contributing

If you'd like to contribute, check out the [contributing guide](CONTRIBUTING.md).

Thank you to all the people who already contributed to Node Valkey!

[![Contributors](https://contrib.rocks/image?repo=firassziedan/node-valkey)](https://github.com/firassziedan/node-valkey/graphs/contributors)

## License

This repository is licensed under the "MIT" license. See [LICENSE](LICENSE).
