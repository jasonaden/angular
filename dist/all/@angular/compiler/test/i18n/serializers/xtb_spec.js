"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@angular/compiler/src/util");
var digest_1 = require("../../../src/i18n/digest");
var xtb_1 = require("../../../src/i18n/serializers/xtb");
function main() {
    describe('XTB serializer', function () {
        var serializer = new xtb_1.Xtb();
        function loadAsMap(xtb) {
            var i18nNodesByMsgId = serializer.load(xtb, 'url').i18nNodesByMsgId;
            var msgMap = {};
            Object.keys(i18nNodesByMsgId).forEach(function (id) {
                msgMap[id] = digest_1.serializeNodes(i18nNodesByMsgId[id]).join('');
            });
            return msgMap;
        }
        describe('load', function () {
            it('should load XTB files with a doctype', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE translationbundle [<!ELEMENT translationbundle (translation)*>\n<!ATTLIST translationbundle lang CDATA #REQUIRED>\n\n<!ELEMENT translation (#PCDATA|ph)*>\n<!ATTLIST translation id CDATA #REQUIRED>\n\n<!ELEMENT ph EMPTY>\n<!ATTLIST ph name CDATA #REQUIRED>\n]>\n<translationbundle>\n  <translation id=\"8841459487341224498\">rab</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({ '8841459487341224498': 'rab' });
            });
            it('should load XTB files without placeholders', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<translationbundle>\n  <translation id=\"8841459487341224498\">rab</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({ '8841459487341224498': 'rab' });
            });
            it('should return the target locale', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<translationbundle lang='fr'>\n  <translation id=\"8841459487341224498\">rab</translation>\n</translationbundle>";
                expect(serializer.load(XTB, 'url').locale).toEqual('fr');
            });
            it('should load XTB files with placeholders', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<translationbundle>\n  <translation id=\"8877975308926375834\"><ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/></translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({
                    '8877975308926375834': '<ph name="START_PARAGRAPH"/>rab<ph name="CLOSE_PARAGRAPH"/>'
                });
            });
            it('should replace ICU placeholders with their translations', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<translationbundle>\n  <translation id=\"7717087045075616176\">*<ph name=\"ICU\"/>*</translation>\n  <translation id=\"5115002811911870583\">{VAR_PLURAL, plural, =1 {<ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/>}}</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({
                    '7717087045075616176': "*<ph name=\"ICU\"/>*",
                    '5115002811911870583': "{VAR_PLURAL, plural, =1 {[<ph name=\"START_PARAGRAPH\"/>, rab, <ph name=\"CLOSE_PARAGRAPH\"/>]}}",
                });
            });
            it('should load complex XTB files', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<translationbundle>\n  <translation id=\"8281795707202401639\"><ph name=\"INTERPOLATION\"/><ph name=\"START_BOLD_TEXT\"/>rab<ph name=\"CLOSE_BOLD_TEXT\"/> oof</translation>\n  <translation id=\"5115002811911870583\">{VAR_PLURAL, plural, =1 {<ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/>}}</translation>\n  <translation id=\"130772889486467622\">oof</translation>\n  <translation id=\"4739316421648347533\">{VAR_PLURAL, plural, =1 {{VAR_GENDER, gender, male {<ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/>}} }}</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({
                    '8281795707202401639': "<ph name=\"INTERPOLATION\"/><ph name=\"START_BOLD_TEXT\"/>rab<ph name=\"CLOSE_BOLD_TEXT\"/> oof",
                    '5115002811911870583': "{VAR_PLURAL, plural, =1 {[<ph name=\"START_PARAGRAPH\"/>, rab, <ph name=\"CLOSE_PARAGRAPH\"/>]}}",
                    '130772889486467622': "oof",
                    '4739316421648347533': "{VAR_PLURAL, plural, =1 {[{VAR_GENDER, gender, male {[<ph name=\"START_PARAGRAPH\"/>, rab, <ph name=\"CLOSE_PARAGRAPH\"/>]}},  ]}}",
                });
            });
        });
        describe('errors', function () {
            it('should be able to parse non-angular xtb files without error', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<translationbundle>\n  <translation id=\"angular\">is great</translation>\n  <translation id=\"non angular\">is <invalid>less</invalid> {count, plural, =0 {{GREAT}}}</translation>\n</translationbundle>";
                // Invalid messages should not cause the parser to throw
                var i18nNodesByMsgId = undefined;
                expect(function () {
                    i18nNodesByMsgId = serializer.load(XTB, 'url').i18nNodesByMsgId;
                }).not.toThrow();
                expect(Object.keys(i18nNodesByMsgId).length).toEqual(2);
                expect(digest_1.serializeNodes(i18nNodesByMsgId['angular']).join('')).toEqual('is great');
                // Messages that contain unsupported feature should throw on access
                expect(function () {
                    var read = i18nNodesByMsgId['non angular'];
                }).toThrowError(/xtb parse errors/);
            });
            it('should throw on nested <translationbundle>', function () {
                var XTB = '<translationbundle><translationbundle></translationbundle></translationbundle>';
                expect(function () {
                    loadAsMap(XTB);
                }).toThrowError(/<translationbundle> elements can not be nested/);
            });
            it('should throw when a <translation> has no id attribute', function () {
                var XTB = "<translationbundle>\n  <translation></translation>\n</translationbundle>";
                expect(function () { loadAsMap(XTB); }).toThrowError(/<translation> misses the "id" attribute/);
            });
            it('should throw when a placeholder has no name attribute', function () {
                var XTB = "<translationbundle>\n  <translation id=\"1186013544048295927\"><ph /></translation>\n</translationbundle>";
                expect(function () { loadAsMap(XTB); }).toThrowError(/<ph> misses the "name" attribute/);
            });
            it('should throw on unknown xtb tags', function () {
                var XTB = "<what></what>";
                expect(function () {
                    loadAsMap(XTB);
                }).toThrowError(new RegExp(util_1.escapeRegExp("Unexpected tag (\"[ERROR ->]<what></what>\")")));
            });
            it('should throw on unknown message tags', function () {
                var XTB = "<translationbundle>\n  <translation id=\"1186013544048295927\"><b>msg should contain only ph tags</b></translation>\n</translationbundle>";
                expect(function () { loadAsMap(XTB); })
                    .toThrowError(new RegExp(util_1.escapeRegExp("[ERROR ->]<b>msg should contain only ph tags</b>")));
            });
            it('should throw on duplicate message id', function () {
                var XTB = "<translationbundle>\n  <translation id=\"1186013544048295927\">msg1</translation>\n  <translation id=\"1186013544048295927\">msg2</translation>\n</translationbundle>";
                expect(function () {
                    loadAsMap(XTB);
                }).toThrowError(/Duplicated translations for msg 1186013544048295927/);
            });
            it('should throw when trying to save an xtb file', function () { expect(function () { serializer.write([], null); }).toThrowError(/Unsupported/); });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2kxOG4vc2VyaWFsaXplcnMveHRiX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtREFBd0Q7QUFDeEQsbURBQXdEO0FBRXhELHlEQUFzRDtBQUd0RDtJQUNFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixJQUFNLFVBQVUsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBRTdCLG1CQUFtQixHQUFXO1lBQ3JCLElBQUEsK0RBQWdCLENBQWdDO1lBQ3ZELElBQU0sTUFBTSxHQUEyQixFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyx1QkFBYyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRUQsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNmLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtnQkFDekMsSUFBTSxHQUFHLEdBQUcsbWFBWUMsQ0FBQztnQkFFZCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtnQkFDL0MsSUFBTSxHQUFHLEdBQUcsb0pBR0MsQ0FBQztnQkFFZCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVB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