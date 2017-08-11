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
var fromPromise_1 = require("rxjs/observable/fromPromise");
var of_1 = require("rxjs/observable/of");
var map_1 = require("rxjs/operator/map");
var mergeMap_1 = require("rxjs/operator/mergeMap");
var config_1 = require("./config");
var collection_1 = require("./utils/collection");
/**
 * @docsNotRequired
 * @experimental
 */
exports.ROUTES = new core_1.InjectionToken('ROUTES');
var RouterConfigLoader = (function () {
    function RouterConfigLoader(loader, compiler, onLoadStartListener, onLoadEndListener) {
        this.loader = loader;
        this.compiler = compiler;
        this.onLoadStartListener = onLoadStartListener;
        this.onLoadEndListener = onLoadEndListener;
    }
    RouterConfigLoader.prototype.load = function (parentInjector, route) {
        var _this = this;
        if (this.onLoadStartListener) {
            this.onLoadStartListener(route);
        }
        var moduleFactory$ = this.loadModuleFactory(route.loadChildren);
        return map_1.map.call(moduleFactory$, function (factory) {
            if (_this.onLoadEndListener) {
                _this.onLoadEndListener(route);
            }
            var module = factory.create(parentInjector);
            return new config_1.LoadedRouterConfig(collection_1.flatten(module.injector.get(exports.ROUTES)), module);
        });
    };
    RouterConfigLoader.prototype.loadModuleFactory = function (loadChildren) {
        var _this = this;
        if (typeof loadChildren === 'string') {
            return fromPromise_1.fromPromise(this.loader.load(loadChildren));
        }
        else {
            return mergeMap_1.mergeMap.call(collection_1.wrapIntoObservable(loadChildren()), function (t) {
                if (t instanceof core_1.NgModuleFactory) {
                    return of_1.of(t);
                }
                else {
                    return fromPromise_1.fromPromise(_this.compiler.compileModuleAsync(t));
                }
            });
        }
    };
    return RouterConfigLoader;
}());
exports.RouterConfigLoader = RouterConfigLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2NvbmZpZ19sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3JvdXRlcl9jb25maWdfbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXNIO0FBRXRILDJEQUF3RDtBQUN4RCx5Q0FBdUM7QUFDdkMseUNBQXNDO0FBQ3RDLG1EQUFnRDtBQUNoRCxtQ0FBaUU7QUFDakUsaURBQStEO0FBRS9EOzs7R0FHRztBQUNVLFFBQUEsTUFBTSxHQUFHLElBQUkscUJBQWMsQ0FBWSxRQUFRLENBQUMsQ0FBQztBQUU5RDtJQUNFLDRCQUNZLE1BQTZCLEVBQVUsUUFBa0IsRUFDekQsbUJBQXdDLEVBQ3hDLGlCQUFzQztRQUZ0QyxXQUFNLEdBQU4sTUFBTSxDQUF1QjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDekQsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQXFCO0lBQUcsQ0FBQztJQUV0RCxpQ0FBSSxHQUFKLFVBQUssY0FBd0IsRUFBRSxLQUFZO1FBQTNDLGlCQWdCQztRQWZDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFlBQWMsQ0FBQyxDQUFDO1FBRXBFLE1BQU0sQ0FBQyxTQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFDLE9BQTZCO1lBQzVELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxDQUFDO1lBRUQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUU5QyxNQUFNLENBQUMsSUFBSSwyQkFBa0IsQ0FBQyxvQkFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sOENBQWlCLEdBQXpCLFVBQTBCLFlBQTBCO1FBQXBELGlCQVlDO1FBWEMsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQywrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLFVBQUMsQ0FBTTtnQkFDOUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLHNCQUFlLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxNQUFNLENBQUMsT0FBRSxDQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyx5QkFBVyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFyQ0QsSUFxQ0M7QUFyQ1ksZ0RBQWtCIn0=