'use strict';

import { IOptions, IExcludeItem } from '../sprite';

export interface IExclude {
	attrs: IExcludeItem[];
	styleProperties: string[];
	tags: string[];
	emptyTags: boolean;
}

/**
 * Creates a collection of attributes and tags that should be exclude from the output
 */
export function makeExcludeFilter(options: IOptions): IExclude {
	let tags: string[] = [];
	let attrs: IExcludeItem[] = [];
	let styleProperties: string[] = [];

	if (options.clean.stripTags) {
		tags = tags.concat(options.clean.stripTags);
	}
	if (options.clean.stripExtraAttrs) {
		attrs = attrs.concat([
			{ pattern: 'sketch', strict: false },
			{ pattern: 'xmlns', strict: false }
		]);
	}
	if (options.clean.stripAttrs.length !== 0) {
		options.clean.stripAttrs.forEach((attr) => {
			if (typeof attr === 'string') {
				attrs.push({
					pattern: attr,
					strict: true
				});
			} else {
				attrs.push(attr);
			}
		});
	}
	if (Array.isArray(options.clean.stripStyles)) {
		styleProperties = styleProperties.concat(options.clean.stripStyles);
	} else if (options.clean.stripStyles) {
		attrs.push({ pattern: 'fill', strict: true });
		tags.push('style');
	}

	return {
		attrs,
		styleProperties,
		tags,
		emptyTags: options.clean.stripEmptyTags
	};
}
