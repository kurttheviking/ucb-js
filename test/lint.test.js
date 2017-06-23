/* eslint-disable global-require, import/no-extraneous-dependencies, strict */

'use strict';

require('eslint');
const lint = require('mocha-eslint');

const options = {};
const paths = [
  'lib',
  'index.js'
];

options.formatter = 'compact';

lint(paths, options);
