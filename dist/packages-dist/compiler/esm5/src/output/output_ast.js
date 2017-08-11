/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
export var TypeModifier = {};
TypeModifier.Const = 0;
TypeModifier[TypeModifier.Const] = "Const";
/**
 * @abstract
 */
var Type = (function () {
    /**
     * @param {?=} modifiers
     */
    function Type(modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
    }
    /**
     * @param {?} modifier
     * @return {?}
     */
    Type.prototype.hasModifier = function (modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; };
    return Type;
}());
export { Type };
function Type_tsickle_Closure_declarations() {
    /** @type {?} */
    Type.prototype.modifiers;
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Type.prototype.visitType = function (visitor, context) { };
}
export var BuiltinTypeName = {};
BuiltinTypeName.Dynamic = 0;
BuiltinTypeName.Bool = 1;
BuiltinTypeName.String = 2;
BuiltinTypeName.Int = 3;
BuiltinTypeName.Number = 4;
BuiltinTypeName.Function = 5;
BuiltinTypeName.Inferred = 6;
BuiltinTypeName[BuiltinTypeName.Dynamic] = "Dynamic";
BuiltinTypeName[BuiltinTypeName.Bool] = "Bool";
BuiltinTypeName[BuiltinTypeName.String] = "String";
BuiltinTypeName[BuiltinTypeName.Int] = "Int";
BuiltinTypeName[BuiltinTypeName.Number] = "Number";
BuiltinTypeName[BuiltinTypeName.Function] = "Function";
BuiltinTypeName[BuiltinTypeName.Inferred] = "Inferred";
var BuiltinType = (function (_super) {
    tslib_1.__extends(BuiltinType, _super);
    /**
     * @param {?} name
     * @param {?=} modifiers
     */
    function BuiltinType(name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.name = name;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BuiltinType.prototype.visitType = function (visitor, context) {
        return visitor.visitBuiltintType(this, context);
    };
    return BuiltinType;
}(Type));
export { BuiltinType };
function BuiltinType_tsickle_Closure_declarations() {
    /** @type {?} */
    BuiltinType.prototype.name;
}
var ExpressionType = (function (_super) {
    tslib_1.__extends(ExpressionType, _super);
    /**
     * @param {?} value
     * @param {?=} modifiers
     */
    function ExpressionType(value, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExpressionType.prototype.visitType = function (visitor, context) {
        return visitor.visitExpressionType(this, context);
    };
    return ExpressionType;
}(Type));
export { ExpressionType };
function ExpressionType_tsickle_Closure_declarations() {
    /** @type {?} */
    ExpressionType.prototype.value;
}
var ArrayType = (function (_super) {
    tslib_1.__extends(ArrayType, _super);
    /**
     * @param {?} of
     * @param {?=} modifiers
     */
    function ArrayType(of, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.of = of;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ArrayType.prototype.visitType = function (visitor, context) {
        return visitor.visitArrayType(this, context);
    };
    return ArrayType;
}(Type));
export { ArrayType };
function ArrayType_tsickle_Closure_declarations() {
    /** @type {?} */
    ArrayType.prototype.of;
}
var MapType = (function (_super) {
    tslib_1.__extends(MapType, _super);
    /**
     * @param {?} valueType
     * @param {?=} modifiers
     */
    function MapType(valueType, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.valueType = valueType || null;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    MapType.prototype.visitType = function (visitor, context) { return visitor.visitMapType(this, context); };
    return MapType;
}(Type));
export { MapType };
function MapType_tsickle_Closure_declarations() {
    /** @type {?} */
    MapType.prototype.valueType;
}
export var /** @type {?} */ DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
export var /** @type {?} */ INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
export var /** @type {?} */ BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
export var /** @type {?} */ INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
export var /** @type {?} */ NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
export var /** @type {?} */ STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
export var /** @type {?} */ FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
/**
 * @record
 */
export function TypeVisitor() { }
function TypeVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    TypeVisitor.prototype.visitBuiltintType;
    /** @type {?} */
    TypeVisitor.prototype.visitExpressionType;
    /** @type {?} */
    TypeVisitor.prototype.visitArrayType;
    /** @type {?} */
    TypeVisitor.prototype.visitMapType;
}
export var BinaryOperator = {};
BinaryOperator.Equals = 0;
BinaryOperator.NotEquals = 1;
BinaryOperator.Identical = 2;
BinaryOperator.NotIdentical = 3;
BinaryOperator.Minus = 4;
BinaryOperator.Plus = 5;
BinaryOperator.Divide = 6;
BinaryOperator.Multiply = 7;
BinaryOperator.Modulo = 8;
BinaryOperator.And = 9;
BinaryOperator.Or = 10;
BinaryOperator.Lower = 11;
BinaryOperator.LowerEquals = 12;
BinaryOperator.Bigger = 13;
BinaryOperator.BiggerEquals = 14;
BinaryOperator[BinaryOperator.Equals] = "Equals";
BinaryOperator[BinaryOperator.NotEquals] = "NotEquals";
BinaryOperator[BinaryOperator.Identical] = "Identical";
BinaryOperator[BinaryOperator.NotIdentical] = "NotIdentical";
BinaryOperator[BinaryOperator.Minus] = "Minus";
BinaryOperator[BinaryOperator.Plus] = "Plus";
BinaryOperator[BinaryOperator.Divide] = "Divide";
BinaryOperator[BinaryOperator.Multiply] = "Multiply";
BinaryOperator[BinaryOperator.Modulo] = "Modulo";
BinaryOperator[BinaryOperator.And] = "And";
BinaryOperator[BinaryOperator.Or] = "Or";
BinaryOperator[BinaryOperator.Lower] = "Lower";
BinaryOperator[BinaryOperator.LowerEquals] = "LowerEquals";
BinaryOperator[BinaryOperator.Bigger] = "Bigger";
BinaryOperator[BinaryOperator.BiggerEquals] = "BiggerEquals";
/**
 * @abstract
 */
var Expression = (function () {
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     */
    function Expression(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @param {?} name
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.prop = function (name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
    };
    /**
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.key = function (index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
    };
    /**
     * @param {?} name
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.callMethod = function (name, params, sourceSpan) {
        return new InvokeMethodExpr(this, name, params, null, sourceSpan);
    };
    /**
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.callFn = function (params, sourceSpan) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan);
    };
    /**
     * @param {?} params
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.instantiate = function (params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
    };
    /**
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.conditional = function (trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.equals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.notEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.identical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.notIdentical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.minus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.plus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.divide = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.multiply = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.modulo = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.and = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.or = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.lower = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.lowerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.bigger = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.biggerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.isBlank = function (sourceSpan) {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        // We use the typed null to allow strictNullChecks to narrow types.
        return this.equals(TYPED_NULL_EXPR, sourceSpan);
    };
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.cast = function (type, sourceSpan) {
        return new CastExpr(this, type, sourceSpan);
    };
    /**
     * @return {?}
     */
    Expression.prototype.toStmt = function () { return new ExpressionStatement(this, null); };
    return Expression;
}());
export { Expression };
function Expression_tsickle_Closure_declarations() {
    /** @type {?} */
    Expression.prototype.type;
    /** @type {?} */
    Expression.prototype.sourceSpan;
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Expression.prototype.visitExpression = function (visitor, context) { };
}
export var BuiltinVar = {};
BuiltinVar.This = 0;
BuiltinVar.Super = 1;
BuiltinVar.CatchError = 2;
BuiltinVar.CatchStack = 3;
BuiltinVar[BuiltinVar.This] = "This";
BuiltinVar[BuiltinVar.Super] = "Super";
BuiltinVar[BuiltinVar.CatchError] = "CatchError";
BuiltinVar[BuiltinVar.CatchStack] = "CatchStack";
var ReadVarExpr = (function (_super) {
    tslib_1.__extends(ReadVarExpr, _super);
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ReadVarExpr(name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        if (typeof name === 'string') {
            _this.name = name;
            _this.builtin = null;
        }
        else {
            _this.name = null;
            _this.builtin = (name);
        }
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReadVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ReadVarExpr.prototype.set = function (value) {
        if (!this.name) {
            throw new Error("Built in variable " + this.builtin + " can not be assigned to.");
        }
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
    };
    return ReadVarExpr;
}(Expression));
export { ReadVarExpr };
function ReadVarExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    ReadVarExpr.prototype.name;
    /** @type {?} */
    ReadVarExpr.prototype.builtin;
}
var WriteVarExpr = (function (_super) {
    tslib_1.__extends(WriteVarExpr, _super);
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function WriteVarExpr(name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    WriteVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    };
    /**
     * @param {?=} type
     * @param {?=} modifiers
     * @return {?}
     */
    WriteVarExpr.prototype.toDeclStmt = function (type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
    };
    return WriteVarExpr;
}(Expression));
export { WriteVarExpr };
function WriteVarExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    WriteVarExpr.prototype.value;
    /** @type {?} */
    WriteVarExpr.prototype.name;
}
var WriteKeyExpr = (function (_super) {
    tslib_1.__extends(WriteKeyExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function WriteKeyExpr(receiver, index, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    WriteKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    };
    return WriteKeyExpr;
}(Expression));
export { WriteKeyExpr };
function WriteKeyExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    WriteKeyExpr.prototype.value;
    /** @type {?} */
    WriteKeyExpr.prototype.receiver;
    /** @type {?} */
    WriteKeyExpr.prototype.index;
}
var WritePropExpr = (function (_super) {
    tslib_1.__extends(WritePropExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function WritePropExpr(receiver, name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    WritePropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    };
    return WritePropExpr;
}(Expression));
export { WritePropExpr };
function WritePropExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    WritePropExpr.prototype.value;
    /** @type {?} */
    WritePropExpr.prototype.receiver;
    /** @type {?} */
    WritePropExpr.prototype.name;
}
export var BuiltinMethod = {};
BuiltinMethod.ConcatArray = 0;
BuiltinMethod.SubscribeObservable = 1;
BuiltinMethod.Bind = 2;
BuiltinMethod[BuiltinMethod.ConcatArray] = "ConcatArray";
BuiltinMethod[BuiltinMethod.SubscribeObservable] = "SubscribeObservable";
BuiltinMethod[BuiltinMethod.Bind] = "Bind";
var InvokeMethodExpr = (function (_super) {
    tslib_1.__extends(InvokeMethodExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} method
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function InvokeMethodExpr(receiver, method, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.args = args;
        if (typeof method === 'string') {
            _this.name = method;
            _this.builtin = null;
        }
        else {
            _this.name = null;
            _this.builtin = (method);
        }
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    InvokeMethodExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
    };
    return InvokeMethodExpr;
}(Expression));
export { InvokeMethodExpr };
function InvokeMethodExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    InvokeMethodExpr.prototype.name;
    /** @type {?} */
    InvokeMethodExpr.prototype.builtin;
    /** @type {?} */
    InvokeMethodExpr.prototype.receiver;
    /** @type {?} */
    InvokeMethodExpr.prototype.args;
}
var InvokeFunctionExpr = (function (_super) {
    tslib_1.__extends(InvokeFunctionExpr, _super);
    /**
     * @param {?} fn
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function InvokeFunctionExpr(fn, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.fn = fn;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    InvokeFunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    };
    return InvokeFunctionExpr;
}(Expression));
export { InvokeFunctionExpr };
function InvokeFunctionExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    InvokeFunctionExpr.prototype.fn;
    /** @type {?} */
    InvokeFunctionExpr.prototype.args;
}
var InstantiateExpr = (function (_super) {
    tslib_1.__extends(InstantiateExpr, _super);
    /**
     * @param {?} classExpr
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function InstantiateExpr(classExpr, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.classExpr = classExpr;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    InstantiateExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    };
    return InstantiateExpr;
}(Expression));
export { InstantiateExpr };
function InstantiateExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    InstantiateExpr.prototype.classExpr;
    /** @type {?} */
    InstantiateExpr.prototype.args;
}
var LiteralExpr = (function (_super) {
    tslib_1.__extends(LiteralExpr, _super);
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function LiteralExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    LiteralExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    };
    return LiteralExpr;
}(Expression));
export { LiteralExpr };
function LiteralExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralExpr.prototype.value;
}
var ExternalExpr = (function (_super) {
    tslib_1.__extends(ExternalExpr, _super);
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} typeParams
     * @param {?=} sourceSpan
     */
    function ExternalExpr(value, type, typeParams, sourceSpan) {
        if (typeParams === void 0) { typeParams = null; }
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        _this.typeParams = typeParams;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExternalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitExternalExpr(this, context);
    };
    return ExternalExpr;
}(Expression));
export { ExternalExpr };
function ExternalExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    ExternalExpr.prototype.value;
    /** @type {?} */
    ExternalExpr.prototype.typeParams;
}
var ExternalReference = (function () {
    /**
     * @param {?} moduleName
     * @param {?} name
     * @param {?} runtime
     */
    function ExternalReference(moduleName, name, runtime) {
        this.moduleName = moduleName;
        this.name = name;
        this.runtime = runtime;
    }
    return ExternalReference;
}());
export { ExternalReference };
function ExternalReference_tsickle_Closure_declarations() {
    /** @type {?} */
    ExternalReference.prototype.moduleName;
    /** @type {?} */
    ExternalReference.prototype.name;
    /** @type {?} */
    ExternalReference.prototype.runtime;
}
var ConditionalExpr = (function (_super) {
    tslib_1.__extends(ConditionalExpr, _super);
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ConditionalExpr(condition, trueCase, falseCase, type, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        var _this = _super.call(this, type || trueCase.type, sourceSpan) || this;
        _this.condition = condition;
        _this.falseCase = falseCase;
        _this.trueCase = trueCase;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ConditionalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    };
    return ConditionalExpr;
}(Expression));
export { ConditionalExpr };
function ConditionalExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    ConditionalExpr.prototype.trueCase;
    /** @type {?} */
    ConditionalExpr.prototype.condition;
    /** @type {?} */
    ConditionalExpr.prototype.falseCase;
}
var NotExpr = (function (_super) {
    tslib_1.__extends(NotExpr, _super);
    /**
     * @param {?} condition
     * @param {?=} sourceSpan
     */
    function NotExpr(condition, sourceSpan) {
        var _this = _super.call(this, BOOL_TYPE, sourceSpan) || this;
        _this.condition = condition;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    NotExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitNotExpr(this, context);
    };
    return NotExpr;
}(Expression));
export { NotExpr };
function NotExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    NotExpr.prototype.condition;
}
var AssertNotNull = (function (_super) {
    tslib_1.__extends(AssertNotNull, _super);
    /**
     * @param {?} condition
     * @param {?=} sourceSpan
     */
    function AssertNotNull(condition, sourceSpan) {
        var _this = _super.call(this, condition.type, sourceSpan) || this;
        _this.condition = condition;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    AssertNotNull.prototype.visitExpression = function (visitor, context) {
        return visitor.visitAssertNotNullExpr(this, context);
    };
    return AssertNotNull;
}(Expression));
export { AssertNotNull };
function AssertNotNull_tsickle_Closure_declarations() {
    /** @type {?} */
    AssertNotNull.prototype.condition;
}
var CastExpr = (function (_super) {
    tslib_1.__extends(CastExpr, _super);
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function CastExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    CastExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCastExpr(this, context);
    };
    return CastExpr;
}(Expression));
export { CastExpr };
function CastExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    CastExpr.prototype.value;
}
var FnParam = (function () {
    /**
     * @param {?} name
     * @param {?=} type
     */
    function FnParam(name, type) {
        if (type === void 0) { type = null; }
        this.name = name;
        this.type = type;
    }
    return FnParam;
}());
export { FnParam };
function FnParam_tsickle_Closure_declarations() {
    /** @type {?} */
    FnParam.prototype.name;
    /** @type {?} */
    FnParam.prototype.type;
}
var FunctionExpr = (function (_super) {
    tslib_1.__extends(FunctionExpr, _super);
    /**
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function FunctionExpr(params, statements, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.params = params;
        _this.statements = statements;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    FunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    };
    /**
     * @param {?} name
     * @param {?=} modifiers
     * @return {?}
     */
    FunctionExpr.prototype.toDeclStmt = function (name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
    };
    return FunctionExpr;
}(Expression));
export { FunctionExpr };
function FunctionExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    FunctionExpr.prototype.params;
    /** @type {?} */
    FunctionExpr.prototype.statements;
}
var BinaryOperatorExpr = (function (_super) {
    tslib_1.__extends(BinaryOperatorExpr, _super);
    /**
     * @param {?} operator
     * @param {?} lhs
     * @param {?} rhs
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function BinaryOperatorExpr(operator, lhs, rhs, type, sourceSpan) {
        var _this = _super.call(this, type || lhs.type, sourceSpan) || this;
        _this.operator = operator;
        _this.rhs = rhs;
        _this.lhs = lhs;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BinaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    };
    return BinaryOperatorExpr;
}(Expression));
export { BinaryOperatorExpr };
function BinaryOperatorExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    BinaryOperatorExpr.prototype.lhs;
    /** @type {?} */
    BinaryOperatorExpr.prototype.operator;
    /** @type {?} */
    BinaryOperatorExpr.prototype.rhs;
}
var ReadPropExpr = (function (_super) {
    tslib_1.__extends(ReadPropExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ReadPropExpr(receiver, name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReadPropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ReadPropExpr.prototype.set = function (value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
    };
    return ReadPropExpr;
}(Expression));
export { ReadPropExpr };
function ReadPropExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    ReadPropExpr.prototype.receiver;
    /** @type {?} */
    ReadPropExpr.prototype.name;
}
var ReadKeyExpr = (function (_super) {
    tslib_1.__extends(ReadKeyExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ReadKeyExpr(receiver, index, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReadKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ReadKeyExpr.prototype.set = function (value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
    };
    return ReadKeyExpr;
}(Expression));
export { ReadKeyExpr };
function ReadKeyExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    ReadKeyExpr.prototype.receiver;
    /** @type {?} */
    ReadKeyExpr.prototype.index;
}
var LiteralArrayExpr = (function (_super) {
    tslib_1.__extends(LiteralArrayExpr, _super);
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function LiteralArrayExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    LiteralArrayExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    };
    return LiteralArrayExpr;
}(Expression));
export { LiteralArrayExpr };
function LiteralArrayExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralArrayExpr.prototype.entries;
}
var LiteralMapEntry = (function () {
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} quoted
     */
    function LiteralMapEntry(key, value, quoted) {
        this.key = key;
        this.value = value;
        this.quoted = quoted;
    }
    return LiteralMapEntry;
}());
export { LiteralMapEntry };
function LiteralMapEntry_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralMapEntry.prototype.key;
    /** @type {?} */
    LiteralMapEntry.prototype.value;
    /** @type {?} */
    LiteralMapEntry.prototype.quoted;
}
var LiteralMapExpr = (function (_super) {
    tslib_1.__extends(LiteralMapExpr, _super);
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function LiteralMapExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        _this.valueType = null;
        if (type) {
            _this.valueType = type.valueType;
        }
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    LiteralMapExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    };
    return LiteralMapExpr;
}(Expression));
export { LiteralMapExpr };
function LiteralMapExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralMapExpr.prototype.valueType;
    /** @type {?} */
    LiteralMapExpr.prototype.entries;
}
var CommaExpr = (function (_super) {
    tslib_1.__extends(CommaExpr, _super);
    /**
     * @param {?} parts
     * @param {?=} sourceSpan
     */
    function CommaExpr(parts, sourceSpan) {
        var _this = _super.call(this, parts[parts.length - 1].type, sourceSpan) || this;
        _this.parts = parts;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    CommaExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCommaExpr(this, context);
    };
    return CommaExpr;
}(Expression));
export { CommaExpr };
function CommaExpr_tsickle_Closure_declarations() {
    /** @type {?} */
    CommaExpr.prototype.parts;
}
/**
 * @record
 */
