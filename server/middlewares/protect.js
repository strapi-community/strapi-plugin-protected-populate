'use strict';
const { protectRoute } = require('./helpers/protect-route');
module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    //Info is parsed to and stingified to ensure none can do someting to the original object
    const info = JSON.parse(JSON.stringify(ctx.state.route.config['protected-populate']));
    if (
      typeof ctx.query.populate === 'undefined' &&
      typeof ctx.query.fields === 'undefined' &&
      strapi.plugin('protected-populate').config('auto-populate')
    ) {
      ctx.query.populate = info.populate;
      ctx.query.fields = info.fields;
    }
    ctx.query = protectRoute(ctx.query, info);
    await next();
  };
};
