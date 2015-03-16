/* jslint node: true */
'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');


var Algorithm = function (options) {
  options = options || {};
  var self = this;

  if (!(self instanceof Algorithm)) {
    return new Algorithm(options);
  }

  var arms = _.isUndefined(options.arms) ? 2 : parseInt(options.arms, 10);
  var counts = [];
  var values = [];

  if (arms < 1) {
    throw new TypeError('invalid arms: cannot be less than 1');
  }

  for (var i=0; i<arms; i++) {
    counts.push(0);
    values.push(0);
  }

  var api = {};

  api.n = 0;

  api.load = function (config) {
    arms = config.arms;
    counts = config.counts;
    values = config.values;

    return BPromise.resolve(values);
  };

  api.reward = function (arm, reward) {
    return new BPromise(function (resolve, reject) {
      if (!_.isNumber(arm)) {
        return reject(new TypeError('missing or invalid required parameter: arm'));
      }
      else if (!_.isNumber(reward)) {
        return reject(new TypeError('missing or invalid required parameter: reward'));
      }
      else if (arm >= arms || arm < 0) {
        return reject(new TypeError('invalid arm: ' + arm + ' not in valid range (0-' + arms.length + ')'));
      }

      var ct = ++counts[arm];
      var pre = values[arm];
      var post = ((ct-1) / ct) * pre + (1/ct) * reward;

      values[arm] = post;

      api.n = _.reduce(counts, function (sum, ct) {
        return sum + ct;
      });

      resolve(values);
    });
  };

  api.select = function () {
    return new BPromise(function (resolve) {
      var arm = null;
      var check = counts.indexOf(0);

      if (check !== -1) {
        arm = check;
      } else {
        var top = 2*Math.log(api.n);

        var valuesUCB = counts.map(function (ct, i) {
          return values[i] + Math.sqrt(top / ct);
        });

        arm = valuesUCB.indexOf(Math.max.apply(null, valuesUCB));
      }

      resolve(arm);
    });
  };

  api.serialize = function () {
    return BPromise.resolve({
      arms: arms,
      counts: counts.slice(0),
      values: values.slice(0)
    });
  };

  return api;
};


module.exports = Algorithm;
