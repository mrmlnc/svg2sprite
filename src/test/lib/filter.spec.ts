'use strict';

import * as assert from 'assert';

import { makeExcludeFilter } from '../../lib/filter';

describe('Filter', () => {

	it('Default', () => {
		const result = makeExcludeFilter({
			clean: {
				stripEmptyTags: true,
				stripTags: ['title', 'desc'],
				stripAttrs: [],
				stripExtraAttrs: true,
				stripStyles: false
			}
		});

		const expected = {
			attrs: [
				{ pattern: 'sketch', strict: false },
				{ pattern: 'xmlns', strict: false }
			],
			styleProperties: [],
			tags: ['title', 'desc'],
			emptyTags: true
		};

		assert.deepEqual(result, expected);
	});

	it('Custom attributes', () => {
		const result = makeExcludeFilter({
			clean: {
				stripEmptyTags: true,
				stripTags: ['title', 'desc'],
				stripAttrs: [
					'style',
					{
						pattern: 'xmlns',
						strict: false
					}
				],
				stripExtraAttrs: false,
				stripStyles: false
			}
		});

		const expected = {
			attrs: [
				{ pattern: 'style', strict: true },
				{ pattern: 'xmlns', strict: false }
			],
			styleProperties: [],
			tags: ['title', 'desc'],
			emptyTags: true
		};

		assert.deepEqual(result, expected);
	});

});
