const debug = require('debug')('ucb:select');

const sum = require('../utils/sum');

function select() {
  const emptyArm = this.counts.indexOf(0);

  if (emptyArm !== -1) {
    debug('found unexplored arm: %s', emptyArm);
    return emptyArm;
  }

  const bonus = 2 * Math.log(sum(this.counts));

  const values = this.counts.map((ct, i) => this.values[i] + Math.sqrt(bonus / ct));

  const max = Math.max.apply(null, values);

  debug('max ucb: %s', max);

  return values.indexOf(max);
}

module.exports = select;
