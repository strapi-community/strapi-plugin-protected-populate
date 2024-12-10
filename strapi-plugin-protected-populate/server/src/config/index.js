'use strict';

module.exports = {
  default: ({ env }) => ({ ['auto-populate']: false }),
  validator: (config) => {
    if (typeof config['auto-populate'] !== 'boolean') {
      throw new Error('config["auto-populate"] has to be a boolean');
    }
  },
};
