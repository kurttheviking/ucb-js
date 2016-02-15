var _ = require('lodash');
var BPromise = require('bluebird');
var debug = require('debug')('ucb');

var async = BPromise.method;

function Algorithm(options) {
  var opts = options || {};

  if (!(this instanceof Algorithm)) {
    return new Algorithm(opts);
  }

  debug('init', opts);

  this.arms = _.isUndefined(opts.arms) ? 2 : parseInt(opts.arms, 10);

  if (this.arms < 1) {
    throw new TypeError('invalid arms: cannot be less than 1');
  }

  this.counts = Array.apply(null, Array(this.arms)).map(Number.prototype.valueOf, 0);
  this.values = Array.apply(null, Array(this.arms)).map(Number.prototype.valueOf, 0);
}

Algorithm.prototype.load = async(require('./lib/load'));
Algorithm.prototype.reward = async(require('./lib/reward'));
Algorithm.prototype.select = async(require('./lib/select'));
Algorithm.prototype.serialize = async(require('./lib/serialize'));

module.exports = Algorithm;
