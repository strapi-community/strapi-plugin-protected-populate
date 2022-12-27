'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

/**
 * `courseValidate` middleware
 */


const protectRoute = (populate, info) => {
  //fields
  if (typeof info.fields === "undefined") {
    populate.fields = []
  } else if (typeof populate.fields === "undefined") {
    populate.fields = info.fields
  } else {
    let fields = []
    populate.fields.forEach((value) => {
      if (populate.fields.includes(value)) {
        fields.push(value)
      }
    })
    populate.fields = fields
  }

  if (Array.isArray(populate.populate)) {
    let data = {}
    populate.populate.forEach((key) => {
      let data2 = data
      const list = key.split(".")
      console.log(list)
      list.forEach((key) => {
        if(typeof data2.populate === "undefined"){
          data2.populate = {}
        }
        if(typeof data2.populate[key] === "undefined"){
          data2.populate[key] = {}
        }
        data2 = data.populate[key]
      })
    })
    console.log(data.populate)
    populate.populate = data.populate
  }
    if (typeof info.populate === "undefined") {
      populate.populate = {}
    } else if (populate.populate === "*") {
      let populateAllowed = {}
      for (const [key, _] of Object.entries(info.populate)) {
        console.log(key)
        let populateData = {}
        protectRoute(populateData, info.populate[key])
        populateAllowed[key] = populateData
      }
      populate.populate = populateAllowed
    } else if (typeof populate.populate !== "undefined") {
      let populateAllowed = {}
      for (const [key, _] of Object.entries(populate.populate)) {
        if (key in info.populate) {
          protectRoute(populate.populate[key], info.populate[key])
          populateAllowed[key] = populate.populate[key]
        }
      }
      populate.populate = populateAllowed
    }


  }
  module.exports = (config, { strapi }) => {
    // Add your own logic here.
    return async (ctx, next) => {
      const info = ctx.state.route.config['protected-populate']
      protectRoute(ctx.query, info)
      console.log(ctx.query)
      await next()
    };
  };
