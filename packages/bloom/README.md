# valkey-bloom

This package provides support for the [ValkeyBloom](https://valkeybloom.io) module, which adds additional probabilistic data structures to Valkey.  It extends the [Node Valkey client](https://github.com/firassziedan/node-valkey) to include functions for each of the RediBloom commands.

To use these extra commands, your Valkey server must have the ValkeyBloom module installed.

ValkeyBloom provides the following probabilistic data structures:

* Bloom Filter: for checking set membership with a high degree of certainty.
* Cuckoo Filter: for checking set membership with a high degree of certainty.
* Count-Min Sketch: Determine the frequency of events in a stream.
* Top-K: Maintain a list of k most frequently seen items.

For complete examples, see `bloom-filter.js`, `cuckoo-filter.js`, `count-min-sketch.js` and `topk.js` in the Node Valkey examples folder.
