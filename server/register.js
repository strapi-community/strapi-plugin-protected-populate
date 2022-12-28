'use strict';

const fs = require('fs')
module.exports = ({ strapi }) => {
    if (fs.existsSync(strapi.dirs.app.src + '/protected-populate/index.json')) {
        const fileData = fs.readFileSync(strapi.dirs.app.src + `/protected-populate/index.json`, { encoding: 'utf8' })
        strapi.plugin('protected-populate').protectedRoutes = JSON.parse(fileData)
    } else {
        strapi.plugin('protected-populate').protectedRoutes = {}
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
            }

        })
    }
    const insertMiddlewareByPath = (routesList, path,method,data) => {

        let routes = routesList
        while (routes.length !== 0) {
            if (typeof routes[0] === "object" && Array.isArray(routes[0]) || routes[0].routes === "object" && Array.isArray(routes[0].routes)) {
                if(insertMiddleware(routes[0],path,method,data)){
                    return true
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


    for (const [path, data] of Object.entries(strapi.plugin('protected-populate').protectedRoutes)) {
        const pathPluginSplit = path.split("/");
        const method = pathPluginSplit[0].trim()
        if (pathPluginSplit[1] === "api" && typeof strapi.plugins[pathPluginSplit[1]] !== "undefined") {
            pathPluginSplit.splice(0, 3)
            const pluginPath = "/" + pathPluginSplit.join("/")
            if (insertMiddlewareByPath([strapi.plugins[pathPluginSplit[2]].routes], pluginPath,method,data)) {
                continue
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
        if (insertMiddlewareByPath(routes, pathApi,method,data)) {
            continue
        }
    }
    /*for (constF [pluginName, plugin] of Object.entries(strapi.plugins)) {
        let routes = [plugin.routes]
        while (routes.length !== 0) {
            if (typeof routes[0] === "object" && Array.isArray(routes[0]) || routes[0].routes === "object" && Array.isArray(routes[0].routes)) {
                insertMiddleware(routes[0])
                routes.splice(0, 1)
            }else {
                for (const [key, value] of Object.entries(routes[0])) {
                    if (value.type !== "admin" && (key === "routes" || key === "content-api")) {
                        routes.push(value)
                    }
                }
                routes.splice(0, 1)
            }
        }
    }
    /*for (const [_, api] of Object.entries(strapi.api)) {
        for (const [_, value] of Object.entries(api.routes)) {
            insertMiddleware(value)
        }
    }*/
    /*for (const [_, api] of Object.entries(strapi.api)) {
        let routes = [api.routes]
        while (routes.length !== 0) {
            if (Array.isArray(routes[0])) {
                insertMiddleware(routes[0])
                routes.splice(0, 1)
            } else {
                for (const [key, value] of Object.entries(routes[0])) {
                    if (value.type !== "admin" && key === "routes") {
                        routes.push(value)
                    }
                }
                routes.splice(0, 1)
            }
        }
    }*/
}