export function ExpressionVisitor() { }
function ExpressionVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    ExpressionVisitor.prototype.visitReadVarExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitWriteVarExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitWriteKeyExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitWritePropExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitInvokeMethodExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitInvokeFunctionExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitInstantiateExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitLiteralExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitExternalExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitConditionalExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitNotExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitAssertNotNullExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitCastExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitFunctionExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitBinaryOperatorExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitReadPropExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitReadKeyExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitLiteralArrayExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitLiteralMapExpr;
    /** @type {?} */
    ExpressionVisitor.prototype.visitCommaExpr;
}
export var /** @type {?} */ THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
export var /** @type {?} */ SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
export var /** @type {?} */ CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
export var /** @type {?} */ CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
export var /** @type {?} */ NULL_EXPR = new LiteralExpr(null, null, null);
export var /** @type {?} */ TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE, null);
export var StmtModifier = {};
StmtModifier.Final = 0;
StmtModifier.Private = 1;
StmtModifier.Exported = 2;
StmtModifier[StmtModifier.Final] = "Final";
StmtModifier[StmtModifier.Private] = "Private";
StmtModifier[StmtModifier.Exported] = "Exported";
/**
 * @abstract
 */
var Statement = (function () {
    /**
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function Statement(modifiers, sourceSpan) {
        this.modifiers = modifiers || [];
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @param {?} modifier
     * @return {?}
     */
    Statement.prototype.hasModifier = function (modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; };
    return Statement;
}());
export { Statement };
function Statement_tsickle_Closure_declarations() {
    /** @type {?} */
    Statement.prototype.modifiers;
    /** @type {?} */
    Statement.prototype.sourceSpan;
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Statement.prototype.visitStatement = function (visitor, context) { };
}
var DeclareVarStmt = (function (_super) {
    tslib_1.__extends(DeclareVarStmt, _super);
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function DeclareVarStmt(name, value, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        _this.type = type || value.type;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    DeclareVarStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    };
    return DeclareVarStmt;
}(Statement));
export { DeclareVarStmt };
function DeclareVarStmt_tsickle_Closure_declarations() {
    /** @type {?} */
    DeclareVarStmt.prototype.type;
    /** @type {?} */
    DeclareVarStmt.prototype.name;
    /** @type {?} */
    DeclareVarStmt.prototype.value;
}
var DeclareFunctionStmt = (function (_super) {
    tslib_1.__extends(DeclareFunctionStmt, _super);
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function DeclareFunctionStmt(name, params, statements, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.params = params;
        _this.statements = statements;
        _this.type = type || null;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    DeclareFunctionStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    };
    return DeclareFunctionStmt;
}(Statement));
export { DeclareFunctionStmt };
function DeclareFunctionStmt_tsickle_Closure_declarations() {
    /** @type {?} */
    DeclareFunctionStmt.prototype.type;
    /** @type {?} */
    DeclareFunctionStmt.prototype.name;
    /** @type {?} */
    DeclareFunctionStmt.prototype.params;
    /** @type {?} */
    DeclareFunctionStmt.prototype.statements;
}
var ExpressionStatement = (function (_super) {
    tslib_1.__extends(ExpressionStatement, _super);
    /**
     * @param {?} expr
     * @param {?=} sourceSpan
     */
    function ExpressionStatement(expr, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.expr = expr;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExpressionStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    };
    return ExpressionStatement;
}(Statement));
export { ExpressionStatement };
function ExpressionStatement_tsickle_Closure_declarations() {
    /** @type {?} */
    ExpressionStatement.prototype.expr;
}
var ReturnStatement = (function (_super) {
    tslib_1.__extends(ReturnStatement, _super);
    /**
     * @param {?} value
     * @param {?=} sourceSpan
     */
    function ReturnStatement(value, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReturnStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitReturnStmt(this, context);
    };
    return ReturnStatement;
}(Statement));
export { ReturnStatement };
function ReturnStatement_tsickle_Closure_declarations() {
    /** @type {?} */
    ReturnStatement.prototype.value;
}
var AbstractClassPart = (function () {
    /**
     * @param {?} type
     * @param {?} modifiers
     */
    function AbstractClassPart(type, modifiers) {
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
        this.type = type || null;
    }
    /**
     * @param {?} modifier
     * @return {?}
     */
    AbstractClassPart.prototype.hasModifier = function (modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; };
    return AbstractClassPart;
}());
export { AbstractClassPart };
function AbstractClassPart_tsickle_Closure_declarations() {
    /** @type {?} */
    AbstractClassPart.prototype.type;
    /** @type {?} */
    AbstractClassPart.prototype.modifiers;
}
var ClassField = (function (_super) {
    tslib_1.__extends(ClassField, _super);
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} modifiers
     */
    function ClassField(name, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        return _this;
    }
    return ClassField;
}(AbstractClassPart));
export { ClassField };
function ClassField_tsickle_Closure_declarations() {
    /** @type {?} */
    ClassField.prototype.name;
}
var ClassMethod = (function (_super) {
    tslib_1.__extends(ClassMethod, _super);
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    function ClassMethod(name, params, body, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.params = params;
        _this.body = body;
        return _this;
    }
    return ClassMethod;
}(AbstractClassPart));
export { ClassMethod };
function ClassMethod_tsickle_Closure_declarations() {
    /** @type {?} */
    ClassMethod.prototype.name;
    /** @type {?} */
    ClassMethod.prototype.params;
    /** @type {?} */
    ClassMethod.prototype.body;
}
var ClassGetter = (function (_super) {
    tslib_1.__extends(ClassGetter, _super);
    /**
     * @param {?} name
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    function ClassGetter(name, body, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.body = body;
        return _this;
    }
    return ClassGetter;
}(AbstractClassPart));
export { ClassGetter };
function ClassGetter_tsickle_Closure_declarations() {
    /** @type {?} */
    ClassGetter.prototype.name;
    /** @type {?} */
    ClassGetter.prototype.body;
}
var ClassStmt = (function (_super) {
    tslib_1.__extends(ClassStmt, _super);
    /**
     * @param {?} name
     * @param {?} parent
     * @param {?} fields
     * @param {?} getters
     * @param {?} constructorMethod
     * @param {?} methods
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function ClassStmt(name, parent, fields, getters, constructorMethod, methods, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.parent = parent;
        _this.fields = fields;
        _this.getters = getters;
        _this.constructorMethod = constructorMethod;
        _this.methods = methods;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ClassStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
    };
    return ClassStmt;
}(Statement));
export { ClassStmt };
function ClassStmt_tsickle_Closure_declarations() {
    /** @type {?} */
    ClassStmt.prototype.name;
    /** @type {?} */
    ClassStmt.prototype.parent;
    /** @type {?} */
    ClassStmt.prototype.fields;
    /** @type {?} */
    ClassStmt.prototype.getters;
    /** @type {?} */
    ClassStmt.prototype.constructorMethod;
    /** @type {?} */
    ClassStmt.prototype.methods;
}
var IfStmt = (function (_super) {
    tslib_1.__extends(IfStmt, _super);
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     */
    function IfStmt(condition, trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = []; }
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.condition = condition;
        _this.trueCase = trueCase;
        _this.falseCase = falseCase;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    IfStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitIfStmt(this, context);
    };
    return IfStmt;
}(Statement));
export { IfStmt };
function IfStmt_tsickle_Closure_declarations() {
    /** @type {?} */
    IfStmt.prototype.condition;
    /** @type {?} */
    IfStmt.prototype.trueCase;
    /** @type {?} */
    IfStmt.prototype.falseCase;
}
var CommentStmt = (function (_super) {
    tslib_1.__extends(CommentStmt, _super);
    /**
     * @param {?} comment
     * @param {?=} sourceSpan
     */
    function CommentStmt(comment, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.comment = comment;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    CommentStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitCommentStmt(this, context);
    };
    return CommentStmt;
}(Statement));
export { CommentStmt };
function CommentStmt_tsickle_Closure_declarations() {
    /** @type {?} */
    CommentStmt.prototype.comment;
}
var TryCatchStmt = (function (_super) {
    tslib_1.__extends(TryCatchStmt, _super);
    /**
     * @param {?} bodyStmts
     * @param {?} catchStmts
     * @param {?=} sourceSpan
     */
    function TryCatchStmt(bodyStmts, catchStmts, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.bodyStmts = bodyStmts;
        _this.catchStmts = catchStmts;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    TryCatchStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
    };
    return TryCatchStmt;
}(Statement));
export { TryCatchStmt };
function TryCatchStmt_tsickle_Closure_declarations() {
    /** @type {?} */
    TryCatchStmt.prototype.bodyStmts;
    /** @type {?} */
    TryCatchStmt.prototype.catchStmts;
}
var ThrowStmt = (function (_super) {
    tslib_1.__extends(ThrowStmt, _super);
    /**
     * @param {?} error
     * @param {?=} sourceSpan
     */
    function ThrowStmt(error, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.error = error;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ThrowStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitThrowStmt(this, context);
    };
    return ThrowStmt;
}(Statement));
export { ThrowStmt };
function ThrowStmt_tsickle_Closure_declarations() {
    /** @type {?} */
    ThrowStmt.prototype.error;
}
/**
 * @record
 */
export function StatementVisitor() { }
function StatementVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    StatementVisitor.prototype.visitDeclareVarStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitDeclareFunctionStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitExpressionStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitReturnStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitDeclareClassStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitIfStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitTryCatchStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitThrowStmt;
    /** @type {?} */
    StatementVisitor.prototype.visitCommentStmt;
}
var AstTransformer = (function () {
    function AstTransformer() {
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.transformExpr = function (expr, context) { return expr; };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.transformStmt = function (stmt, context) { return stmt; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitReadVarExpr = function (ast, context) { return this.transformExpr(ast, context); };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitWriteVarExpr = function (expr, context) {
        return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitWriteKeyExpr = function (expr, context) {
        return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitWritePropExpr = function (expr, context) {
        return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitInvokeMethodExpr = function (ast, context) {
        var /** @type {?} */ method = ast.builtin || ast.name;
        return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), /** @type {?} */ ((method)), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitInvokeFunctionExpr = function (ast, context) {
        return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitInstantiateExpr = function (ast, context) {
        return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralExpr = function (ast, context) { return this.transformExpr(ast, context); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitExternalExpr = function (ast, context) {
        return this.transformExpr(ast, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitConditionalExpr = function (ast, context) {
        return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), /** @type {?} */ ((ast.falseCase)).visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitNotExpr = function (ast, context) {
        return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitAssertNotNullExpr = function (ast, context) {
        return this.transformExpr(new AssertNotNull(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitCastExpr = function (ast, context) {
        return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitFunctionExpr = function (ast, context) {
        return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitBinaryOperatorExpr = function (ast, context) {
        return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitReadPropExpr = function (ast, context) {
        return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitReadKeyExpr = function (ast, context) {
        return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralArrayExpr = function (ast, context) {
        return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        var /** @type {?} */ entries = ast.entries.map(function (entry) { return new LiteralMapEntry(entry.key, entry.value.visitExpression(_this, context), entry.quoted); });
        var /** @type {?} */ mapType = new MapType(ast.valueType, null);
        return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitCommaExpr = function (ast, context) {
        return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
    };
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        return exprs.map(function (expr) { return expr.visitExpression(_this, context); });
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitDeclareVarStmt = function (stmt, context) {
        return this.transformStmt(new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitExpressionStmt = function (stmt, context) {
        return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitReturnStmt = function (stmt, context) {
        return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        var /** @type {?} */ parent = ((stmt.parent)).visitExpression(this, context);
        var /** @type {?} */ getters = stmt.getters.map(function (getter) { return new ClassGetter(getter.name, _this.visitAllStatements(getter.body, context), getter.type, getter.modifiers); });
        var /** @type {?} */ ctorMethod = stmt.constructorMethod &&
            new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
        var /** @type {?} */ methods = stmt.methods.map(function (method) { return new ClassMethod(method.name, method.params, _this.visitAllStatements(method.body, context), method.type, method.modifiers); });
        return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitIfStmt = function (stmt, context) {
        return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitTryCatchStmt = function (stmt, context) {
        return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitThrowStmt = function (stmt, context) {
        return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitCommentStmt = function (stmt, context) {
        return this.transformStmt(stmt, context);
    };
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        return stmts.map(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return AstTransformer;
}());
export { AstTransformer };
var RecursiveAstVisitor = (function () {
    function RecursiveAstVisitor() {
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitReadVarExpr = function (ast, context) { return ast; };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitWriteVarExpr = function (expr, context) {
        expr.value.visitExpression(this, context);
        return expr;
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitWriteKeyExpr = function (expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.index.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitWritePropExpr = function (expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitInstantiateExpr = function (ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralExpr = function (ast, context) { return ast; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitExternalExpr = function (ast, context) { return ast; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitConditionalExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context); /** @type {?} */
        ((ast.falseCase)).visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitNotExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitAssertNotNullExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitCastExpr = function (ast, context) {
        ast.value.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitFunctionExpr = function (ast, context) {
        this.visitAllStatements(ast.statements, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitReadPropExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitReadKeyExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        ast.entries.forEach(function (entry) { return entry.value.visitExpression(_this, context); });
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitCommaExpr = function (ast, context) {
        this.visitAllExpressions(ast.parts, context);
    };
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        exprs.forEach(function (expr) { return expr.visitExpression(_this, context); });
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitDeclareVarStmt = function (stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitExpressionStmt = function (stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitReturnStmt = function (stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        ((stmt.parent)).visitExpression(this, context);
        stmt.getters.forEach(function (getter) { return _this.visitAllStatements(getter.body, context); });
        if (stmt.constructorMethod) {
            this.visitAllStatements(stmt.constructorMethod.body, context);
        }
        stmt.methods.forEach(function (method) { return _this.visitAllStatements(method.body, context); });
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitIfStmt = function (stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitTryCatchStmt = function (stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitThrowStmt = function (stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        stmts.forEach(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return RecursiveAstVisitor;
}());
export { RecursiveAstVisitor };
/**
 * @param {?} stmts
 * @return {?}
 */
export function findReadVarNames(stmts) {
    var /** @type {?} */ visitor = new _ReadVarVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.varNames;
}
var _ReadVarVisitor = (function (_super) {
    tslib_1.__extends(_ReadVarVisitor, _super);
    function _ReadVarVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.varNames = new Set();
        return _this;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    _ReadVarVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        // Don't descend into nested functions
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    _ReadVarVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        // Don't descend into nested classes
        return stmt;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _ReadVarVisitor.prototype.visitReadVarExpr = function (ast, context) {
        if (ast.name) {
            this.varNames.add(ast.name);
        }
        return null;
    };
    return _ReadVarVisitor;
}(RecursiveAstVisitor));
function _ReadVarVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    _ReadVarVisitor.prototype.varNames;
}
/**
 * @param {?} stmt
 * @param {?} sourceSpan
 * @return {?}
 */
export function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
    if (!sourceSpan) {
        return stmt;
    }
    var /** @type {?} */ transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return stmt.visitStatement(transformer, null);
}
/**
 * @param {?} expr
 * @param {?} sourceSpan
 * @return {?}
 */
export function applySourceSpanToExpressionIfNeeded(expr, sourceSpan) {
    if (!sourceSpan) {
        return expr;
    }
    var /** @type {?} */ transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return expr.visitExpression(transformer, null);
}
var _ApplySourceSpanTransformer = (function (_super) {
    tslib_1.__extends(_ApplySourceSpanTransformer, _super);
    /**
     * @param {?} sourceSpan
     */
    function _ApplySourceSpanTransformer(sourceSpan) {
        var _this = _super.call(this) || this;
        _this.sourceSpan = sourceSpan;
        return _this;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    _ApplySourceSpanTransformer.prototype._clone = function (obj) {
        var /** @type {?} */ clone = Object.create(obj.constructor.prototype);
        for (var /** @type {?} */ prop in obj) {
            clone[prop] = obj[prop];
        }
        return clone;
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    _ApplySourceSpanTransformer.prototype.transformExpr = function (expr, context) {
        if (!expr.sourceSpan) {
            expr = this._clone(expr);
            expr.sourceSpan = this.sourceSpan;
        }
        return expr;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    _ApplySourceSpanTransformer.prototype.transformStmt = function (stmt, context) {
        if (!stmt.sourceSpan) {
            stmt = this._clone(stmt);
            stmt.sourceSpan = this.sourceSpan;
        }
        return stmt;
    };
    return _ApplySourceSpanTransformer;
}(AstTransformer));
function _ApplySourceSpanTransformer_tsickle_Closure_declarations() {
    /** @type {?} */
    _ApplySourceSpanTransformer.prototype.sourceSpan;
}
/**
 * @param {?} name
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
export function variable(name, type, sourceSpan) {
    return new ReadVarExpr(name, type, sourceSpan);
}
/**
 * @param {?} id
 * @param {?=} typeParams
 * @param {?=} sourceSpan
 * @return {?}
 */
export function importExpr(id, typeParams, sourceSpan) {
    if (typeParams === void 0) { typeParams = null; }
    return new ExternalExpr(id, null, typeParams, sourceSpan);
}
/**
 * @param {?} id
 * @param {?=} typeParams
 * @param {?=} typeModifiers
 * @return {?}
 */
export function importType(id, typeParams, typeModifiers) {
    if (typeParams === void 0) { typeParams = null; }
    if (typeModifiers === void 0) { typeModifiers = null; }
    return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
}
/**
 * @param {?} expr
 * @param {?=} typeModifiers
 * @return {?}
 */
export function expressionType(expr, typeModifiers) {
    if (typeModifiers === void 0) { typeModifiers = null; }
    return expr != null ? ((new ExpressionType(expr, typeModifiers))) : null;
}
/**
 * @param {?} values
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
export function literalArr(values, type, sourceSpan) {
    return new LiteralArrayExpr(values, type, sourceSpan);
}
/**
 * @param {?} values
 * @param {?=} type
 * @return {?}
 */
export function literalMap(values, type) {
    if (type === void 0) { type = null; }
    return new LiteralMapExpr(values.map(function (e) { return new LiteralMapEntry(e.key, e.value, e.quoted); }), type, null);
}
/**
 * @param {?} expr
 * @param {?=} sourceSpan
 * @return {?}
 */
export function not(expr, sourceSpan) {
    return new NotExpr(expr, sourceSpan);
}
/**
 * @param {?} expr
 * @param {?=} sourceSpan
 * @return {?}
 */
export function assertNotNull(expr, sourceSpan) {
    return new AssertNotNull(expr, sourceSpan);
}
/**
 * @param {?} params
 * @param {?} body
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
export function fn(params, body, type, sourceSpan) {
    return new FunctionExpr(params, body, type, sourceSpan);
}
/**
 * @param {?} value
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
export function literal(value, type, sourceSpan) {
    return new LiteralExpr(value, type, sourceSpan);
}
//# sourceMappingURL=output_ast.js.map