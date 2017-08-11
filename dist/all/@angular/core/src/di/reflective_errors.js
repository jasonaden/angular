"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var error_handler_1 = require("../error_handler");
var errors_1 = require("../errors");
var util_1 = require("../util");
function findFirstClosedCycle(keys) {
    var res = [];
    for (var i = 0; i < keys.length; ++i) {
        if (res.indexOf(keys[i]) > -1) {
            res.push(keys[i]);
            return res;
        }
        res.push(keys[i]);
    }
    return res;
}
function constructResolvingPath(keys) {
    if (keys.length > 1) {
        var reversed = findFirstClosedCycle(keys.slice().reverse());
        var tokenStrs = reversed.map(function (k) { return util_1.stringify(k.token); });
        return ' (' + tokenStrs.join(' -> ') + ')';
    }
    return '';
}
function injectionError(injector, key, constructResolvingMessage, originalError) {
    var keys = [key];
    var errMsg = constructResolvingMessage(keys);
    var error = (originalError ? error_handler_1.wrappedError(errMsg, originalError) : Error(errMsg));
    error.addKey = addKey;
    error.keys = keys;
    error.injectors = [injector];
    error.constructResolvingMessage = constructResolvingMessage;
    error[errors_1.ERROR_ORIGINAL_ERROR] = originalError;
    return error;
}
function addKey(injector, key) {
    this.injectors.push(injector);
    this.keys.push(key);
    // Note: This updated message won't be reflected in the `.stack` property
    this.message = this.constructResolvingMessage(this.keys);
}
/**
 * Thrown when trying to retrieve a dependency by key from {@link Injector}, but the
 * {@link Injector} does not have a {@link Provider} for the given key.
 *
 * ### Example ([live demo](http://plnkr.co/edit/vq8D3FRB9aGbnWJqtEPE?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor(b:B) {}
 * }
 *
 * expect(() => Injector.resolveAndCreate([A])).toThrowError();
 * ```
 */
function noProviderError(injector, key) {
    return injectionError(injector, key, function (keys) {
        var first = util_1.stringify(keys[0].token);
        return "No provider for " + first + "!" + constructResolvingPath(keys);
    });
}
exports.noProviderError = noProviderError;
/**
 * Thrown when dependencies form a cycle.
 *
 * ### Example ([live demo](http://plnkr.co/edit/wYQdNos0Tzql3ei1EV9j?p=info))
 *
 * ```typescript
 * var injector = Injector.resolveAndCreate([
 *   {provide: "one", useFactory: (two) => "two", deps: [[new Inject("two")]]},
 *   {provide: "two", useFactory: (one) => "one", deps: [[new Inject("one")]]}
 * ]);
 *
 * expect(() => injector.get("one")).toThrowError();
 * ```
 *
 * Retrieving `A` or `B` throws a `CyclicDependencyError` as the graph above cannot be constructed.
 */
function cyclicDependencyError(injector, key) {
    return injectionError(injector, key, function (keys) {
        return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
    });
}
exports.cyclicDependencyError = cyclicDependencyError;
/**
 * Thrown when a constructing type returns with an Error.
 *
 * The `InstantiationError` class contains the original error plus the dependency graph which caused
 * this object to be instantiated.
 *
 * ### Example ([live demo](http://plnkr.co/edit/7aWYdcqTQsP0eNqEdUAf?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor() {
 *     throw new Error('message');
 *   }
 * }
 *
 * var injector = Injector.resolveAndCreate([A]);

 * try {
 *   injector.get(A);
 * } catch (e) {
 *   expect(e instanceof InstantiationError).toBe(true);
 *   expect(e.originalException.message).toEqual("message");
 *   expect(e.originalStack).toBeDefined();
 * }
 * ```
 */
function instantiationError(injector, originalException, originalStack, key) {
    return injectionError(injector, key, function (keys) {
        var first = util_1.stringify(keys[0].token);
        return originalException.message + ": Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".";
    }, originalException);
}
exports.instantiationError = instantiationError;
/**
 * Thrown when an object other then {@link Provider} (or `Type`) is passed to {@link Injector}
 * creation.
 *
 * ### Example ([live demo](http://plnkr.co/edit/YatCFbPAMCL0JSSQ4mvH?p=preview))
 *
 * ```typescript
 * expect(() => Injector.resolveAndCreate(["not a type"])).toThrowError();
 * ```
 */
function invalidProviderError(provider) {
    return Error("Invalid provider - only instances of Provider and Type are allowed, got: " + provider);
}
exports.invalidProviderError = invalidProviderError;
/**
 * Thrown when the class has no annotation information.
 *
 * Lack of annotation information prevents the {@link Injector} from determining which dependencies
 * need to be injected into the constructor.
 *
 * ### Example ([live demo](http://plnkr.co/edit/rHnZtlNS7vJOPQ6pcVkm?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor(b) {}
 * }
 *
 * expect(() => Injector.resolveAndCreate([A])).toThrowError();
 * ```
 *
 * This error is also thrown when the class not marked with {@link Injectable} has parameter types.
 *
 * ```typescript
 * class B {}
 *
 * class A {
 *   constructor(b:B) {} // no information about the parameter types of A is available at runtime.
 * }
 *
 * expect(() => Injector.resolveAndCreate([A,B])).toThrowError();
 * ```
 * @stable
 */
function noAnnotationError(typeOrFunc, params) {
    var signature = [];
    for (var i = 0, ii = params.length; i < ii; i++) {
        var parameter = params[i];
        if (!parameter || parameter.length == 0) {
            signature.push('?');
        }
        else {
            signature.push(parameter.map(util_1.stringify).join(' '));
        }
    }
    return Error('Cannot resolve all parameters for \'' + util_1.stringify(typeOrFunc) + '\'(' +
        signature.join(', ') + '). ' +
        'Make sure that all the parameters are decorated with Inject or have valid type annotations and that \'' +
        util_1.stringify(typeOrFunc) + '\' is decorated with Injectable.');
}
exports.noAnnotationError = noAnnotationError;
/**
 * Thrown when getting an object by index.
 *
 * ### Example ([live demo](http://plnkr.co/edit/bRs0SX2OTQiJzqvjgl8P?p=preview))
 *
 * ```typescript
 * class A {}
 *
 * var injector = Injector.resolveAndCreate([A]);
 *
 * expect(() => injector.getAt(100)).toThrowError();
 * ```
 * @stable
 */
function outOfBoundsError(index) {
    return Error("Index " + index + " is out-of-bounds.");
}
exports.outOfBoundsError = outOfBoundsError;
// TODO: add a working example after alpha38 is released
/**
 * Thrown when a multi provider and a regular provider are bound to the same token.
 *
 * ### Example
 *
 * ```typescript
 * expect(() => Injector.resolveAndCreate([
 *   { provide: "Strings", useValue: "string1", multi: true},
 *   { provide: "Strings", useValue: "string2", multi: false}
 * ])).toThrowError();
 * ```
 */
function mixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
    return Error("Cannot mix multi providers and regular providers, got: " + provider1 + " " + provider2);
}
exports.mixingMultiProvidersWithRegularProvidersError = mixingMultiProvidersWithRegularProvidersError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS9yZWZsZWN0aXZlX2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGtEQUE4QztBQUM5QyxvQ0FBaUU7QUFFakUsZ0NBQWtDO0FBS2xDLDhCQUE4QixJQUFXO0lBQ3ZDLElBQU0sR0FBRyxHQUFVLEVBQUUsQ0FBQztJQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxnQ0FBZ0MsSUFBVztJQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBTSxRQUFRLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDOUQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLGdCQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFsQixD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