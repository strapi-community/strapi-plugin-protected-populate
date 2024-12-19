'use strict';

const fs = require('fs');

module.exports = ({ strapi }) => ({
  getRoutes() {
    const routes = strapi.server.router.stack;
    return routes.filter(
      (route) => route.path.startsWith('/api/')
    );
  },
  getContentTypes() {
    const contentTypes = strapi.get('content-types').keys();
    return contentTypes.filter(
      (contentType) => contentType.startsWith('api::') || contentType.startsWith('plugin::')
    );
  },
  indexData() {
    return strapi.plugin('protected-populate').protectedRoutes
  },
  updateData(body) {
    strapi.plugin('protected-populate').protectedRoutes = body;
    strapi.plugin('protected-populate').service('data').writePopulateFile(body);
  },
  writePopulateFile(routes) {
    if (!fs.existsSync(strapi.dirs.app.src + '/protected-populate')) {
      fs.mkdirSync(strapi.dirs.app.src + '/protected-populate', { recursive: true });
    }
    fs.writeFileSync(
      strapi.dirs.app.src + `/protected-populate/index.json`,
      JSON.stringify(routes, null, 3)
    );
  },
});
