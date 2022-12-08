import { Ucb } from "../src/ucb";
import { randomInteger } from "../src/utils/random-integer";
import { cloneSimpleObject } from "./utils/clone-simple-object";

describe('Ucb', () => {
  describe('constructor', () => {
    const arms = randomInteger(2, 10);
    const state = {
      arms,
      counts: new Array(arms).fill(0),
      values: new Array(arms).fill(0)
    };

    state.counts = state.counts.map(() => randomInteger(0, 10));
    state.values = state.values.map(() => randomInteger(0, 100) / 100);

    it('restores instance properties from prior state', () => {
      const alg = new Ucb(state);

      expect(alg.arms).toEqual(state.arms);
      expect(alg.counts).toEqual(state.counts);
      expect(alg.values).toEqual(state.values);
    });

    it('throws TypeError when passed arms=0', () => {
      function test() {
        return new Ucb({ arms: 0 });
      }

      expect(test).toThrow(TypeError);
      expect(test).toThrow(/invalid arms: cannot be less than 1/);
    });

    it('throws TypeError when passed arms<0', () => {
      function test() {
        return new Ucb({ arms: -1 });
      }

      expect(test).toThrow(TypeError);
      expect(test).toThrow(/invalid arms: cannot be less than 1/);
    });

    it('throws if counts is not an array', () => {
      const localState = { ...state, counts: Date.now().toString(16) };

      function test() {
        return new Ucb(localState);
      }

      expect(test).toThrow(TypeError);
      expect(test).toThrow(/counts must be an array/);
    });

    it('throws if values is not an array', () => {
      const localState = { ...state, values: Date.now().toString(16) };

      function test() {
        return new Ucb(localState);
      }

      expect(test).toThrow(TypeError);
      expect(test).toThrow(/values must be an array/);
    });

    it('throws if counts.length does not equal arm count', () => {
      const localState = cloneSimpleObject(state);

      localState.counts.pop();

      function test() {
        return new Ucb(localState);
      }

      expect(test).toThrow(Error);
      expect(test).toThrow(/arms and counts.length must be identical/);
    });

    it('throws if values.length does not equal arm count', () => {
      const localState = cloneSimpleObject(state);

      localState.values.pop();

      function test() {
        return new Ucb(localState);
      }

      expect(test).toThrow(Error);
      expect(test).toThrow(/arms and values.length must be identical/);
    });
  });

  describe('reward', () => {
    const arms = randomInteger(2, 10);
    const config = {
      arms
    };

    it('updates the values and counts accumulators', async() => {
      const ucb = new Ucb(config);

      const arm = randomInteger(0, arms - 1);
      const val = randomInteger(0, 100) / 100;

      await ucb.reward(arm, val);
      expect(ucb.counts[arm]).toEqual(1);
      expect(ucb.values[arm]).toEqual(val);

      expect(ucb.counts.reduce((accum, x) => accum + x)).toEqual(1);
      expect(ucb.values.reduce((accum, x) => accum + x)).toEqual(val);
    });

    it('updates the observation counter', async () => {
      const ucb = new Ucb(config);

      const arm = randomInteger(0, arms - 1);
      const val = randomInteger(0, 100) / 100;

      const pre = ucb.counts.reduce((out, x) => out + x);

      await ucb.reward(arm, val);
      const post = ucb.counts.reduce((accum, x) => accum + x);

      expect(post).toEqual(pre + 1);
    });

    it('resolves to the updated algorithm instance', async () => {
      const ucb = new Ucb(config);

      const arm = randomInteger(0, arms - 1);
      const val = randomInteger(0, 100) / 100;

      const out = await ucb.reward(arm, val);
      expect(out).toBeInstanceOf(Ucb);
      expect(typeof out.select).toBe('function');
      expect(typeof out.reward).toBe('function');
      expect(typeof out.serialize).toBe('function');
    });

    it('throws if the arm index is null', async () => {
      const ucb = new Ucb(config);

      const val = randomInteger(0, 100) / 100;

      await expect(async () => ucb.reward(null, val))
        .rejects.toThrow(/missing or invalid required parameter: arm/);
    });

    it('throws if the arm index is negative', async () => {
      const ucb = new Ucb(config);

      const val = randomInteger(0, 100) / 100;

      await expect(async () => ucb.reward(-1, val)).rejects.toThrow(/arm index out of bounds/);
    });

    it('throws if the arm index exceeds total arms', async () => {
      const ucb = new Ucb(config);

      const val = randomInteger(0, 100) / 100;

      await expect(async () => ucb.reward(config.arms * 10, val))
        .rejects.toThrow(/arm index out of bounds/);
    });

    it('throws if the arm index is undefined', async () => {
      const ucb = new Ucb(config);

      const val = randomInteger(0, 100) / 100;

      await expect(async () => ucb.reward(undefined, val))
        .rejects.toThrow(/missing or invalid required parameter: arm/);
    });

    it('throws if the arm index is not a number', async () => {
      const ucb = new Ucb(config);

      const val = randomInteger(0, 100) / 100;

      await expect(async () => ucb.reward('0' as unknown as number, val))
        .rejects.toThrow(/missing or invalid required parameter: arm/);
    });

    it('throws if the reward is null', async () => {
      const ucb = new Ucb(config);

      await expect(async () => ucb.reward(0, null))
        .rejects.toThrow(/missing or invalid required parameter: reward/);
    });

    it('throws if the reward is undefined', async () => {
      const alg = new Ucb(config);

      await expect(async () => alg.reward(0, undefined))
        .rejects.toThrow(/missing or invalid required parameter: reward/);
    });

    it('throws if the reward is not a number', async () => {
      const ucb = new Ucb(config);

      await expect(async () => ucb.reward(0, '1' as unknown as number))
        .rejects.toThrow(/missing or invalid required parameter: reward/);
    });
  });

  describe('select', () => {
    const arms = randomInteger(2, 10);
    const config = {
      arms
    };

    it('returns a number', async () => {
      const alg = new Ucb(config);

      const arm = await alg.select();
      expect(typeof arm).toBe('number');
    });

    it('returns a valid arm', async () => {
      const alg = new Ucb(config);

      const trials = new Array(randomInteger(10, 20)).fill(-1);

      const selections = await Promise.all(trials.map(() => alg.select()));
      expect(selections.length).toEqual(trials.length);

      selections.forEach((choice) => {
        expect(typeof choice).toBe('number');
        expect(choice).toBeLessThan(arms);
      });
    });

    it('initially explores all available arms', async () => {
      const alg = new Ucb(config);
      for (let arm = 0; arm < arms; arm++) {
        const arm = await alg.select();
        await alg.reward(arm, randomInteger(0, 100) / 100);
      }
      alg.counts.forEach((ct) => {
        expect(ct).toEqual(1);
      });
    });

    it('begins to exploit best arm (first)', async () => {
      const alg = new Ucb(config);

      for (let i = 0; i < arms * 10; i++) {
        const arm = await alg.select();
        await alg.reward(arm, arm === 0 ? 1 : 0);
      }

      const bestCt = alg.counts[0];
      alg.counts.slice(1).forEach((ct) => {
        expect(ct).toBeLessThan(bestCt);
      });
    });

    it('begins to exploit best arm (last)', async () => {
      const alg = new Ucb(config);

      for (let i = 0; i < arms * 10; i++) {
        const arm = await alg.select();
        await alg.reward(arm, arm === arms - 1 ? 1 : 0);
      }

      const bestCt = alg.counts[arms - 1];

      alg.counts.slice(0, -1).forEach((ct) => {
        expect(ct).toBeLessThan(bestCt);
      });
    });
  });

  describe('serialize', () => {
    const arms = randomInteger(2, 20);
    const config = {
      arms
    };

    const emptyArray = new Array(arms).fill(0);

    it('returns a valid state', async () => {
      const alg = new Ucb(config);

      const state = await alg.serialize();
      expect(state.arms).toEqual(arms);
      expect(state.counts).toEqual(emptyArray);
      expect(state.values).toEqual(emptyArray);
    });
  });
});
