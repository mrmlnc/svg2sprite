'use strict';

import * as fs from 'fs';
import * as assert from 'assert';

import { updateAttributes } from './attributes';

describe('Attributes', () => {

  const svg = fs.readFileSync('./fixtures/square.svg', 'utf-8');

  it('Should add/update attributes.', () => {
    const content = updateAttributes(svg, {
      viewBox: '0 0 64 64',
      test: 'test'
    });

    assert.ok(content.indexOf('test="test"') !== -1);
    assert.ok(content.indexOf('viewBox="0 0 64 64"') !== -1);
  });

  it('Should modify attributes only in first tag.', () => {
    const content = updateAttributes('<svg><svg viewBox="0 0 128 128"></svg></svg>', {
      viewBox: '0 0 64 64',
      test: 'test'
    });

    assert.equal(content, '<svg test="test" viewBox="0 0 64 64"><svg viewBox="0 0 128 128"></svg></svg>');
  });

  it('Should change the width of the image.', () => {
    const content = updateAttributes('<svg width="32" viewBox="0 0 128 128"></svg>', { width: 64 });

    assert.equal(content, '<svg width="64" viewBox="0 0 128 128"></svg>');
  });

  it('Should change the jeight of the image.', () => {
    const content = updateAttributes('<svg height="32" viewBox="0 0 128 128"></svg>', { height: 64 });

    assert.equal(content, '<svg height="64" viewBox="0 0 128 128"></svg>');
  });

  it('Should change the svg size (with proportions).', () => {
    const content = updateAttributes('<svg width="64" height="64" viewBox="0 0 128 128"></svg>', {
      height: 32
    });

    assert.equal(content, '<svg width="32" height="32" viewBox="0 0 128 128"></svg>');
  });

  it('Should change the svg size (without proportions).', () => {
    const content = updateAttributes('<svg width="32" height="64" viewBox="0 0 128 128"></svg>', {
      width: 64,
      height: 96
    });

    assert.equal(content, '<svg width="64" height="96" viewBox="0 0 128 128"></svg>');
  });

});
