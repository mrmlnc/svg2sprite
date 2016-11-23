'use strict';

import * as assert from 'assert';
import * as fs from 'fs';

import stringifier from '../../lib/stringifier';

const square = fs.readFileSync('./fixtures/square.svg', 'utf-8');
const defaultOptions = {
	clean: {
		stripEmptyTags: true,
		stripTags: ['title', 'desc'],
		stripAttrs: [],
		stripExtraAttrs: true,
		stripStyles: true
	}
};

describe('Stringifier', () => {

	/**
	 * Options -> Clean
	 */

	it('Should not contains newline symbols', () => {
		const result = stringifier(square, defaultOptions);

		assert.ok(result.indexOf('\n') === -1);
	});

	it('Should remove extra attributes', () => {
		const result = stringifier(square, defaultOptions);

		assert.ok(result.indexOf('sketch') === -1);
		assert.ok(result.indexOf('xmlns') === -1);
	});

	it('Should not change extra attributes', () => {
		const result = stringifier(square, {
			clean: {
				stripEmptyTags: true,
				stripTags: ['title', 'desc'],
				stripAttrs: [],
				stripExtraAttrs: false,
				stripStyles: true
			}
		});

		assert.ok(result.indexOf('sketch') !== -1);
		assert.ok(result.indexOf('xmlns') !== -1);
	});

	it('Should remove attributes witch strict and non-strict mode', () => {
		const result = stringifier(square, {
			clean: {
				stripEmptyTags: true,
				stripTags: ['title', 'desc'],
				stripAttrs: [
					'class',
					{ pattern: 'sketch', strict: false }
				],
				stripExtraAttrs: false,
				stripStyles: true
			}
		});

		assert.ok(result.indexOf('class') === -1);
		assert.ok(result.indexOf('sketch') === -1);
	});

	it('Should remove empty tags', () => {
		const result = stringifier(square, defaultOptions);

		assert.ok(result.indexOf('<defs></defs><g></g>') === -1);
	});

	it('Should not change empty tags', () => {
		const result = stringifier(square, {
			clean: {
				stripEmptyTags: false,
				stripTags: ['title', 'desc'],
				stripAttrs: [],
				stripExtraAttrs: true,
				stripStyles: true
			}
		});

		assert.ok(result.indexOf('<defs></defs><g></g>') !== -1);
	});

	it('Should remove extra tags', () => {
		const result = stringifier(square, defaultOptions);

		assert.ok(result.indexOf('<title>') === -1);
		assert.ok(result.indexOf('<desc>') === -1);
	});

	it('Should not change extra tags', () => {
		const result = stringifier(square, {
			clean: {
				stripEmptyTags: true,
				stripTags: [],
				stripAttrs: [],
				stripExtraAttrs: true,
				stripStyles: true
			}
		});

		assert.ok(result.indexOf('<title>') !== -1);
		assert.ok(result.indexOf('<desc>') !== -1);
	});

	it('Should remove `style` tag', () => {
		const result = stringifier(square, defaultOptions);

		assert.ok(result.indexOf('<style>') === -1);
	});

	it('Should not change `style` tag', () => {
		const result = stringifier(square, {
			clean: {
				stripEmptyTags: true,
				stripTags: ['title', 'desc'],
				stripAttrs: [],
				stripExtraAttrs: true,
				stripStyles: false
			}
		});

		assert.ok(result.indexOf('<style>') !== -1);
	});

	it('Should remove specified properties from the `style` tag', () => {
		const result = stringifier(square, {
			clean: {
				stripEmptyTags: true,
				stripTags: ['title', 'desc'],
				stripAttrs: ['fill'],
				stripExtraAttrs: true,
				stripStyles: ['fill', 'stroke-width']
			}
		});

		assert.ok(result.indexOf('fill') === -1);
		assert.ok(result.indexOf('stroke-width') === -1);
	});

	it('Should remove `style` tag if it is empty', () => {
		const result = stringifier(square, {
			clean: {
				stripEmptyTags: true,
				stripTags: ['title', 'desc'],
				stripAttrs: [],
				stripExtraAttrs: true,
				stripStyles: ['fill', 'stroke', 'stroke-width']
			}
		});

		assert.equal(result.match(/<style>/g).length, 1);
	});

	/**
	 * Options -> Attributes
	 */

	it('Should merge original and specified attributes', () => {
		const result = stringifier(square, {
			clean: defaultOptions.clean,
			iconAttributes: {
				me: 'hello'
			}
		});

		assert.ok(result.indexOf('me="hello"') !== -1);
	});

});
