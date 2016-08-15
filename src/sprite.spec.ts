'use strict';

import * as fs from 'fs';
import * as assert from 'assert';

import * as ss from './sprite';

const square = fs.readFileSync('./fixtures/square.svg', 'utf-8');
const circle = fs.readFileSync('./fixtures/circle.svg', 'utf-8');
const expected = fs.readFileSync('./fixtures/sprite.svg', 'utf-8');

describe('Sprite', () => {

  it('Should add a new item to the collection.', () => {
    const sprite = ss.collection();

    sprite.add('test', square);

    const icon = sprite.get('test');

    assert.ok(icon.indexOf('<symbol') !== -1);
    assert.ok(icon.indexOf('id="test"') !== -1);
  });

  it('Should remove the item from the collection.', () => {
    const sprite = ss.collection();

    sprite.add('test', square);
    sprite.remove('test');

    assert.ok(!sprite.get('test'));
  });

  it('Should clear the collection.', () => {
    const sprite = ss.collection();

    sprite.add('test', square);
    sprite.clean();

    assert.ok(!sprite.get('test'));
  });

  it('Should use a provide transformer.', () => {
    const sprite = ss.collection({
      transform: (content) => {
        return '<svg></svg>';
      }
    });

    sprite.add('test', square);

    assert.equal(sprite.get('test'), '<symbol id="test"></symbol>');
  });

});

describe('Compile', () => {

  it('Default options.', () => {
    const sprite = ss.collection();

    sprite.add('test', square);

    const content = sprite.compile();

    assert.ok(content.indexOf('?xml') !== -1);
    assert.ok(content.indexOf('svg xmlns') !== -1);
    assert.ok(content.indexOf('<symbol id="test"') !== -1);
  });

  it('With `inline` option.', () => {
    const sprite = ss.collection({
      inline: true
    });

    sprite.add('test', square);

    const content = sprite.compile();

    assert.ok(content.indexOf('?xml') === -1);
    assert.ok(content.indexOf('<svg position="absolute" height="0" width="0">') !== -1);
    assert.ok(content.indexOf('<symbol id="test"') !== -1);
  });

  it('With `rootAttributes` option.', () => {
    const sprite = ss.collection({
      rootAttributes: {
        test: 'test'
      }
    });

    sprite.add('test', square);

    const content = sprite.compile();

    assert.ok(content.indexOf('<svg test="test"') !== -1);
    assert.ok(content.indexOf('<symbol id="test"') !== -1);
  });

  it('With `iconAttributes` option.', () => {
    const sprite = ss.collection({
      iconAttributes: {
        test: 'test'
      }
    });

    sprite.add('test', square);

    const content = sprite.compile();

    assert.ok(content.indexOf('<symbol id="test" test="test"') !== -1);
  });

  it('With `iconPrefix` and `iconSuffix` option.', () => {
    const sprite = ss.collection({
      iconPrefix: 'prefix-',
      iconSuffix: '-suffix'
    });

    sprite.add('test', square);

    const content = sprite.compile();

    assert.ok(content.indexOf('<symbol id="prefix-test-suffix"') !== -1);
  });

  it('Sprite validation.', () => {
    const sprite = ss.collection({
      inline: true
    });

    sprite.add('square', square);
    sprite.add('circle', circle);

    const content = sprite.compile();

    assert.equal(content, expected.replace(/[\r\n\t]|\s{2,}/g, ''));
  });

});
