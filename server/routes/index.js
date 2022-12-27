module.exports = [
  {
    method: 'GET',
    path: '/content-types',
    handler: 'data.contentTypes',
    config: {
      middlewares: [],
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/routes',
    handler: 'data.routes',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/data',
    handler: 'data.indexData',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'PUT',
    path: '/data',
    handler: 'data.updateData',
    config: {
      policies: [],
      auth: false
    },
  },
];