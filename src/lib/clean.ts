'use strict';

import * as parser from 'svg-parser';

import { IExclude } from './filter';

export function cleanupStyleProperties(content: string, toExclude: string[]): string {
	content = content.replace(/[\r\n\t]|\s{2,}/g, '');
	if (toExclude.length === 0) {
		return content.trim();
	}

	const re = new RegExp(`(\s*(?:${toExclude.join('|')})\s*?:\s*([^;>]*?)(?=[;"'>}]|$);?)`, 'gi');
	return content.replace(re, '').trim();
}

export function skipTag(tree: parser.INode, attrs: string, filters: IExclude): boolean {
	// Exclude tag by list of empty tags
	if (attrs === '' && tree.children.length === 0 && filters.emptyTags) {
		return true;
	}

	// Exclude tag by list of tags to exclude
	if (filters.tags.indexOf(tree.name) !== -1) {
		return true;
	}

	return false;
}
