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
 * Used to load ng module factories.
 * @stable
 */
var NgModuleFactoryLoader = (function () {
    function NgModuleFactoryLoader() {
    }
    return NgModuleFactoryLoader;
}());
exports.NgModuleFactoryLoader = NgModuleFactoryLoader;
var moduleFactories = new Map();
/**
 * Registers a loaded module. Should only be called from generated NgModuleFactory code.
 * @experimental
 */
function registerModuleFactory(id, factory) {
    var existing = moduleFactories.get(id);
    if (existing) {
        throw new Error("Duplicate module registered for " + id + " - " + existing.moduleType.name + " vs " + factory.moduleType.name);
    }
    moduleFactories.set(id, factory);
}
exports.registerModuleFactory = registerModuleFactory;
function clearModulesForTest() {
    moduleFactories = new Map();
}
exports.clearModulesForTest = clearModulesForTest;
/**
 * Returns the NgModuleFactory with the given id, if it exists and has been loaded.
 * Factories for modules that do not specify an `id` cannot be retrieved. Throws if the module
 * cannot be found.
 * @experimental
 */
function getModuleFactory(id) {
    var factory = moduleFactories.get(id);
    if (!factory)
        throw new Error("No module with ID " + id + " loaded");
    return factory;
}
exports.getModuleFactory = getModuleFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX2ZhY3RvcnlfbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvbGlua2VyL25nX21vZHVsZV9mYWN0b3J5X2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlIOzs7R0FHRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBQUQsNEJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZxQixzREFBcUI7QUFJM0MsSUFBSSxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQWdDLENBQUM7QUFFOUQ7OztHQUdHO0FBQ0gsK0JBQXNDLEVBQVUsRUFBRSxPQUE2QjtJQUM3RSxJQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDYixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFtQyxFQUFFLFdBQy9CLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxZQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBTSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUNELGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFQRCxzREFPQztBQUVEO0lBQ0UsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFnQyxDQUFDO0FBQzVELENBQUM7QUFGRCxrREFFQztBQUVEOzs7OztHQUtHO0FBQ0gsMEJBQWlDLEVBQVU7SUFDekMsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXFCLEVBQUUsWUFBUyxDQUFDLENBQUM7SUFDaEUsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBSkQsNENBSUMifQ==