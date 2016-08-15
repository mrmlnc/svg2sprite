'use strict';

import * as fs from 'fs';
import * as assert from 'assert';

import { clean } from './clean';

describe('Clean', () => {

  const svg = fs.readFileSync('./fixtures/square.svg', 'utf-8');

  it('Should strip declarations.', () => {
    const content = clean(svg, {});

    assert.ok(content.indexOf('?xml') === -1);
    assert.ok(content.indexOf('!Doctype') === -1);
  });

  it('Should strip indent.', () => {
    const content = clean(svg, {});

    assert.ok(content.indexOf('\n') === -1);
  });


  it('Should strip comments.', () => {
    const content = clean(svg, {
      stripComment: true,
    });

    assert.ok(content.indexOf('<!--') === -1);
  });

  it('Should strip empty defenitions.', () => {
    const content = clean(svg, {
      stripEmptyDefinition: true
    });

    assert.ok(content.indexOf('<defs></defs>') === -1);
  });


  it('Should strip empty groups.', () => {
    const content = clean(svg, {
      stripEmptyGroup: true
    });

    assert.ok(content.indexOf('<g></g>') === -1);
  });

  it('Should strip title tag.', () => {
    const content = clean(svg, {
      stripTitle: true
    });

    assert.ok(content.indexOf('<title>') === -1);
  });

  it('Should strip description tag.', () => {
    const content = clean(svg, {
      stripDescription: true
    });

    assert.ok(content.indexOf('<desc>') === -1);
  });

  it('Should strip extra attributes.', () => {
    const content = clean(svg, {
      stripExtraAttributes: true
    });

    assert.ok(content.indexOf('sketch') === -1);
    assert.ok(content.indexOf('xmlns') === -1);
  });

  it('Should strip viewBox attributes.', () => {
    const content = clean(svg, {
      stripViewBox: true
    });

    assert.ok(content.indexOf('viewBox="') === -1);
  });

  it('Should strip fill.', () => {
    const content = clean(svg, {
      stripFill: true
    });

    assert.ok(content.indexOf('fill:') === -1);
    assert.ok(content.indexOf('fill="') === -1);
  });

  it('Should strip any styles.', () => {
    const content = clean(svg, {
      stripStyles: true
    });

    assert.ok(content.indexOf('<style') === -1);
    assert.ok(content.indexOf('style="') === -1);
    assert.ok(content.indexOf('fill:') === -1);
    assert.ok(content.indexOf('fill="') === -1);
  });

});
