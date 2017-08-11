"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dom_adapter_1 = require("../dom/dom_adapter");
var dom_tokens_1 = require("../dom/dom_tokens");
/**
 * An id that identifies a particular application being bootstrapped, that should
 * match across the client/server boundary.
 */
exports.TRANSITION_ID = new core_1.InjectionToken('TRANSITION_ID');
function appInitializerFactory(transitionId, document, injector) {
    return function () {
        // Wait for all application initializers to be completed before removing the styles set by
        // the server.
        injector.get(core_1.ApplicationInitStatus).donePromise.then(function () {
            var dom = dom_adapter_1.getDOM();
            var styles = Array.prototype.slice.apply(dom.querySelectorAll(document, "style[ng-transition]"));
            styles.filter(function (el) { return dom.getAttribute(el, 'ng-transition') === transitionId; })
                .forEach(function (el) { return dom.remove(el); });
        });
    };
}
exports.appInitializerFactory = appInitializerFactory;
exports.SERVER_TRANSITION_PROVIDERS = [
    {
        provide: core_1.APP_INITIALIZER,
        useFactory: appInitializerFactory,
        deps: [exports.TRANSITION_ID, dom_tokens_1.DOCUMENT, core_1.Injector],
        multi: true
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXRyYW5zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3NlcnZlci10cmFuc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXVIO0FBRXZILGtEQUEwQztBQUMxQyxnREFBMkM7QUFFM0M7OztHQUdHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRWpFLCtCQUFzQyxZQUFvQixFQUFFLFFBQWEsRUFBRSxRQUFrQjtJQUMzRixNQUFNLENBQUM7UUFDTCwwRkFBMEY7UUFDMUYsY0FBYztRQUNkLFFBQVEsQ0FBQyxHQUFHLENBQUMsNEJBQXFCLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQ25ELElBQU0sR0FBRyxHQUFHLG9CQUFNLEVBQUUsQ0FBQztZQUNyQixJQUFNLE1BQU0sR0FDUixLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7WUFDeEYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxLQUFLLFlBQVksRUFBdEQsQ0FBc0QsQ0FBQztpQkFDdEUsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNKLENBQUM7QUFaRCxzREFZQztBQUVZLFFBQUEsMkJBQTJCLEdBQXFCO0lBQzNEO1FBQ0UsT0FBTyxFQUFFLHNCQUFlO1FBQ3hCLFVBQVUsRUFBRSxxQkFBcUI7UUFDakMsSUFBSSxFQUFFLENBQUMscUJBQWEsRUFBRSxxQkFBUSxFQUFFLGVBQVEsQ0FBQztRQUN6QyxLQUFLLEVBQUUsSUFBSTtLQUNaO0NBQ0YsQ0FBQyJ9