const debug = require('debug')('ucb:serialize');

function serialize() {
  const out = {
    arms: this.arms,
    counts: this.counts.slice(0),
    values: this.values.slice(0)
  };

  debug('state', out);

  return out;
}

module.exports = serialize;
