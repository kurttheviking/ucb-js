ucb
=======

[![Build Status](https://travis-ci.org/kurttheviking/ucb-js.svg?branch=master)](https://travis-ci.org/kurttheviking/ucb-js)

**An upper confidence bounds algorithm for multi-armed bandit problems**

This implementation is based on [<em>Bandit Algorithms for Website Optimization</em>](http://shop.oreilly.com/product/0636920027393.do) and related empirical research in ["Algorithms for the multi-armed bandit problem"](http://www.cs.mcgill.ca/~vkules/bandits.pdf).


## Specification

This module conforms to the [BanditLab/2.0 specification](https://github.com/kurttheviking/banditlab-spec/releases).


## Quick start

First, install this module in your project:

```sh
npm install ucb --save
```

Then, use the algorithm:

1. Create an optimizer with `3` arms:

    ```js
    const Algorithm = require('ucb');

    const algorithm = new Algorithm({
      arms: 3
    });
    ```

2. Select an arm (for exploration or exploitation, according to the algorithm):

    ```js
    algorithm.select().then(function (arm) {
      // do something based on the chosen arm
    });
    ```

3. Report the reward earned from a chosen arm:

    ```js
    algorithm.reward(arm, value);
    ```


## API

#### `Algorithm(config)`

Creates a new optimization algorithm.

**Arguments**

- `config` (Object): algorithm instance parameters

The `config` object supports two parameters:

- `arms`: (Number:Integer, Optional), default=2, the number of arms over which the optimization will operate

Alternatively, the `state` object returned from [`Algorithm#serialize`](https://github.com/kurttheviking/ucb-js#algorithmserialize) can be passed as `config`.


**Returns**

An instance of the ucb optimization algorithm.

**Example**

```js
const Algorithm = require('ucb');
const algorithm = new Algorithm();

assert.equal(algorithm.arms, 2);
```

Or, with a passed `config`:

```js
const Algorithm = require('ucb');
const algorithm = new Algorithm({arms: 4});

assert.equal(algorithm.arms, 4);
```

#### `Algorithm#select()`

Choose an arm to play, according to the specified bandit algorithm.

**Arguments**

_None_

**Returns**

A promise that resolves to a Number corresponding to the associated arm index.

**Example**

```js
const Algorithm = require('ucb');
const algorithm = new Algorithm();

algorithm.select().then(function (arm) { console.log(arm); });
```

```js
0
```

#### `Algorithm#reward(arm, reward)`

Inform the algorithm about the payoff from a given arm.

**Arguments**

- `arm` (Integer): the arm index (provided from `algorithm.select()`)
- `reward` (Number): the observed reward value (which can be 0, to indicate no reward)

**Returns**

A promise that resolves to an updated instance of the algorithm.

**Example**

```js
const Algorithm = require('ucb');
const algorithm = new Algorithm();

algorithm.reward(0, 1).then(function (algorithmUpdated) { console.log(algorithmUpdated) });
```

```js
<Algorithm>{
  arms: 2,
  counts: [ 1, 0 ],
  values: [ 1, 0 ]
}
```

#### `Algorithm#serialize()`

Obtain a plain object representing the internal state of the algorithm.

**Arguments**

_None_

**Returns**

A promise that resolves to an Object representing parameters required to reconstruct algorithm state.

**Example**

```js
const Algorithm = require('ucb');
const algorithm = new Algorithm();

algorithm.serialize().then(function (state) { console.log(state); });
```

```js
{
  arms: 2,
  counts: [0, 0],
  values: [0, 0]
}
```


## Tests

To run the unit test suite:

```sh
npm test
```

Or, to run the test suite and view test coverage:

```sh
npm run coverage
```


## Contribute

PRs are welcome! For bugs, please include a failing test which passes when your PR is applied. [Travis CI](https://travis-ci.org/kurttheviking/ucb-js) provides on-demand testing for commits and pull requests.


## Caveat emptor

This implementation often encounter extended floating point numbers. Arm selection is therefore subject to JavaScript's floating point precision limitations. For general information about floating point issues see the [floating point guide](http://floating-point-gui.de).
