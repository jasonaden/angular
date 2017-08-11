"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var merge_1 = require("rxjs/observable/merge");
var share_1 = require("rxjs/operator/share");
var error_handler_1 = require("../src/error_handler");
var util_1 = require("../src/util");
var lang_1 = require("../src/util/lang");
var application_init_1 = require("./application_init");
var application_tokens_1 = require("./application_tokens");
var console_1 = require("./console");
var di_1 = require("./di");
var compiler_1 = require("./linker/compiler");
var component_factory_1 = require("./linker/component_factory");
var component_factory_resolver_1 = require("./linker/component_factory_resolver");
var ng_module_factory_1 = require("./linker/ng_module_factory");
var profile_1 = require("./profile/profile");
var testability_1 = require("./testability/testability");
var ng_zone_1 = require("./zone/ng_zone");
var _devMode = true;
var _runModeLocked = false;
var _platform;
exports.ALLOW_MULTIPLE_PLATFORMS = new di_1.InjectionToken('AllowMultipleToken');
/**
 * Disable Angular's development mode, which turns off assertions and other
 * checks within the framework.
 *
 * One important assertion this disables verifies that a change detection pass
 * does not result in additional changes to any bindings (also known as
 * unidirectional data flow).
 *
 * @stable
 */
function enableProdMode() {
    if (_runModeLocked) {
        throw new Error('Cannot enable prod mode after platform setup.');
    }
    _devMode = false;
}
exports.enableProdMode = enableProdMode;
/**
 * Returns whether Angular is in development mode. After called once,
 * the value is locked and won't change any more.
 *
 * By default, this is true, unless a user calls `enableProdMode` before calling this.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
function isDevMode() {
    _runModeLocked = true;
    return _devMode;
}
exports.isDevMode = isDevMode;
/**
 * A token for third-party components that can register themselves with NgProbe.
 *
 * @experimental
 */
var NgProbeToken = (function () {
    function NgProbeToken(name, token) {
        this.name = name;
        this.token = token;
    }
    return NgProbeToken;
}());
exports.NgProbeToken = NgProbeToken;
/**
 * Creates a platform.
 * Platforms have to be eagerly created via this function.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
function createPlatform(injector) {
    if (_platform && !_platform.destroyed &&
        !_platform.injector.get(exports.ALLOW_MULTIPLE_PLATFORMS, false)) {
        throw new Error('There can be only one platform. Destroy the previous one to create a new one.');
    }
    _platform = injector.get(PlatformRef);
    var inits = injector.get(application_tokens_1.PLATFORM_INITIALIZER, null);
    if (inits)
        inits.forEach(function (init) { return init(); });
    return _platform;
}
exports.createPlatform = createPlatform;
/**
 * Creates a factory for a platform
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
function createPlatformFactory(parentPlatformFactory, name, providers) {
    if (providers === void 0) { providers = []; }
    var marker = new di_1.InjectionToken("Platform: " + name);
    return function (extraProviders) {
        if (extraProviders === void 0) { extraProviders = []; }
        var platform = getPlatform();
        if (!platform || platform.injector.get(exports.ALLOW_MULTIPLE_PLATFORMS, false)) {
            if (parentPlatformFactory) {
                parentPlatformFactory(providers.concat(extraProviders).concat({ provide: marker, useValue: true }));
            }
            else {
                createPlatform(di_1.Injector.create(providers.concat(extraProviders).concat({ provide: marker, useValue: true })));
            }
        }
        return assertPlatform(marker);
    };
}
exports.createPlatformFactory = createPlatformFactory;
/**
 * Checks that there currently is a platform which contains the given token as a provider.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
function assertPlatform(requiredToken) {
    var platform = getPlatform();
    if (!platform) {
        throw new Error('No platform exists!');
    }
    if (!platform.injector.get(requiredToken, null)) {
        throw new Error('A platform with a different configuration has been created. Please destroy it first.');
    }
    return platform;
}
exports.assertPlatform = assertPlatform;
/**
 * Destroy the existing platform.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
function destroyPlatform() {
    if (_platform && !_platform.destroyed) {
        _platform.destroy();
    }
}
exports.destroyPlatform = destroyPlatform;
/**
 * Returns the current platform.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
function getPlatform() {
    return _platform && !_platform.destroyed ? _platform : null;
}
exports.getPlatform = getPlatform;
/**
 * The Angular platform is the entry point for Angular on a web page. Each page
 * has exactly one platform, and services (such as reflection) which are common
 * to every Angular application running on the page are bound in its scope.
 *
 * A page's platform is initialized implicitly when a platform is created via a platform factory
 * (e.g. {@link platformBrowser}), or explicitly by calling the {@link createPlatform} function.
 *
 * @stable
 */
