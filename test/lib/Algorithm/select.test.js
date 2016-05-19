/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var BPromise = require('bluebird');
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm#select', function () {
  var Algorithm = require('../../../index');  // eslint-disable-line global-require
  var arms = _.random(2, 10);
  var config = {
    arms: arms
  };

  it('returns a number', function () {
    var alg = new Algorithm(config);

    alg.select().then(function (arm) {
      expect(arm).to.be.a('number');
    });
  });

  it('returns a valid arm', function () {
    var alg = new Algorithm(config);
    var iterations = _.random(10, 20);
    var trials = Array.apply(null, Array(iterations)).map(Number.prototype.valueOf, -1);

    trials = trials.map(function () {
      return alg.select();
    });

    return BPromise.all(trials).then(function (selections) {
      expect(selections.length).to.equal(trials.length);

      selections.forEach(function (choice) {
        expect(choice).to.be.a('number');
        expect(choice).to.be.below(arms);
      });
    });
  });

  it('initially explores all available arms', function () {
    var alg = new Algorithm(config);
    var tasks = [];

    _.times(
      arms,
      function () {
        tasks.push(function () {
          return alg.select().then(function (arm) {
            return alg.reward(arm, _.random(0, 1));
          });
        });
      }
    );

    BPromise.reduce(
      tasks,
      function (out, task) {
        return task().then(function () { return out + 1; });
      },
      0
    ).then(function (ct) {
      expect(ct).to.equal(tasks.length);

      alg.counts.forEach(function (val) {
        expect(val).to.equal(1);
      });
    });
  });

  it('begins to exploit best arm', function () {
    var alg = new Algorithm(config);
    var tasks = [];

    _.times(
      arms * 4,
      function () {
        tasks.push(function () {
          return alg.select().then(function (arm) {
            return alg.reward(arm, arm === 0 ? 1 : 0);
          });
        });
      }
    );

    BPromise.reduce(
      tasks,
      function (out, task) {
        return task().then(function () { return out + 1; });
      },
      0
    ).then(function (ct) {
      expect(ct).to.equal(tasks.length);

      alg.counts.slice(1).forEach(function (plays) {
        expect(plays).to.be.below(alg.counts[0]);
      });
    });
  });
});
