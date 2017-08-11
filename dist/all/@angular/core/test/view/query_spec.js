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
var errors_1 = require("@angular/core/src/errors");
var index_1 = require("@angular/core/src/view/index");
var helper_1 = require("./helper");
function main() {
    describe("Query Views", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
            if (viewFlags === void 0) { viewFlags = 0 /* None */; }
            return index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
        }
        function embeddedViewDef(nodes, update) {
            return function () { return index_1.viewDef(0 /* None */, nodes, update); };
        }
        function createAndGetRootNodes(viewDef, context) {
            if (context === void 0) { context = null; }
            var view = helper_1.createRootView(viewDef, context);
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        var someQueryId = 1;
        var AService = (function () {
            function AService() {
            }
            return AService;
        }());
        var QueryService = (function () {
            function QueryService() {
            }
            return QueryService;
        }());
        function contentQueryProviders() {
            return [
                index_1.directiveDef(0 /* None */, null, 1, QueryService, []),
                index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ })
            ];
        }
        function compViewQueryProviders(extraChildCount, nodes) {
            return [
                index_1.elementDef(0 /* None */, null, null, 1 + extraChildCount, 'div', null, null, null, null, function () { return compViewDef([
                    index_1.queryDef(134217728 /* TypeViewQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ })
                ].concat(nodes)); }),
                index_1.directiveDef(32768 /* Component */, null, 0, QueryService, [], null, null),
            ];
        }
        function aServiceProvider() {
            return index_1.directiveDef(0 /* None */, [[someQueryId, 4 /* Provider */]], 0, AService, []);
        }
        describe('content queries', function () {
            it('should query providers on the same element and child elements', function () {
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 5, 'div')
                ].concat(contentQueryProviders(), [
                    aServiceProvider(),
                    index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                    aServiceProvider(),
                ]))).view;
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a).toBeUndefined();
                index_1.Services.checkAndUpdateView(view);
                var as = qs.a.toArray();
                expect(as.length).toBe(2);
                expect(as[0]).toBe(index_1.asProviderData(view, 3).instance);
                expect(as[1]).toBe(index_1.asProviderData(view, 5).instance);
            });
            it('should not query providers on sibling or parent elements', function () {
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 6, 'div'),
                    aServiceProvider(),
                    index_1.elementDef(0 /* None */, null, null, 2, 'div')
                ].concat(contentQueryProviders(), [
                    index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                    aServiceProvider(),
                ]))).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 3).instance;
                expect(qs.a.length).toBe(0);
            });
        });
        describe('view queries', function () {
            it('should query providers in the view', function () {
                var view = createAndGetRootNodes(compViewDef(compViewQueryProviders(0, [
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    aServiceProvider(),
                ]).slice())).view;
                index_1.Services.checkAndUpdateView(view);
                var comp = index_1.asProviderData(view, 1).instance;
                var compView = index_1.asElementData(view, 0).componentView;
                expect(comp.a.length).toBe(1);
                expect(comp.a.first).toBe(index_1.asProviderData(compView, 2).instance);
            });
            it('should not query providers on the host element', function () {
                var view = createAndGetRootNodes(compViewDef(compViewQueryProviders(1, [
                    index_1.elementDef(0 /* None */, null, null, 0, 'span'),
                ]).concat([
                    aServiceProvider(),
                ]))).view;
                index_1.Services.checkAndUpdateView(view);
                var comp = index_1.asProviderData(view, 1).instance;
                expect(comp.a.length).toBe(0);
            });
        });
        describe('embedded views', function () {
            it('should query providers in embedded views', function () {
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 5, 'div')
                ].concat(contentQueryProviders(), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 2, null, embeddedViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(),
                    ]))
                ], contentQueryProviders()))).view;
                var childView = helper_1.createEmbeddedView(view, view.def.nodes[3]);
                index_1.attachEmbeddedView(view, index_1.asElementData(view, 3), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                // queries on parent elements of anchors
                var qs1 = index_1.asProviderData(view, 1).instance;
                expect(qs1.a.length).toBe(1);
                expect(qs1.a.first instanceof AService).toBe(true);
                // queries on the anchor
                var qs2 = index_1.asProviderData(view, 4).instance;
                expect(qs2.a.length).toBe(1);
                expect(qs2.a.first instanceof AService).toBe(true);
            });
            it('should query providers in embedded views only at the template declaration', function () {
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 3, 'div')
                ].concat(contentQueryProviders(), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(),
                    ])),
                    index_1.elementDef(0 /* None */, null, null, 3, 'div')
                ], contentQueryProviders(), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0),
                ]))).view;
                var childView = helper_1.createEmbeddedView(view, view.def.nodes[3]);
                // attach at a different place than the one where the template was defined
                index_1.attachEmbeddedView(view, index_1.asElementData(view, 7), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                // query on the declaration place
                var qs1 = index_1.asProviderData(view, 1).instance;
                expect(qs1.a.length).toBe(1);
                expect(qs1.a.first instanceof AService).toBe(true);
                // query on the attach place
                var qs2 = index_1.asProviderData(view, 5).instance;
                expect(qs2.a.length).toBe(0);
            });
            it('should update content queries if embedded views are added or removed', function () {
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 3, 'div')
                ].concat(contentQueryProviders(), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(),
                    ])),
                ]))).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.length).toBe(0);
                var childView = helper_1.createEmbeddedView(view, view.def.nodes[3]);
                index_1.attachEmbeddedView(view, index_1.asElementData(view, 3), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                expect(qs.a.length).toBe(1);
                index_1.detachEmbeddedView(index_1.asElementData(view, 3), 0);
                index_1.Services.checkAndUpdateView(view);
                expect(qs.a.length).toBe(0);
            });
            it('should update view queries if embedded views are added or removed', function () {
                var view = createAndGetRootNodes(compViewDef(compViewQueryProviders(0, [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(),
                    ])),
                ]).slice())).view;
                index_1.Services.checkAndUpdateView(view);
                var comp = index_1.asProviderData(view, 1).instance;
                expect(comp.a.length).toBe(0);
                var compView = index_1.asElementData(view, 0).componentView;
                var childView = helper_1.createEmbeddedView(compView, compView.def.nodes[1]);
                index_1.attachEmbeddedView(view, index_1.asElementData(compView, 1), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                expect(comp.a.length).toBe(1);
                index_1.detachEmbeddedView(index_1.asElementData(compView, 1), 0);
                index_1.Services.checkAndUpdateView(view);
                expect(comp.a.length).toBe(0);
            });
        });
        describe('QueryBindingType', function () {
            it('should query all matches', function () {
                var QueryService = (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 4, 'div'),
                    index_1.directiveDef(0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ }),
                    aServiceProvider(),
                    aServiceProvider(),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a instanceof core_1.QueryList).toBeTruthy();
                expect(qs.a.toArray()).toEqual([
                    index_1.asProviderData(view, 3).instance,
                    index_1.asProviderData(view, 4).instance,
                ]);
            });
            it('should query the first match', function () {
                var QueryService = (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 4, 'div'),
                    index_1.directiveDef(0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                    aServiceProvider(),
                    aServiceProvider(),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a).toBe(index_1.asProviderData(view, 3).instance);
            });
        });
        describe('query builtins', function () {
            it('should query ElementRef', function () {
                var QueryService = (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, [[someQueryId, 0 /* ElementRef */]], null, 2, 'div'),
                    index_1.directiveDef(0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.nativeElement).toBe(index_1.asElementData(view, 0).renderElement);
            });
            it('should query TemplateRef', function () {
                var QueryService = (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = createAndGetRootNodes(compViewDef([
                    index_1.anchorDef(0 /* None */, [[someQueryId, 2 /* TemplateRef */]], null, 2, null, embeddedViewDef([index_1.anchorDef(0 /* None */, null, null, 0)])),
                    index_1.directiveDef(0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.createEmbeddedView).toBeTruthy();
            });
            it('should query ViewContainerRef', function () {
                var QueryService = (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = createAndGetRootNodes(compViewDef([
                    index_1.anchorDef(16777216 /* EmbeddedViews */, [[someQueryId, 3 /* ViewContainerRef */]], null, 2),
                    index_1.directiveDef(0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.createEmbeddedView).toBeTruthy();
            });
        });
        describe('general binding behavior', function () {
            it('should report debug info on binding errors', function () {
                var QueryService = (function () {
                    function QueryService() {
                    }
                    Object.defineProperty(QueryService.prototype, "a", {
                        set: function (value) { throw new Error('Test'); },
                        enumerable: true,
                        configurable: true
                    });
                    return QueryService;
                }());
                var view = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 3, 'div'),
                    index_1.directiveDef(0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ }),
                    aServiceProvider(),
                ])).view;
                var err;
                try {
                    index_1.Services.checkAndUpdateView(view);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                expect(debugCtx.nodeIndex).toBe(2);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L3F1ZXJ5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBNkw7QUFDN0wsbURBQXlEO0FBQ3pELHNEQUF3WTtBQUl4WSxtQ0FBNEQ7QUFFNUQ7SUFDRSxRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLHFCQUNJLEtBQWdCLEVBQUUsZ0JBQStCLEVBQUUsY0FBNkIsRUFDaEYsU0FBcUM7WUFBckMsMEJBQUEsRUFBQSx3QkFBcUM7WUFDdkMsTUFBTSxDQUFDLGVBQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFRCx5QkFBeUIsS0FBZ0IsRUFBRSxNQUFxQjtZQUM5RCxNQUFNLENBQUMsY0FBTSxPQUFBLGVBQU8sZUFBaUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUF0QyxDQUFzQyxDQUFDO1FBQ3RELENBQUM7UUFFRCwrQkFDSSxPQUF1QixFQUFFLE9BQW1CO1lBQW5CLHdCQUFBLEVBQUEsY0FBbUI7WUFDOUMsSUFBTSxJQUFJLEdBQUcsdUJBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUMsSUFBTSxTQUFTLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxJQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFFdEI7WUFBQTtZQUFnQixDQUFDO1lBQUQsZUFBQztRQUFELENBQUMsQUFBakIsSUFBaUI7UUFFakI7WUFBQTtZQUVBLENBQUM7WUFBRCxtQkFBQztRQUFELENBQUMsQUFGRCxJQUVDO1FBRUQ7WUFDRSxNQUFNLENBQUM7Z0JB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