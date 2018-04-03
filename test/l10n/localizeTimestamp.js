/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const { assert } = require('chai');

describe('localizeTimestamp:', () => {
  let localizeTimestamp;

  before(() => {
    localizeTimestamp = require('../../l10n/localizeTimestamp');
  });

  it('returned a function with one parameter', () => {
    assert.isFunction(localizeTimestamp);
    assert.lengthOf(localizeTimestamp, 1);
  });

  it('throws if called without defaultLanguage', () => {
    assert.throws(() => localizeTimestamp({ supportedLanguages: [ 'en' ] }));
  })

  describe('call with supported language:', () => {
    let format;

    before(() => {
      format = localizeTimestamp({
        supportedLanguages: [ 'en', 'en-GB', 'es', 'ru' ],
        defaultLanguage: 'en'
      }).format;
    });

    it('returned a function with one parameter', () => {
      assert.isFunction(localizeTimestamp);
      assert.lengthOf(localizeTimestamp, 1);
    });

    it('returns the empty string if called without arguments', () => {
      assert.strictEqual(format(), '');
    });

    it('returns the default language if called without an Accept-Language header', () => {
      assert.equal(format(Date.now() - 1), 'a few seconds ago');
    });

    it('returns the requested language if called with an Accept-Language header', () => {
      assert.equal(format(Date.now() - 1, 'qu,ru;q=0.8,en-GB;q=0.5,en;q=0.3'), 'несколько секунд назад');
    });

    it('returns the requested language if called with a single language', () => {
      assert.equal(format(Date.now() - 1, 'ru'), 'несколько секунд назад');
    });

    it('returns the requested language if called with a language variation', () => {
      assert.equal(format(Date.now() - 1, 'es-mx, ru'), 'hace unos segundos');
    });

    it('returns the default language if called with an unsupported language', () => {
      assert.equal(format(Date.now() - 1, 'qu'), 'a few seconds ago');
    });

    it('returns the default language if called with no language', () => {
      assert.equal(format(Date.now() - 1, 'q=0.8'), 'a few seconds ago');
    });
  });

  describe('call with no supported languages:', () => {
    let format;

    before(() => {
      format = localizeTimestamp({
        supportedLanguages: [],
        defaultLanguage: 'en'
      }).format;
    });

    it('returned a function with one parameter', () => {
      assert.isFunction(localizeTimestamp);
      assert.lengthOf(localizeTimestamp, 1);
    });

    it('returns the empty string if called without arguments', () => {
      assert.strictEqual(format(), '');
    });

    it('returns the default language if called without an Accept-Language header', () => {
      assert.equal(format(Date.now() - 1), 'a few seconds ago');
    });

    it('returns the default language if called with an unsupported language', () => {
      assert.equal(format(Date.now() - 1, 'ru'), 'a few seconds ago');
    });
  });
});
