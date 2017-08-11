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
var index_1 = require("@angular/core/src/view/index");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var helper_1 = require("./helper");
/**
 * We map addEventListener to the Zones internal name. This is because we want to be fast
 * and bypass the zone bookkeeping. We know that we can do the bookkeeping faster.
 */
var addEventListener = '__zone_symbol__addEventListener';
function main() {
    describe("Component Views", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
            if (viewFlags === void 0) { viewFlags = 0 /* None */; }
            return index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
        }
        function createAndGetRootNodes(viewDef) {
            var view = helper_1.createRootView(viewDef);
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        it('should create and attach component views', function () {
            var instance = undefined;
            var AComp = (function () {
                function AComp() {
                    instance = this;
                }
                return AComp;
            }());
            var _a = createAndGetRootNodes(compViewDef([
                index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 0, 'span'),
                ]); }),
                index_1.directiveDef(32768 /* Component */, null, 0, AComp, []),
            ])), view = _a.view, rootNodes = _a.rootNodes;
            var compView = index_1.asElementData(view, 0).componentView;
            expect(compView.context).toBe(instance);
            expect(compView.component).toBe(instance);
            var compRootEl = dom_adapter_1.getDOM().childNodes(rootNodes[0])[0];
            expect(dom_adapter_1.getDOM().nodeName(compRootEl).toLowerCase()).toBe('span');
        });
        if (helper_1.isBrowser()) {
            describe('root views', function () {
                var rootNode;
                beforeEach(function () {
                    rootNode = document.createElement('root');
                    document.body.appendChild(rootNode);
                    helper_1.recordNodeToRemove(rootNode);
                });
                it('should select root elements based on a selector', function () {
                    var view = helper_1.createRootView(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 0, 'div'),
                    ]), {}, [], 'root');
                    var rootNodes = index_1.rootRenderNodes(view);
                    expect(rootNodes).toEqual([rootNode]);
                });
                it('should select root elements based on a node', function () {
                    var view = helper_1.createRootView(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 0, 'div'),
                    ]), {}, [], rootNode);
                    var rootNodes = index_1.rootRenderNodes(view);
                    expect(rootNodes).toEqual([rootNode]);
                });
                it('should set attributes on the root node', function () {
                    var view = helper_1.createRootView(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 0, 'div', [['a', 'b']]),
                    ]), {}, [], rootNode);
                    expect(rootNode.getAttribute('a')).toBe('b');
                });
                it('should clear the content of the root node', function () {
                    rootNode.appendChild(document.createElement('div'));
                    var view = helper_1.createRootView(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 0, 'div', [['a', 'b']]),
                    ]), {}, [], rootNode);
                    expect(rootNode.childNodes.length).toBe(0);
                });
            });
        }
        describe('data binding', function () {
            it('should dirty check component views', function () {
                var value;
                var AComp = (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var update = jasmine.createSpy('updater').and.callFake(function (check, view) {
                    check(view, 0, 0 /* Inline */, value);
                });
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 0, 'span', null, [[1 /* TypeElementAttribute */, 'a', core_1.SecurityContext.NONE]]),
                    ], null, update); }),
                    index_1.directiveDef(32768 /* Component */, null, 0, AComp, []),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var compView = index_1.asElementData(view, 0).componentView;
                value = 'v1';
                index_1.Services.checkAndUpdateView(view);
                expect(update.calls.mostRecent().args[1]).toBe(compView);
                update.calls.reset();
                index_1.Services.checkNoChangesView(view);
                expect(update.calls.mostRecent().args[1]).toBe(compView);
                value = 'v2';
                expect(function () { return index_1.Services.checkNoChangesView(view); })
                    .toThrowError("ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'v1'. Current value: 'v2'.");
            });
            it('should support detaching and attaching component views for dirty checking', function () {
                var AComp = (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var update = jasmine.createSpy('updater');
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 0, 'span'),
                    ], update); }),
                    index_1.directiveDef(32768 /* Component */, null, 0, AComp, [], null, null),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var compView = index_1.asElementData(view, 0).componentView;
                index_1.Services.checkAndUpdateView(view);
                update.calls.reset();
                compView.state &= ~8 /* ChecksEnabled */;
                index_1.Services.checkAndUpdateView(view);
                expect(update).not.toHaveBeenCalled();
                compView.state |= 8 /* ChecksEnabled */;
                index_1.Services.checkAndUpdateView(view);
                expect(update).toHaveBeenCalled();
            });
            if (helper_1.isBrowser()) {
                it('should support OnPush components', function () {
                    var compInputValue;
                    var AComp = (function () {
                        function AComp() {
                        }
                        return AComp;
                    }());
                    var update = jasmine.createSpy('updater');
                    var addListenerSpy = spyOn(HTMLElement.prototype, addEventListener).and.callThrough();
                    var view = createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () {
                            return compViewDef([
                                index_1.elementDef(0 /* None */, null, null, 0, 'span', null, null, [[null, 'click']]),
                            ], update, null, 2 /* OnPush */);
                        }),
                        index_1.directiveDef(32768 /* Component */, null, 0, AComp, [], { a: [0, 'a'] }),
                    ], function (check, view) { check(view, 1, 0 /* Inline */, compInputValue); })).view;
                    index_1.Services.checkAndUpdateView(view);
                    // auto detach
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).not.toHaveBeenCalled();
                    // auto attach on input changes
                    update.calls.reset();
                    compInputValue = 'v1';
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).toHaveBeenCalled();
                    // auto detach
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).not.toHaveBeenCalled();
                    // auto attach on events
                    addListenerSpy.calls.mostRecent().args[1]('SomeEvent');
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).toHaveBeenCalled();
                    // auto detach
                    update.calls.reset();
                    index_1.Services.checkAndUpdateView(view);
                    expect(update).not.toHaveBeenCalled();
                });
            }
            it('should not stop dirty checking views that threw errors in change detection', function () {
                var AComp = (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var update = jasmine.createSpy('updater');
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 0, 'span', null, [[1 /* TypeElementAttribute */, 'a', core_1.SecurityContext.NONE]]),
                    ], null, update); }),
                    index_1.directiveDef(32768 /* Component */, null, 0, AComp, [], null, null),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var compView = index_1.asElementData(view, 0).componentView;
                update.and.callFake(function (check, view) { throw new Error('Test'); });
                expect(function () { return index_1.Services.checkAndUpdateView(view); }).toThrowError('Test');
                expect(update).toHaveBeenCalled();
                update.calls.reset();
                expect(function () { return index_1.Services.checkAndUpdateView(view); }).toThrowError('Test');
                expect(update).toHaveBeenCalled();
            });
        });
        describe('destroy', function () {
            it('should destroy component views', function () {
                var log = [];
                var AComp = (function () {
                    function AComp() {
                    }
                    return AComp;
                }());
                var ChildProvider = (function () {
                    function ChildProvider() {
                    }
                    ChildProvider.prototype.ngOnDestroy = function () { log.push('ngOnDestroy'); };
                    ;
                    return ChildProvider;
                }());
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(131072 /* OnDestroy */, null, 0, ChildProvider, [])
                    ]); }),
                    index_1.directiveDef(32768 /* Component */, null, 0, AComp, [], null, null),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.destroyView(view);
                expect(log).toEqual(['ngOnDestroy']);
            });
            it('should throw on dirty checking destroyed views', function () {
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 0, 'div'),
                ], function (view) { })), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.destroyView(view);
                expect(function () { return index_1.Services.checkAndUpdateView(view); })
                    .toThrowError('ViewDestroyedError: Attempt to use a destroyed view: detectChanges');
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X3ZpZXdfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L2NvbXBvbmVudF92aWV3X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBeUg7QUFDekgsc0RBQWlVO0FBQ2pVLDZFQUFxRTtBQUVyRSxtQ0FBdUU7QUFFdkU7OztHQUdHO0FBQ0gsSUFBTSxnQkFBZ0IsR0FBRyxpQ0FBaUMsQ0FBQztBQUUzRDtJQUNFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixxQkFDSSxLQUFnQixFQUFFLGdCQUErQixFQUFFLGNBQTZCLEVBQ2hGLFNBQXFDO1lBQXJDLDBCQUFBLEVBQUEsd0JBQXFDO1lBQ3ZDLE1BQU0sQ0FBQyxlQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBRUQsK0JBQStCLE9BQXVCO1lBQ3BELElBQU0sSUFBSSxHQUFHLHVCQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckMsSUFBTSxTQUFTLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsSUFBSSxRQUFRLEdBQVUsU0FBVyxDQUFDO1lBQ2xDO2dCQUNFO29CQUFnQixRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUFDLENBQUM7Z0JBQ3BDLFlBQUM7WUFBRCxDQUFDLEFBRkQsSUFFQztZQUVLLElBQUE7Ozs7O2VBT0gsRUFQSSxjQUFJLEVBQUUsd0JBQVMsQ0FPbEI7WUFFSixJQUFNLFFBQVEsR0FBRyxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFFdEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFMUMsSUFBTSxVQUFVLEdBQUcsb0JBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxDQUFDLGtCQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEIsUUFBUSxDQUFDLFlBQVksRUFBRTtnQkFDckIsSUFBSSxRQUFxQixDQUFDO2dCQUMxQixVQUFVLENBQUM7b0JBQ1QsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNwQywyQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO29CQUNwRCxJQUFNLElBQUksR0FBRyx1QkFBYyxDQUN2QixXQUFXLENBQUM7d0JBQ1Ysa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDO3FCQUNyRCxDQUFDLEVBQ0YsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDcEIsSUFBTSxTQUFTLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtvQkFDaEQsSUFBTSxJQUFJLEdBQUcsdUJBQWMsQ0FDdkIsV0FBVyxDQUFDO3dCQUNWLGtCQUFVLGVBQWlCLElBQU0sRUFBRSxJQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQztxQkFDckQsQ0FBQyxFQUNGLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3RCLElBQU0sU0FBUyxHQUFHLHVCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7b0JBQzNDLElBQU0sSUFBSSxHQUFHLHVCQUFjLENBQ3ZCLFdBQVcsQ0FBQzt3QkFDVixrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNuRSxDQUFDLEVBQ0YsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9DLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtvQkFDOUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3BELElBQU0sSUFBSSxHQUFHLHVCQUFjLENBQ3ZCLFdBQVcsQ0FBQzt3QkFDVixrQkFBVSxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNuRSxDQUFDLEVBQ0YsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUU7WUFDdkIsRUFBRSxDQUFDLG9DQUFvQyxFQUFFO2dCQUN2QyxJQUFJLEtBQVUsQ0FBQztnQkFDZjtvQkFBQTtvQkFFQSxDQUFDO29CQUFELFlBQUM7Z0JBQUQsQ0FBQyxBQUZELElBRUM7Z0JBRUQsSUFBTSxNQUFNLEdBQ1IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQUMsS0FBa0IsRUFBRSxJQUFjO29CQUMzRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsa0JBQXVCLEtBQUssQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsQ0FBQztnQkFFRCxJQUFBOzs7OzttQkFRRCxFQVJFLGNBQUksRUFBRSx3QkFBUyxDQVFoQjtnQkFDTixJQUFNLFFBQVEsR0FBRyxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBRXRELEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2IsZ0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV6RCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNyQixnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVsQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXpELEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLGNBQU0sT0FBQSxnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFqQyxDQUFpQyxDQUFDO3FCQUMxQyxZQUFZLENBQ1Qsc0lBQXNJLENBQUMsQ0FBQztZQUNsSixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtnQkFDOUU7b0JBQUE7b0JBRUEsQ0FBQztvQkFBRCxZQUFDO2dCQUFELENBQUMsQUFGRCxJQUVDO2dCQUVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXRDLElBQUE7Ozs7O21CQVNILEVBVEksY0FBSSxFQUFFLHdCQUFTLENBU2xCO2dCQUVKLElBQU0sUUFBUSxHQUFHLHFCQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFFdEQsZ0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFckIsUUFBUSxDQUFDLEtBQUssSUFBSSxzQkFBd0IsQ0FBQztnQkFDM0MsZ0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUV0QyxRQUFRLENBQUMsS0FBSyx5QkFBMkIsQ0FBQztnQkFDMUMsZ0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsQ0FBQyxrQkFBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLENBQUMsa0NBQWtDLEVBQUU7b0JBQ3JDLElBQUksY0FBbUIsQ0FBQztvQkFDeEI7d0JBQUE7d0JBRUEsQ0FBQzt3QkFBRCxZQUFDO29CQUFELENBQUMsQUFGRCxJQUVDO29CQUVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBRTVDLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUVqRixJQUFBOzs7Ozs7O3dHQUFJLENBZXFFO29CQUVoRixnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVsQyxjQUFjO29CQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3JCLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFFdEMsK0JBQStCO29CQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNyQixjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUN0QixnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFFbEMsY0FBYztvQkFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNyQixnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7b0JBRXRDLHdCQUF3QjtvQkFDeEIsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3ZELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3JCLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUVsQyxjQUFjO29CQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3JCLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEMsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLDRFQUE0RSxFQUFFO2dCQUMvRTtvQkFBQTtvQkFFQSxDQUFDO29CQUFELFlBQUM7Z0JBQUQsQ0FBQyxBQUZELElBRUM7Z0JBRUQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFdEMsSUFBQTs7Ozs7bUJBU0gsRUFUSSxjQUFJLEVBQUUsd0JBQVMsQ0FTbEI7Z0JBRUosSUFBTSxRQUFRLEdBQUcscUJBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUV0RCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFDLEtBQWtCLEVBQUUsSUFBYyxJQUFPLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUYsTUFBTSxDQUFDLGNBQU0sT0FBQSxnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFFbEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDckIsTUFBTSxDQUFDLGNBQU0sT0FBQSxnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNsQixFQUFFLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ25DLElBQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztnQkFFekI7b0JBQUE7b0JBQWEsQ0FBQztvQkFBRCxZQUFDO2dCQUFELENBQUMsQUFBZCxJQUFjO2dCQUVkO29CQUFBO29CQUVBLENBQUM7b0JBREMsbUNBQVcsR0FBWCxjQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFBQSxDQUFDO29CQUM3QyxvQkFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFFSyxJQUFBOzs7Ozs7bUJBUUgsRUFSSSxjQUFJLEVBQUUsd0JBQVMsQ0FRbEI7Z0JBRUosZ0JBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO2dCQUM3QyxJQUFBOzt3Q0FJWSxFQUpYLGNBQUksRUFBRSx3QkFBUyxDQUlIO2dCQUVuQixnQkFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFM0IsTUFBTSxDQUFDLGNBQU0sT0FBQSxnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFqQyxDQUFpQyxDQUFDO3FCQUMxQyxZQUFZLENBQUMsb0VBQW9FLENBQUMsQ0FBQztZQUMxRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBalNELG9CQWlTQyJ9