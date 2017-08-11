"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var injector_1 = require("./injector");
var metadata_1 = require("./metadata");
var reflective_errors_1 = require("./reflective_errors");
var reflective_key_1 = require("./reflective_key");
var reflective_provider_1 = require("./reflective_provider");
// Threshold for the dynamic version
var UNDEFINED = new Object();
/**
 * A ReflectiveDependency injection container used for instantiating objects and resolving
 * dependencies.
 *
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 *
 * In typical use, application code asks for the dependencies in the constructor and they are
 * resolved by the `Injector`.
 *
 * ### Example ([live demo](http://plnkr.co/edit/jzjec0?p=preview))
 *
 * The following example creates an `Injector` configured to create `Engine` and `Car`.
 *
 * ```typescript
 * @Injectable()
 * class Engine {
 * }
 *
 * @Injectable()
 * class Car {
 *   constructor(public engine:Engine) {}
 * }
 *
 * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
 * var car = injector.get(Car);
 * expect(car instanceof Car).toBe(true);
 * expect(car.engine instanceof Engine).toBe(true);
 * ```
 *
 * Notice, we don't use the `new` operator because we explicitly want to have the `Injector`
 * resolve all of the object's dependencies automatically.
 *
 * @deprecated from v5 - slow and brings in a lot of code, Use `Injector.create` instead.
 */
