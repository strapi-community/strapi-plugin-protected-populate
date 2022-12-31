'use strict';
const { protectRoute } = require('./helpers/protect-route');
module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    //Info is parsed to and stingified to ensure none can do someting to the original object
    const info = JSON.parse(JSON.stringify(ctx.state.route.config['protected-populate']));
    ctx.query = protectRoute(ctx.query, info);
    await next();
  };
};
