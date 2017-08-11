/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * An interface implemented by all Angular type decorators, which allows them to be used as ES7
 * decorators as well as
 * Angular DSL syntax.
 *
 * ES7 syntax:
 *
 * ```
 * \@ng.Component({...})
 * class MyClass {...}
 * ```
 * \@stable
 * @record
 */
export function TypeDecorator() { }
function TypeDecorator_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    <T extends Type<any>>(type: T): T;
    */
    /* TODO: handle strange member:
    (target: Object, propertyKey?: string|symbol, parameterIndex?: number): void;
    */
}
export var /** @type {?} */ ANNOTATIONS = '__annotations__';
export var /** @type {?} */ PARAMETERS = '__paramaters__';
export var /** @type {?} */ PROP_METADATA = '__prop__metadata__';
/**
 * @suppress {globalThis}
 * @param {?} name
 * @param {?=} props
 * @param {?=} parentClass
 * @param {?=} chainFn
 * @return {?}
 */
export function makeDecorator(name, props, parentClass, chainFn) {
    var /** @type {?} */ metaCtor = makeMetadataCtor(props);
    /**
     * @param {?} objOrType
     * @return {?}
     */
    function DecoratorFactory(objOrType) {
        if (this instanceof DecoratorFactory) {
            metaCtor.call(this, objOrType);
            return this;
        }
        var /** @type {?} */ annotationInstance = new ((DecoratorFactory))(objOrType);
        var /** @type {?} */ TypeDecorator = (function TypeDecorator(cls) {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var /** @type {?} */ annotations = cls.hasOwnProperty(ANNOTATIONS) ?
                ((cls))[ANNOTATIONS] :
                Object.defineProperty(cls, ANNOTATIONS, { value: [] })[ANNOTATIONS];
            annotations.push(annotationInstance);
            return cls;
        });
        if (chainFn)
            chainFn(TypeDecorator);
        return TypeDecorator;
    }
    if (parentClass) {
        DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    DecoratorFactory.prototype.toString = function () { return "@" + name; };
    ((DecoratorFactory)).annotationCls = DecoratorFactory;
    return (DecoratorFactory);
}
/**
 * @param {?=} props
 * @return {?}
 */
function makeMetadataCtor(props) {
    return function ctor() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (props) {
            var /** @type {?} */ values = props.apply(void 0, args);
            for (var /** @type {?} */ propName in values) {
                this[propName] = values[propName];
            }
        }
    };
}
/**
 * @param {?} name
 * @param {?=} props
 * @param {?=} parentClass
 * @return {?}
 */
export function makeParamDecorator(name, props, parentClass) {
    var /** @type {?} */ metaCtor = makeMetadataCtor(props);
    /**
     * @param {...?} args
     * @return {?}
     */
    function ParamDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this instanceof ParamDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        var /** @type {?} */ annotationInstance = new ((_a = ((ParamDecoratorFactory))).bind.apply(_a, [void 0].concat(args)))();
        ((ParamDecorator)).annotation = annotationInstance;
        return ParamDecorator;
        /**
         * @param {?} cls
         * @param {?} unusedKey
         * @param {?} index
         * @return {?}
         */
        function ParamDecorator(cls, unusedKey, index) {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var /** @type {?} */ parameters = cls.hasOwnProperty(PARAMETERS) ?
                ((cls))[PARAMETERS] :
                Object.defineProperty(cls, PARAMETERS, { value: [] })[PARAMETERS];
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
    ((ParamDecoratorFactory)).annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
}
/**
 * @param {?} name
 * @param {?=} props
 * @param {?=} parentClass
 * @return {?}
 */
export function makePropDecorator(name, props, parentClass) {
    var /** @type {?} */ metaCtor = makeMetadataCtor(props);
    /**
     * @param {...?} args
     * @return {?}
     */
    function PropDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this instanceof PropDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        var /** @type {?} */ decoratorInstance = new ((_a = ((PropDecoratorFactory))).bind.apply(_a, [void 0].concat(args)))();
        return function PropDecorator(target, name) {
            var /** @type {?} */ constructor = target.constructor;
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var /** @type {?} */ meta = constructor.hasOwnProperty(PROP_METADATA) ?
                ((constructor))[PROP_METADATA] :
                Object.defineProperty(constructor, PROP_METADATA, { value: {} })[PROP_METADATA];
            meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
            meta[name].unshift(decoratorInstance);
        };
        var _a;
    }
    if (parentClass) {
        PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    PropDecoratorFactory.prototype.toString = function () { return "@" + name; };
    ((PropDecoratorFactory)).annotationCls = PropDecoratorFactory;
    return PropDecoratorFactory;
}
//# sourceMappingURL=decorators.js.map