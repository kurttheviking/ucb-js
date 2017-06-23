/* global describe, it */
/* eslint-disable global-require, import/no-extraneous-dependencies */

const expect = require('chai').expect;

const cloneSimpleObject = require('../utils/cloneSimpleObject');
const randomInteger = require('../utils/randomInteger');

describe('Algorithm', () => {
  const Algorithm = require('../../index');

  const arms = randomInteger(2, 10);
  const state = {
    arms,
    counts: new Array(arms).fill(0),
    values: new Array(arms).fill(0)
  };

  state.counts = state.counts.map(() => randomInteger(0, 10));
  state.values = state.values.map(() => randomInteger(0, 100) / 100);

  it('does not require new keyword', () => {
    const alg = Algorithm();

    expect(alg).to.have.property('arms');
    expect(alg).to.have.property('counts');
    expect(alg).to.have.property('values');
  });

  it('restores instance properties from prior state', () => {
    const alg = new Algorithm(state);

    expect(alg.arms).to.equal(state.arms);
    expect(alg.counts).to.deep.equal(state.counts);
    expect(alg.values).to.deep.equal(state.values);
  });

  it('throws TypeError when passed arms=0', () => {
    function test() {
      return new Algorithm({ arms: 0 });
    }

    expect(test).to.throw(TypeError);
    expect(test).to.throw(/invalid arms: cannot be less than 1/);
  });

  it('throws TypeError when passed arms<0', () => {
    function test() {
      return new Algorithm({ arms: -1 });
    }

    expect(test).to.throw(TypeError);
    expect(test).to.throw(/invalid arms: cannot be less than 1/);
  });

  it('throws if counts is not an array', () => {
    const localState = Object.assign({}, state, { counts: Date.now().toString(16) });

    function test() {
      return new Algorithm(localState);
    }

    expect(test).to.throw(TypeError);
    expect(test).to.throw(/counts must be an array/);
  });

  it('throws if values is not an array', () => {
    const localState = Object.assign({}, state, { values: Date.now().toString(16) });

    function test() {
      return new Algorithm(localState);
    }

    expect(test).to.throw(TypeError);
    expect(test).to.throw(/values must be an array/);
  });

  it('throws if counts.length does not equal arm count', () => {
    const localState = cloneSimpleObject(state);

    localState.counts.pop();

    function test() {
      return new Algorithm(localState);
    }

    expect(test).to.throw(Error);
    expect(test).to.throw(/arms and counts.length must be identical/);
  });

  it('throws if values.length does not equal arm count', () => {
    const localState = cloneSimpleObject(state);

    localState.values.pop();

    function test() {
      return new Algorithm(localState);
    }

    expect(test).to.throw(Error);
    expect(test).to.throw(/arms and values.length must be identical/);
  });
});
