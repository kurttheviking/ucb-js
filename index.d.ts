export interface IAlgorithmOptions {
  arms: number;
}

export interface ISerializedAlgorithm {
  arms: number;
  counts: number[];
  values: number[];
}

declare module 'ucb' {
  // @ts-ignore legacy export
  export = // @ts-ignore legacy export
    class Algorithm implements ISerializedAlgorithm {
    arms: number;
    counts: number[];
    values: number[];

    constructor(options: IAlgorithmOptions | ISerializedAlgorithm);

    public select(): Promise<number>;

    public reward(arm: number, reward: number): Promise<Algorithm>;

    public serialize(): Promise<ISerializedAlgorithm>;
  }
}
