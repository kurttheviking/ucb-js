/* eslint-disable */

const { Ucb } = require('ucb');

const ucb = new Ucb();

ucb.select().then((arm) => {
  console.log('chose arm', arm);
  return ucb.reward(arm, 1);
})
.then(() => ucb.serialize())
.then(state => console.log('new state', JSON.stringify(state, null, 2)));
