# svg2sprite

> A very simple module to generate SVG sprites.

[![Travis Status](https://travis-ci.org/mrmlnc/svg2sprite.svg?branch=master)](https://travis-ci.org/mrmlnc/svg2sprite)

## Install

```shell
$ npm i -D svg2sprite
```

## Why?

Existing solutions have many dependencies.

## Usage

```js
const svgSprite = require('svg2sprite');
const sprite = svgSprite.collection({ inline: true });

sprite.add('chevron-up', '<svg><path d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5z"></path></svg>');
sprite.add('chevron-down', '<svg><path d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"></path></svg>');

const svg = sprite.compile();

console.log(svg);
// <svg position="absolute" height="0" width="0">
//   <symbol id="chevron-up"><path d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5z"></path></symbol>
//   <symbol id="chevron-down"><path d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"></path></symbol>
// </svg>
```

## Supported methods

#### `.collection([options])`

This method creates a new item collection and returns the available methods for it. See all available [options](#supported-options).

#### `.add(name, content, options)`

This method adds an item to the collection. Using the last argument you can transfer individual settings for that item (e.g. `attributes`). See all available [options](#supported-options).

#### `.get(name)`

Returns the contents of a specified element.

#### `.remove(name)`

Removes the specified item from the collection.

#### `.clean()`

Removes all elements in the collection.

#### `.compile()`

Returns the builded sprite.

## Supported options

**transform**

  * Type: `Function`
  * Default: `undefined`

Allows to transform the provided file before it is processed. For example, to optimize it using SVGO.

```js
{
  transform: (content) => content.toUpperCase();
}
```

**rootAttributes**

  * Type: `Object`
  * Default: `{}`

The attributes that will be added to the root `svg` tag.

**inline**

  * Type: `Boolean`
  * Default: `false`

If you want to embed the sprite into your HTML source, you will want to set this to `true` in order to prevent the creation of SVG namespace declarations and to set some other attributes for effectively hiding the library sprite.

**iconAttributes**

  * Type: `Object`
  * Default: `{}`

The attributes of each icon. Current attribute values will be overwritten.

**iconPrefix**

  * Type: `String`
  * Default: `''`

The name prefix for each icon.

**iconSuffix**

  * Type: `String`
  * Default: `''`

The name suffix for each icon.

**clean**

Clean options.

```js
{
  stripComment: false,         // Strip <!-- * -->
  stripEmptyDefinition: false, // Strip empty <defs></defs>
  stripEmptyGroup: false,      // Strip empty <g></g>
  stripTitle: false,           // Strip <title>*</title>
  stripDescription: false,     // Strip <desc>*</desc>
  stripExtraAttributes: false, // Strip Sketch and xmlns:* attributes
  stripViewBox: false,         // Strip viewBox attributes
  stripStyles: false,          // `stripFill` option and strip all `style` attributes
  stripFill: false             // Strip `fill` attribute (fill="") or fill in the `style` attribute (style="fill:*;")
}
```

## Related

  * [svg2sprite-cli](https://github.com/mrmlnc/svg2sprite-cli) - CLI interface for this module.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/svg2sprite/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
