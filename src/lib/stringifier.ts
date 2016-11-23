'use strict';

import * as parser from 'svg-parser';

import { cleanupStyleProperties, skipTag } from './clean';
import { IExclude, makeExcludeFilter } from './filter';

import { IOptions, IAttributes } from '../sprite';

/**
 * Creates a string that represents the tag attributes
 */
function makeAttributes(tree: parser.INode, iconAttrs: IAttributes, filters: IExclude): string {
	let attrs = '';

	// Merge original and specified attributes
	const attrsCollection = Object.assign(tree.attributes, iconAttrs);

	Object.keys(attrsCollection).forEach((key) => {
		let value = tree.attributes[key];

		// Use filters for attribute
		for (let i = 0; i < filters.attrs.length; i++) {
			const filter = filters.attrs[i];

			// Exclude attribute by strict comparison
			if (filter.strict && filter.pattern === key) {
				return;
			}

			// Exclude attribute by no strict comparison
			if (!filter.strict && key.indexOf(filter.pattern) !== -1) {
				return;
			}
		}

		// Remove the specified properties of the `style` attribute
		if (key === 'style') {
			value = cleanupStyleProperties(value, filters.styleProperties);
		}

		// Remove extra spaces
		value = value.toString().trim();

		// Create attribute
		if (value) {
			attrs += ` ${key}="${value}"`;
		}
	});

	return attrs;
}

/**
 * Creates a string that represents the tag without children
 */
function makeClosedTag(tree: parser.INode, options: IOptions, filters: IExclude): string {
	const attrs = makeAttributes(tree, options.iconAttributes, filters);

	// Exclude tag by filters
	if (skipTag(tree, attrs, filters)) {
		return '';
	}

	// Create tag
	return `<${tree.name}${attrs}></${tree.name}>`;
}

/**
 * Creates a string that represents the tag content
 */
function makeContent(content: string, parent: string, filters: IExclude): string {
	let start = '';
	let end = '';
	if (parent === 'style') {
		start = '<![CDATA[';
		end = ']]>';

		content = cleanupStyleProperties(content, filters.styleProperties);
	}

	return start + content + end;
}

/**
 * Creating a SVG string from the tree
 */
function stringify(tree: parser.INode, options: IOptions, filters: IExclude, parent: string, isNestedSvg): string {
	let svg = '';

	if (tree.children && tree.children.length !== 0) {
		let name = tree.name;
		if (name === 'svg' && !isNestedSvg) {
			name = 'symbol';
			isNestedSvg = true;
		}

		const attrs = makeAttributes(tree, options.iconAttributes, filters);

		// Exclude tag
		if (!skipTag(tree, attrs, filters)) {
			svg += `<${name}${attrs}>`;

			for (let i = 0; i < tree.children.length; i++) {
				svg += stringify(tree.children[i], options, filters, name, isNestedSvg);
			}

			svg += `</${name}>`;
		}
	} else if (typeof tree === 'object') {
		svg += makeClosedTag(tree, options, filters);
	} else {
		svg += makeContent(<string>tree, parent, filters);
	}

	return svg;
}

export default function stringifier(content: string, options: IOptions): string {
	const ast = parser.parse(content);
	const filters = makeExcludeFilter(options);

	return stringify(ast, options, filters, null, false);
}
