const update = (strapi, config) => {
  let outputObject = {};
  Object.keys(config).map(function (key) {
    outputObject[key] = {};
    outputObject[key]['content-type'] = config[key]['content-type'];
    const data = checkForMedia(config[key], config[key]['content-type']);
    if (typeof data.fields !== 'undefined' && data.fields.length !== 0) {
      outputObject[key].fields = data.fields;
    }
    if (typeof data.populate !== 'undefined' && Object.keys(data.populate).length !== 0) {
      outputObject[key].populate = data.populate;
    }
  });
  return outputObject;
};

const checkForMedia = (config, contentType) => {
  let typeInfo;
  if (contentType.includes('::')) {
    typeInfo = strapi.contentTypes[contentType];
  } else {
    typeInfo = strapi.components[contentType];
  }
  if (typeInfo === undefined) {
    return {};
  }
  let fields = [];
  let populate = {};
  if (typeof config.fields !== 'undefined') {
    config.fields.map(function (name, i) {
      if (typeInfo.attributes[name].type === 'media') {
        populate[name] = {};
      } else {
        fields.push(name);
      }
    });
  }
  if (typeof config.populate !== 'undefined') {
    Object.keys(config.populate).map(function (key) {
      if (typeof typeInfo.attributes[key] !== 'undefined') {
        if (typeInfo.attributes[key].type === 'component') {
          populate[key] = checkForMedia(config.populate[key], typeInfo.attributes[key].component);
        } else if (typeInfo.attributes[key].type === 'relation') {
          populate[key] = checkForMedia(config.populate[key], typeInfo.attributes[key].target);
        } else if (typeInfo.attributes[key].type === 'dynamiczone') {
          Object.keys(config.populate[key].on).map(function (component) {
            populate[key] = { on: {} };
            populate[key].on[component] = checkForMedia(
              config.populate[key].on[component],
              component
            );
          });
        }
      }
    });
  }
  const returnObject = {};
  if (fields.length !== 0) {
    returnObject.fields = fields;
  }
  if (Object.keys(populate).length !== 0) {
    returnObject.populate = populate;
  }
  return returnObject;
};

module.exports = {
  update,
};
