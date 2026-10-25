import { strict as assert } from 'assert';
import testUtils, { GLOBAL } from '../test-utils';
import { transformArguments } from './DEBUG_MEMORY';

describe('DEBUG MEMORY', () => {
    describe('transformArguments', () => {
        it('without path', () => {
            assert.deepEqual(
                transformArguments('key'),
                ['JSON.DEBUG', 'MEMORY', 'key']
            );
        });

        it('with path', () => {
            assert.deepEqual(
                transformArguments('key', '$'),
                ['JSON.DEBUG', 'MEMORY', 'key', '$']
            );
        });
    });

    testUtils.testWithClient('client.json.debugMemory', async client => {
        await client.json.set('key', '$', { a: [1, 2, 3] });

        const [withPath, withoutPath] = await Promise.all([
            client.json.debugMemory('key', '$'),
            client.json.debugMemory('key')
        ]);

        // with a JSONPath the reply is one size per matched value, without a path it is a single size
        assert.ok(Array.isArray(withPath));
        assert.equal(withPath.length, 1);
        assert.equal(typeof withPath[0], 'number');
        assert.equal(typeof withoutPath, 'number');
    }, GLOBAL.SERVERS.OPEN);
});
