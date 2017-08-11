"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var LoadedRouterConfig = (function () {
    function LoadedRouterConfig(routes, module) {
        this.routes = routes;
        this.module = module;
    }
    return LoadedRouterConfig;
}());
exports.LoadedRouterConfig = LoadedRouterConfig;
function validateConfig(config, parentPath) {
    if (parentPath === void 0) { parentPath = ''; }
    // forEach doesn't iterate undefined values
    for (var i = 0; i < config.length; i++) {
        var route = config[i];
        var fullPath = getFullPath(parentPath, route);
        validateNode(route, fullPath);
    }
}
exports.validateConfig = validateConfig;
function validateNode(route, fullPath) {
    if (!route) {
        throw new Error("\n      Invalid configuration of route '" + fullPath + "': Encountered undefined route.\n      The reason might be an extra comma.\n\n      Example:\n      const routes: Routes = [\n        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },\n        { path: 'dashboard',  component: DashboardComponent },, << two commas\n        { path: 'detail/:id', component: HeroDetailComponent }\n      ];\n    ");
    }
    if (Array.isArray(route)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': Array cannot be specified");
    }
    if (!route.component && (route.outlet && route.outlet !== shared_1.PRIMARY_OUTLET)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': a componentless route cannot have a named outlet set");
    }
    if (route.redirectTo && route.children) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and children cannot be used together");
    }
    if (route.redirectTo && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and loadChildren cannot be used together");
    }
    if (route.children && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': children and loadChildren cannot be used together");
    }
    if (route.redirectTo && route.component) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and component cannot be used together");
    }
    if (route.path && route.matcher) {
        throw new Error("Invalid configuration of route '" + fullPath + "': path and matcher cannot be used together");
    }
    if (route.redirectTo === void 0 && !route.component && !route.children && !route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "'. One of the following must be provided: component, redirectTo, children or loadChildren");
    }
    if (route.path === void 0 && route.matcher === void 0) {
        throw new Error("Invalid configuration of route '" + fullPath + "': routes must have either a path or a matcher specified");
    }
    if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
        throw new Error("Invalid configuration of route '" + fullPath + "': path cannot start with a slash");
    }
    if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
        var exp = "The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.";
        throw new Error("Invalid configuration of route '{path: \"" + fullPath + "\", redirectTo: \"" + route.redirectTo + "\"}': please provide 'pathMatch'. " + exp);
    }
    if (route.pathMatch !== void 0 && route.pathMatch !== 'full' && route.pathMatch !== 'prefix') {
        throw new Error("Invalid configuration of route '" + fullPath + "': pathMatch can only be set to 'prefix' or 'full'");
    }
    if (route.children) {
        validateConfig(route.children, fullPath);
    }
}
function getFullPath(parentPath, currentRoute) {
    if (!currentRoute) {
        return parentPath;
    }
    if (!parentPath && !currentRoute.path) {
        return '';
    }
    else if (parentPath && !currentRoute.path) {
        return parentPath + "/";
    }
    else if (!parentPath && currentRoute.path) {
        return currentRoute.path;
    }
    else {
        return parentPath + "/" + currentRoute.path;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxtQ0FBd0M7QUFtV3hDO0lBQ0UsNEJBQW1CLE1BQWUsRUFBUyxNQUF3QjtRQUFoRCxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7SUFBRyxDQUFDO0lBQ3pFLHlCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxnREFBa0I7QUFJL0Isd0JBQStCLE1BQWMsRUFBRSxVQUF1QjtJQUF2QiwyQkFBQSxFQUFBLGVBQXVCO0lBQ3BFLDJDQUEyQztJQUMzQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN2QyxJQUFNLEtBQUssR0FBVSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBTSxRQUFRLEdBQVcsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4RCxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7QUFDSCxDQUFDO0FBUEQsd0NBT0M7QUFFRCxzQkFBc0IsS0FBWSxFQUFFLFFBQWdCO0lBQ2xELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQ29CLFFBQVEsb1dBUzNDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFtQyxRQUFRLGlDQUE4QixDQUFDLENBQUM7SUFDN0Ys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