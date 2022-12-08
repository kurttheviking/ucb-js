import { randomInteger } from './utils/random-integer';

export interface IOptions {
  arms: number;
}

export interface ISerialized {
  arms: number;
  counts: number[];
  values: number[];
}

export class Ucb implements ISerialized {
  arms: number;
  counts: number[];
  values: number[];
  constructor(opts: ISerialized | IOptions) {
    this.arms = opts.arms;

    if (this.arms < 1) {
      throw new TypeError('invalid arms: cannot be less than 1');
    }

    const serialized = opts as ISerialized;
    if (typeof serialized.counts !== 'undefined' && typeof serialized.values !== 'undefined') {
      if (!Array.isArray(serialized.counts)) {
        throw new TypeError('counts must be an array');
      } else if (!Array.isArray(serialized.values)) {
        throw new TypeError('values must be an array');
      } else if (serialized.counts.length !== this.arms) {
        throw new Error('arms and counts.length must be identical');
      } else if (serialized.values.length !== this.arms) {
        throw new Error('arms and values.length must be identical');
      }

      this.counts = serialized.counts.slice(0);
      this.values = serialized.values.slice(0);
    } else {
      this.counts = new Array(this.arms).fill(0);
      this.values = new Array(this.arms).fill(0);
    }
  }

  async reward(arm: number, value: number): Promise<this> {
    return this.rewardSync(arm, value);
  }

  rewardSync(arm: number, value: number): this {
    if (typeof arm !== 'number') {
      throw new TypeError('missing or invalid required parameter: arm');
    } else if (arm >= this.arms || arm < 0) {
      throw new TypeError('arm index out of bounds');
    } else if (typeof value !== 'number') {
      throw new TypeError('missing or invalid required parameter: reward');
    }

    const count = this.counts[arm] + 1;
    const prior = this.values[arm];

    this.counts[arm] = count;

    this.values[arm] = (((count - 1) / count) * prior) + ((1 / count) * value);

    return this;
  }

  async select(): Promise<number> {
    return this.selectSync();
  }

  selectSync(): number {
    let emptyArm = this.counts.indexOf(0);

    if (emptyArm !== -1) {
      const emptyArms = this.counts.reduce((arms, count, index) => {
        if (count === 0) {
          arms.push(index);
        }
        return arms;
      }, []);

      if (emptyArms.length > 1) {
        const randomIndex = randomInteger(0, emptyArms.length - 1);
        emptyArm = emptyArms[randomIndex];
      }

      return emptyArm;
    }

    const bonus = 2 * Math.log(sum(this.counts));

    const values = this.counts.map((ct, i) => this.values[i] + Math.sqrt(bonus / ct));

    const max = Math.max.apply(null, values);

    return values.indexOf(max);
  }

  async serialize(): Promise<ISerialized> {
    return this.serializeSync();
  }

  serializeSync(): ISerialized {
    return {
      arms: this.arms,
      counts: this.counts.slice(0),
      values: this.values.slice(0)
    };
  }
}

function sum(arr: number[]): number {
  return arr.reduce(reducer);
}

function reducer(out: number, value: number): number {
  return out + value;
}
