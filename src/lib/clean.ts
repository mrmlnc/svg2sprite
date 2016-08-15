'use strict';

import { ICleanOptions } from '../sprite';

export function clean(content: string, options: ICleanOptions): string {
  content = content
    .replace(/<.*?(xml\s|dtd).*?>/g, '')
    .replace(/[\r\n\t]|\s{2,}/g, '');

  if (options.stripComment) {
    content = content.replace(/<!--.*?-->/g, '');
  }
  if (options.stripEmptyDefinition) {
    content = content.replace(/<defs><\/defs>/g, '');
  }
  if (options.stripEmptyGroup) {
    content = content.replace(/<g><\/g>/g, '');
  }
  if (options.stripTitle) {
    content = content.replace(/<title>.*?<\/title>/g, '');
  }
  if (options.stripDescription) {
    content = content.replace(/<desc>.*?<\/desc>/g, '');
  }
  if (options.stripExtraAttributes) {
    content = content
      .replace(/sketch:type=".*?"/g, '')
      .replace(/(xmlns|xmlns:.*?)=".*?"/g, '');
  }
  if (options.stripViewBox) {
    content = content.replace(/viewBox=".*?"/g, '');
  }
  if (options.stripStyles) {
    options.stripFill = true;

    content = content
      .replace(/style=".*?"/g, '')
      .replace(/<style>.*<\/style>/g, '');
  }
  if (options.stripFill) {
    content = content.replace(/fill(?::|=").*?[;"]/g, '');
  }

  return content;
}
