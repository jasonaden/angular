/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
export { VERSION } from './version';
export { TemplateAst, TextAst, BoundTextAst, AttrAst, BoundElementPropertyAst, BoundEventAst, ReferenceAst, VariableAst, ElementAst, EmbeddedTemplateAst, BoundDirectivePropertyAst, DirectiveAst, ProviderAst, ProviderAstType, NgContentAst, PropertyBindingType, QueryMatch, TemplateAstVisitor, NullTemplateVisitor, RecursiveTemplateAstVisitor, templateVisitAll } from './template_parser/template_ast';
export { TEMPLATE_TRANSFORMS } from './template_parser/template_parser';
export { CompilerConfig } from './config';
export { CompileAnimationEntryMetadata, CompileAnimationStateMetadata, CompileAnimationStateDeclarationMetadata, CompileAnimationStateTransitionMetadata, CompileAnimationMetadata, CompileAnimationKeyframesSequenceMetadata, CompileAnimationStyleMetadata, CompileAnimationAnimateMetadata, CompileAnimationWithStepsMetadata, CompileAnimationSequenceMetadata, CompileAnimationGroupMetadata, identifierName, identifierModuleUrl, viewClassName, rendererTypeName, hostViewClassName, componentFactoryName, ProxyClass, CompileIdentifierMetadata, CompileSummaryKind, CompileTypeSummary, CompileDiDependencyMetadata, CompileProviderMetadata, CompileFactoryMetadata, tokenName, tokenReference, CompileTokenMetadata, CompileTypeMetadata, CompileQueryMetadata, CompileStylesheetMetadata, CompileTemplateSummary, CompileTemplateMetadata, CompileEntryComponentMetadata, CompileDirectiveSummary, CompileDirectiveMetadata, createHostComponentMeta, CompilePipeSummary, CompilePipeMetadata, CompileNgModuleSummary, CompileNgModuleMetadata, TransitiveCompileNgModuleMetadata, ProviderMeta, flatten, sourceUrl, templateSourceUrl, sharedStylesheetJitUrl, ngModuleJitUrl, templateJitUrl } from './compile_metadata';
export { createAotCompiler } from './aot/compiler_factory';
export { AotCompiler, NgAnalyzedModules, NgAnalyzeModulesHost, analyzeNgModules, analyzeAndValidateNgModules, extractProgramSymbols } from './aot/compiler';
export { GeneratedFile, toTypeScript } from './aot/generated_file';
export { AotCompilerOptions } from './aot/compiler_options';
export { AotCompilerHost } from './aot/compiler_host';
export { StaticReflector } from './aot/static_reflector';
export { StaticSymbol, StaticSymbolCache } from './aot/static_symbol';
export { ResolvedStaticSymbol, StaticSymbolResolverHost, StaticSymbolResolver, unescapeIdentifier } from './aot/static_symbol_resolver';
export { AotSummaryResolverHost, AotSummaryResolver } from './aot/summary_resolver';
export { AstPath } from './ast_path';
export { Summary, SummaryResolver, JitSummaryResolver } from './summary_resolver';
export { JitCompiler } from './jit/compiler';
export { COMPILER_PROVIDERS, JitCompilerFactory, platformCoreDynamic } from './jit/compiler_factory';
export { JitReflector } from './jit/jit_reflector';
export { CompileReflector } from './compile_reflector';
export { createUrlResolverWithoutPackagePrefix, createOfflineCompileUrlResolver, DEFAULT_PACKAGE_URL_PROVIDER, UrlResolver, getUrlScheme } from './url_resolver';
export { ResourceLoader } from './resource_loader';
export { DirectiveResolver } from './directive_resolver';
export { PipeResolver } from './pipe_resolver';
export { NgModuleResolver } from './ng_module_resolver';
export { DEFAULT_INTERPOLATION_CONFIG, InterpolationConfig } from './ml_parser/interpolation_config';
export { ElementSchemaRegistry } from './schema/element_schema_registry';
export { Extractor, ExtractorHost, I18NHtmlParser, MessageBundle, Serializer, Xliff, Xliff2, Xmb, Xtb } from './i18n/index';
export { PrenormalizedTemplateMetadata, DirectiveNormalizer } from './directive_normalizer';
export { ParserError, ParseSpan, AST, Quote, EmptyExpr, ImplicitReceiver, Chain, Conditional, PropertyRead, PropertyWrite, SafePropertyRead, KeyedRead, KeyedWrite, BindingPipe, LiteralPrimitive, LiteralArray, LiteralMap, Interpolation, Binary, PrefixNot, NonNullAssert, MethodCall, SafeMethodCall, FunctionCall, ASTWithSource, TemplateBinding, AstVisitor, NullAstVisitor, RecursiveAstVisitor, AstTransformer, visitAstChildren } from './expression_parser/ast';
export { TokenType, Lexer, Token, EOF, isIdentifier, isQuote } from './expression_parser/lexer';
export { SplitInterpolation, TemplateBindingParseResult, Parser, _ParseAST } from './expression_parser/parser';
export { ERROR_COLLECTOR_TOKEN, CompileMetadataResolver } from './metadata_resolver';
export { Node, Text, Expansion, ExpansionCase, Attribute, Element, Comment, Visitor, visitAll, RecursiveVisitor, findNode } from './ml_parser/ast';
export { ParseTreeResult, TreeError, HtmlParser } from './ml_parser/html_parser';
export { HtmlTagDefinition, getHtmlTagDefinition } from './ml_parser/html_tags';
export { TagContentType, TagDefinition, splitNsName, isNgContainer, isNgContent, isNgTemplate, getNsPrefix, mergeNsAndName, NAMED_ENTITIES } from './ml_parser/tags';
export { NgModuleCompiler } from './ng_module_compiler';
export { AssertNotNull, BinaryOperator, BinaryOperatorExpr, BuiltinMethod, BuiltinVar, CastExpr, ClassStmt, CommaExpr, CommentStmt, ConditionalExpr, DeclareFunctionStmt, DeclareVarStmt, ExpressionStatement, ExpressionVisitor, ExternalExpr, ExternalReference, FunctionExpr, IfStmt, InstantiateExpr, InvokeFunctionExpr, InvokeMethodExpr, LiteralArrayExpr, LiteralExpr, LiteralMapExpr, NotExpr, ReadKeyExpr, ReadPropExpr, ReadVarExpr, ReturnStatement, StatementVisitor, ThrowStmt, TryCatchStmt, WriteKeyExpr, WritePropExpr, WriteVarExpr, StmtModifier, Statement } from './output/output_ast';
export { EmitterVisitorContext } from './output/abstract_emitter';
export { debugOutputAstAsTypeScript, TypeScriptEmitter } from './output/ts_emitter';
export { ParseLocation, ParseSourceFile, ParseSourceSpan, ParseErrorLevel, ParseError, typeSourceSpan } from './parse_util';
export { DomElementSchemaRegistry } from './schema/dom_element_schema_registry';
export { CssSelector, SelectorMatcher, SelectorListContext, SelectorContext } from './selector';
export { StylesCompileDependency, CompiledStylesheet, StyleCompiler } from './style_compiler';
export { TemplateParseError, TemplateParseResult, TemplateParser, splitClasses, createElementCssSelector, removeSummaryDuplicates } from './template_parser/template_parser';
export { ViewCompiler } from './view_compiler/view_compiler';
export { getParseErrors, isSyntaxError, syntaxError } from './util';
// This file only reexports content of the `src` folder. Keep it that way.
//# sourceMappingURL=compiler.js.map