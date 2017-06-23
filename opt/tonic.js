/* eslint no-console: 0 */

const Algorithm = require('ucb');  // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies, max-len

const algorithm = new Algorithm();

algorithm.select().then((arm) => {
  console.log('chose arm', arm);
  return algorithm.reward(arm, 1);
})
.then(() => algorithm.serialize())
.then(state => console.log('new state', JSON.stringify(state, null, 2)));