var ReflectiveInjector = (function () {
    function ReflectiveInjector() {
    }
    /**
     * Turns an array of provider definitions into an array of resolved providers.
     *
     * A resolution is a process of flattening multiple nested arrays and converting individual
     * providers into an array of {@link ResolvedReflectiveProvider}s.
     *
     * ### Example ([live demo](http://plnkr.co/edit/AiXTHi?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = ReflectiveInjector.resolve([Car, [[Engine]]]);
     *
     * expect(providers.length).toEqual(2);
     *
     * expect(providers[0] instanceof ResolvedReflectiveProvider).toBe(true);
     * expect(providers[0].key.displayName).toBe("Car");
     * expect(providers[0].dependencies.length).toEqual(1);
     * expect(providers[0].factory).toBeDefined();
     *
     * expect(providers[1].key.displayName).toBe("Engine");
     * });
     * ```
     *
     * See {@link ReflectiveInjector#fromResolvedProviders} for more info.
     */
    ReflectiveInjector.resolve = function (providers) {
        return reflective_provider_1.resolveReflectiveProviders(providers);
    };
    /**
     * Resolves an array of providers and creates an injector from those providers.
     *
     * The passed-in providers can be an array of `Type`, {@link Provider},
     * or a recursive array of more providers.
     *
     * ### Example ([live demo](http://plnkr.co/edit/ePOccA?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     *
     * This function is slower than the corresponding `fromResolvedProviders`
     * because it needs to resolve the passed-in providers first.
     * See {@link ReflectiveInjector#resolve} and {@link ReflectiveInjector#fromResolvedProviders}.
     */
    ReflectiveInjector.resolveAndCreate = function (providers, parent) {
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
    };
    /**
     * Creates an injector from previously resolved providers.
     *
     * This API is the recommended way to construct injectors in performance-sensitive parts.
     *
     * ### Example ([live demo](http://plnkr.co/edit/KrSMci?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = ReflectiveInjector.resolve([Car, Engine]);
     * var injector = ReflectiveInjector.fromResolvedProviders(providers);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     * @experimental
     */
    ReflectiveInjector.fromResolvedProviders = function (providers, parent) {
        return new ReflectiveInjector_(providers, parent);
    };
    return ReflectiveInjector;
}());
exports.ReflectiveInjector = ReflectiveInjector;
var ReflectiveInjector_ = (function () {
    /**
     * Private
     */
    function ReflectiveInjector_(_providers, _parent) {
        /** @internal */
        this._constructionCounter = 0;
        this._providers = _providers;
        this._parent = _parent || null;
        var len = _providers.length;
        this.keyIds = new Array(len);
        this.objs = new Array(len);
        for (var i = 0; i < len; i++) {
            this.keyIds[i] = _providers[i].key.id;
            this.objs[i] = UNDEFINED;
        }
    }
    ReflectiveInjector_.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = injector_1.THROW_IF_NOT_FOUND; }
        return this._getByKey(reflective_key_1.ReflectiveKey.get(token), null, notFoundValue);
    };
    Object.defineProperty(ReflectiveInjector_.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    ReflectiveInjector_.prototype.resolveAndCreateChild = function (providers) {
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return this.createChildFromResolved(ResolvedReflectiveProviders);
    };
    ReflectiveInjector_.prototype.createChildFromResolved = function (providers) {
        var inj = new ReflectiveInjector_(providers);
        inj._parent = this;
        return inj;
    };
    ReflectiveInjector_.prototype.resolveAndInstantiate = function (provider) {
        return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
    };
    ReflectiveInjector_.prototype.instantiateResolved = function (provider) {
        return this._instantiateProvider(provider);
    };
    ReflectiveInjector_.prototype.getProviderAtIndex = function (index) {
        if (index < 0 || index >= this._providers.length) {
            throw reflective_errors_1.outOfBoundsError(index);
        }
        return this._providers[index];
    };
    /** @internal */
    ReflectiveInjector_.prototype._new = function (provider) {
        if (this._constructionCounter++ > this._getMaxNumberOfObjects()) {
            throw reflective_errors_1.cyclicDependencyError(this, provider.key);
        }
        return this._instantiateProvider(provider);
    };
    ReflectiveInjector_.prototype._getMaxNumberOfObjects = function () { return this.objs.length; };
    ReflectiveInjector_.prototype._instantiateProvider = function (provider) {
        if (provider.multiProvider) {
            var res = new Array(provider.resolvedFactories.length);
            for (var i = 0; i < provider.resolvedFactories.length; ++i) {
                res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
            }
            return res;
        }
        else {
            return this._instantiate(provider, provider.resolvedFactories[0]);
        }
    };
    ReflectiveInjector_.prototype._instantiate = function (provider, ResolvedReflectiveFactory) {
        var _this = this;
        var factory = ResolvedReflectiveFactory.factory;
        var deps;
        try {
            deps =
                ResolvedReflectiveFactory.dependencies.map(function (dep) { return _this._getByReflectiveDependency(dep); });
        }
        catch (e) {
            if (e.addKey) {
                e.addKey(this, provider.key);
            }
            throw e;
        }
        var obj;
        try {
            obj = factory.apply(void 0, deps);
        }
        catch (e) {
            throw reflective_errors_1.instantiationError(this, e, e.stack, provider.key);
        }
        return obj;
    };
    ReflectiveInjector_.prototype._getByReflectiveDependency = function (dep) {
        return this._getByKey(dep.key, dep.visibility, dep.optional ? null : injector_1.THROW_IF_NOT_FOUND);
    };
    ReflectiveInjector_.prototype._getByKey = function (key, visibility, notFoundValue) {
        if (key === ReflectiveInjector_.INJECTOR_KEY) {
            return this;
        }
        if (visibility instanceof metadata_1.Self) {
            return this._getByKeySelf(key, notFoundValue);
        }
        else {
            return this._getByKeyDefault(key, notFoundValue, visibility);
        }
    };
    ReflectiveInjector_.prototype._getObjByKeyId = function (keyId) {
        for (var i = 0; i < this.keyIds.length; i++) {
            if (this.keyIds[i] === keyId) {
                if (this.objs[i] === UNDEFINED) {
                    this.objs[i] = this._new(this._providers[i]);
                }
                return this.objs[i];
            }
        }
        return UNDEFINED;
    };
    /** @internal */
    ReflectiveInjector_.prototype._throwOrNull = function (key, notFoundValue) {
        if (notFoundValue !== injector_1.THROW_IF_NOT_FOUND) {
            return notFoundValue;
        }
        else {
            throw reflective_errors_1.noProviderError(this, key);
        }
    };
    /** @internal */
    ReflectiveInjector_.prototype._getByKeySelf = function (key, notFoundValue) {
        var obj = this._getObjByKeyId(key.id);
        return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
    };
    /** @internal */
    ReflectiveInjector_.prototype._getByKeyDefault = function (key, notFoundValue, visibility) {
        var inj;
        if (visibility instanceof metadata_1.SkipSelf) {
            inj = this._parent;
        }
        else {
            inj = this;
        }
        while (inj instanceof ReflectiveInjector_) {
            var inj_ = inj;
            var obj = inj_._getObjByKeyId(key.id);
            if (obj !== UNDEFINED)
                return obj;
            inj = inj_._parent;
        }
        if (inj !== null) {
            return inj.get(key.token, notFoundValue);
        }
        else {
            return this._throwOrNull(key, notFoundValue);
        }
    };
    Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
        get: function () {
            var providers = _mapProviders(this, function (b) { return ' "' + b.key.displayName + '" '; })
                .join(', ');
            return "ReflectiveInjector(providers: [" + providers + "])";
        },
        enumerable: true,
        configurable: true
    });
    ReflectiveInjector_.prototype.toString = function () { return this.displayName; };
    return ReflectiveInjector_;
}());
ReflectiveInjector_.INJECTOR_KEY = reflective_key_1.ReflectiveKey.get(injector_1.Injector);
exports.ReflectiveInjector_ = ReflectiveInjector_;
function _mapProviders(injector, fn) {
    var res = new Array(injector._providers.length);
    for (var i = 0; i < injector._providers.length; ++i) {
        res[i] = fn(injector.getProviderAtIndex(i));
    }
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL3JlZmxlY3RpdmVfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1Q0FBd0Q7QUFDeEQsdUNBQTBDO0FBRTFDLHlEQUFpSDtBQUNqSCxtREFBK0M7QUFDL0MsNkRBQThJO0FBRTlJLG9DQUFvQztBQUNwQyxJQUFNLFNBQVMsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0NHO0FBQ0g7SUFBQTtJQStOQSxDQUFDO0lBOU5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWdDRztJQUNJLDBCQUFPLEdBQWQsVUFBZSxTQUFxQjtRQUNsQyxNQUFNLENBQUMsZ0RBQTBCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BeUJHO0lBQ0ksbUNBQWdCLEdBQXZCLFVBQXdCLFNBQXFCLEVBQUUsTUFBaUI7UUFDOUQsSUFBTSwyQkFBMkIsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXNCRztJQUNJLHdDQUFxQixHQUE1QixVQUE2QixTQUF1QyxFQUFFLE1BQWlCO1FBRXJGLE1BQU0sQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBZ0lILHlCQUFDO0FBQUQsQ0FBQyxBQS9ORCxJQStOQztBQS9OcUIsZ0RBQWtCO0FBaU94QztJQVdF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