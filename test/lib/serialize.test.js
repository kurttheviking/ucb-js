/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var chai = require('chai');

var expect = chai.expect;

describe('#serialize()', function () {
  var Algorithm = require('../../index');
  var arms = _.random(1, 10);
  var config = {
    arms: arms
  };
  var emptyArray = Array.apply(null, Array(arms)).map(Number.prototype.valueOf, 0);

  it('returns a valid state', function () {
    var alg = new Algorithm(config);

    return alg.serialize().then(function (state) {
      expect(state).to.have.property('arms', config.arms);

      expect(state).to.have.property('counts');
      expect(state.counts).to.deep.equal(emptyArray);

      expect(state).to.have.property('values');
      expect(state.values).to.deep.equal(emptyArray);
    });
  });
});
