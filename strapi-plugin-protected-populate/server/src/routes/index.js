module.exports = [
  {
    method: 'GET',
    path: '/content-types',
    handler: 'data.contentTypes',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: { actions: ['plugin::protected-populate.read'] },
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/routes',
    handler: 'data.routes',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: { actions: ['plugin::protected-populate.read'] },
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/data',
    handler: 'data.indexData',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: { actions: ['plugin::protected-populate.read'] },
        },
      ],
    },
  },
  {
    method: 'PUT',
    path: '/data',
    handler: 'data.updateData',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: { actions: ['plugin::protected-populate.read'] },
        },
      ],
    },
  },
];
