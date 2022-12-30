'use strict';

const fs = require('fs')
module.exports = ({ strapi }) => {
    if (fs.existsSync(strapi.dirs.app.src + '/protected-populate/index.json')) {
        const fileData = fs.readFileSync(strapi.dirs.app.src + `/protected-populate/index.json`, { encoding: 'utf8' })
        strapi.plugin('protected-populate').protectedRoutes = JSON.parse(fileData)
    } else {
        strapi.plugin('protected-populate').protectedRoutes = {}
    }

    const savedPluginRoutes = {}

    const savePluginRoutesWithoutPrefix = (value,path,method,data) => {
        value.forEach((route) => {
            if (typeof route.config !== "undefined" && route.config.prefix === "") {
                savedPluginRoutes[route.method + " " + route.path] = data
             }
        })
    }
    
    const insertMiddleware = (value,path,method,data) => {
        value.forEach((route) => {
            if(route.path == path && method == route.method){
                if (typeof route.config === "undefined") {
                    route.config = {}
                }
                route.config["protected-populate"] = data
                if (typeof route.config.middlewares === "undefined") {
                    route.config.middlewares = ['plugin::protected-populate.protect']
                } else {
                    route.config.middlewares.push('plugin::protected-populate.protect')
                }
                return true
            }

        })
    }

    const insertMiddlewareByPath = (routesList, path,method,data,func) => {

        let routes = routesList
        while (routes.length !== 0) {
            if (typeof routes[0] === "object" && Array.isArray(routes[0]) || routes[0].routes === "object" && Array.isArray(routes[0].routes)) {
                if(typeof routes[0] === "object" && Array.isArray(routes[0])){
                    if(func(routes[0],path,method,data)){
                        return true
                    }
                }else if(routes[0].routes === "object" && Array.isArray(routes[0].routes)){
                    if(func(routes[0],path,method,data)){
                        return true
                    }
                }
                routes.splice(0, 1)
            } else {
                for (const [key, value] of Object.entries(routes[0])) {
                    if (value.type !== "admin" && (key === "routes" || key === "content-api")) {
                        routes.push(value)
                    }
                }
                routes.splice(0, 1)
            }
        }
        return false
    }

    for (const pluginName of Object.keys(strapi.plugins)) {
        insertMiddlewareByPath([strapi.plugins[pluginName].routes], "","",pluginName,savePluginRoutesWithoutPrefix)
    }

    for (const [path, data] of Object.entries(strapi.plugin('protected-populate').protectedRoutes)) {
        const pathPluginSplit = path.split("/");
        const method = pathPluginSplit[0].trim()
        let pluginName = pathPluginSplit[2]
        if (pathPluginSplit[1] === "api" && typeof strapi.plugins[pluginName] !== "undefined") {
            pathPluginSplit.splice(0, 3)
            const pluginPath = "/" + pathPluginSplit.join("/")
            if (insertMiddlewareByPath([strapi.plugins[pluginName].routes], pluginPath,method,data,insertMiddleware)) {
                continue
            }
        }else{
            pathPluginSplit.splice(0, 2)
            const pluginPath = "/" + pathPluginSplit.join("/")
            pluginName = savedPluginRoutes[method + " " + pluginPath]
            if(typeof pluginName !== "undefined"){
                if (insertMiddlewareByPath([strapi.plugins[pluginName].routes], pluginPath,method,data,insertMiddleware)) {
                    continue
                }
            }
        }
        const pathApiSplit = path.split("/");
        pathApiSplit.splice(0, 2)
        const pathApi = "/"  + pathApiSplit.join("/")
        let routes = []
        for (const [_, api] of Object.entries(strapi.api)) {
            for (const [_, route] of Object.entries(api.routes)) {
                routes.push(route.routes)
            }
        }
        if (insertMiddlewareByPath(routes, pathApi,method,data,insertMiddleware)) {
            continue
        }
    }
}
