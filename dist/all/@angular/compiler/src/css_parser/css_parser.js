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
var chars = require("../chars");
var parse_util_1 = require("../parse_util");
var css_ast_1 = require("./css_ast");
var css_lexer_1 = require("./css_lexer");
var SPACE_OPERATOR = ' ';
var css_lexer_2 = require("./css_lexer");
exports.CssToken = css_lexer_2.CssToken;
var css_ast_2 = require("./css_ast");
exports.BlockType = css_ast_2.BlockType;
var SLASH_CHARACTER = '/';
var GT_CHARACTER = '>';
var TRIPLE_GT_OPERATOR_STR = '>>>';
var DEEP_OPERATOR_STR = '/deep/';
var EOF_DELIM_FLAG = 1;
var RBRACE_DELIM_FLAG = 2;
var LBRACE_DELIM_FLAG = 4;
var COMMA_DELIM_FLAG = 8;
var COLON_DELIM_FLAG = 16;
var SEMICOLON_DELIM_FLAG = 32;
var NEWLINE_DELIM_FLAG = 64;
var RPAREN_DELIM_FLAG = 128;
var LPAREN_DELIM_FLAG = 256;
var SPACE_DELIM_FLAG = 512;
function _pseudoSelectorSupportsInnerSelectors(name) {
    return ['not', 'host', 'host-context'].indexOf(name) >= 0;
}
function isSelectorOperatorCharacter(code) {
    switch (code) {
        case chars.$SLASH:
        case chars.$TILDA:
        case chars.$PLUS:
        case chars.$GT:
            return true;
        default:
            return chars.isWhitespace(code);
    }
}
function getDelimFromCharacter(code) {
    switch (code) {
        case chars.$EOF:
            return EOF_DELIM_FLAG;
        case chars.$COMMA:
            return COMMA_DELIM_FLAG;
        case chars.$COLON:
            return COLON_DELIM_FLAG;
        case chars.$SEMICOLON:
            return SEMICOLON_DELIM_FLAG;
        case chars.$RBRACE:
            return RBRACE_DELIM_FLAG;
        case chars.$LBRACE:
            return LBRACE_DELIM_FLAG;
        case chars.$RPAREN:
            return RPAREN_DELIM_FLAG;
        case chars.$SPACE:
        case chars.$TAB:
            return SPACE_DELIM_FLAG;
        default:
            return css_lexer_1.isNewline(code) ? NEWLINE_DELIM_FLAG : 0;
    }
}
function characterContainsDelimiter(code, delimiters) {
    return (getDelimFromCharacter(code) & delimiters) > 0;
}
var ParsedCssResult = (function () {
    function ParsedCssResult(errors, ast) {
        this.errors = errors;
        this.ast = ast;
    }
    return ParsedCssResult;
}());
exports.ParsedCssResult = ParsedCssResult;
var CssParser = (function () {
    function CssParser() {
        this._errors = [];
    }
    /**
     * @param css the CSS code that will be parsed
     * @param url the name of the CSS file containing the CSS source code
     */
    CssParser.prototype.parse = function (css, url) {
        var lexer = new css_lexer_1.CssLexer();
        this._file = new parse_util_1.ParseSourceFile(css, url);
        this._scanner = lexer.scan(css, false);
        var ast = this._parseStyleSheet(EOF_DELIM_FLAG);
        var errors = this._errors;
        this._errors = [];
        var result = new ParsedCssResult(errors, ast);
        this._file = null;
        this._scanner = null;
        return result;
    };
    /** @internal */
    CssParser.prototype._parseStyleSheet = function (delimiters) {
        var results = [];
        this._scanner.consumeEmptyStatements();
        while (this._scanner.peek != chars.$EOF) {
            this._scanner.setMode(css_lexer_1.CssLexerMode.BLOCK);
            results.push(this._parseRule(delimiters));
        }
        var span = null;
        if (results.length > 0) {
            var firstRule = results[0];
            // we collect the last token like so incase there was an
            // EOF token that was emitted sometime during the lexing
            span = this._generateSourceSpan(firstRule, this._lastToken);
        }
        return new css_ast_1.CssStyleSheetAst(span, results);
    };
    /** @internal */
    CssParser.prototype._getSourceContent = function () { return this._scanner != null ? this._scanner.input : ''; };
    /** @internal */
    CssParser.prototype._extractSourceContent = function (start, end) {
        return this._getSourceContent().substring(start, end + 1);
    };
    /** @internal */
    CssParser.prototype._generateSourceSpan = function (start, end) {
        if (end === void 0) { end = null; }
        var startLoc;
        if (start instanceof css_ast_1.CssAst) {
            startLoc = start.location.start;
        }
        else {
            var token = start;
            if (token == null) {
                // the data here is invalid, however, if and when this does
                // occur, any other errors associated with this will be collected
                token = this._lastToken;
            }
            startLoc = new parse_util_1.ParseLocation(this._file, token.index, token.line, token.column);
        }
        if (end == null) {
            end = this._lastToken;
        }
        var endLine = -1;
        var endColumn = -1;
        var endIndex = -1;
        if (end instanceof css_ast_1.CssAst) {
            endLine = end.location.end.line;
            endColumn = end.location.end.col;
            endIndex = end.location.end.offset;
        }
        else if (end instanceof css_lexer_1.CssToken) {
            endLine = end.line;
            endColumn = end.column;
            endIndex = end.index;
        }
        var endLoc = new parse_util_1.ParseLocation(this._file, endIndex, endLine, endColumn);
        return new parse_util_1.ParseSourceSpan(startLoc, endLoc);
    };
    /** @internal */
    CssParser.prototype._resolveBlockType = function (token) {
        switch (token.strValue) {
            case '@-o-keyframes':
            case '@-moz-keyframes':
            case '@-webkit-keyframes':
            case '@keyframes':
                return css_ast_1.BlockType.Keyframes;
            case '@charset':
                return css_ast_1.BlockType.Charset;
            case '@import':
                return css_ast_1.BlockType.Import;
            case '@namespace':
                return css_ast_1.BlockType.Namespace;
            case '@page':
                return css_ast_1.BlockType.Page;
            case '@document':
                return css_ast_1.BlockType.Document;
            case '@media':
                return css_ast_1.BlockType.MediaQuery;
            case '@font-face':
                return css_ast_1.BlockType.FontFace;
            case '@viewport':
                return css_ast_1.BlockType.Viewport;
            case '@supports':
                return css_ast_1.BlockType.Supports;
            default:
                return css_ast_1.BlockType.Unsupported;
        }
    };
    /** @internal */
    CssParser.prototype._parseRule = function (delimiters) {
        if (this._scanner.peek == chars.$AT) {
            return this._parseAtRule(delimiters);
        }
        return this._parseSelectorRule(delimiters);
    };
    /** @internal */
    CssParser.prototype._parseAtRule = function (delimiters) {
        var start = this._getScannerIndex();
        this._scanner.setMode(css_lexer_1.CssLexerMode.BLOCK);
        var token = this._scan();
        var startToken = token;
        this._assertCondition(token.type == css_lexer_1.CssTokenType.AtKeyword, "The CSS Rule " + token.strValue + " is not a valid [@] rule.", token);
        var block;
        var type = this._resolveBlockType(token);
        var span;
        var tokens;
        var endToken;
        var end;
        var strValue;
        var query;
        switch (type) {
            case css_ast_1.BlockType.Charset:
            case css_ast_1.BlockType.Namespace:
            case css_ast_1.BlockType.Import:
                var value = this._parseValue(delimiters);
                this._scanner.setMode(css_lexer_1.CssLexerMode.BLOCK);
                this._scanner.consumeEmptyStatements();
                span = this._generateSourceSpan(startToken, value);
                return new css_ast_1.CssInlineRuleAst(span, type, value);
            case css_ast_1.BlockType.Viewport:
            case css_ast_1.BlockType.FontFace:
                block = this._parseStyleBlock(delimiters);
                span = this._generateSourceSpan(startToken, block);
                return new css_ast_1.CssBlockRuleAst(span, type, block);
            case css_ast_1.BlockType.Keyframes:
                tokens = this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG);
                // keyframes only have one identifier name
                var name_1 = tokens[0];
                block = this._parseKeyframeBlock(delimiters);
                span = this._generateSourceSpan(startToken, block);
                return new css_ast_1.CssKeyframeRuleAst(span, name_1, block);
            case css_ast_1.BlockType.MediaQuery:
                this._scanner.setMode(css_lexer_1.CssLexerMode.MEDIA_QUERY);
                tokens = this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG);
                endToken = tokens[tokens.length - 1];
                // we do not track the whitespace after the mediaQuery predicate ends
                // so we have to calculate the end string value on our own
                end = endToken.index + endToken.strValue.length - 1;
                strValue = this._extractSourceContent(start, end);
                span = this._generateSourceSpan(startToken, endToken);
                query = new css_ast_1.CssAtRulePredicateAst(span, strValue, tokens);
                block = this._parseBlock(delimiters);
                strValue = this._extractSourceContent(start, this._getScannerIndex() - 1);
                span = this._generateSourceSpan(startToken, block);
                return new css_ast_1.CssMediaQueryRuleAst(span, strValue, query, block);
            case css_ast_1.BlockType.Document:
            case css_ast_1.BlockType.Supports:
            case css_ast_1.BlockType.Page:
                this._scanner.setMode(css_lexer_1.CssLexerMode.AT_RULE_QUERY);
                tokens = this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG);
                endToken = tokens[tokens.length - 1];
                // we do not track the whitespace after this block rule predicate ends
                // so we have to calculate the end string value on our own
                end = endToken.index + endToken.strValue.length - 1;
                strValue = this._extractSourceContent(start, end);
                span = this._generateSourceSpan(startToken, tokens[tokens.length - 1]);
                query = new css_ast_1.CssAtRulePredicateAst(span, strValue, tokens);
                block = this._parseBlock(delimiters);
                strValue = this._extractSourceContent(start, block.end.offset);
                span = this._generateSourceSpan(startToken, block);
                return new css_ast_1.CssBlockDefinitionRuleAst(span, strValue, type, query, block);
            // if a custom @rule { ... } is used it should still tokenize the insides
            default:
                var listOfTokens_1 = [];
                var tokenName = token.strValue;
                this._scanner.setMode(css_lexer_1.CssLexerMode.ALL);
                this._error(css_lexer_1.generateErrorMessage(this._getSourceContent(), "The CSS \"at\" rule \"" + tokenName + "\" is not allowed to used here", token.strValue, token.index, token.line, token.column), token);
                this._collectUntilDelim(delimiters | LBRACE_DELIM_FLAG | SEMICOLON_DELIM_FLAG)
                    .forEach(function (token) { listOfTokens_1.push(token); });
                if (this._scanner.peek == chars.$LBRACE) {
                    listOfTokens_1.push(this._consume(css_lexer_1.CssTokenType.Character, '{'));
                    this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG)
                        .forEach(function (token) { listOfTokens_1.push(token); });
                    listOfTokens_1.push(this._consume(css_lexer_1.CssTokenType.Character, '}'));
                }
                endToken = listOfTokens_1[listOfTokens_1.length - 1];
                span = this._generateSourceSpan(startToken, endToken);
                return new css_ast_1.CssUnknownRuleAst(span, tokenName, listOfTokens_1);
        }
    };
    /** @internal */
    CssParser.prototype._parseSelectorRule = function (delimiters) {
        var start = this._getScannerIndex();
        var selectors = this._parseSelectors(delimiters);
        var block = this._parseStyleBlock(delimiters);
        var ruleAst;
        var span;
        var startSelector = selectors[0];
        if (block != null) {
            span = this._generateSourceSpan(startSelector, block);
            ruleAst = new css_ast_1.CssSelectorRuleAst(span, selectors, block);
        }
        else {
            var name_2 = this._extractSourceContent(start, this._getScannerIndex() - 1);
            var innerTokens_1 = [];
            selectors.forEach(function (selector) {
                selector.selectorParts.forEach(function (part) {
                    part.tokens.forEach(function (token) { innerTokens_1.push(token); });
                });
            });
            var endToken = innerTokens_1[innerTokens_1.length - 1];
            span = this._generateSourceSpan(startSelector, endToken);
            ruleAst = new css_ast_1.CssUnknownTokenListAst(span, name_2, innerTokens_1);
        }
        this._scanner.setMode(css_lexer_1.CssLexerMode.BLOCK);
        this._scanner.consumeEmptyStatements();
        return ruleAst;
    };
    /** @internal */
    CssParser.prototype._parseSelectors = function (delimiters) {
        delimiters |= LBRACE_DELIM_FLAG | SEMICOLON_DELIM_FLAG;
        var selectors = [];
        var isParsingSelectors = true;
        while (isParsingSelectors) {
            selectors.push(this._parseSelector(delimiters));
            isParsingSelectors = !characterContainsDelimiter(this._scanner.peek, delimiters);
            if (isParsingSelectors) {
                this._consume(css_lexer_1.CssTokenType.Character, ',');
                isParsingSelectors = !characterContainsDelimiter(this._scanner.peek, delimiters);
                if (isParsingSelectors) {
                    this._scanner.consumeWhitespace();
                }
            }
        }
        return selectors;
    };
    /** @internal */
    CssParser.prototype._scan = function () {
        var output = this._scanner.scan();
        var token = output.token;
        var error = output.error;
        if (error != null) {
            this._error(css_lexer_1.getRawMessage(error), token);
        }
        this._lastToken = token;
        return token;
    };
    /** @internal */
    CssParser.prototype._getScannerIndex = function () { return this._scanner.index; };
    /** @internal */
    CssParser.prototype._consume = function (type, value) {
        if (value === void 0) { value = null; }
        var output = this._scanner.consume(type, value);
        var token = output.token;
        var error = output.error;
        if (error != null) {
            this._error(css_lexer_1.getRawMessage(error), token);
        }
        this._lastToken = token;
        return token;
    };
    /** @internal */
    CssParser.prototype._parseKeyframeBlock = function (delimiters) {
        delimiters |= RBRACE_DELIM_FLAG;
        this._scanner.setMode(css_lexer_1.CssLexerMode.KEYFRAME_BLOCK);
        var startToken = this._consume(css_lexer_1.CssTokenType.Character, '{');
        var definitions = [];
        while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            definitions.push(this._parseKeyframeDefinition(delimiters));
        }
        var endToken = this._consume(css_lexer_1.CssTokenType.Character, '}');
        var span = this._generateSourceSpan(startToken, endToken);
        return new css_ast_1.CssBlockAst(span, definitions);
    };
    /** @internal */
    CssParser.prototype._parseKeyframeDefinition = function (delimiters) {
        var start = this._getScannerIndex();
        var stepTokens = [];
        delimiters |= LBRACE_DELIM_FLAG;
        while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            stepTokens.push(this._parseKeyframeLabel(delimiters | COMMA_DELIM_FLAG));
            if (this._scanner.peek != chars.$LBRACE) {
                this._consume(css_lexer_1.CssTokenType.Character, ',');
            }
        }
        var stylesBlock = this._parseStyleBlock(delimiters | RBRACE_DELIM_FLAG);
        var span = this._generateSourceSpan(stepTokens[0], stylesBlock);
        var ast = new css_ast_1.CssKeyframeDefinitionAst(span, stepTokens, stylesBlock);
        this._scanner.setMode(css_lexer_1.CssLexerMode.BLOCK);
        return ast;
    };
    /** @internal */
    CssParser.prototype._parseKeyframeLabel = function (delimiters) {
        this._scanner.setMode(css_lexer_1.CssLexerMode.KEYFRAME_BLOCK);
        return css_ast_1.mergeTokens(this._collectUntilDelim(delimiters));
    };
    /** @internal */
    CssParser.prototype._parsePseudoSelector = function (delimiters) {
        var start = this._getScannerIndex();
        delimiters &= ~COMMA_DELIM_FLAG;
        // we keep the original value since we may use it to recurse when :not, :host are used
        var startingDelims = delimiters;
        var startToken = this._consume(css_lexer_1.CssTokenType.Character, ':');
        var tokens = [startToken];
        if (this._scanner.peek == chars.$COLON) {
            tokens.push(this._consume(css_lexer_1.CssTokenType.Character, ':'));
        }
        var innerSelectors = [];
        this._scanner.setMode(css_lexer_1.CssLexerMode.PSEUDO_SELECTOR);
        // host, host-context, lang, not, nth-child are all identifiers
        var pseudoSelectorToken = this._consume(css_lexer_1.CssTokenType.Identifier);
        var pseudoSelectorName = pseudoSelectorToken.strValue;
        tokens.push(pseudoSelectorToken);
        // host(), lang(), nth-child(), etc...
        if (this._scanner.peek == chars.$LPAREN) {
            this._scanner.setMode(css_lexer_1.CssLexerMode.PSEUDO_SELECTOR_WITH_ARGUMENTS);
            var openParenToken = this._consume(css_lexer_1.CssTokenType.Character, '(');
            tokens.push(openParenToken);
            // :host(innerSelector(s)), :not(selector), etc...
            if (_pseudoSelectorSupportsInnerSelectors(pseudoSelectorName)) {
                var innerDelims = startingDelims | LPAREN_DELIM_FLAG | RPAREN_DELIM_FLAG;
                if (pseudoSelectorName == 'not') {
                    // the inner selector inside of :not(...) can only be one
                    // CSS selector (no commas allowed) ... This is according
                    // to the CSS specification
                    innerDelims |= COMMA_DELIM_FLAG;
                }
                // :host(a, b, c) {
                this._parseSelectors(innerDelims).forEach(function (selector, index) {
                    innerSelectors.push(selector);
                });
            }
            else {
                // this branch is for things like "en-us, 2k + 1, etc..."
                // which all end up in pseudoSelectors like :lang, :nth-child, etc..
                var innerValueDelims = delimiters | LBRACE_DELIM_FLAG | COLON_DELIM_FLAG |
                    RPAREN_DELIM_FLAG | LPAREN_DELIM_FLAG;
                while (!characterContainsDelimiter(this._scanner.peek, innerValueDelims)) {
                    var token = this._scan();
                    tokens.push(token);
                }
            }
            var closeParenToken = this._consume(css_lexer_1.CssTokenType.Character, ')');
            tokens.push(closeParenToken);
        }
        var end = this._getScannerIndex() - 1;
        var strValue = this._extractSourceContent(start, end);
        var endToken = tokens[tokens.length - 1];
        var span = this._generateSourceSpan(startToken, endToken);
        return new css_ast_1.CssPseudoSelectorAst(span, strValue, pseudoSelectorName, tokens, innerSelectors);
    };
    /** @internal */
    CssParser.prototype._parseSimpleSelector = function (delimiters) {
        var start = this._getScannerIndex();
        delimiters |= COMMA_DELIM_FLAG;
        this._scanner.setMode(css_lexer_1.CssLexerMode.SELECTOR);
        var selectorCssTokens = [];
        var pseudoSelectors = [];
        var previousToken = undefined;
        var selectorPartDelimiters = delimiters | SPACE_DELIM_FLAG;
        var loopOverSelector = !characterContainsDelimiter(this._scanner.peek, selectorPartDelimiters);
        var hasAttributeError = false;
        while (loopOverSelector) {
            var peek = this._scanner.peek;
            switch (peek) {
                case chars.$COLON:
                    var innerPseudo = this._parsePseudoSelector(delimiters);
                    pseudoSelectors.push(innerPseudo);
                    this._scanner.setMode(css_lexer_1.CssLexerMode.SELECTOR);
                    break;
                case chars.$LBRACKET:
                    // we set the mode after the scan because attribute mode does not
                    // allow attribute [] values. And this also will catch any errors
                    // if an extra "[" is used inside.
                    selectorCssTokens.push(this._scan());
                    this._scanner.setMode(css_lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR);
                    break;
                case chars.$RBRACKET:
                    if (this._scanner.getMode() != css_lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR) {
                        hasAttributeError = true;
                    }
                    // we set the mode early because attribute mode does not
                    // allow attribute [] values
                    this._scanner.setMode(css_lexer_1.CssLexerMode.SELECTOR);
                    selectorCssTokens.push(this._scan());
                    break;
                default:
                    if (isSelectorOperatorCharacter(peek)) {
                        loopOverSelector = false;
                        continue;
                    }
                    var token = this._scan();
                    previousToken = token;
                    selectorCssTokens.push(token);
                    break;
            }
            loopOverSelector = !characterContainsDelimiter(this._scanner.peek, selectorPartDelimiters);
        }
        hasAttributeError =
            hasAttributeError || this._scanner.getMode() == css_lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR;
        if (hasAttributeError) {
            this._error("Unbalanced CSS attribute selector at column " + previousToken.line + ":" + previousToken.column, previousToken);
        }
        var end = this._getScannerIndex() - 1;
        // this happens if the selector is not directly followed by
        // a comma or curly brace without a space in between
        var operator = null;
        var operatorScanCount = 0;
        var lastOperatorToken = null;
        if (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            while (operator == null && !characterContainsDelimiter(this._scanner.peek, delimiters) &&
                isSelectorOperatorCharacter(this._scanner.peek)) {
                var token = this._scan();
                var tokenOperator = token.strValue;
                operatorScanCount++;
                lastOperatorToken = token;
                if (tokenOperator != SPACE_OPERATOR) {
                    switch (tokenOperator) {
                        case SLASH_CHARACTER:
                            // /deep/ operator
                            var deepToken = this._consume(css_lexer_1.CssTokenType.Identifier);
                            var deepSlash = this._consume(css_lexer_1.CssTokenType.Character);
                            var index = lastOperatorToken.index;
                            var line = lastOperatorToken.line;
                            var column = lastOperatorToken.column;
                            if (deepToken != null && deepToken.strValue.toLowerCase() == 'deep' &&
                                deepSlash.strValue == SLASH_CHARACTER) {
                                token = new css_lexer_1.CssToken(lastOperatorToken.index, lastOperatorToken.column, lastOperatorToken.line, css_lexer_1.CssTokenType.Identifier, DEEP_OPERATOR_STR);
                            }
                            else {
                                var text = SLASH_CHARACTER + deepToken.strValue + deepSlash.strValue;
                                this._error(css_lexer_1.generateErrorMessage(this._getSourceContent(), text + " is an invalid CSS operator", text, index, line, column), lastOperatorToken);
                                token = new css_lexer_1.CssToken(index, column, line, css_lexer_1.CssTokenType.Invalid, text);
                            }
                            break;
                        case GT_CHARACTER:
                            // >>> operator
                            if (this._scanner.peek == chars.$GT && this._scanner.peekPeek == chars.$GT) {
                                this._consume(css_lexer_1.CssTokenType.Character, GT_CHARACTER);
                                this._consume(css_lexer_1.CssTokenType.Character, GT_CHARACTER);
                                token = new css_lexer_1.CssToken(lastOperatorToken.index, lastOperatorToken.column, lastOperatorToken.line, css_lexer_1.CssTokenType.Identifier, TRIPLE_GT_OPERATOR_STR);
                            }
                            break;
                    }
                    operator = token;
                }
            }
            // so long as there is an operator then we can have an
            // ending value that is beyond the selector value ...
            // otherwise it's just a bunch of trailing whitespace
            if (operator != null) {
                end = operator.index;
            }
        }
        this._scanner.consumeWhitespace();
        var strValue = this._extractSourceContent(start, end);
        // if we do come across one or more spaces inside of
        // the operators loop then an empty space is still a
        // valid operator to use if something else was not found
        if (operator == null && operatorScanCount > 0 && this._scanner.peek != chars.$LBRACE) {
            operator = lastOperatorToken;
        }
        // please note that `endToken` is reassigned multiple times below
        // so please do not optimize the if statements into if/elseif
        var startTokenOrAst = null;
        var endTokenOrAst = null;
        if (selectorCssTokens.length > 0) {
            startTokenOrAst = startTokenOrAst || selectorCssTokens[0];
            endTokenOrAst = selectorCssTokens[selectorCssTokens.length - 1];
        }
        if (pseudoSelectors.length > 0) {
            startTokenOrAst = startTokenOrAst || pseudoSelectors[0];
            endTokenOrAst = pseudoSelectors[pseudoSelectors.length - 1];
        }
        if (operator != null) {
            startTokenOrAst = startTokenOrAst || operator;
            endTokenOrAst = operator;
        }
        var span = this._generateSourceSpan(startTokenOrAst, endTokenOrAst);
        return new css_ast_1.CssSimpleSelectorAst(span, selectorCssTokens, strValue, pseudoSelectors, operator);
    };
    /** @internal */
    CssParser.prototype._parseSelector = function (delimiters) {
        delimiters |= COMMA_DELIM_FLAG;
        this._scanner.setMode(css_lexer_1.CssLexerMode.SELECTOR);
        var simpleSelectors = [];
        while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            simpleSelectors.push(this._parseSimpleSelector(delimiters));
            this._scanner.consumeWhitespace();
        }
        var firstSelector = simpleSelectors[0];
        var lastSelector = simpleSelectors[simpleSelectors.length - 1];
        var span = this._generateSourceSpan(firstSelector, lastSelector);
        return new css_ast_1.CssSelectorAst(span, simpleSelectors);
    };
    /** @internal */
    CssParser.prototype._parseValue = function (delimiters) {
        delimiters |= RBRACE_DELIM_FLAG | SEMICOLON_DELIM_FLAG | NEWLINE_DELIM_FLAG;
        this._scanner.setMode(css_lexer_1.CssLexerMode.STYLE_VALUE);
        var start = this._getScannerIndex();
        var tokens = [];
        var wsStr = '';
        var previous = undefined;
        while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            var token = void 0;
            if (previous != null && previous.type == css_lexer_1.CssTokenType.Identifier &&
                this._scanner.peek == chars.$LPAREN) {
                token = this._consume(css_lexer_1.CssTokenType.Character, '(');
                tokens.push(token);
                this._scanner.setMode(css_lexer_1.CssLexerMode.STYLE_VALUE_FUNCTION);
                token = this._scan();
                tokens.push(token);
                this._scanner.setMode(css_lexer_1.CssLexerMode.STYLE_VALUE);
                token = this._consume(css_lexer_1.CssTokenType.Character, ')');
                tokens.push(token);
            }
            else {
                token = this._scan();
                if (token.type == css_lexer_1.CssTokenType.Whitespace) {
                    wsStr += token.strValue;
                }
                else {
                    wsStr = '';
                    tokens.push(token);
                }
            }
            previous = token;
        }
        var end = this._getScannerIndex() - 1;
        this._scanner.consumeWhitespace();
        var code = this._scanner.peek;
        if (code == chars.$SEMICOLON) {
            this._consume(css_lexer_1.CssTokenType.Character, ';');
        }
        else if (code != chars.$RBRACE) {
            this._error(css_lexer_1.generateErrorMessage(this._getSourceContent(), "The CSS key/value definition did not end with a semicolon", previous.strValue, previous.index, previous.line, previous.column), previous);
        }
        var strValue = this._extractSourceContent(start, end);
        var startToken = tokens[0];
        var endToken = tokens[tokens.length - 1];
        var span = this._generateSourceSpan(startToken, endToken);
        return new css_ast_1.CssStyleValueAst(span, tokens, strValue);
    };
    /** @internal */
    CssParser.prototype._collectUntilDelim = function (delimiters, assertType) {
        if (assertType === void 0) { assertType = null; }
        var tokens = [];
        while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            var val = assertType != null ? this._consume(assertType) : this._scan();
            tokens.push(val);
        }
        return tokens;
    };
    /** @internal */
    CssParser.prototype._parseBlock = function (delimiters) {
        delimiters |= RBRACE_DELIM_FLAG;
        this._scanner.setMode(css_lexer_1.CssLexerMode.BLOCK);
        var startToken = this._consume(css_lexer_1.CssTokenType.Character, '{');
        this._scanner.consumeEmptyStatements();
        var results = [];
        while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            results.push(this._parseRule(delimiters));
        }
        var endToken = this._consume(css_lexer_1.CssTokenType.Character, '}');
        this._scanner.setMode(css_lexer_1.CssLexerMode.BLOCK);
        this._scanner.consumeEmptyStatements();
        var span = this._generateSourceSpan(startToken, endToken);
        return new css_ast_1.CssBlockAst(span, results);
    };
    /** @internal */
    CssParser.prototype._parseStyleBlock = function (delimiters) {
        delimiters |= RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG;
        this._scanner.setMode(css_lexer_1.CssLexerMode.STYLE_BLOCK);
        var startToken = this._consume(css_lexer_1.CssTokenType.Character, '{');
        if (startToken.numValue != chars.$LBRACE) {
            return null;
        }
        var definitions = [];
        this._scanner.consumeEmptyStatements();
        while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
            definitions.push(this._parseDefinition(delimiters));
            this._scanner.consumeEmptyStatements();
        }
        var endToken = this._consume(css_lexer_1.CssTokenType.Character, '}');
        this._scanner.setMode(css_lexer_1.CssLexerMode.STYLE_BLOCK);
        this._scanner.consumeEmptyStatements();
        var span = this._generateSourceSpan(startToken, endToken);
        return new css_ast_1.CssStylesBlockAst(span, definitions);
    };
    /** @internal */
    CssParser.prototype._parseDefinition = function (delimiters) {
        this._scanner.setMode(css_lexer_1.CssLexerMode.STYLE_BLOCK);
        var prop = this._consume(css_lexer_1.CssTokenType.Identifier);
        var parseValue = false;
        var value = null;
        var endToken = prop;
        // the colon value separates the prop from the style.
        // there are a few cases as to what could happen if it
        // is missing
        switch (this._scanner.peek) {
            case chars.$SEMICOLON:
            case chars.$RBRACE:
            case chars.$EOF:
                parseValue = false;
                break;
            default:
                var propStr_1 = [prop.strValue];
                if (this._scanner.peek != chars.$COLON) {
                    // this will throw the error
                    var nextValue = this._consume(css_lexer_1.CssTokenType.Character, ':');
                    propStr_1.push(nextValue.strValue);
                    var remainingTokens = this._collectUntilDelim(delimiters | COLON_DELIM_FLAG | SEMICOLON_DELIM_FLAG, css_lexer_1.CssTokenType.Identifier);
                    if (remainingTokens.length > 0) {
                        remainingTokens.forEach(function (token) { propStr_1.push(token.strValue); });
                    }
                    endToken = prop =
                        new css_lexer_1.CssToken(prop.index, prop.column, prop.line, prop.type, propStr_1.join(' '));
                }
                // this means we've reached the end of the definition and/or block
                if (this._scanner.peek == chars.$COLON) {
                    this._consume(css_lexer_1.CssTokenType.Character, ':');
                    parseValue = true;
                }
                break;
        }
        if (parseValue) {
            value = this._parseValue(delimiters);
            endToken = value;
        }
        else {
            this._error(css_lexer_1.generateErrorMessage(this._getSourceContent(), "The CSS property was not paired with a style value", prop.strValue, prop.index, prop.line, prop.column), prop);
        }
        var span = this._generateSourceSpan(prop, endToken);
        return new css_ast_1.CssDefinitionAst(span, prop, value);
    };
    /** @internal */
    CssParser.prototype._assertCondition = function (status, errorMessage, problemToken) {
        if (!status) {
            this._error(errorMessage, problemToken);
            return true;
        }
        return false;
    };
    /** @internal */
    CssParser.prototype._error = function (message, problemToken) {
        var length = problemToken.strValue.length;
        var error = CssParseError.create(this._file, 0, problemToken.line, problemToken.column, length, message);
        this._errors.push(error);
    };
    return CssParser;
}());
exports.CssParser = CssParser;
var CssParseError = (function (_super) {
    __extends(CssParseError, _super);
    function CssParseError(span, message) {
        return _super.call(this, span, message) || this;
    }
    CssParseError.create = function (file, offset, line, col, length, errMsg) {
        var start = new parse_util_1.ParseLocation(file, offset, line, col);
        var end = new parse_util_1.ParseLocation(file, offset, line, col + length);
        var span = new parse_util_1.ParseSourceSpan(start, end);
        return new CssParseError(span, 'CSS Parse Error: ' + errMsg);
    };
    return CssParseError;
}(parse_util_1.ParseError));
exports.CssParseError = CssParseError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jc3NfcGFyc2VyL2Nzc19wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsZ0NBQWtDO0FBQ2xDLDRDQUEwRjtBQUUxRixxQ0FBK2E7QUFDL2EseUNBQXVJO0FBRXZJLElBQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQztBQUUzQix5Q0FBcUM7QUFBN0IsK0JBQUEsUUFBUSxDQUFBO0FBQ2hCLHFDQUFvQztBQUE1Qiw4QkFBQSxTQUFTLENBQUE7QUFFakIsSUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBQzVCLElBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQztBQUN6QixJQUFNLHNCQUFzQixHQUFHLEtBQUssQ0FBQztBQUNyQyxJQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQztBQUVuQyxJQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDekIsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDNUIsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDNUIsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFDM0IsSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDNUIsSUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFDaEMsSUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7QUFDOUIsSUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUM7QUFDOUIsSUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUM7QUFDOUIsSUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7QUFFN0IsK0NBQStDLElBQVk7SUFDekQsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FB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