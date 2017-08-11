"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * Entry point for all APIs of the compiler package.
 *
 * <div class="callout is-critical">
 *   <header>Unstable APIs</header>
 *   <p>
 *     All compiler apis are currently considered experimental and private!
 *   </p>
 *   <p>
 *     We expect the APIs in this package to keep on changing. Do not rely on them.
 *   </p>
 * </div>
 */
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
__export(require("./template_parser/template_ast"));
var template_parser_1 = require("./template_parser/template_parser");
exports.TEMPLATE_TRANSFORMS = template_parser_1.TEMPLATE_TRANSFORMS;
var config_1 = require("./config");
exports.CompilerConfig = config_1.CompilerConfig;
__export(require("./compile_metadata"));
__export(require("./aot/compiler_factory"));
__export(require("./aot/compiler"));
__export(require("./aot/generated_file"));
__export(require("./aot/static_reflector"));
__export(require("./aot/static_symbol"));
__export(require("./aot/static_symbol_resolver"));
__export(require("./aot/summary_resolver"));
__export(require("./ast_path"));
__export(require("./summary_resolver"));
var compiler_1 = require("./jit/compiler");
exports.JitCompiler = compiler_1.JitCompiler;
__export(require("./jit/compiler_factory"));
__export(require("./jit/jit_reflector"));
__export(require("./compile_reflector"));
__export(require("./url_resolver"));
__export(require("./resource_loader"));
var directive_resolver_1 = require("./directive_resolver");
exports.DirectiveResolver = directive_resolver_1.DirectiveResolver;
var pipe_resolver_1 = require("./pipe_resolver");
exports.PipeResolver = pipe_resolver_1.PipeResolver;
var ng_module_resolver_1 = require("./ng_module_resolver");
exports.NgModuleResolver = ng_module_resolver_1.NgModuleResolver;
var interpolation_config_1 = require("./ml_parser/interpolation_config");
exports.DEFAULT_INTERPOLATION_CONFIG = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG;
exports.InterpolationConfig = interpolation_config_1.InterpolationConfig;
__export(require("./schema/element_schema_registry"));
__export(require("./i18n/index"));
__export(require("./directive_normalizer"));
__export(require("./expression_parser/ast"));
__export(require("./expression_parser/lexer"));
__export(require("./expression_parser/parser"));
__export(require("./metadata_resolver"));
__export(require("./ml_parser/ast"));
__export(require("./ml_parser/html_parser"));
__export(require("./ml_parser/html_tags"));
__export(require("./ml_parser/interpolation_config"));
__export(require("./ml_parser/tags"));
var ng_module_compiler_1 = require("./ng_module_compiler");
exports.NgModuleCompiler = ng_module_compiler_1.NgModuleCompiler;
var output_ast_1 = require("./output/output_ast");
exports.AssertNotNull = output_ast_1.AssertNotNull;
exports.BinaryOperator = output_ast_1.BinaryOperator;
exports.BinaryOperatorExpr = output_ast_1.BinaryOperatorExpr;
exports.BuiltinMethod = output_ast_1.BuiltinMethod;
exports.BuiltinVar = output_ast_1.BuiltinVar;
exports.CastExpr = output_ast_1.CastExpr;
exports.ClassStmt = output_ast_1.ClassStmt;
exports.CommaExpr = output_ast_1.CommaExpr;
exports.CommentStmt = output_ast_1.CommentStmt;
exports.ConditionalExpr = output_ast_1.ConditionalExpr;
exports.DeclareFunctionStmt = output_ast_1.DeclareFunctionStmt;
exports.DeclareVarStmt = output_ast_1.DeclareVarStmt;
exports.ExpressionStatement = output_ast_1.ExpressionStatement;
exports.ExternalExpr = output_ast_1.ExternalExpr;
exports.ExternalReference = output_ast_1.ExternalReference;
exports.FunctionExpr = output_ast_1.FunctionExpr;
exports.IfStmt = output_ast_1.IfStmt;
exports.InstantiateExpr = output_ast_1.InstantiateExpr;
exports.InvokeFunctionExpr = output_ast_1.InvokeFunctionExpr;
exports.InvokeMethodExpr = output_ast_1.InvokeMethodExpr;
exports.LiteralArrayExpr = output_ast_1.LiteralArrayExpr;
exports.LiteralExpr = output_ast_1.LiteralExpr;
exports.LiteralMapExpr = output_ast_1.LiteralMapExpr;
exports.NotExpr = output_ast_1.NotExpr;
exports.ReadKeyExpr = output_ast_1.ReadKeyExpr;
exports.ReadPropExpr = output_ast_1.ReadPropExpr;
exports.ReadVarExpr = output_ast_1.ReadVarExpr;
exports.ReturnStatement = output_ast_1.ReturnStatement;
exports.ThrowStmt = output_ast_1.ThrowStmt;
exports.TryCatchStmt = output_ast_1.TryCatchStmt;
exports.WriteKeyExpr = output_ast_1.WriteKeyExpr;
exports.WritePropExpr = output_ast_1.WritePropExpr;
exports.WriteVarExpr = output_ast_1.WriteVarExpr;
exports.StmtModifier = output_ast_1.StmtModifier;
exports.Statement = output_ast_1.Statement;
var abstract_emitter_1 = require("./output/abstract_emitter");
exports.EmitterVisitorContext = abstract_emitter_1.EmitterVisitorContext;
__export(require("./output/ts_emitter"));
__export(require("./parse_util"));
__export(require("./schema/dom_element_schema_registry"));
__export(require("./selector"));
__export(require("./style_compiler"));
__export(require("./template_parser/template_parser"));
var view_compiler_1 = require("./view_compiler/view_compiler");
exports.ViewCompiler = view_compiler_1.ViewCompiler;
var util_1 = require("./util");
exports.getParseErrors = util_1.getParseErrors;
exports.isSyntaxError = util_1.isSyntaxError;
exports.syntaxError = util_1.syntaxError;
// This file only reexports content of the `src` folder. Keep it that way.
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILHFDQUFrQztBQUExQiw0QkFBQSxPQUFPLENBQUE7QUFDZixvREFBK0M7QUFDL0MscUVBQXNFO0FBQTlELGdEQUFBLG1CQUFtQixDQUFBO0FBQzNCLG1DQUF3QztBQUFoQyxrQ0FBQSxjQUFjLENBQUE7QUFDdEIsd0NBQW1DO0FBQ25DLDRDQUF1QztBQUN2QyxvQ0FBK0I7QUFDL0IsMENBQXFDO0FBR3JDLDRDQUF1QztBQUN2Qyx5Q0FBb0M7QUFDcEMsa0RBQTZDO0FBQzdDLDRDQUF1QztBQUN2QyxnQ0FBMkI7QUFDM0Isd0NBQW1DO0FBQ25DLDJDQUEyQztBQUFuQyxpQ0FBQSxXQUFXLENBQUE7QUFDbkIsNENBQXVDO0FBQ3ZDLHlDQUFvQztBQUNwQyx5Q0FBb0M7QUFDcEMsb0NBQStCO0FBQy9CLHVDQUFrQztBQUNsQywyREFBdUQ7QUFBL0MsaURBQUEsaUJBQWlCLENBQUE7QUFDekIsaURBQTZDO0FBQXJDLHVDQUFBLFlBQVksQ0FBQTtBQUNwQiwyREFBc0Q7QUFBOUMsZ0RBQUEsZ0JBQWdCLENBQUE7QUFDeEIseUVBQW1HO0FBQTNGLDhEQUFBLDRCQUE0QixDQUFBO0FBQUUscURBQUEsbUJBQW1CLENBQUE7QUFDekQsc0RBQWlEO0FBQ2pELGtDQUE2QjtBQUM3Qiw0Q0FBdUM7QUFDdkMsNkNBQXdDO0FBQ3hDLCtDQUEwQztBQUMxQyxnREFBMkM7QUFDM0MseUNBQW9DO0FBQ3BDLHFDQUFnQztBQUNoQyw2Q0FBd0M7QUFDeEMsMkNBQXNDO0FBQ3RDLHNEQUFpRDtBQUNqRCxzQ0FBaUM7QUFDakMsMkRBQXNEO0FBQTlDLGdEQUFBLGdCQUFnQixDQUFBO0FBQ3hCLGtEQUEwa0I7QUFBbGtCLHFDQUFBLGFBQWEsQ0FBQTtBQUFFLHNDQUFBLGNBQWMsQ0FBQTtBQUFFLDBDQUFBLGtCQUFrQixDQUFBO0FBQUUscUNBQUEsYUFBYSxDQUFBO0FBQUUsa0NBQUEsVUFBVSxDQUFBO0FBQUUsZ0NBQUEsUUFBUSxDQUFBO0FBQUUsaUNBQUEsU0FBUyxDQUFBO0FBQUUsaUNBQUEsU0FBUyxDQUFBO0FBQUUsbUNBQUEsV0FBVyxDQUFBO0FBQUUsdUNBQUEsZUFBZSxDQUFBO0FBQUUsMkNBQUEsbUJBQW1CLENBQUE7QUFBRSxzQ0FBQSxjQUFjLENBQUE7QUFBRSwyQ0FBQSxtQkFBbUIsQ0FBQTtBQUFxQixvQ0FBQSxZQUFZLENBQUE7QUFBRSx5Q0FBQSxpQkFBaUIsQ0FBQTtBQUFFLG9DQUFBLFlBQVksQ0FBQTtBQUFFLDhCQUFBLE1BQU0sQ0FBQTtBQUFFLHVDQUFBLGVBQWUsQ0FBQTtBQUFFLDBDQUFBLGtCQUFrQixDQUFBO0FBQUUsd0NBQUEsZ0JBQWdCLENBQUE7QUFBRSx3Q0FBQSxnQkFBZ0IsQ0FBQTtBQUFFLG1DQUFBLFdBQVcsQ0FBQTtBQUFFLHNDQUFBLGNBQWMsQ0FBQTtBQUFFLCtCQUFBLE9BQU8sQ0FBQTtBQUFFLG1DQUFBLFdBQVcsQ0FBQTtBQUFFLG9DQUFBLFlBQVksQ0FBQTtBQUFFLG1DQUFBLFdBQVcsQ0FBQTtBQUFFLHVDQUFBLGVBQWUsQ0FBQTtBQUFvQixpQ0FBQSxTQUFTLENBQUE7QUFBRSxvQ0FBQSxZQUFZLENBQUE7QUFBRSxvQ0FBQSxZQUFZLENBQUE7QUFBRSxxQ0FBQSxhQUFhLENBQUE7QUFBRSxvQ0FBQSxZQUFZLENBQUE7QUFBRSxvQ0FBQSxZQUFZLENBQUE7QUFBRSxpQ0FBQSxTQUFTLENBQUE7QUFDN2lCLDhEQUFnRTtBQUF4RCxtREFBQSxxQkFBcUIsQ0FBQTtBQUM3Qix5Q0FBb0M7QUFDcEMsa0NBQTZCO0FBQzdCLDBEQUFxRDtBQUNyRCxnQ0FBMkI7QUFDM0Isc0NBQWlDO0FBQ2pDLHVEQUFrRDtBQUNsRCwrREFBMkQ7QUFBbkQsdUNBQUEsWUFBWSxDQUFBO0FBQ3BCLCtCQUFrRTtBQUExRCxnQ0FBQSxjQUFjLENBQUE7QUFBRSwrQkFBQSxhQUFhLENBQUE7QUFBRSw2QkFBQSxXQUFXLENBQUE7QUFDbEQsMEVBQTBFIn0=