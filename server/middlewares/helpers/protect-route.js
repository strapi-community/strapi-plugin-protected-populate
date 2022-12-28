const { parseType } = require('@strapi/utils')

/*
  Rules
  1 in dynamicZones if on is found populate and fields get ignored
  2 populating * populates 1 level + 1 level of dynamic zones
  3 fields and populate in dynamic zones get replicated to all its children example:
  fields=["field"] If A and B both have the field field and c does not then field will be populated on a and b
  4 if populate[name] = true then load 1 level deep + 1 level of dynamic zones

*/


const protectRoute = (populate, info) => {
  let mainBoolean
  try {
    mainBoolean = parseType("boolean", populate)
  } catch (error) {
    //Is not a boolean 
  }
  if(mainBoolean === true || mainBoolean === false){
    populate = {}
  }
  //fields
  if (typeof info.on === "undefined") {
    if (typeof info.fields === "undefined") {
      populate.fields = []
    } else if (typeof populate.fields === "undefined") {
      //Don't have to check main mainBoolean since if it is true fields is also "undefined"
      populate.fields = info.fields
    } else if (Array.isArray(populate.fields)) {
      let fields = []
      populate.fields.forEach((value) => {
        if (info.fields.includes(value)) {
          fields.push(value)
        }
      })
      populate.fields = fields
    } else {
      //Unexpected input handle it if it was empty
      populate.fields = info.fields
    }
  }
  //Deal with array input for populate
  if (Array.isArray(populate.populate)) {
    const data = {}
    populate.populate.forEach((key) => {
      let data2 = data
      const list = key.split(".")
      list.forEach((key) => {
        if (typeof data2.populate === "undefined") {
          data2.populate = {}
        }
        if (typeof data2.populate[key] === "undefined") {
          data2.populate[key] = {}
        }
        data2 = data2.populate[key]
      })
    })
    populate.populate = data.populate
  }

  //on and populate
  if (typeof info.on !== "undefined") {
    //dynamicZone
    if (typeof populate.on !== "undefined") {
      //on
      if (Object.keys(info.on).length === 0) {
        populate = {on:{}}
      } else if (mainBoolean == true) {
        let populateAllowed = {}
        for (const key of Object.keys(info.on)) {
          let populateData = protectRoute({}, info.on[key])
          populateAllowed[key] = populateData
        }
        populate.on = populateAllowed
      } else if (typeof populate.on !== "undefined") {
        let populateAllowed = {}
        for (const [key, _] of Object.entries(populate.on)) {
          if (key in info.on) {
            let data = protectRoute(populate.on[key], info.on[key])
            populateAllowed[key] = data
          }
        }
        populate.on = populateAllowed
      }
    } else if (typeof populate.populate !== "undefined" || Array.isArray(populate.fields)) {
      //populate
      const AllowedList = {}
      AllowedList["on"] = {}
      Object.keys(info.on).forEach((key) => {
        let data = protectRoute(JSON.parse(JSON.stringify(populate)), info.on[key])
        AllowedList["on"][key] = data
      })
      populate = AllowedList
    } else {
      //empty
      let AllowedList = {}
      AllowedList["on"] = {}
      Object.keys(info.on).forEach((key) => {
        let data = protectRoute({}, info.on[key])
        AllowedList["on"][key] = data
      })
      delete populate["fields"]
      delete populate["populate"]  
      populate = AllowedList
    }
  } else {
    //populate
    if (typeof info.populate === "undefined") {
      populate.populate = {}
    } else if (populate.populate === "*" || mainBoolean === true) {
      let populateAllowed = {}
      for (const key of Object.keys(info.populate)) {
        let data = protectRoute({}, info.populate[key])
        populateAllowed[key] = data
      }
      populate.populate = populateAllowed
    } else if (typeof populate.populate !== "undefined") {
      let populateAllowed = {}
      for (const [key, _] of Object.entries(populate.populate)) {
        if (key in info.populate) {
          let data = protectRoute(populate.populate[key], info.populate[key])
          populateAllowed[key] = data
        }
      }
      populate.populate = populateAllowed
    }
  }
  return populate
}

module.exports = {
  protectRoute
};
