# valkey-bloom

This package provides support for the [valkey-bloom](https://valkey.io/topics/bloomfilters/) module, which adds a Bloom filter data type to Valkey. It extends the [Node Valkey client](https://github.com/firassziedan/node-valkey) to include functions for each of the `BF.*` commands.

To use these commands, your Valkey server must have the valkey-bloom module loaded. The easiest way to get it is the [`valkey/valkey-bundle`](https://hub.docker.com/r/valkey/valkey-bundle) docker image (Valkey 8.1 and later).

## Valkey compatibility

This package was forked from `@redis/bloom`, which targeted RedisBloom. valkey-bloom implements a subset of that command set:

| Commands                                                                                 | Status on Valkey                                                                                                          |
|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `BF.ADD`, `BF.CARD`, `BF.EXISTS`, `BF.INFO`, `BF.INSERT`, `BF.MADD`, `BF.MEXISTS`, `BF.RESERVE` | Supported by valkey-bloom                                                                                                 |
| `BF.SCANDUMP`, `BF.LOADCHUNK`                                                            | Not implemented by valkey-bloom (`ERR unknown command`)                                                                   |
| `CF.*` (Cuckoo filter), `CMS.*` (Count-Min Sketch), `TOPK.*` (Top-K), `TDIGEST.*` (t-digest) | No Valkey module implements these. They are kept in the API for compatibility but fail with `ERR unknown command`         |

`client.bf.info()` is parsed by field name and returns the fields reported by valkey-bloom: `capacity`, `size`, `numberOfFilters`, `numberOfInsertedItems`, `expansionRate`, `errorRate`, `tighteningRatio` and `maxScaledCapacity`.

For a complete example, see [`bloom-filter.js`](https://github.com/firassziedan/node-valkey/blob/main/examples/bloom-filter.js) in the Node Valkey examples folder.
