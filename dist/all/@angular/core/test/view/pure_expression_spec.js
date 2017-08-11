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
var helper_1 = require("./helper");
function main() {
    describe("View Pure Expressions", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
            if (viewFlags === void 0) { viewFlags = 0 /* None */; }
            return index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
        }
        function createAndGetRootNodes(viewDef) {
            var view = helper_1.createRootView(viewDef);
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        var Service = (function () {
            function Service() {
            }
            return Service;
        }());
        describe('pure arrays', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var values;
                    var _a = createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                        index_1.pureArrayDef(2),
                        index_1.directiveDef(0 /* None */, null, 0, Service, [], { data: [0, 'data'] }),
                    ], function (check, view) {
                        var pureValue = helper_1.checkNodeInlineOrDynamic(check, view, 1, inlineDynamic, values);
                        helper_1.checkNodeInlineOrDynamic(check, view, 2, inlineDynamic, [pureValue]);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    var service = index_1.asProviderData(view, 2).instance;
                    values = [1, 2];
                    index_1.Services.checkAndUpdateView(view);
                    var arr0 = service.data;
                    expect(arr0).toEqual([1, 2]);
                    // instance should not change
                    // if the values don't change
                    index_1.Services.checkAndUpdateView(view);
                    expect(service.data).toBe(arr0);
                    values = [3, 2];
                    index_1.Services.checkAndUpdateView(view);
                    var arr1 = service.data;
                    expect(arr1).not.toBe(arr0);
                    expect(arr1).toEqual([3, 2]);
                });
            });
        });
        describe('pure objects', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var values;
                    var _a = createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 2, 'span'), index_1.pureObjectDef({ a: 0, b: 1 }),
                        index_1.directiveDef(0 /* None */, null, 0, Service, [], { data: [0, 'data'] })
                    ], function (check, view) {
                        var pureValue = helper_1.checkNodeInlineOrDynamic(check, view, 1, inlineDynamic, values);
                        helper_1.checkNodeInlineOrDynamic(check, view, 2, inlineDynamic, [pureValue]);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    var service = index_1.asProviderData(view, 2).instance;
                    values = [1, 2];
                    index_1.Services.checkAndUpdateView(view);
                    var obj0 = service.data;
                    expect(obj0).toEqual({ a: 1, b: 2 });
                    // instance should not change
                    // if the values don't change
                    index_1.Services.checkAndUpdateView(view);
                    expect(service.data).toBe(obj0);
                    values = [3, 2];
                    index_1.Services.checkAndUpdateView(view);
                    var obj1 = service.data;
                    expect(obj1).not.toBe(obj0);
                    expect(obj1).toEqual({ a: 3, b: 2 });
                });
            });
        });
        describe('pure pipes', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var SomePipe = (function () {
                        function SomePipe() {
                        }
                        SomePipe.prototype.transform = function (v1, v2) { return [v1 + 10, v2 + 20]; };
                        return SomePipe;
                    }());
                    var values;
                    var _a = createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 3, 'span'),
                        index_1.pipeDef(0 /* None */, SomePipe, []),
                        index_1.purePipeDef(2),
                        index_1.directiveDef(0 /* None */, null, 0, Service, [], { data: [0, 'data'] }),
                    ], function (check, view) {
                        var pureValue = helper_1.checkNodeInlineOrDynamic(check, view, 2, inlineDynamic, [index_1.nodeValue(view, 1)].concat(values));
                        helper_1.checkNodeInlineOrDynamic(check, view, 3, inlineDynamic, [pureValue]);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    var service = index_1.asProviderData(view, 3).instance;
                    values = [1, 2];
                    index_1.Services.checkAndUpdateView(view);
                    var obj0 = service.data;
                    expect(obj0).toEqual([11, 22]);
                    // instance should not change
                    // if the values don't change
                    index_1.Services.checkAndUpdateView(view);
                    expect(service.data).toBe(obj0);
                    values = [3, 2];
                    index_1.Services.checkAndUpdateView(view);
                    var obj1 = service.data;
                    expect(obj1).not.toBe(obj0);
                    expect(obj1).toEqual([13, 22]);
                });
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZV9leHByZXNzaW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Qvdmlldy9wdXJlX2V4cHJlc3Npb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILHNEQUErUDtBQUUvUCxtQ0FBbUY7QUFFbkY7SUFDRSxRQUFRLENBQUMsdUJBQXVCLEVBQUU7UUFDaEMscUJBQ0ksS0FBZ0IsRUFBRSxnQkFBK0IsRUFBRSxjQUE2QixFQUNoRixTQUFxQztZQUFyQywwQkFBQSxFQUFBLHdCQUFxQztZQUN2QyxNQUFNLENBQUMsZUFBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckUsQ0FBQztRQUVELCtCQUErQixPQUF1QjtZQUNwRCxJQUFNLElBQUksR0FBRyx1QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JDLElBQU0sU0FBUyxHQUFHLHVCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQ7WUFBQTtZQUVBLENBQUM7WUFBRCxjQUFDO1FBQUQsQ0FBQyxBQUZELElBRUM7UUFFRCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBRXRCLHdCQUFlLENBQUMsT0FBTyxDQUFDLFVBQUMsYUFBYTtnQkFDcEMsRUFBRSxDQUFDLGdDQUE4QixhQUFlLEVBQUU7b0JBQ2hELElBQUksTUFBYSxDQUFDO29CQUVaLElBQUE7Ozs7Ozs7dUJBU0MsRUFUQSxjQUFJLEVBQUUsd0JBQVMsQ0FTZDtvQkFDUixJQUFNLE9BQU8sR0FBRyxzQkFBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7b0JBRWpELE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFD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