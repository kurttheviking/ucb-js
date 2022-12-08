ucb
===

[![Build Status](https://travis-ci.org/kurttheviking/ucb-js.svg?branch=master)](https://travis-ci.org/kurttheviking/ucb-js)

**An upper confidence bounds algorithm for multi-armed bandit problems**

This implementation is based on [<em>Bandit Algorithms for Website Optimization</em>](http://shop.oreilly.com/product/0636920027393.do) and related empirical research in ["Algorithms for the multi-armed bandit problem"](http://www.cs.mcgill.ca/~vkules/bandits.pdf). In addition, this module conforms to the [BanditLab/2.0 specification](https://github.com/kurttheviking/banditlab-spec/releases).  Now written in Typescript!


## Get started

### Prerequisites

- Node.js 6.x+ ([LTS track](https://github.com/nodejs/LTS#lts-schedule1))
- npm

### Installing

Install with `npm` (or `yarn`):

```sh
npm install ucb --save
```

### Caveat emptor

This implementation often encounters extended floating point numbers. Arm selection is therefore subject to JavaScript's floating point precision limitations. For general information about floating point issues see the [floating point guide](http://floating-point-gui.de).


## Usage

1. Create an optimizer with `3` arms:

    ```js
    const { Ucb } = require('ucb');

    const ucb = new Ucb({
      arms: 3
    });
    ```

2. Select an arm (exploits or explores, determined by ucb):

    ```js
    ucb.select().then((arm) => {
      // do something based on the chosen arm
    });
    // or
    const arm = ucb.selectSync();
    ```

3. Report the reward earned from a chosen arm:

    ```js
    ucb.reward(arm, value);
    ```


## API

### `Ucb(config)`

Creates a new Ucb.

#### Arguments

- `config` (`Object`): ucb instance parameters

The `config` object supports two optional parameters:

- `arms` (`Number`, Integer): The number of arms over which the optimization will operate; defaults to `2`

Alternatively, the `state` object resolved from [`Ucb#serialize`](https://github.com/kurttheviking/ucb-js#algorithmserialize) can be passed as `config`.

#### Returns

An instance of Ucb.

#### Example

```js
const { Ucb } = require('ucb');
const ucb = new Ucb();

assert.equal(ucb.arms, 2);
```

Or, with a passed `config`:

```js
const { Ucb } = require('ucb');
const ucb = new Ucb({ arms: 4 });

assert.equal(ucb.arms, 4);
```

### `Ucb#select()`

Choose an arm to play, according to Ucb.

#### Arguments

_None_

#### Returns

A `Promise` that resolves to a `Number` corresponding to the associated arm index.

#### Example

```js
const { Ucb } = require('ucb');
const ucb = new Ucb();

ucb.select().then(arm => console.log(arm));
// or
const arm = ucb.selectSync();
```

### `Ucb#reward(arm, reward)`

Inform Ucb about the payoff from a given arm.

#### Arguments

- `arm` (`Number`, Integer): the arm index (provided from `Ucb#select()`)
- `reward` (`Number`): the observed reward value (which can be 0 to indicate no reward)

#### Returns

A `Promise` that resolves to an updated instance of ucb. (The original instance is mutated as well.)

#### Example

```js
const { Ucb } = require('ucb');
const ucb = new Ucb();

ucb.reward(0, 1).then(updatedUcb => console.log(updatedUcb));
// or
const updatedUcb = ucb.rewardSync(0, 1);
console.log(updatedUcb);
```

### `Ucb#serialize()`

Obtain a plain object representing the internal state of ucb.

#### Arguments

_None_

#### Returns

A `Promise` that resolves to a stringify-able `Object` with parameters needed to reconstruct ucb state.

#### Example

```js
const { Ucb } = require('ucb');
const ucb = new Ucb();

ucb.serialize().then(state => console.log(state));
// or
const state = ucb.serializeSync();
console.log(state);
```


## Development

### Contribute

PRs are welcome! For bugs, please include a failing test which passes when your PR is applied. [Travis CI](https://travis-ci.org/kurttheviking/ucb-js) provides on-demand testing for commits and pull requests.

### Workflow

1. Feature development and bug fixing should occur on a non-master branch.
2. Changes should be submitted to master via a [Pull Request](https://github.com/kurttheviking/ucb-js/compare).
3. Pull Requests should be merged via a merge commit. Local "in-process" commits may be squashed prior to pushing to the remote feature branch.

### Tests

To run the unit test suite:

```sh
npm test
```

Or, to run the test suite and view test coverage:

```sh
npm run coverage
```
