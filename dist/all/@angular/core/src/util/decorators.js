"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANNOTATIONS = '__annotations__';
exports.PARAMETERS = '__paramaters__';
exports.PROP_METADATA = '__prop__metadata__';
/**
 * @suppress {globalThis}
 */
function makeDecorator(name, props, parentClass, chainFn) {
    var metaCtor = makeMetadataCtor(props);
    function DecoratorFactory(objOrType) {
        if (this instanceof DecoratorFactory) {
            metaCtor.call(this, objOrType);
            return this;
        }
        var annotationInstance = new DecoratorFactory(objOrType);
        var TypeDecorator = function TypeDecorator(cls) {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var annotations = cls.hasOwnProperty(exports.ANNOTATIONS) ?
                cls[exports.ANNOTATIONS] :
                Object.defineProperty(cls, exports.ANNOTATIONS, { value: [] })[exports.ANNOTATIONS];
            annotations.push(annotationInstance);
            return cls;
        };
        if (chainFn)
            chainFn(TypeDecorator);
        return TypeDecorator;
    }
    if (parentClass) {
        DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    DecoratorFactory.prototype.toString = function () { return "@" + name; };
    DecoratorFactory.annotationCls = DecoratorFactory;
    return DecoratorFactory;
}
exports.makeDecorator = makeDecorator;
function makeMetadataCtor(props) {
    return function ctor() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (props) {
            var values = props.apply(void 0, args);
            for (var propName in values) {
                this[propName] = values[propName];
            }
        }
    };
}
function makeParamDecorator(name, props, parentClass) {
    var metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this instanceof ParamDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        var annotationInstance = new ((_a = ParamDecoratorFactory).bind.apply(_a, [void 0].concat(args)))();
        ParamDecorator.annotation = annotationInstance;
        return ParamDecorator;
        function ParamDecorator(cls, unusedKey, index) {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var parameters = cls.hasOwnProperty(exports.PARAMETERS) ?
                cls[exports.PARAMETERS] :
                Object.defineProperty(cls, exports.PARAMETERS, { value: [] })[exports.PARAMETERS];
            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            while (parameters.length <= index) {
                parameters.push(null);
            }
            (parameters[index] = parameters[index] || []).push(annotationInstance);
            return cls;
        }
        var _a;
    }
    if (parentClass) {
        ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.toString = function () { return "@" + name; };
    ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
}
exports.makeParamDecorator = makeParamDecorator;
function makePropDecorator(name, props, parentClass) {
    var metaCtor = makeMetadataCtor(props);
    function PropDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this instanceof PropDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        var decoratorInstance = new ((_a = PropDecoratorFactory).bind.apply(_a, [void 0].concat(args)))();
        return function PropDecorator(target, name) {
            var constructor = target.constructor;
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var meta = constructor.hasOwnProperty(exports.PROP_METADATA) ?
                constructor[exports.PROP_METADATA] :
                Object.defineProperty(constructor, exports.PROP_METADATA, { value: {} })[exports.PROP_METADATA];
            meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
            meta[name].unshift(decoratorInstance);
        };
        var _a;
    }
    if (parentClass) {
        PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    PropDecoratorFactory.prototype.toString = function () { return "@" + name; };
    PropDecoratorFactory.annotationCls = PropDecoratorFactory;
    return PropDecoratorFactory;
}
exports.makePropDecorator = makePropDecorator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3V0aWwvZGVjb3JhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQThCVSxRQUFBLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQztBQUNoQyxRQUFBLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztBQUM5QixRQUFBLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQztBQUVsRDs7R0FFRztBQUNILHVCQUNJLElBQVksRUFBRSxLQUErQixFQUFFLFdBQWlCLEVBQ2hFLE9BQWdDO0lBRWxDLElBQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpDLDBCQUEwQixTQUFjO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxJQUFNLGtCQUFrQixHQUFHLElBQVUsZ0JBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEUsSUFBTSxhQUFhLEdBQWlDLHVCQUF1QixHQUFjO1lBQ3ZGLDJGQUEyRjtZQUMzRixzREFBc0Q7WUFDdEQsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxtQkFBVyxDQUFDO2dCQUM5QyxHQUFXLENBQUMsbUJBQVcsQ0FBQztnQkFDekIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsbUJBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsQ0FBQztZQUN0RSxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUMs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