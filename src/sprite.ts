'use strict';

import { clean } from './lib/clean';
import { updateAttributes } from './lib/attributes';

export interface IAttributes {
  id?: string;
  width?: number;
  height?: number;
  [property: string]: string | number;
}

export interface ICleanOptions {
  /**
   * Strip comments.
   */
  stripComment?: boolean;
  /**
   * Strip empty `defs` tags.
   */
  stripEmptyDefinition?: boolean;
  /**
   * Strip empty `g` tags.
   */
  stripEmptyGroup?: boolean;
  /**
   * Strip `title` tags.
   */
  stripTitle?: boolean;
  /**
   * Strip `desc` tags.
   */
  stripDescription?: boolean;
  /**
   * Strip Sketch, xmlns and xmlns:* attributes.
   */
  stripExtraAttributes?: boolean;
  /**
   * Strip viewBox attributes.
   */
  stripViewBox?: boolean;
  /**
   * Strip `style` tags and attributes.
   */
  stripStyles?: boolean;
  /**
   * Strip `fill` attributes and property (style="fill:*;").
   */
  stripFill?: boolean;
}

export interface IOptions {
  /**
   * SVG transform.
   */
  transform?: (content: string) => string;
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

export function collection(options?: IOptions) {
  options = Object.assign({
    rootAttributes: {},
    inline: false,
    iconAttributes: {},
    iconPrefix: '',
    iconSuffix: ''
  }, options);

  options.clean = Object.assign({
    stripComment: false,
    stripEmptyDefinition: false,
    stripEmptyGroup: false,
    stripTitle: false,
    stripDescription: false,
    stripExtraAttributes: false,
    stripViewBox: false,
    stripFill: false,
    stripStyles: false
  }, options.clean);

  let storage = {};

  return {
    add: (name: string, content: string, iconOptions?: IOptions): void => {
      iconOptions = Object.assign(options, iconOptions);

      iconOptions.iconAttributes.id = iconOptions.iconPrefix + name + iconOptions.iconSuffix;

      storage[name] = addToCollection(content, iconOptions);
    },
    get: (name: string): string => {
      return storage[name];
    },
    remove: (name: string): void => {
      delete storage[name];
    },
    clean: (): void => {
      storage = {};
    },
    compile: () => compileCollection(storage, options)
  };
}

function addToCollection(content: string, options: IOptions) {
  if (options.transform) {
    content = options.transform(content);
  }

  content = clean(content, options.clean);
  content = updateAttributes(content, options.iconAttributes);

  return content.replace(/<(\/*)svg/g, '<$1symbol');
}

function compileCollection(storage: any, options: IOptions): string {
  let root = [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
  ].join('');

  if (options.inline) {
    root = '<svg>';
    options.rootAttributes = Object.assign({
      width: 0,
      height: 0,
      position: 'absolute'
    }, options.rootAttributes);
  }

  root = updateAttributes(root, options.rootAttributes);

  let buf = '';
  Object.keys(storage).forEach((key) => {
    buf += storage[key];
  });

  return root + buf + '</svg>';
}
