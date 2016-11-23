'use strict';

import * as assert from 'assert';

import * as parser from 'svg-parser';

import { cleanupStyleProperties, skipTag } from '../../lib/clean';

describe('Clean', () => {

	/**
	 * Function: cleanupStyleProperties
	 */

	it('cleanupStyleProperties - One parameter', () => {
		const result = cleanupStyleProperties('fill: #eee; fill: #eee', ['fill']);
		assert.equal(result, '');
	});

	it('cleanupStyleProperties - Two parameter', () => {
		const result = cleanupStyleProperties('fill: #eee; stroke:black; fill: #eee', ['fill', 'stroke']);
		assert.equal(result, '');
	});

	it('cleanupStyleProperties - Content from `style` tag', () => {
		const css = '#internal rect {\n  fill: slategrey;\n  stroke: black;\n  stroke-width: 3;\n  -webkit-transition: all 350ms;\n}';
		const result = cleanupStyleProperties(css, ['fill', 'stroke-width']);
		assert.equal(result, '#internal rect {stroke: black;-webkit-transition: all 350ms;}');
	});

	/**
	 * Function: skipTag
	 */

	it('skipTag - skip by list of empty tags', () => {
		const tree: parser.INode = {
			name: 'g',
			attributes: {},
			children: [],
			metadata: ''
		};

		const options = {
			emptyTags: true,
			attrs: [],
			styleProperties: [],
			tags: []
		};

		assert.equal(skipTag(tree, '', options), true, 'empty tag');
		assert.equal(skipTag(tree, 'a=""', options), false, 'non-empty tag');
	});

	it('skipTag - skip by list of tags to exclude', () => {
		const tree: parser.INode = {
			name: 'g',
			attributes: {},
			children: [],
			metadata: ''
		};

		const options = {
			emptyTags: true,
			attrs: [],
			styleProperties: [],
			tags: ['g']
		};

		assert.equal(skipTag(tree, '', options), true, 'empty tag');
		assert.equal(skipTag(tree, 'a=""', options), true, 'non-empty tag');
	});

});
