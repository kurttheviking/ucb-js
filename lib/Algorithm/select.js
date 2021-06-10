const debug = require('debug')('ucb:select');

const sum = require('../utils/sum');
const randomInteger = require('../utils/randomInteger');

function select() {
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
