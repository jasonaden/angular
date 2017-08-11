"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
/**
 * @whatItDoes
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allow an Angular service to be accessible from AngularJS.
 *
 * @howToUse
 *
 * First ensure that the service to be downgraded is provided in an {@link NgModule}
 * that will be part of the upgrade application. For example, let's assume we have
 * defined `HeroesService`
 *
 * {@example upgrade/static/ts/module.ts region="ng2-heroes-service"}
 *
 * and that we have included this in our upgrade app {@link NgModule}
 *
 * {@example upgrade/static/ts/module.ts region="ng2-module"}
 *
 * Now we can register the `downgradeInjectable` factory function for the service
 * on an AngularJS module.
 *
 * {@example upgrade/static/ts/module.ts region="downgrade-ng2-heroes-service"}
 *
 * Inside an AngularJS component's controller we can get hold of the
 * downgraded service via the name we gave when downgrading.
 *
 * {@example upgrade/static/ts/module.ts region="example-app"}
 *
 * @description
 *
 * Takes a `token` that identifies a service provided from Angular.
 *
 * Returns a [factory function](https://docs.angularjs.org/guide/di) that can be
 * used to register the service on an AngularJS module.
 *
 * The factory function provides access to the Angular service that
 * is identified by the `token` parameter.
 *
 * @experimental
 */
function downgradeInjectable(token) {
    var factory = function (i) { return i.get(token); };
    factory['$inject'] = [constants_1.INJECTOR_KEY];
    return factory;
}
exports.downgradeInjectable = downgradeInjectable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2luamVjdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvY29tbW9uL2Rvd25ncmFkZV9pbmplY3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gseUNBQXlDO0FBRXpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlDRztBQUNILDZCQUFvQyxLQUFVO0lBQzVDLElBQU0sT0FBTyxHQUFHLFVBQVMsQ0FBVyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlELE9BQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHdCQUFZLENBQUMsQ0FBQztJQUU3QyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFMRCxrREFLQyJ9