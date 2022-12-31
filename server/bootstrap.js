'use strict';

module.exports = async ({ strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: 'protected-populate',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
