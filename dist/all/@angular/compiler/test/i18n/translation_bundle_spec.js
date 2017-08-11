"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var i18n = require("../../src/i18n/i18n_ast");
var translation_bundle_1 = require("../../src/i18n/translation_bundle");
var parse_util_1 = require("../../src/parse_util");
var ast_serializer_spec_1 = require("../ml_parser/ast_serializer_spec");
var i18n_parser_spec_1 = require("./i18n_parser_spec");
function main() {
    describe('TranslationBundle', function () {
        var file = new parse_util_1.ParseSourceFile('content', 'url');
        var startLocation = new parse_util_1.ParseLocation(file, 0, 0, 0);
        var endLocation = new parse_util_1.ParseLocation(file, 0, 0, 7);
        var span = new parse_util_1.ParseSourceSpan(startLocation, endLocation);
        var srcNode = new i18n.Text('src', span);
        it('should translate a plain message', function () {
            var msgMap = { foo: [new i18n.Text('bar', null)] };
            var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
            var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
            expect(ast_serializer_spec_1.serializeNodes(tb.get(msg))).toEqual(['bar']);
        });
        it('should translate a message with placeholder', function () {
            var msgMap = {
                foo: [
                    new i18n.Text('bar', null),
                    new i18n.Placeholder('', 'ph1', null),
                ]
            };
            var phMap = {
                ph1: '*phContent*',
            };
            var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
            var msg = new i18n.Message([srcNode], phMap, {}, 'm', 'd', 'i');
            expect(ast_serializer_spec_1.serializeNodes(tb.get(msg))).toEqual(['bar*phContent*']);
        });
        it('should translate a message with placeholder referencing messages', function () {
            var msgMap = {
                foo: [
                    new i18n.Text('--', null),
                    new i18n.Placeholder('', 'ph1', null),
                    new i18n.Text('++', null),
                ],
                ref: [
                    new i18n.Text('*refMsg*', null),
                ],
            };
            var refMsg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
            var msg = new i18n.Message([srcNode], {}, { ph1: refMsg }, 'm', 'd', 'i');
            var count = 0;
            var digest = function (_) { return count++ ? 'ref' : 'foo'; };
            var tb = new translation_bundle_1.TranslationBundle(msgMap, null, digest);
            expect(ast_serializer_spec_1.serializeNodes(tb.get(msg))).toEqual(['--*refMsg*++']);
        });
        it('should use the original message or throw when a translation is not found', function () {
            var src = "<some-tag>some text{{ some_expression }}</some-tag>{count, plural, =0 {no} few {a <b>few</b>}}";
            var messages = i18n_parser_spec_1._extractMessages("<div i18n>" + src + "</div>");
            var digest = function (_) { return "no matching id"; };
            // Empty message map -> use source messages in Ignore mode
            var tb = new translation_bundle_1.TranslationBundle({}, null, digest, null, core_1.MissingTranslationStrategy.Ignore);
            expect(ast_serializer_spec_1.serializeNodes(tb.get(messages[0])).join('')).toEqual(src);
            // Empty message map -> use source messages in Warning mode
            tb = new translation_bundle_1.TranslationBundle({}, null, digest, null, core_1.MissingTranslationStrategy.Warning);
            expect(ast_serializer_spec_1.serializeNodes(tb.get(messages[0])).join('')).toEqual(src);
            // Empty message map -> throw in Error mode
            tb = new translation_bundle_1.TranslationBundle({}, null, digest, null, core_1.MissingTranslationStrategy.Error);
            expect(function () { return ast_serializer_spec_1.serializeNodes(tb.get(messages[0])).join(''); }).toThrow();
        });
        describe('errors reporting', function () {
            it('should report unknown placeholders', function () {
                var msgMap = {
                    foo: [
                        new i18n.Text('bar', null),
                        new i18n.Placeholder('', 'ph1', span),
                    ]
                };
                var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).toThrowError(/Unknown placeholder/);
            });
            it('should report missing translation', function () {
                var tb = new translation_bundle_1.TranslationBundle({}, null, function (_) { return 'foo'; }, null, core_1.MissingTranslationStrategy.Error);
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).toThrowError(/Missing translation for message "foo"/);
            });
            it('should report missing translation with MissingTranslationStrategy.Warning', function () {
                var log = [];
                var console = {
                    log: function (msg) { throw "unexpected"; },
                    warn: function (msg) { return log.push(msg); },
                };
                var tb = new translation_bundle_1.TranslationBundle({}, 'en', function (_) { return 'foo'; }, null, core_1.MissingTranslationStrategy.Warning, console);
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).not.toThrowError();
                expect(log.length).toEqual(1);
                expect(log[0]).toMatch(/Missing translation for message "foo" for locale "en"/);
            });
            it('should not report missing translation with MissingTranslationStrategy.Ignore', function () {
                var tb = new translation_bundle_1.TranslationBundle({}, null, function (_) { return 'foo'; }, null, core_1.MissingTranslationStrategy.Ignore);
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).not.toThrowError();
            });
            it('should report missing referenced message', function () {
                var msgMap = {
                    foo: [new i18n.Placeholder('', 'ph1', span)],
                };
                var refMsg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                var msg = new i18n.Message([srcNode], {}, { ph1: refMsg }, 'm', 'd', 'i');
                var count = 0;
                var digest = function (_) { return count++ ? 'ref' : 'foo'; };
                var tb = new translation_bundle_1.TranslationBundle(msgMap, null, digest, null, core_1.MissingTranslationStrategy.Error);
                expect(function () { return tb.get(msg); }).toThrowError(/Missing translation for message "ref"/);
            });
            it('should report invalid translated html', function () {
                var msgMap = {
                    foo: [
                        new i18n.Text('text', null),
                        new i18n.Placeholder('', 'ph1', null),
                    ]
                };
                var phMap = {
                    ph1: '</b>',
                };
                var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
                var msg = new i18n.Message([srcNode], phMap, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).toThrowError(/Unexpected closing tag "b"/);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fYnVuZGxlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2kxOG4vdHJhbnNsYXRpb25fYnVuZGxlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBeUQ7QUFFekQsOENBQWdEO0FBQ2hELHdFQUFvRTtBQUNwRSxtREFBcUY7QUFDckYsd0VBQWdFO0FBQ2hFLHVEQUFvRDtBQUVwRDtJQUNFLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixJQUFNLElBQUksR0FBRyxJQUFJLDRCQUFlLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25ELElBQU0sYUFBYSxHQUFHLElBQUksMEJBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RCxJQUFNLFdBQVcsR0FBRyxJQUFJLDBCQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBTSxJQUFJLEdBQUcsSUFBSSw0QkFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM3RCxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTNDLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxJQUFNLE1BQU0sR0FBRyxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDO1lBQ3JELElBQU0sRUFBRSxHQUFHLElBQUksc0NBQWlCLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUMsQ0FBQztZQUM3RCxJ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