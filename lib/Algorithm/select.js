var _ = require('lodash');
var debug = require('debug')('ucb:select');

function select() {
  var bonusNumerator;
  var emptyArm = this.counts.indexOf(0);
  var maxUCB;
  var tempValues;

  if (emptyArm !== -1) {
    debug('found unexplored arm: %s', emptyArm);
    return emptyArm;
  }

  bonusNumerator = 2 * Math.log(_.sum(this.counts));

  tempValues = this.counts.map(function addBonus(ct, i) {
    return this.values[i] + Math.sqrt(bonusNumerator / ct);
  }, this);

  maxUCB = Math.max.apply(null, tempValues);
  debug('max ucb: %s', maxUCB);

  return tempValues.indexOf(maxUCB);
}

module.exports = select;
