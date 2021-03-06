/**
 * Created by Estevao on 22-12-2017.
 */

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
(function () {
  'use strict';

  require('source-map-support').install();
  require('chai').should();
  var fs = require('fs');

  function getTestSuite (dir) {
    return fs.readdirSync(dir)
      .filter(filter())
      .map(map(dir));
  }

  function filter () {
    return function (file) {
      var ext = file.slice(-3);
      return (ext === '.md');
    };
  }

  function map (dir) {
    return function (file) {
      var name = file.replace('.md', ''),
          htmlPath = dir + name + '.html',
          html = fs.readFileSync(htmlPath, 'utf8'),
          mdPath = dir + name + '.md',
          md = fs.readFileSync(mdPath, 'utf8');

      return {
        name:     name,
        input:    html,
        expected: md
      };
    };
  }

  function assertion (testCase, converter) {
    return function () {
      testCase.actual = converter.makeMarkdown(testCase.input);
      testCase = normalize(testCase);

      // Compare
      testCase.actual.should.equal(testCase.expected);
    };
  }

  //Normalize input/output
  function normalize (testCase) {

    // Normalize line returns
    testCase.expected = testCase.expected.replace(/(\r\n)|\n|\r/g, '\n');
    testCase.actual = testCase.actual.replace(/(\r\n)|\n|\r/g, '\n');

    // Remove extra lines
    testCase.expected = testCase.expected.replace(/^\n+/, '').replace(/\n+$/, '');
    testCase.actual = testCase.actual.replace(/^\n+/, '').replace(/\n+$/, '');

    return testCase;
  }

  module.exports = {
    getTestSuite: getTestSuite,
    assertion: assertion,
    normalize: normalize,
    showdown: require('../../../.build/showdown.js')
  };
})();