var PlatformRef = (function () {
    function PlatformRef() {
    }
    return PlatformRef;
}());
exports.PlatformRef = PlatformRef;
function _callAndReportToErrorHandler(errorHandler, ngZone, callback) {
    try {
        var result = callback();
        if (lang_1.isPromise(result)) {
            return result.catch(function (e) {
                ngZone.runOutsideAngular(function () { return errorHandler.handleError(e); });
                // rethrow as the exception handler might not do it
                throw e;
            });
        }
        return result;
    }
    catch (e) {
        ngZone.runOutsideAngular(function () { return errorHandler.handleError(e); });
        // rethrow as the exception handler might not do it
        throw e;
    }
}
/**
 * workaround https://github.com/angular/tsickle/issues/350
 * @suppress {checkTypes}
 */
var PlatformRef_ = (function (_super) {
    __extends(PlatformRef_, _super);
    function PlatformRef_(_injector) {
        var _this = _super.call(this) || this;
        _this._injector = _injector;
        _this._modules = [];
        _this._destroyListeners = [];
        _this._destroyed = false;
        return _this;
    }
    PlatformRef_.prototype.onDestroy = function (callback) { this._destroyListeners.push(callback); };
    Object.defineProperty(PlatformRef_.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlatformRef_.prototype, "destroyed", {
        get: function () { return this._destroyed; },
        enumerable: true,
        configurable: true
    });
    PlatformRef_.prototype.destroy = function () {
        if (this._destroyed) {
            throw new Error('The platform has already been destroyed!');
        }
        this._modules.slice().forEach(function (module) { return module.destroy(); });
        this._destroyListeners.forEach(function (listener) { return listener(); });
        this._destroyed = true;
    };
    PlatformRef_.prototype.bootstrapModuleFactory = function (moduleFactory) {
        return this._bootstrapModuleFactoryWithZone(moduleFactory);
    };
    PlatformRef_.prototype._bootstrapModuleFactoryWithZone = function (moduleFactory, ngZone) {
        var _this = this;
        // Note: We need to create the NgZone _before_ we instantiate the module,
        // as instantiating the module creates some providers eagerly.
        // So we create a mini parent injector that just contains the new NgZone and
        // pass that as parent to the NgModuleFactory.
        if (!ngZone)
            ngZone = new ng_zone_1.NgZone({ enableLongStackTrace: isDevMode() });
        // Attention: Don't use ApplicationRef.run here,
        // as we want to be sure that all possible constructor calls are inside `ngZone.run`!
        return ngZone.run(function () {
            var ngZoneInjector = di_1.Injector.create([{ provide: ng_zone_1.NgZone, useValue: ngZone }], _this.injector);
            var moduleRef = moduleFactory.create(ngZoneInjector);
            var exceptionHandler = moduleRef.injector.get(error_handler_1.ErrorHandler, null);
            if (!exceptionHandler) {
                throw new Error('No ErrorHandler. Is platform module (BrowserModule) included?');
            }
            moduleRef.onDestroy(function () { return remove(_this._modules, moduleRef); });
            ngZone.runOutsideAngular(function () { return ngZone.onError.subscribe({ next: function (error) { exceptionHandler.handleError(error); } }); });
            return _callAndReportToErrorHandler(exceptionHandler, ngZone, function () {
                var initStatus = moduleRef.injector.get(application_init_1.ApplicationInitStatus);
                initStatus.runInitializers();
                return initStatus.donePromise.then(function () {
                    _this._moduleDoBootstrap(moduleRef);
                    return moduleRef;
                });
            });
        });
    };
    PlatformRef_.prototype.bootstrapModule = function (moduleType, compilerOptions) {
        if (compilerOptions === void 0) { compilerOptions = []; }
        return this._bootstrapModuleWithZone(moduleType, compilerOptions);
    };
    PlatformRef_.prototype._bootstrapModuleWithZone = function (moduleType, compilerOptions, ngZone) {
        var _this = this;
        if (compilerOptions === void 0) { compilerOptions = []; }
        var compilerFactory = this.injector.get(compiler_1.CompilerFactory);
        var compiler = compilerFactory.createCompiler(Array.isArray(compilerOptions) ? compilerOptions : [compilerOptions]);
        return compiler.compileModuleAsync(moduleType)
            .then(function (moduleFactory) { return _this._bootstrapModuleFactoryWithZone(moduleFactory, ngZone); });
    };
    PlatformRef_.prototype._moduleDoBootstrap = function (moduleRef) {
        var appRef = moduleRef.injector.get(ApplicationRef);
        if (moduleRef._bootstrapComponents.length > 0) {
            moduleRef._bootstrapComponents.forEach(function (f) { return appRef.bootstrap(f); });
        }
        else if (moduleRef.instance.ngDoBootstrap) {
            moduleRef.instance.ngDoBootstrap(appRef);
        }
        else {
            throw new Error("The module " + util_1.stringify(moduleRef.instance.constructor) + " was bootstrapped, but it does not declare \"@NgModule.bootstrap\" components nor a \"ngDoBootstrap\" method. " +
                "Please define one of these.");
        }
        this._modules.push(moduleRef);
    };
    return PlatformRef_;
}(PlatformRef));
PlatformRef_ = __decorate([
    di_1.Injectable(),
    __metadata("design:paramtypes", [di_1.Injector])
], PlatformRef_);
exports.PlatformRef_ = PlatformRef_;
/**
 * A reference to an Angular application running on a page.
 *
 * @stable
 */
