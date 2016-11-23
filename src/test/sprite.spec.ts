'use strict';

import * as assert from 'assert';
import * as fs from 'fs';

import * as ss from '../sprite';

const square = fs.readFileSync('./fixtures/square.svg', 'utf-8');
const circle = fs.readFileSync('./fixtures/circle.svg', 'utf-8');
const expected = fs.readFileSync('./fixtures/sprite.svg', 'utf-8');

describe('Sprite', () => {

	it('Should add a new item to the collection', () => {
		const sprite = ss.collection();

		sprite.add('test', square);

		const icon = sprite.get('test');

		assert.ok(icon.indexOf('<symbol') !== -1);
	});

	it('Should add a new item to the collection with specified options', () => {
		const sprite = ss.collection();

		sprite.add('test', square, {
			iconPrefix: 'prefix-',
			iconSuffix: '-suffix',
		});

		assert.ok(sprite.get('prefix-test-suffix'));
	});

	it('Should remove the item from the collection', () => {
		const sprite = ss.collection();

		sprite.add('test', square);
		sprite.remove('test');

		assert.ok(!sprite.get('test'));
	});

	it('Should clear the collection', () => {
		const sprite = ss.collection();

		sprite.add('test', square);
		sprite.clean();

		assert.ok(!sprite.get('test'));
	});

	it('Should create sprite', () => {
		const sprite = ss.collection({
			inline: true,
			rootAttributes: {
				me: 'hello'
			}
		});

		sprite.add('square', square);
		sprite.add('circle', circle);

		const result = sprite.compile();

		assert.equal(result, expected.replace(/[\r\n\t]|\s{2,}/g, ''));
	});

});
