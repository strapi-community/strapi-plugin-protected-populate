'use strict';
const { protectRoute } = require('./helpers/protect-route');
module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    //Info is parsed to and stingified to ensure none can do someting to the original object
    let info = JSON.parse(JSON.stringify(ctx.state.route.config['protected-populate']));
    if (info.roles !== undefined) {
      if (ctx.state.user === undefined) {
        info = info.roles['public'];
      } else {
        info = info.roles[ctx.state.user.role.type];
      }
    }
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
