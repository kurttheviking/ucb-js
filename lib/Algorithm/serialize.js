var debug = require('debug')('ucb:serialize');

function serialize() {
  var out = {
    arms: this.arms,
    counts: this.counts.slice(0),
    values: this.values.slice(0)
  };

  debug('serializing', out);
  return out;
}

module.exports = serialize;
