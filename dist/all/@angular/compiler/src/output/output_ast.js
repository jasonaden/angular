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
Object.defineProperty(exports, "__esModule", { value: true });
//// Types
var TypeModifier;
(function (TypeModifier) {
    TypeModifier[TypeModifier["Const"] = 0] = "Const";
})(TypeModifier = exports.TypeModifier || (exports.TypeModifier = {}));
var Type = (function () {
    function Type(modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
    }
    Type.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
    return Type;
}());
exports.Type = Type;
var BuiltinTypeName;
(function (BuiltinTypeName) {
    BuiltinTypeName[BuiltinTypeName["Dynamic"] = 0] = "Dynamic";
    BuiltinTypeName[BuiltinTypeName["Bool"] = 1] = "Bool";
    BuiltinTypeName[BuiltinTypeName["String"] = 2] = "String";
    BuiltinTypeName[BuiltinTypeName["Int"] = 3] = "Int";
    BuiltinTypeName[BuiltinTypeName["Number"] = 4] = "Number";
    BuiltinTypeName[BuiltinTypeName["Function"] = 5] = "Function";
    BuiltinTypeName[BuiltinTypeName["Inferred"] = 6] = "Inferred";
})(BuiltinTypeName = exports.BuiltinTypeName || (exports.BuiltinTypeName = {}));
var BuiltinType = (function (_super) {
    __extends(BuiltinType, _super);
    function BuiltinType(name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.name = name;
        return _this;
    }
    BuiltinType.prototype.visitType = function (visitor, context) {
        return visitor.visitBuiltintType(this, context);
    };
    return BuiltinType;
}(Type));
exports.BuiltinType = BuiltinType;
var ExpressionType = (function (_super) {
    __extends(ExpressionType, _super);
    function ExpressionType(value, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.value = value;
        return _this;
    }
    ExpressionType.prototype.visitType = function (visitor, context) {
        return visitor.visitExpressionType(this, context);
    };
    return ExpressionType;
}(Type));
exports.ExpressionType = ExpressionType;
var ArrayType = (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(of, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.of = of;
        return _this;
    }
    ArrayType.prototype.visitType = function (visitor, context) {
        return visitor.visitArrayType(this, context);
    };
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
var MapType = (function (_super) {
    __extends(MapType, _super);
    function MapType(valueType, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.valueType = valueType || null;
        return _this;
    }
    MapType.prototype.visitType = function (visitor, context) { return visitor.visitMapType(this, context); };
    return MapType;
}(Type));
exports.MapType = MapType;
exports.DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
exports.INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
exports.BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
exports.INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
exports.NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
exports.STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
exports.FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
///// Expressions
var BinaryOperator;
(function (BinaryOperator) {
    BinaryOperator[BinaryOperator["Equals"] = 0] = "Equals";
    BinaryOperator[BinaryOperator["NotEquals"] = 1] = "NotEquals";
    BinaryOperator[BinaryOperator["Identical"] = 2] = "Identical";
    BinaryOperator[BinaryOperator["NotIdentical"] = 3] = "NotIdentical";
    BinaryOperator[BinaryOperator["Minus"] = 4] = "Minus";
    BinaryOperator[BinaryOperator["Plus"] = 5] = "Plus";
    BinaryOperator[BinaryOperator["Divide"] = 6] = "Divide";
    BinaryOperator[BinaryOperator["Multiply"] = 7] = "Multiply";
    BinaryOperator[BinaryOperator["Modulo"] = 8] = "Modulo";
    BinaryOperator[BinaryOperator["And"] = 9] = "And";
    BinaryOperator[BinaryOperator["Or"] = 10] = "Or";
    BinaryOperator[BinaryOperator["Lower"] = 11] = "Lower";
    BinaryOperator[BinaryOperator["LowerEquals"] = 12] = "LowerEquals";
    BinaryOperator[BinaryOperator["Bigger"] = 13] = "Bigger";
    BinaryOperator[BinaryOperator["BiggerEquals"] = 14] = "BiggerEquals";
})(BinaryOperator = exports.BinaryOperator || (exports.BinaryOperator = {}));
var Expression = (function () {
    function Expression(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
    }
    Expression.prototype.prop = function (name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
    };
    Expression.prototype.key = function (index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
    };
    Expression.prototype.callMethod = function (name, params, sourceSpan) {
        return new InvokeMethodExpr(this, name, params, null, sourceSpan);
    };
    Expression.prototype.callFn = function (params, sourceSpan) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan);
    };
    Expression.prototype.instantiate = function (params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
    };
    Expression.prototype.conditional = function (trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
    };
    Expression.prototype.equals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.notEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.identical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
    };
    Expression.prototype.notIdentical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
    };
    Expression.prototype.minus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
    };
    Expression.prototype.plus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
    };
    Expression.prototype.divide = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
    };
    Expression.prototype.multiply = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
    };
    Expression.prototype.modulo = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
    };
    Expression.prototype.and = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
    };
    Expression.prototype.or = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
    };
    Expression.prototype.lower = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
    };
    Expression.prototype.lowerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.bigger = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
    };
    Expression.prototype.biggerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
    };
    Expression.prototype.isBlank = function (sourceSpan) {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        // We use the typed null to allow strictNullChecks to narrow types.
        return this.equals(exports.TYPED_NULL_EXPR, sourceSpan);
    };
    Expression.prototype.cast = function (type, sourceSpan) {
        return new CastExpr(this, type, sourceSpan);
    };
    Expression.prototype.toStmt = function () { return new ExpressionStatement(this, null); };
    return Expression;
}());
exports.Expression = Expression;
var BuiltinVar;
(function (BuiltinVar) {
    BuiltinVar[BuiltinVar["This"] = 0] = "This";
    BuiltinVar[BuiltinVar["Super"] = 1] = "Super";
    BuiltinVar[BuiltinVar["CatchError"] = 2] = "CatchError";
    BuiltinVar[BuiltinVar["CatchStack"] = 3] = "CatchStack";
})(BuiltinVar = exports.BuiltinVar || (exports.BuiltinVar = {}));
var ReadVarExpr = (function (_super) {
    __extends(ReadVarExpr, _super);
    function ReadVarExpr(name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        if (typeof name === 'string') {
            _this.name = name;
            _this.builtin = null;
        }
        else {
            _this.name = null;
            _this.builtin = name;
        }
        return _this;
    }
    ReadVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    };
    ReadVarExpr.prototype.set = function (value) {
        if (!this.name) {
            throw new Error("Built in variable " + this.builtin + " can not be assigned to.");
        }
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
    };
    return ReadVarExpr;
}(Expression));
exports.ReadVarExpr = ReadVarExpr;
var WriteVarExpr = (function (_super) {
    __extends(WriteVarExpr, _super);
    function WriteVarExpr(name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    WriteVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    };
    WriteVarExpr.prototype.toDeclStmt = function (type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
    };
    return WriteVarExpr;
}(Expression));
exports.WriteVarExpr = WriteVarExpr;
var WriteKeyExpr = (function (_super) {
    __extends(WriteKeyExpr, _super);
    function WriteKeyExpr(receiver, index, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        _this.value = value;
        return _this;
    }
    WriteKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    };
    return WriteKeyExpr;
}(Expression));
exports.WriteKeyExpr = WriteKeyExpr;
var WritePropExpr = (function (_super) {
    __extends(WritePropExpr, _super);
    function WritePropExpr(receiver, name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    WritePropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    };
    return WritePropExpr;
}(Expression));
exports.WritePropExpr = WritePropExpr;
var BuiltinMethod;
(function (BuiltinMethod) {
    BuiltinMethod[BuiltinMethod["ConcatArray"] = 0] = "ConcatArray";
    BuiltinMethod[BuiltinMethod["SubscribeObservable"] = 1] = "SubscribeObservable";
    BuiltinMethod[BuiltinMethod["Bind"] = 2] = "Bind";
})(BuiltinMethod = exports.BuiltinMethod || (exports.BuiltinMethod = {}));
var InvokeMethodExpr = (function (_super) {
    __extends(InvokeMethodExpr, _super);
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
            _this.builtin = method;
        }
        return _this;
    }
    InvokeMethodExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
    };
    return InvokeMethodExpr;
}(Expression));
exports.InvokeMethodExpr = InvokeMethodExpr;
var InvokeFunctionExpr = (function (_super) {
    __extends(InvokeFunctionExpr, _super);
    function InvokeFunctionExpr(fn, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.fn = fn;
        _this.args = args;
        return _this;
    }
    InvokeFunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    };
    return InvokeFunctionExpr;
}(Expression));
exports.InvokeFunctionExpr = InvokeFunctionExpr;
var InstantiateExpr = (function (_super) {
    __extends(InstantiateExpr, _super);
    function InstantiateExpr(classExpr, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.classExpr = classExpr;
        _this.args = args;
        return _this;
    }
    InstantiateExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    };
    return InstantiateExpr;
}(Expression));
exports.InstantiateExpr = InstantiateExpr;
var LiteralExpr = (function (_super) {
    __extends(LiteralExpr, _super);
    function LiteralExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    LiteralExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    };
    return LiteralExpr;
}(Expression));
exports.LiteralExpr = LiteralExpr;
var ExternalExpr = (function (_super) {
    __extends(ExternalExpr, _super);
    function ExternalExpr(value, type, typeParams, sourceSpan) {
        if (typeParams === void 0) { typeParams = null; }
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        _this.typeParams = typeParams;
        return _this;
    }
    ExternalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitExternalExpr(this, context);
    };
    return ExternalExpr;
}(Expression));
exports.ExternalExpr = ExternalExpr;
var ExternalReference = (function () {
    function ExternalReference(moduleName, name, runtime) {
        this.moduleName = moduleName;
        this.name = name;
        this.runtime = runtime;
    }
    return ExternalReference;
}());
exports.ExternalReference = ExternalReference;
var ConditionalExpr = (function (_super) {
    __extends(ConditionalExpr, _super);
    function ConditionalExpr(condition, trueCase, falseCase, type, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        var _this = _super.call(this, type || trueCase.type, sourceSpan) || this;
        _this.condition = condition;
        _this.falseCase = falseCase;
        _this.trueCase = trueCase;
        return _this;
    }
    ConditionalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    };
    return ConditionalExpr;
}(Expression));
exports.ConditionalExpr = ConditionalExpr;
var NotExpr = (function (_super) {
    __extends(NotExpr, _super);
    function NotExpr(condition, sourceSpan) {
        var _this = _super.call(this, exports.BOOL_TYPE, sourceSpan) || this;
        _this.condition = condition;
        return _this;
    }
    NotExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitNotExpr(this, context);
    };
    return NotExpr;
}(Expression));
exports.NotExpr = NotExpr;
var AssertNotNull = (function (_super) {
    __extends(AssertNotNull, _super);
    function AssertNotNull(condition, sourceSpan) {
        var _this = _super.call(this, condition.type, sourceSpan) || this;
        _this.condition = condition;
        return _this;
    }
    AssertNotNull.prototype.visitExpression = function (visitor, context) {
        return visitor.visitAssertNotNullExpr(this, context);
    };
    return AssertNotNull;
}(Expression));
exports.AssertNotNull = AssertNotNull;
var CastExpr = (function (_super) {
    __extends(CastExpr, _super);
    function CastExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    CastExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCastExpr(this, context);
    };
    return CastExpr;
}(Expression));
exports.CastExpr = CastExpr;
var FnParam = (function () {
    function FnParam(name, type) {
        if (type === void 0) { type = null; }
        this.name = name;
        this.type = type;
    }
    return FnParam;
}());
exports.FnParam = FnParam;
var FunctionExpr = (function (_super) {
    __extends(FunctionExpr, _super);
    function FunctionExpr(params, statements, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.params = params;
        _this.statements = statements;
        return _this;
    }
    FunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    };
    FunctionExpr.prototype.toDeclStmt = function (name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
    };
    return FunctionExpr;
}(Expression));
exports.FunctionExpr = FunctionExpr;
var BinaryOperatorExpr = (function (_super) {
    __extends(BinaryOperatorExpr, _super);
    function BinaryOperatorExpr(operator, lhs, rhs, type, sourceSpan) {
        var _this = _super.call(this, type || lhs.type, sourceSpan) || this;
        _this.operator = operator;
        _this.rhs = rhs;
        _this.lhs = lhs;
        return _this;
    }
    BinaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    };
    return BinaryOperatorExpr;
}(Expression));
exports.BinaryOperatorExpr = BinaryOperatorExpr;
var ReadPropExpr = (function (_super) {
    __extends(ReadPropExpr, _super);
    function ReadPropExpr(receiver, name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
    }
    ReadPropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    };
    ReadPropExpr.prototype.set = function (value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
    };
    return ReadPropExpr;
}(Expression));
exports.ReadPropExpr = ReadPropExpr;
var ReadKeyExpr = (function (_super) {
    __extends(ReadKeyExpr, _super);
    function ReadKeyExpr(receiver, index, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        return _this;
    }
    ReadKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    };
    ReadKeyExpr.prototype.set = function (value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
    };
    return ReadKeyExpr;
}(Expression));
exports.ReadKeyExpr = ReadKeyExpr;
var LiteralArrayExpr = (function (_super) {
    __extends(LiteralArrayExpr, _super);
    function LiteralArrayExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        return _this;
    }
    LiteralArrayExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    };
    return LiteralArrayExpr;
}(Expression));
exports.LiteralArrayExpr = LiteralArrayExpr;
var LiteralMapEntry = (function () {
    function LiteralMapEntry(key, value, quoted) {
        this.key = key;
        this.value = value;
        this.quoted = quoted;
    }
    return LiteralMapEntry;
}());
exports.LiteralMapEntry = LiteralMapEntry;
var LiteralMapExpr = (function (_super) {
    __extends(LiteralMapExpr, _super);
    function LiteralMapExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        _this.valueType = null;
        if (type) {
            _this.valueType = type.valueType;
        }
        return _this;
    }
    LiteralMapExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    };
    return LiteralMapExpr;
}(Expression));
exports.LiteralMapExpr = LiteralMapExpr;
var CommaExpr = (function (_super) {
    __extends(CommaExpr, _super);
    function CommaExpr(parts, sourceSpan) {
        var _this = _super.call(this, parts[parts.length - 1].type, sourceSpan) || this;
        _this.parts = parts;
        return _this;
    }
    CommaExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCommaExpr(this, context);
    };
    return CommaExpr;
}(Expression));
exports.CommaExpr = CommaExpr;
exports.THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
exports.SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
exports.CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
exports.CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
exports.NULL_EXPR = new LiteralExpr(null, null, null);
exports.TYPED_NULL_EXPR = new LiteralExpr(null, exports.INFERRED_TYPE, null);
//// Statements
var StmtModifier;
(function (StmtModifier) {
    StmtModifier[StmtModifier["Final"] = 0] = "Final";
    StmtModifier[StmtModifier["Private"] = 1] = "Private";
    StmtModifier[StmtModifier["Exported"] = 2] = "Exported";
})(StmtModifier = exports.StmtModifier || (exports.StmtModifier = {}));
var Statement = (function () {
    function Statement(modifiers, sourceSpan) {
        this.modifiers = modifiers || [];
        this.sourceSpan = sourceSpan || null;
    }
    Statement.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
    return Statement;
}());
exports.Statement = Statement;
var DeclareVarStmt = (function (_super) {
    __extends(DeclareVarStmt, _super);
    function DeclareVarStmt(name, value, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        _this.type = type || value.type;
        return _this;
    }
    DeclareVarStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    };
    return DeclareVarStmt;
}(Statement));
exports.DeclareVarStmt = DeclareVarStmt;
var DeclareFunctionStmt = (function (_super) {
    __extends(DeclareFunctionStmt, _super);
    function DeclareFunctionStmt(name, params, statements, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.params = params;
        _this.statements = statements;
        _this.type = type || null;
        return _this;
    }
    DeclareFunctionStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    };
    return DeclareFunctionStmt;
}(Statement));
exports.DeclareFunctionStmt = DeclareFunctionStmt;
var ExpressionStatement = (function (_super) {
    __extends(ExpressionStatement, _super);
    function ExpressionStatement(expr, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.expr = expr;
        return _this;
    }
    ExpressionStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    };
    return ExpressionStatement;
}(Statement));
exports.ExpressionStatement = ExpressionStatement;
var ReturnStatement = (function (_super) {
    __extends(ReturnStatement, _super);
    function ReturnStatement(value, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    ReturnStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitReturnStmt(this, context);
    };
    return ReturnStatement;
}(Statement));
exports.ReturnStatement = ReturnStatement;
var AbstractClassPart = (function () {
    function AbstractClassPart(type, modifiers) {
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
        this.type = type || null;
    }
    AbstractClassPart.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
    return AbstractClassPart;
}());
exports.AbstractClassPart = AbstractClassPart;
var ClassField = (function (_super) {
    __extends(ClassField, _super);
    function ClassField(name, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        return _this;
    }
    return ClassField;
}(AbstractClassPart));
exports.ClassField = ClassField;
var ClassMethod = (function (_super) {
    __extends(ClassMethod, _super);
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
exports.ClassMethod = ClassMethod;
var ClassGetter = (function (_super) {
    __extends(ClassGetter, _super);
    function ClassGetter(name, body, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.body = body;
        return _this;
    }
    return ClassGetter;
}(AbstractClassPart));
exports.ClassGetter = ClassGetter;
var ClassStmt = (function (_super) {
    __extends(ClassStmt, _super);
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
    ClassStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
    };
    return ClassStmt;
}(Statement));
exports.ClassStmt = ClassStmt;
var IfStmt = (function (_super) {
    __extends(IfStmt, _super);
    function IfStmt(condition, trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = []; }
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.condition = condition;
        _this.trueCase = trueCase;
        _this.falseCase = falseCase;
        return _this;
    }
    IfStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitIfStmt(this, context);
    };
    return IfStmt;
}(Statement));
exports.IfStmt = IfStmt;
var CommentStmt = (function (_super) {
    __extends(CommentStmt, _super);
    function CommentStmt(comment, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.comment = comment;
        return _this;
    }
    CommentStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitCommentStmt(this, context);
    };
    return CommentStmt;
}(Statement));
exports.CommentStmt = CommentStmt;
var TryCatchStmt = (function (_super) {
    __extends(TryCatchStmt, _super);
    function TryCatchStmt(bodyStmts, catchStmts, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.bodyStmts = bodyStmts;
        _this.catchStmts = catchStmts;
        return _this;
    }
    TryCatchStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
    };
    return TryCatchStmt;
}(Statement));
exports.TryCatchStmt = TryCatchStmt;
var ThrowStmt = (function (_super) {
    __extends(ThrowStmt, _super);
    function ThrowStmt(error, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.error = error;
        return _this;
    }
    ThrowStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitThrowStmt(this, context);
    };
    return ThrowStmt;
}(Statement));
exports.ThrowStmt = ThrowStmt;
var AstTransformer = (function () {
    function AstTransformer() {
    }
    AstTransformer.prototype.transformExpr = function (expr, context) { return expr; };
    AstTransformer.prototype.transformStmt = function (stmt, context) { return stmt; };
    AstTransformer.prototype.visitReadVarExpr = function (ast, context) { return this.transformExpr(ast, context); };
    AstTransformer.prototype.visitWriteVarExpr = function (expr, context) {
        return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    AstTransformer.prototype.visitWriteKeyExpr = function (expr, context) {
        return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    AstTransformer.prototype.visitWritePropExpr = function (expr, context) {
        return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    AstTransformer.prototype.visitInvokeMethodExpr = function (ast, context) {
        var method = ast.builtin || ast.name;
        return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), method, this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitInvokeFunctionExpr = function (ast, context) {
        return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitInstantiateExpr = function (ast, context) {
        return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitLiteralExpr = function (ast, context) { return this.transformExpr(ast, context); };
    AstTransformer.prototype.visitExternalExpr = function (ast, context) {
        return this.transformExpr(ast, context);
    };
    AstTransformer.prototype.visitConditionalExpr = function (ast, context) {
        return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ast.falseCase.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitNotExpr = function (ast, context) {
        return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitAssertNotNullExpr = function (ast, context) {
        return this.transformExpr(new AssertNotNull(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitCastExpr = function (ast, context) {
        return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitFunctionExpr = function (ast, context) {
        return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitBinaryOperatorExpr = function (ast, context) {
        return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitReadPropExpr = function (ast, context) {
        return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitReadKeyExpr = function (ast, context) {
        return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitLiteralArrayExpr = function (ast, context) {
        return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        var entries = ast.entries.map(function (entry) { return new LiteralMapEntry(entry.key, entry.value.visitExpression(_this, context), entry.quoted); });
        var mapType = new MapType(ast.valueType, null);
        return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitCommaExpr = function (ast, context) {
        return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
    };
    AstTransformer.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        return exprs.map(function (expr) { return expr.visitExpression(_this, context); });
    };
    AstTransformer.prototype.visitDeclareVarStmt = function (stmt, context) {
        return this.transformStmt(new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitExpressionStmt = function (stmt, context) {
        return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitReturnStmt = function (stmt, context) {
        return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        var parent = stmt.parent.visitExpression(this, context);
        var getters = stmt.getters.map(function (getter) { return new ClassGetter(getter.name, _this.visitAllStatements(getter.body, context), getter.type, getter.modifiers); });
        var ctorMethod = stmt.constructorMethod &&
            new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
        var methods = stmt.methods.map(function (method) { return new ClassMethod(method.name, method.params, _this.visitAllStatements(method.body, context), method.type, method.modifiers); });
        return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitIfStmt = function (stmt, context) {
        return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitTryCatchStmt = function (stmt, context) {
        return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitThrowStmt = function (stmt, context) {
        return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan), context);
    };
    AstTransformer.prototype.visitCommentStmt = function (stmt, context) {
        return this.transformStmt(stmt, context);
    };
    AstTransformer.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        return stmts.map(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return AstTransformer;
}());
exports.AstTransformer = AstTransformer;
var RecursiveAstVisitor = (function () {
    function RecursiveAstVisitor() {
    }
    RecursiveAstVisitor.prototype.visitReadVarExpr = function (ast, context) { return ast; };
    RecursiveAstVisitor.prototype.visitWriteVarExpr = function (expr, context) {
        expr.value.visitExpression(this, context);
        return expr;
    };
    RecursiveAstVisitor.prototype.visitWriteKeyExpr = function (expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.index.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    };
    RecursiveAstVisitor.prototype.visitWritePropExpr = function (expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    };
    RecursiveAstVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitInstantiateExpr = function (ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitLiteralExpr = function (ast, context) { return ast; };
    RecursiveAstVisitor.prototype.visitExternalExpr = function (ast, context) { return ast; };
    RecursiveAstVisitor.prototype.visitConditionalExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context);
        ast.falseCase.visitExpression(this, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitNotExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitAssertNotNullExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitCastExpr = function (ast, context) {
        ast.value.visitExpression(this, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitFunctionExpr = function (ast, context) {
        this.visitAllStatements(ast.statements, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitReadPropExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitReadKeyExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return ast;
    };
    RecursiveAstVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        ast.entries.forEach(function (entry) { return entry.value.visitExpression(_this, context); });
        return ast;
    };
    RecursiveAstVisitor.prototype.visitCommaExpr = function (ast, context) {
        this.visitAllExpressions(ast.parts, context);
    };
    RecursiveAstVisitor.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        exprs.forEach(function (expr) { return expr.visitExpression(_this, context); });
    };
    RecursiveAstVisitor.prototype.visitDeclareVarStmt = function (stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitExpressionStmt = function (stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitReturnStmt = function (stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        stmt.parent.visitExpression(this, context);
        stmt.getters.forEach(function (getter) { return _this.visitAllStatements(getter.body, context); });
        if (stmt.constructorMethod) {
            this.visitAllStatements(stmt.constructorMethod.body, context);
        }
        stmt.methods.forEach(function (method) { return _this.visitAllStatements(method.body, context); });
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitIfStmt = function (stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitTryCatchStmt = function (stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitThrowStmt = function (stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
    };
    RecursiveAstVisitor.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
    RecursiveAstVisitor.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        stmts.forEach(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return RecursiveAstVisitor;
}());
exports.RecursiveAstVisitor = RecursiveAstVisitor;
function findReadVarNames(stmts) {
    var visitor = new _ReadVarVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.varNames;
}
exports.findReadVarNames = findReadVarNames;
var _ReadVarVisitor = (function (_super) {
    __extends(_ReadVarVisitor, _super);
    function _ReadVarVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.varNames = new Set();
        return _this;
    }
    _ReadVarVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        // Don't descend into nested functions
        return stmt;
    };
    _ReadVarVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        // Don't descend into nested classes
        return stmt;
    };
    _ReadVarVisitor.prototype.visitReadVarExpr = function (ast, context) {
        if (ast.name) {
            this.varNames.add(ast.name);
        }
        return null;
    };
    return _ReadVarVisitor;
}(RecursiveAstVisitor));
function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
    if (!sourceSpan) {
        return stmt;
    }
    var transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return stmt.visitStatement(transformer, null);
}
exports.applySourceSpanToStatementIfNeeded = applySourceSpanToStatementIfNeeded;
function applySourceSpanToExpressionIfNeeded(expr, sourceSpan) {
    if (!sourceSpan) {
        return expr;
    }
    var transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return expr.visitExpression(transformer, null);
}
exports.applySourceSpanToExpressionIfNeeded = applySourceSpanToExpressionIfNeeded;
var _ApplySourceSpanTransformer = (function (_super) {
    __extends(_ApplySourceSpanTransformer, _super);
    function _ApplySourceSpanTransformer(sourceSpan) {
        var _this = _super.call(this) || this;
        _this.sourceSpan = sourceSpan;
        return _this;
    }
    _ApplySourceSpanTransformer.prototype._clone = function (obj) {
        var clone = Object.create(obj.constructor.prototype);
        for (var prop in obj) {
            clone[prop] = obj[prop];
        }
        return clone;
    };
    _ApplySourceSpanTransformer.prototype.transformExpr = function (expr, context) {
        if (!expr.sourceSpan) {
            expr = this._clone(expr);
            expr.sourceSpan = this.sourceSpan;
        }
        return expr;
    };
    _ApplySourceSpanTransformer.prototype.transformStmt = function (stmt, context) {
        if (!stmt.sourceSpan) {
            stmt = this._clone(stmt);
            stmt.sourceSpan = this.sourceSpan;
        }
        return stmt;
    };
    return _ApplySourceSpanTransformer;
}(AstTransformer));
function variable(name, type, sourceSpan) {
    return new ReadVarExpr(name, type, sourceSpan);
}
exports.variable = variable;
function importExpr(id, typeParams, sourceSpan) {
    if (typeParams === void 0) { typeParams = null; }
    return new ExternalExpr(id, null, typeParams, sourceSpan);
}
exports.importExpr = importExpr;
function importType(id, typeParams, typeModifiers) {
    if (typeParams === void 0) { typeParams = null; }
    if (typeModifiers === void 0) { typeModifiers = null; }
    return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
}
exports.importType = importType;
function expressionType(expr, typeModifiers) {
    if (typeModifiers === void 0) { typeModifiers = null; }
    return expr != null ? new ExpressionType(expr, typeModifiers) : null;
}
exports.expressionType = expressionType;
function literalArr(values, type, sourceSpan) {
    return new LiteralArrayExpr(values, type, sourceSpan);
}
exports.literalArr = literalArr;
function literalMap(values, type) {
    if (type === void 0) { type = null; }
    return new LiteralMapExpr(values.map(function (e) { return new LiteralMapEntry(e.key, e.value, e.quoted); }), type, null);
}
exports.literalMap = literalMap;
function not(expr, sourceSpan) {
    return new NotExpr(expr, sourceSpan);
}
exports.not = not;
function assertNotNull(expr, sourceSpan) {
    return new AssertNotNull(expr, sourceSpan);
}
exports.assertNotNull = assertNotNull;
function fn(params, body, type, sourceSpan) {
    return new FunctionExpr(params, body, type, sourceSpan);
}
exports.fn = fn;
function literal(value, type, sourceSpan) {
    return new LiteralExpr(value, type, sourceSpan);
}
exports.literal = literal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFLSCxVQUFVO0FBQ1YsSUFBWSxZQUVYO0FBRkQsV0FBWSxZQUFZO0lBQ3RCLGlEQUFLLENBQUE7QUFDUCxDQUFDLEVBRlcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFFdkI7QUFFRDtJQUNFLGNBQW1CLFNBQXFDO1FBQXJDLDBCQUFBLEVBQUEsZ0JBQXFDO1FBQXJDLGNBQVMsR0FBVCxTQUFTLENBQTRCO1FBQ3RELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBR0QsMEJBQVcsR0FBWCxVQUFZLFFBQXNCLElBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRyxXQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFUcUIsb0JBQUk7QUFXMUIsSUFBWSxlQVFYO0FBUkQsV0FBWSxlQUFlO0lBQ3pCLDJEQUFPLENBQUE7SUFDUCxxREFBSSxDQUFBO0lBQ0oseURBQU0sQ0FBQTtJQUNOLG1EQUFHLENBQUE7SUFDSCx5REFBTSxDQUFBO0lBQ04sNkRBQVEsQ0FBQTtJQUNSLDZEQUFRLENBQUE7QUFDVixDQUFDLEVBUlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFRMUI7QUFFRDtJQUFpQywrQkFBSTtJQUNuQyxxQkFBbUIsSUFBcUIsRUFBRSxTQUFxQztRQUFyQywwQkFBQSxFQUFBLGdCQUFxQztRQUEvRSxZQUNFLGtCQUFNLFNBQVMsQ0FB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