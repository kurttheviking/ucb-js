import { Random, MersenneTwister19937 } from 'random-js';

const random = new Random(MersenneTwister19937.autoSeed());
export function randomInteger(min: number, max: number): number {
  return random.integer(min, max);
}