var ApplicationRef = (function () {
    function ApplicationRef() {
    }
    return ApplicationRef;
}());
exports.ApplicationRef = ApplicationRef;
/**
 * workaround https://github.com/angular/tsickle/issues/350
 * @suppress {checkTypes}
 */
var ApplicationRef_ = ApplicationRef_1 = (function (_super) {
    __extends(ApplicationRef_, _super);
    function ApplicationRef_(_zone, _console, _injector, _exceptionHandler, _componentFactoryResolver, _initStatus) {
        var _this = _super.call(this) || this;
        _this._zone = _zone;
        _this._console = _console;
        _this._injector = _injector;
        _this._exceptionHandler = _exceptionHandler;
        _this._componentFactoryResolver = _componentFactoryResolver;
        _this._initStatus = _initStatus;
        _this._bootstrapListeners = [];
        _this._rootComponents = [];
        _this._rootComponentTypes = [];
        _this._views = [];
        _this._runningTick = false;
        _this._enforceNoNewChanges = false;
        _this._stable = true;
        _this._enforceNoNewChanges = isDevMode();
        _this._zone.onMicrotaskEmpty.subscribe({ next: function () { _this._zone.run(function () { _this.tick(); }); } });
        var isCurrentlyStable = new Observable_1.Observable(function (observer) {
            _this._stable = _this._zone.isStable && !_this._zone.hasPendingMacrotasks &&
                !_this._zone.hasPendingMicrotasks;
            _this._zone.runOutsideAngular(function () {
                observer.next(_this._stable);
                observer.complete();
            });
        });
        var isStable = new Observable_1.Observable(function (observer) {
            var stableSub = _this._zone.onStable.subscribe(function () {
                ng_zone_1.NgZone.assertNotInAngularZone();
                // Check whether there are no pending macro/micro tasks in the next tick
                // to allow for NgZone to update the state.
                util_1.scheduleMicroTask(function () {
                    if (!_this._stable && !_this._zone.hasPendingMacrotasks &&
                        !_this._zone.hasPendingMicrotasks) {
                        _this._stable = true;
                        observer.next(true);
                    }
                });
            });
            var unstableSub = _this._zone.onUnstable.subscribe(function () {
                ng_zone_1.NgZone.assertInAngularZone();
                if (_this._stable) {
                    _this._stable = false;
                    _this._zone.runOutsideAngular(function () { observer.next(false); });
                }
            });
            return function () {
                stableSub.unsubscribe();
                unstableSub.unsubscribe();
            };
        });
        _this._isStable = merge_1.merge(isCurrentlyStable, share_1.share.call(isStable));
        return _this;
    }
    ApplicationRef_.prototype.attachView = function (viewRef) {
        var view = viewRef;
        this._views.push(view);
        view.attachToAppRef(this);
    };
    ApplicationRef_.prototype.detachView = function (viewRef) {
        var view = viewRef;
        remove(this._views, view);
        view.detachFromAppRef();
    };
    ApplicationRef_.prototype.bootstrap = function (componentOrFactory, rootSelectorOrNode) {
        var _this = this;
        if (!this._initStatus.done) {
            throw new Error('Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.');
        }
        var componentFactory;
        if (componentOrFactory instanceof component_factory_1.ComponentFactory) {
            componentFactory = componentOrFactory;
        }
        else {
            componentFactory =
                this._componentFactoryResolver.resolveComponentFactory(componentOrFactory);
        }
        this._rootComponentTypes.push(componentFactory.componentType);
        // Create a factory associated with the current module if it's not bound to some other
        var ngModule = componentFactory instanceof component_factory_resolver_1.ComponentFactoryBoundToModule ?
            null :
            this._injector.get(ng_module_factory_1.NgModuleRef);
        var selectorOrNode = rootSelectorOrNode || componentFactory.selector;
        var compRef = componentFactory.create(di_1.Injector.NULL, [], selectorOrNode, ngModule);
        compRef.onDestroy(function () { _this._unloadComponent(compRef); });
        var testability = compRef.injector.get(testability_1.Testability, null);
        if (testability) {
            compRef.injector.get(testability_1.TestabilityRegistry)
                .registerApplication(compRef.location.nativeElement, testability);
        }
        this._loadComponent(compRef);
        if (isDevMode()) {
            this._console.log("Angular is running in the development mode. Call enableProdMode() to enable the production mode.");
        }
        return compRef;
    };
    ApplicationRef_.prototype._loadComponent = function (componentRef) {
        this.attachView(componentRef.hostView);
        this.tick();
        this._rootComponents.push(componentRef);
        // Get the listeners lazily to prevent DI cycles.
        var listeners = this._injector.get(application_tokens_1.APP_BOOTSTRAP_LISTENER, []).concat(this._bootstrapListeners);
        listeners.forEach(function (listener) { return listener(componentRef); });
    };
    ApplicationRef_.prototype._unloadComponent = function (componentRef) {
        this.detachView(componentRef.hostView);
        remove(this._rootComponents, componentRef);
    };
    ApplicationRef_.prototype.tick = function () {
        var _this = this;
        if (this._runningTick) {
            throw new Error('ApplicationRef.tick is called recursively');
        }
        var scope = ApplicationRef_1._tickScope();
        try {
            this._runningTick = true;
            this._views.forEach(function (view) { return view.detectChanges(); });
            if (this._enforceNoNewChanges) {
                this._views.forEach(function (view) { return view.checkNoChanges(); });
            }
        }
        catch (e) {
            // Attention: Don't rethrow as it could cancel subscriptions to Observables!
            this._zone.runOutsideAngular(function () { return _this._exceptionHandler.handleError(e); });
        }
        finally {
            this._runningTick = false;
            profile_1.wtfLeave(scope);
        }
    };
    ApplicationRef_.prototype.ngOnDestroy = function () {
        // TODO(alxhub): Dispose of the NgZone.
        this._views.slice().forEach(function (view) { return view.destroy(); });
    };
    Object.defineProperty(ApplicationRef_.prototype, "viewCount", {
        get: function () { return this._views.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationRef_.prototype, "componentTypes", {
        get: function () { return this._rootComponentTypes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationRef_.prototype, "components", {
        get: function () { return this._rootComponents; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationRef_.prototype, "isStable", {
        get: function () { return this._isStable; },
        enumerable: true,
        configurable: true
    });
    return ApplicationRef_;
}(ApplicationRef));
/** @internal */
ApplicationRef_._tickScope = profile_1.wtfCreateScope('ApplicationRef#tick()');
ApplicationRef_ = ApplicationRef_1 = __decorate([
    di_1.Injectable(),
    __metadata("design:paramtypes", [ng_zone_1.NgZone, console_1.Console, di_1.Injector,
        error_handler_1.ErrorHandler,
        component_factory_resolver_1.ComponentFactoryResolver,
        application_init_1.ApplicationInitStatus])
], ApplicationRef_);
exports.ApplicationRef_ = ApplicationRef_;
function remove(list, el) {
    var index = list.indexOf(el);
    if (index > -1) {
        list.splice(index, 1);
    }
}
var ApplicationRef_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvYXBwbGljYXRpb25fcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDhDQUEyQztBQUczQywrQ0FBNEM7QUFDNUMsNkNBQTBDO0FBRTFDLHNEQUFrRDtBQUNsRCxvQ0FBeUQ7QUFDekQseUNBQTJDO0FBRTNDLHVEQUF5RDtBQUN6RCwyREFBa0Y7QUFDbEYscUNBQWtDO0FBQ2xDLDJCQUEwRTtBQUMxRSw4Q0FBbUU7QUFDbkUsZ0VBQTBFO0FBQzFFLGtGQUE0RztBQUM1RyxnRUFBNkY7QUFFN0YsNkNBQXVFO0FBQ3ZFLHlEQUEyRTtBQUUzRSwwQ0FBc0M7QUFFdEMsSUFBSSxRQUFRLEdBQVksSUFBSSxDQUFDO0FBQzdCLElBQUksY0FBYyxHQUFZLEtBQUssQ0FBQztBQUNwQyxJQUFJLFNBQXNCLENBQUM7QUFFZCxRQUFBLHdCQUF3QixHQUFHLElBQUksbUJBQWMsQ0FBVSxvQkFBb0IsQ0FBQyxDQUFDO0FBRTFGOzs7Ozs7Ozs7R0FTRztBQUNIO0lBQ0UsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDbkIsQ0FBQztBQUxELHdDQUtDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNIO0lBQ0UsY0FBYyxHQUFHLElBQUksQ0FBQztJQUN0QixNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFIRCw4QkFHQztBQUVEOzs7O0dBSUc7QUFDSDtJQUNFLHNCQUFtQixJQUFZLEVBQVMsS0FBVTtRQUEvQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBSztJQUFH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