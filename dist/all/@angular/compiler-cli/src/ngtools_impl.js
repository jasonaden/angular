"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is a private API for the ngtools toolkit.
 *
 * This API should be stable for NG 2. It can be removed in NG 4..., but should be replaced by
 * something else.
 */
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var ROUTER_MODULE_PATH = '@angular/router';
var ROUTER_ROUTES_SYMBOL_NAME = 'ROUTES';
// A route definition. Normally the short form 'path/to/module#ModuleClassName' is used by
// the user, and this is a helper class to extract information from it.
var RouteDef = (function () {
    function RouteDef(path, className) {
        if (className === void 0) { className = null; }
        this.path = path;
        this.className = className;
    }
    RouteDef.prototype.toString = function () {
        return (this.className === null || this.className == 'default') ?
            this.path :
            this.path + "#" + this.className;
    };
    RouteDef.fromString = function (entry) {
        var split = entry.split('#');
        return new RouteDef(split[0], split[1] || null);
    };
    return RouteDef;
}());
exports.RouteDef = RouteDef;
function listLazyRoutesOfModule(entryModule, host, reflector) {
    var entryRouteDef = RouteDef.fromString(entryModule);
    var containingFile = _resolveModule(entryRouteDef.path, entryRouteDef.path, host);
    var modulePath = "./" + containingFile.replace(/^(.*)\//, '');
    var className = entryRouteDef.className;
    // List loadChildren of this single module.
    var appStaticSymbol = reflector.findDeclaration(modulePath, className, containingFile);
    var ROUTES = reflector.findDeclaration(ROUTER_MODULE_PATH, ROUTER_ROUTES_SYMBOL_NAME);
    var lazyRoutes = _extractLazyRoutesFromStaticModule(appStaticSymbol, reflector, host, ROUTES);
    var allLazyRoutes = lazyRoutes.reduce(function includeLazyRouteAndSubRoutes(allRoutes, lazyRoute) {
        var route = lazyRoute.routeDef.toString();
        _assertRoute(allRoutes, lazyRoute);
        allRoutes[route] = lazyRoute;
        // StaticReflector does not support discovering annotations like `NgModule` on default
        // exports
        // Which means: if a default export NgModule was lazy-loaded, we can discover it, but,
        //  we cannot parse its routes to see if they have loadChildren or not.
        if (!lazyRoute.routeDef.className) {
            return allRoutes;
        }
        var lazyModuleSymbol = reflector.findDeclaration(lazyRoute.absoluteFilePath, lazyRoute.routeDef.className || 'default');
        var subRoutes = _extractLazyRoutesFromStaticModule(lazyModuleSymbol, reflector, host, ROUTES);
        return subRoutes.reduce(includeLazyRouteAndSubRoutes, allRoutes);
    }, {});
    return allLazyRoutes;
}
exports.listLazyRoutesOfModule = listLazyRoutesOfModule;
/**
 * Try to resolve a module, and returns its absolute path.
 * @private
 */
function _resolveModule(modulePath, containingFile, host) {
    var result = host.moduleNameToFileName(modulePath, containingFile);
    if (!result) {
        throw new Error("Could not resolve \"" + modulePath + "\" from \"" + containingFile + "\".");
    }
    return result;
}
/**
 * Throw an exception if a route is in a route map, but does not point to the same module.
 */
function _assertRoute(map, route) {
    var r = route.routeDef.toString();
    if (map[r] && map[r].absoluteFilePath != route.absoluteFilePath) {
        throw new Error("Duplicated path in loadChildren detected: \"" + r + "\" is used in 2 loadChildren, " +
            ("but they point to different modules \"(" + map[r].absoluteFilePath + " and ") +
            ("\"" + route.absoluteFilePath + "\"). Webpack cannot distinguish on context and would fail to ") +
            'load the proper one.');
    }
}
function flatten(list) {
    return list.reduce(function (flat, item) {
        var flatItem = Array.isArray(item) ? flatten(item) : item;
        return flat.concat(flatItem);
    }, []);
}
exports.flatten = flatten;
/**
 * Extract all the LazyRoutes from a module. This extracts all `loadChildren` keys from this
 * module and all statically referred modules.
 * @private
 */
function _extractLazyRoutesFromStaticModule(staticSymbol, reflector, host, ROUTES) {
    var moduleMetadata = _getNgModuleMetadata(staticSymbol, reflector);
    var imports = flatten(moduleMetadata.imports || []);
    var allRoutes = imports.filter(function (i) { return 'providers' in i; }).reduce(function (mem, m) {
        return mem.concat(_collectRoutes(m.providers || [], reflector, ROUTES));
    }, _collectRoutes(moduleMetadata.providers || [], reflector, ROUTES));
    var lazyRoutes = _collectLoadChildren(allRoutes).reduce(function (acc, route) {
        var routeDef = RouteDef.fromString(route);
        var absoluteFilePath = _resolveModule(routeDef.path, staticSymbol.filePath, host);
        acc.push({ routeDef: routeDef, absoluteFilePath: absoluteFilePath });
        return acc;
    }, []);
    var importedSymbols = imports
        .filter(function (i) { return i instanceof compiler_1.StaticSymbol || i.ngModule instanceof compiler_1.StaticSymbol; })
        .map(function (i) {
        if (i instanceof compiler_1.StaticSymbol)
            return i;
        return i.ngModule;
    });
    return importedSymbols
        .reduce(function (acc, i) {
        return acc.concat(_extractLazyRoutesFromStaticModule(i, reflector, host, ROUTES));
    }, [])
        .concat(lazyRoutes);
}
/**
 * Get the NgModule Metadata of a symbol.
 */
function _getNgModuleMetadata(staticSymbol, reflector) {
    var ngModules = reflector.annotations(staticSymbol).filter(function (s) { return s instanceof core_1.NgModule; });
    if (ngModules.length === 0) {
        throw new Error(staticSymbol.name + " is not an NgModule");
    }
    return ngModules[0];
}
/**
 * Return the routes from the provider list.
 * @private
 */
function _collectRoutes(providers, reflector, ROUTES) {
    return providers.reduce(function (routeList, p) {
        if (p.provide === ROUTES) {
            return routeList.concat(p.useValue);
        }
        else if (Array.isArray(p)) {
            return routeList.concat(_collectRoutes(p, reflector, ROUTES));
        }
        else {
            return routeList;
        }
    }, []);
}
/**
 * Return the loadChildren values of a list of Route.
 */
function _collectLoadChildren(routes) {
    return routes.reduce(function (m, r) {
        if (r.loadChildren && typeof r.loadChildren === 'string') {
            return m.concat(r.loadChildren);
        }
        else if (Array.isArray(r)) {
            return m.concat(_collectLoadChildren(r));
        }
        else if (r.children) {
            return m.concat(_collectLoadChildren(r.children));
        }
        else {
            return m;
        }
    }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd0b29sc19pbXBsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3Rvb2xzX2ltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7R0FLRztBQUNILDhDQUFpRjtBQUNqRixzQ0FBdUM7QUFJdkMsSUFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQztBQUM3QyxJQUFNLHlCQUF5QixHQUFHLFFBQVEsQ0FBQztBQVkzQywwRkFBMEY7QUFDMUYsdUVBQXVFO0FBQ3ZFO0lBQ0Usa0JBQW9DLElBQVksRUFBa0IsU0FBNkI7UUFBN0IsMEJBQUEsRUFBQSxnQkFBNkI7UUFBM0QsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFrQixjQUFTLEdBQVQsU0FBUyxDQUFvQjtJQUMvRixDQUFDO0lBRUQsMkJBQVEsR0FBUjtRQUNFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO1lBQzNELElBQUksQ0FBQyxJQUFJO1lBQ04sSUFBSSxDQUFDLElBQUksU0FBSSxJQUFJLENBQUMsU0FBVyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxtQkFBVSxHQUFqQixVQUFrQixLQUFhO1FBQzdCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQWRZLDRCQUFRO0FBaUJyQixnQ0FDSSxXQUFtQixFQUFFLElBQXFCLEVBQUUsU0FBMEI7SUFDeEUsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLFVB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