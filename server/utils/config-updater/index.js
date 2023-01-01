const updater1dot0dot1 = require('./v1');
const fs = require('fs');
const configUpdater = (strapi, config) => {
  if (typeof config.version === 'undefined') {
    config = updater1dot0dot1.update(strapi, config);
    const newConfig = {};
    newConfig.data = config;
    newConfig.version = 1;
    config = newConfig;
    fs.writeFileSync(
      strapi.dirs.app.src + `/protected-populate/index.json`,
      JSON.stringify(config, null, 3)
    );
  }
  return config;
};

module.exports = {
  configUpdater,
};
