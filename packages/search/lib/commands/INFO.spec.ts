import { strict as assert } from 'assert';
import { SchemaFieldTypes } from '.';
import testUtils, { GLOBAL } from '../test-utils';
import { transformArguments } from './INFO';

describe('INFO', () => {
    it('transformArguments', () => {
        assert.deepEqual(
            transformArguments('index'),
            ['FT.INFO', 'index']
        );
    });

    testUtils.testWithClient('client.ft.info', async client => {
        await client.ft.create('index', {
            field: SchemaFieldTypes.TEXT
        });

        const info = await client.ft.info('index');
        assert.equal(info.indexName, 'index');
        assert.equal(info.indexDefinition.key_type, 'HASH');
        assert.equal(info.attributes.length, 1);
        assert.equal(info.attributes[0].identifier, 'field');
        assert.equal(info.attributes[0].attribute, 'field');
        assert.equal(info.attributes[0].type, 'TEXT');
        assert.equal(Number(info.numDocs), 0);
        assert.equal(Number(info.hashIndexingFailures), 0);
    }, GLOBAL.SERVERS.OPEN);
});
