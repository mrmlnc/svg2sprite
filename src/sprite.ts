'use strict';

import stringifier from './lib/stringifier';

export interface IAttributes {
	[property: string]: string | number;
}

export interface IExcludeItem {
	pattern: string;
	strict: boolean;
}

export interface ICleanOptions {
	stripEmptyTags?: boolean;
	stripTags?: string[];
	stripAttrs?: (string | IExcludeItem)[];
	stripExtraAttrs?: boolean;
	stripStyles?: boolean | string[];
}

export interface IOptions {
	/**
	 * The attributes that will be added to the root `svg` tag.
	 */
	rootAttributes?: IAttributes;
	/**
	 * If you want to embed the sprite into your HTML source, you will want to set
	 * this to `true` in order to prevent the creation of SVG namespace declarations
	 * and to set some other attributes for effectively hiding the library sprite.
	 */
	inline?: boolean;
	/**
	 * The attributes of each icon. Current attribute values will be overwritten.
	 */
	iconAttributes?: IAttributes;
	/**
	 * The name prefix for each icon.
	 */
	iconPrefix?: string;
	/**
	 * The name suffix for each icon.
	 */
	iconSuffix?: string;
	/**
	 * Clean options.
	 */
	clean?: ICleanOptions;
}

function compileCollection(storage: any, options: IOptions): string {
	let root = [
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
	].join('');

	if (options.inline) {
		root = '<svg';

		options.rootAttributes = Object.assign({
			width: 0,
			height: 0,
			position: 'absolute'
		}, options.rootAttributes);
	}

	Object.keys(options.rootAttributes).forEach((key) => {
		root += ` ${key}="${options.rootAttributes[key]}"`;
	});

	let buf = '';
	Object.keys(storage).forEach((key) => {
		buf += storage[key].replace(/^<symbol/, `<symbol id="${key}"`);
	});

	return root + '>' + buf + '</svg>';
}

export function collection(options?: IOptions) {
	options = Object.assign(<IOptions>{
		rootAttributes: {},
		inline: false,
		iconAttributes: {},
		iconPrefix: '',
		iconSuffix: ''
	}, options);

	options.clean = Object.assign(<ICleanOptions>{
		stripEmptyTags: true,
		stripTags: ['title', 'desc'],
		stripAttrs: [],
		stripExtraAttrs: true,
		stripStyles: false
	}, options.clean);

	// Storage for icons
	let storage = {};

	return {
		add: (name: string, content: string, iconOptions?: IOptions): void => {
			// Create local scope for the icon
			iconOptions = Object.assign(options, iconOptions);

			// The unique ID for the icon in the sprite
			const id = iconOptions.iconPrefix + name + iconOptions.iconSuffix;

			// Saving an icon in the storage
			storage[id] = stringifier(content, iconOptions);
		},
		get: (name: string): string => {
			return storage[name];
		},
		remove: (name: string): void => {
			delete storage[name];
		},
		clean: () => {
			storage = {};
		},
		compile: () => {
			return compileCollection(storage, options);
		}
	};
}
