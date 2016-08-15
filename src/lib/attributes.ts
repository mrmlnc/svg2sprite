'use strict';

import { IAttributes } from '../sprite';

export function updateAttributes(content: string, attrs: IAttributes): string {
  let svg = /<svg.*?>/.exec(content)[0];

  // The current size of the image
  const oldWidth = /width="([^"]+)"/.exec(svg);
  const oldHeight = /height="([^"]+)"/.exec(svg);

  // Update image size
  if (oldWidth && oldHeight) {
    if (attrs.width && !attrs.height) {
      const newHeight = attrs.width / parseFloat(oldWidth[1]) * parseFloat(oldHeight[1]);
      if (newHeight) {
        attrs.height = newHeight;
      }
    } else if (attrs.height && !attrs.width) {
      const newWidth = attrs.height / parseFloat(oldHeight[1]) * parseFloat(oldWidth[1]);
      if (newWidth) {
        attrs.width = newWidth;
      }
    }
  }

  Object.keys(attrs).forEach((property) => {
    if (svg.indexOf(` ${property}="`) === -1) {
      svg = svg.replace(/<svg/, `<svg ${property}="${attrs[property]}"`);
    } else {
      const regexp = new RegExp(`${property}="([^"]+)"`);
      svg = svg.replace(regexp, `${property}="${attrs[property]}"`);
    }
  });

  return content.replace(/<svg.*?>/, svg);
}
