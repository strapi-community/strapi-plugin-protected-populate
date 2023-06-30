'use strict';

module.exports = ({ strapi }) => ({
  contentTypes(ctx) {
    ctx.body = strapi.plugin('protected-populate').service('data').getContentTypes();
  },
  routes(ctx) {
    ctx.body = strapi.plugin('protected-populate').service('data').getRoutes();
  },
  indexData(ctx) {
    ctx.body = strapi.plugin('protected-populate').service('data').indexData();
  },
  updateData(ctx) {
    ctx.body = strapi.plugin('protected-populate').service('data').updateData(ctx.request.body);
  },
});
