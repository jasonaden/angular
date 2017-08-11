"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("@angular/core/src/view/index");
var util_1 = require("@angular/core/src/view/util");
function main() {
    describe('viewDef', function () {
        describe('parent', function () {
            function parents(viewDef) {
                return viewDef.nodes.map(function (node) { return node.parent ? node.parent.index : null; });
            }
            it('should calculate parents for one level', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.textDef(null, ['a']),
                    index_1.textDef(null, ['a']),
                ]);
                expect(parents(vd)).toEqual([null, 0, 0]);
            });
            it('should calculate parents for one level, multiple roots', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(null, ['a']),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(null, ['a']),
                    index_1.textDef(null, ['a']),
                ]);
                expect(parents(vd)).toEqual([null, 0, null, 2, null]);
            });
            it('should calculate parents for multiple levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(null, ['a']),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(null, ['a']),
                    index_1.textDef(null, ['a']),
                ]);
                expect(parents(vd)).toEqual([null, 0, 1, null, 3, null]);
            });
        });
        describe('childFlags', function () {
            function childFlags(viewDef) {
                return viewDef.nodes.map(function (node) { return node.childFlags; });
            }
            function directChildFlags(viewDef) {
                return viewDef.nodes.map(function (node) { return node.directChildFlags; });
            }
            it('should calculate childFlags for one level', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2097152 /* AfterContentChecked */, null, 0, AService, [])
                ]);
                expect(childFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */
                ]);
            });
            it('should calculate childFlags for two levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2097152 /* AfterContentChecked */, null, 0, AService, [])
                ]);
                expect(childFlags(vd)).toEqual([
                    1 /* TypeElement */ | 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    1 /* TypeElement */, 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    0 /* None */
                ]);
            });
            it('should calculate childFlags for one level, multiple roots', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2097152 /* AfterContentChecked */, null, 0, AService, []),
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(1048576 /* AfterContentInit */, null, 0, AService, []),
                    index_1.directiveDef(8388608 /* AfterViewChecked */, null, 0, AService, []),
                ]);
                expect(childFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 8388608 /* AfterViewChecked */,
                    0 /* None */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 8388608 /* AfterViewChecked */,
                    0 /* None */, 0 /* None */
                ]);
            });
            it('should calculate childFlags for multiple levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2097152 /* AfterContentChecked */, null, 0, AService, []),
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(1048576 /* AfterContentInit */, null, 0, AService, []),
                    index_1.directiveDef(4194304 /* AfterViewInit */, null, 0, AService, []),
                ]);
                expect(childFlags(vd)).toEqual([
                    1 /* TypeElement */ | 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 4194304 /* AfterViewInit */,
                    0 /* None */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    1 /* TypeElement */, 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 4194304 /* AfterViewInit */,
                    0 /* None */, 0 /* None */
                ]);
            });
        });
        describe('childMatchedQueries', function () {
            function childMatchedQueries(viewDef) {
                return viewDef.nodes.map(function (node) { return node.childMatchedQueries; });
            }
            it('should calculate childMatchedQueries for one level', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(0 /* None */, [[1, 4 /* Provider */]], 0, AService, [])
                ]);
                expect(childMatchedQueries(vd)).toEqual([util_1.filterQueryId(1), 0]);
            });
            it('should calculate childMatchedQueries for two levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(0 /* None */, [[1, 4 /* Provider */]], 0, AService, [])
                ]);
                expect(childMatchedQueries(vd)).toEqual([util_1.filterQueryId(1), util_1.filterQueryId(1), 0]);
            });
            it('should calculate childMatchedQueries for one level, multiple roots', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(0 /* None */, [[1, 4 /* Provider */]], 0, AService, []),
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(0 /* None */, [[2, 4 /* Provider */]], 0, AService, []),
                    index_1.directiveDef(0 /* None */, [[3, 4 /* Provider */]], 0, AService, []),
                ]);
                expect(childMatchedQueries(vd)).toEqual([
                    util_1.filterQueryId(1), 0, util_1.filterQueryId(2) | util_1.filterQueryId(3), 0, 0
                ]);
            });
            it('should calculate childMatchedQueries for multiple levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(0 /* None */, [[1, 4 /* Provider */]], 0, AService, []),
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(0 /* None */, [[2, 4 /* Provider */]], 0, AService, []),
                    index_1.directiveDef(0 /* None */, [[3, 4 /* Provider */]], 0, AService, []),
                ]);
                expect(childMatchedQueries(vd)).toEqual([
                    util_1.filterQueryId(1), util_1.filterQueryId(1), 0, util_1.filterQueryId(2) | util_1.filterQueryId(3), 0, 0
                ]);
            });
            it('should included embedded views into childMatchedQueries', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.anchorDef(0 /* None */, null, null, 0, null, function () { return index_1.viewDef(0 /* None */, [
                        index_1.elementDef(0 /* None */, [[1, 4 /* Provider */]], null, 0, 'span'),
                    ]); })
                ]);
                // Note: the template will become a sibling to the anchor once stamped out,
                expect(childMatchedQueries(vd)).toEqual([util_1.filterQueryId(1), 0]);
            });
        });
    });
}
exports.main = main;
var AService = (function () {
    function AService() {
    }
    return AService;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19kZWZfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L3ZpZXdfZGVmX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzREFBbUs7QUFDbkssb0RBQTBEO0FBRTFEO0lBQ0UsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUVsQixRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLGlCQUFpQixPQUF1QjtnQkFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLEVBQXRDLENBQXNDLENBQUMsQ0FBQztZQUMzRSxDQUFDO1lBRUQsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO2dCQUMzQyxJQUFNLEVBQUUsR0FBRyxlQUFPLGVBQWlCO29CQUNqQyxrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7b0JBQ3JELGVBQU8sQ0FBQyxJQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsZUFBTyxDQUFDLElBQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN2QixDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtnQkFDM0QsSUFBTSxFQUFFLEdBQUcsZUFBTyxlQUFpQjtvQkFDakMsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxlQUFPLENBQUMsSUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsZUFBTyxDQUFDLElBQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixlQUFPLENBQUMsSUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3ZCLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7Z0JBQ2pELElBQU0sRUFBRSxHQUFHLGVBQU8sZUFBaUI7b0JBQ2pDLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxlQUFPLENBQUMsSUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsZUFBTyxDQUFDLElBQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixlQUFPLENBQUMsSUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3ZCLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1lBRXJCLG9CQUFvQixPQUF1QjtnQkFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLFVBQVUsRUFBZixDQUFlLENBQUMsQ0FBQztZQUNwRCxDQUFDO1lBRUQsMEJBQTBCLE9BQXVCO2dCQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsZ0JBQWdCLEVBQXJCLENBQXFCLENBQUMsQ0FBQztZQUMxRCxDQUFDO1lBRUQsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO2dCQUM5QyxJQUFNLEVBQUUsR0FBRyxlQUFPLGVBQWlCO29CQUNqQyxrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7b0JBQ3JELG9CQUFZLG9DQUFnQyxJQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7aUJBQ3JFLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUM3Qiw2REFBdUQ7aUJBQ3hELENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ25DLDZEQUF1RDtpQkFDeEQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLElBQU0sRUFBRSxHQUFHLGVBQU8sZUFBaUI7b0JBQ2pDLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxvQkFBWSxvQ0FBZ0MsSUFBTSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO2lCQUNyRSxDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDN0IsK0NBQStDLG9DQUFnQztvQkFDL0UsNkRBQXVEO2lCQUN4RCxDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3lDQUNaLDZEQUF1RDs7aUJBRS9FLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO2dCQUM5RCxJQUFNLEVBQUUsR0FBRyxlQUFPLGVBQWlCO29CQUNqQyxrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7b0JBQ3JELG9CQUFZLG9DQUFnQyxJQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7b0JBQ3BFLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsb0JBQVksaUNBQTZCLElBQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztvQkFDakUsb0JBQVksaUNBQTZCLElBQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztpQkFDbEUsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzdCLDZEQUF1RDtvQkFDdkQsMERBQW9ELGlDQUE2Qjs7aUJBRWxGLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ25DLDZEQUF1RDtvQkFDdkQsMERBQW9ELGlDQUE2Qjs7aUJBRWxGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO2dCQUNwRCxJQUFNLEVBQUUsR0FBRyxlQUFPLGVBQWlCO29CQUNqQyxrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7b0JBQ3JELGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsb0JBQVksb0NBQWdDLElBQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztvQkFDcEUsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxvQkFBWSxpQ0FBNkIsSUFBTSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO29CQUNqRSxvQkFBWSw4QkFBMEIsSUFBTSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO2lCQUMvRCxDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDN0IsK0NBQStDLG9DQUFnQztvQkFDL0UsNkRBQXVEO29CQUN2RCwwREFBb0QsOEJBQTBCOztpQkFFL0UsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt5Q0FDWiw2REFBdUQ7O29CQUU5RSwwREFBb0QsOEJBQTBCOztpQkFFL0UsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtZQUM5Qiw2QkFBNkIsT0FBdUI7Z0JBQ2xELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxtQkFBbUIsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFFRCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7Z0JBQ3ZELElBQU0sRUFBRSxHQUFHLGVBQU8sZUFBaUI7b0JBQ2pDLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsb0JBQVksZUFBaUIsQ0FBQyxDQUFDLENBQUMsbUJBQTBCLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztpQkFDOUUsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxREFBcUQsRUFBRTtnQkFDeEQsSUFBTSxFQUFFLEdBQUcsZUFBTyxlQUFpQjtvQkFDakMsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7b0JBQ3JELG9CQUFZLGVBQWlCLENBQUMsQ0FBQyxDQUFDLG1CQUEwQixDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7aUJBQzlFLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvRUFBb0UsRUFBRTtnQkFDdkUsSUFBTSxFQUFFLEdBQUcsZUFBTyxlQUFpQjtvQkFDakMsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxvQkFBWSxlQUFpQixDQUFDLENBQUMsQ0FBQyxtQkFBMEIsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO29CQUM3RSxrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7b0JBQ3JELG9CQUFZLGVBQWlCLENBQUMsQ0FBQyxDQUFDLG1CQUEwQixDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7b0JBQzdFLG9CQUFZLGVBQWlCLENBQUMsQ0FBQyxDQUFDLG1CQUEwQixDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7aUJBQzlFLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3RDLG9CQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG9CQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsb0JBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDL0QsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUU7Z0JBQzdELElBQU0sRUFBRSxHQUFHLGVBQU8sZUFBaUI7b0JBQ2pDLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDckQsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxvQkFBWSxlQUFpQixDQUFDLENBQUMsQ0FBQyxtQkFBMEIsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO29CQUM3RSxrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7b0JBQ3JELG9CQUFZLGVBQWlCLENBQUMsQ0FBQyxDQUFDLG1CQUEwQixDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7b0JBQzdFLG9CQUFZLGVBQWlCLENBQUMsQ0FBQyxDQUFDLG1CQUEwQixDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7aUJBQzlFLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3RDLG9CQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsb0JBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxvQkFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNqRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtnQkFDNUQsSUFBTSxFQUFFLEdBQUcsZUFBTyxlQUFpQjtvQkFDakMsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNyRCxpQkFBUyxlQUNXLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLElBQU0sRUFDekMsY0FBTSxPQUFBLGVBQU8sZUFFVDt3QkFDRSxrQkFBVSxlQUFpQixDQUFDLENBQUMsQ0FBQyxtQkFBMEIsQ0FBQyxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO3FCQUM5RSxDQUFDLEVBSkEsQ0FJQSxDQUFDO2lCQUNaLENBQUMsQ0FBQztnQkFFSCwyRUFBMkU7Z0JBQzNFLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBN01ELG9CQTZNQztBQUVEO0lBQUE7SUFBZ0IsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBQWpCLElBQWlCIn0=