"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("../type");
var util_1 = require("../util");
var decorators_1 = require("../util/decorators");
/**
 * Attention: This regex has to hold even if the code is minified!
 */
exports.DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
var ReflectionCapabilities = (function () {
    function ReflectionCapabilities(reflect) {
        this._reflect = reflect || util_1.global['Reflect'];
    }
    ReflectionCapabilities.prototype.isReflectionEnabled = function () { return true; };
    ReflectionCapabilities.prototype.factory = function (t) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new (t.bind.apply(t, [void 0].concat(args)))();
    }; };
    /** @internal */
    ReflectionCapabilities.prototype._zipTypesAndAnnotations = function (paramTypes, paramAnnotations) {
        var result;
        if (typeof paramTypes === 'undefined') {
            result = new Array(paramAnnotations.length);
        }
        else {
            result = new Array(paramTypes.length);
        }
        for (var i = 0; i < result.length; i++) {
            // TS outputs Object for parameters without types, while Traceur omits
            // the annotations. For now we preserve the Traceur behavior to aid
            // migration, but this can be revisited.
            if (typeof paramTypes === 'undefined') {
                result[i] = [];
            }
            else if (paramTypes[i] != Object) {
                result[i] = [paramTypes[i]];
            }
            else {
                result[i] = [];
            }
            if (paramAnnotations && paramAnnotations[i] != null) {
                result[i] = result[i].concat(paramAnnotations[i]);
            }
        }
        return result;
    };
    ReflectionCapabilities.prototype._ownParameters = function (type, parentCtor) {
        // If we have no decorators, we only have function.length as metadata.
        // In that case, to detect whether a child class declared an own constructor or not,
        // we need to look inside of that constructor to check whether it is
        // just calling the parent.
        // This also helps to work around for https://github.com/Microsoft/TypeScript/issues/12439
        // that sets 'design:paramtypes' to []
        // if a class inherits from another class but has no ctor declared itself.
        if (exports.DELEGATE_CTOR.exec(type.toString())) {
            return null;
        }
        // Prefer the direct API.
        if (type.parameters && type.parameters !== parentCtor.parameters) {
            return type.parameters;
        }
        // API of tsickle for lowering decorators to properties on the class.
        var tsickleCtorParams = type.ctorParameters;
        if (tsickleCtorParams && tsickleCtorParams !== parentCtor.ctorParameters) {
            // Newer tsickle uses a function closure
            // Retain the non-function case for compatibility with older tsickle
            var ctorParameters = typeof tsickleCtorParams === 'function' ? tsickleCtorParams() : tsickleCtorParams;
            var paramTypes_1 = ctorParameters.map(function (ctorParam) { return ctorParam && ctorParam.type; });
            var paramAnnotations_1 = ctorParameters.map(function (ctorParam) {
                return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators);
            });
            return this._zipTypesAndAnnotations(paramTypes_1, paramAnnotations_1);
        }
        // API for metadata created by invoking the decorators.
        var paramAnnotations = type.hasOwnProperty(decorators_1.PARAMETERS) && type[decorators_1.PARAMETERS];
        var paramTypes = this._reflect && this._reflect.getOwnMetadata &&
            this._reflect.getOwnMetadata('design:paramtypes', type);
        if (paramTypes || paramAnnotations) {
            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
        }
        // If a class has no decorators, at least create metadata
        // based on function.length.
        // Note: We know that this is a real constructor as we checked
        // the content of the constructor above.
        return new Array(type.length).fill(undefined);
    };
    ReflectionCapabilities.prototype.parameters = function (type) {
        // Note: only report metadata if we have at least one class decorator
        // to stay in sync with the static reflector.
        if (!type_1.isType(type)) {
            return [];
        }
        var parentCtor = getParentCtor(type);
        var parameters = this._ownParameters(type, parentCtor);
        if (!parameters && parentCtor !== Object) {
            parameters = this.parameters(parentCtor);
        }
        return parameters || [];
    };
    ReflectionCapabilities.prototype._ownAnnotations = function (typeOrFunc, parentCtor) {
        // Prefer the direct API.
        if (typeOrFunc.annotations && typeOrFunc.annotations !== parentCtor.annotations) {
            var annotations = typeOrFunc.annotations;
            if (typeof annotations === 'function' && annotations.annotations) {
                annotations = annotations.annotations;
            }
            return annotations;
        }
        // API of tsickle for lowering decorators to properties on the class.
        if (typeOrFunc.decorators && typeOrFunc.decorators !== parentCtor.decorators) {
            return convertTsickleDecoratorIntoMetadata(typeOrFunc.decorators);
        }
        // API for metadata created by invoking the decorators.
        if (typeOrFunc.hasOwnProperty(decorators_1.ANNOTATIONS)) {
            return typeOrFunc[decorators_1.ANNOTATIONS];
        }
        return null;
    };
    ReflectionCapabilities.prototype.annotations = function (typeOrFunc) {
        if (!type_1.isType(typeOrFunc)) {
            return [];
        }
        var parentCtor = getParentCtor(typeOrFunc);
        var ownAnnotations = this._ownAnnotations(typeOrFunc, parentCtor) || [];
        var parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];
        return parentAnnotations.concat(ownAnnotations);
    };
    ReflectionCapabilities.prototype._ownPropMetadata = function (typeOrFunc, parentCtor) {
        // Prefer the direct API.
        if (typeOrFunc.propMetadata &&
            typeOrFunc.propMetadata !== parentCtor.propMetadata) {
            var propMetadata = typeOrFunc.propMetadata;
            if (typeof propMetadata === 'function' && propMetadata.propMetadata) {
                propMetadata = propMetadata.propMetadata;
            }
            return propMetadata;
        }
        // API of tsickle for lowering decorators to properties on the class.
        if (typeOrFunc.propDecorators &&
            typeOrFunc.propDecorators !== parentCtor.propDecorators) {
            var propDecorators_1 = typeOrFunc.propDecorators;
            var propMetadata_1 = {};
            Object.keys(propDecorators_1).forEach(function (prop) {
                propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
            });
            return propMetadata_1;
        }
        // API for metadata created by invoking the decorators.
        if (typeOrFunc.hasOwnProperty(decorators_1.PROP_METADATA)) {
            return typeOrFunc[decorators_1.PROP_METADATA];
        }
        return null;
    };
    ReflectionCapabilities.prototype.propMetadata = function (typeOrFunc) {
        if (!type_1.isType(typeOrFunc)) {
            return {};
        }
        var parentCtor = getParentCtor(typeOrFunc);
        var propMetadata = {};
        if (parentCtor !== Object) {
            var parentPropMetadata_1 = this.propMetadata(parentCtor);
            Object.keys(parentPropMetadata_1).forEach(function (propName) {
                propMetadata[propName] = parentPropMetadata_1[propName];
            });
        }
        var ownPropMetadata = this._ownPropMetadata(typeOrFunc, parentCtor);
        if (ownPropMetadata) {
            Object.keys(ownPropMetadata).forEach(function (propName) {
                var decorators = [];
                if (propMetadata.hasOwnProperty(propName)) {
                    decorators.push.apply(decorators, propMetadata[propName]);
                }
                decorators.push.apply(decorators, ownPropMetadata[propName]);
                propMetadata[propName] = decorators;
            });
        }
        return propMetadata;
    };
    ReflectionCapabilities.prototype.hasLifecycleHook = function (type, lcProperty) {
        return type instanceof type_1.Type && lcProperty in type.prototype;
    };
    ReflectionCapabilities.prototype.getter = function (name) { return new Function('o', 'return o.' + name + ';'); };
    ReflectionCapabilities.prototype.setter = function (name) {
        return new Function('o', 'v', 'return o.' + name + ' = v;');
    };
    ReflectionCapabilities.prototype.method = function (name) {
        var functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
        return new Function('o', 'args', functionBody);
    };
    // There is not a concept of import uri in Js, but this is useful in developing Dart applications.
    ReflectionCapabilities.prototype.importUri = function (type) {
        // StaticSymbol
        if (typeof type === 'object' && type['filePath']) {
            return type['filePath'];
        }
        // Runtime type
        return "./" + util_1.stringify(type);
    };
    ReflectionCapabilities.prototype.resourceUri = function (type) { return "./" + util_1.stringify(type); };
    ReflectionCapabilities.prototype.resolveIdentifier = function (name, moduleUrl, members, runtime) {
        return runtime;
    };
    ReflectionCapabilities.prototype.resolveEnum = function (enumIdentifier, name) { return enumIdentifier[name]; };
    return ReflectionCapabilities;
}());
exports.ReflectionCapabilities = ReflectionCapabilities;
function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
    if (!decoratorInvocations) {
        return [];
    }
    return decoratorInvocations.map(function (decoratorInvocation) {
        var decoratorType = decoratorInvocation.type;
        var annotationCls = decoratorType.annotationCls;
        var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
        return new (annotationCls.bind.apply(annotationCls, [void 0].concat(annotationArgs)))();
    });
}
function getParentCtor(ctor) {
    var parentProto = Object.getPrototypeOf(ctor.prototype);
    var parentCtor = parentProto ? parentProto.constructor : null;
    // Note: We always use `Object` as the null value
    // to simplify checking later on.
    return parentCtor || Object;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGlvbl9jYXBhYmlsaXRpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZWZsZWN0aW9uL3JlZmxlY3Rpb25fY2FwYWJpbGl0aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQXFDO0FBQ3JDLGdDQUEwQztBQUMxQyxpREFBMEU7QUFNMUU7O0dBRUc7QUFDVSxRQUFBLGFBQWEsR0FBRyw0REFBNEQsQ0FBQztBQUUxRjtJQUdFLGdDQUFZLE9BQWE7UUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxhQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFBQyxDQUFDO0lBRTVFLG9EQUFtQixHQUFuQixjQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUUvQyx3Q0FBTyxHQUFQLFVBQVcsQ0FBVSxJQUF3QixNQUFNLENBQUM7UUFBQyxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUFLLFlBQUksQ0FBQyxZQUFELENBQUMsa0JBQUksSUFBSTtJQUFiLENBQWMsQ0FBQyxDQUFDLENBQUM7SUFFekYsZ0JBQWdCO0lBQ2hCLHdEQUF1QixHQUF2QixVQUF3QixVQUFpQixFQUFFLGdCQUF1QjtRQUNoRSxJQUFJLE1BQWUsQ0FBQztRQUVwQixFQUFFLENBQUMsQ0FBQyxPQUFPLFVBQVUsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FB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