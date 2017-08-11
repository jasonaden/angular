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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/platform-browser-dynamic/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_renderer_1 = require("@angular/platform-browser/src/dom/dom_renderer");
var testing_3 = require("@angular/platform-browser/testing");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var client_message_broker_1 = require("../../../src/web_workers/shared/client_message_broker");
var render_store_1 = require("../../../src/web_workers/shared/render_store");
var serializer_1 = require("../../../src/web_workers/shared/serializer");
var service_message_broker_1 = require("../../../src/web_workers/shared/service_message_broker");
var renderer_1 = require("../../../src/web_workers/ui/renderer");
var renderer_2 = require("../../../src/web_workers/worker/renderer");
var web_worker_test_util_1 = require("../shared/web_worker_test_util");
var lastCreatedRenderer;
function main() {
    describe('Web Worker Renderer v2', function () {
        // Don't run on server...
        if (!dom_adapter_1.getDOM().supportsDOMEvents())
            return;
        var uiRenderStore;
        var wwRenderStore;
        beforeEach(function () {
            // UI side
            uiRenderStore = new render_store_1.RenderStore();
            var uiInjector = new testing_1.TestBed();
            uiInjector.platform = testing_2.platformBrowserDynamicTesting();
            uiInjector.ngModule = testing_3.BrowserTestingModule;
            uiInjector.configureTestingModule({
                providers: [
                    serializer_1.Serializer,
                    { provide: render_store_1.RenderStore, useValue: uiRenderStore },
                    dom_renderer_1.DomRendererFactory2,
                    { provide: core_1.RendererFactory2, useExisting: dom_renderer_1.DomRendererFactory2 },
                ]
            });
            var uiSerializer = uiInjector.get(serializer_1.Serializer);
            var domRendererFactory = uiInjector.get(core_1.RendererFactory2);
            // Worker side
            lastCreatedRenderer = null;
            wwRenderStore = new render_store_1.RenderStore();
            testing_1.TestBed.configureTestingModule({
                declarations: [MyComp2],
                providers: [
                    serializer_1.Serializer,
                    { provide: render_store_1.RenderStore, useValue: wwRenderStore },
                    {
                        provide: core_1.RendererFactory2,
                        useFactory: function (wwSerializer) { return createWebWorkerRendererFactory2(wwSerializer, uiSerializer, domRendererFactory, uiRenderStore, wwRenderStore); },
                        deps: [serializer_1.Serializer],
                    },
                ],
            });
        });
        function getRenderElement(workerEl) {
            var id = wwRenderStore.serialize(workerEl);
            return uiRenderStore.deserialize(id);
        }
        it('should update text nodes', function () {
            var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<div>{{ctxProp}}</div>').createComponent(MyComp2);
            var renderEl = getRenderElement(fixture.nativeElement);
            matchers_1.expect(renderEl).toHaveText('');
            fixture.componentInstance.ctxProp = 'Hello World!';
            fixture.detectChanges();
            matchers_1.expect(renderEl).toHaveText('Hello World!');
        });
        it('should update any element property/attributes/class/style(s) independent of the compilation on the root element and other elements', function () {
            var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<input [title]="y" style="position:absolute">')
                .createComponent(MyComp2);
            var checkSetters = function (componentRef, workerEl) {
                matchers_1.expect(lastCreatedRenderer).not.toEqual(null);
                var el = getRenderElement(workerEl);
                lastCreatedRenderer.setProperty(workerEl, 'tabIndex', 1);
                matchers_1.expect(el.tabIndex).toEqual(1);
                lastCreatedRenderer.addClass(workerEl, 'a');
                matchers_1.expect(dom_adapter_1.getDOM().hasClass(el, 'a')).toBe(true);
                lastCreatedRenderer.removeClass(workerEl, 'a');
                matchers_1.expect(dom_adapter_1.getDOM().hasClass(el, 'a')).toBe(false);
                lastCreatedRenderer.setStyle(workerEl, 'width', '10px');
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(el, 'width')).toEqual('10px');
                lastCreatedRenderer.removeStyle(workerEl, 'width');
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(el, 'width')).toEqual('');
                lastCreatedRenderer.setAttribute(workerEl, 'someattr', 'someValue');
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(el, 'someattr')).toEqual('someValue');
            };
            // root element
            checkSetters(fixture.componentRef, fixture.nativeElement);
            // nested elements
            checkSetters(fixture.componentRef, fixture.debugElement.children[0].nativeElement);
        });
        it('should update any template comment property/attributes', function () {
            var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<ng-container *ngIf="ctxBoolProp"></ng-container>')
                .createComponent(MyComp2);
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            var el = getRenderElement(fixture.nativeElement);
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(el)).toContain('"ng-reflect-ng-if": "true"');
        });
        it('should add and remove fragments', function () {
            var fixture = testing_1.TestBed
                .overrideTemplate(MyComp2, '<ng-container *ngIf="ctxBoolProp">hello</ng-container>')
                .createComponent(MyComp2);
            var rootEl = getRenderElement(fixture.nativeElement);
            matchers_1.expect(rootEl).toHaveText('');
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            matchers_1.expect(rootEl).toHaveText('hello');
            fixture.componentInstance.ctxBoolProp = false;
            fixture.detectChanges();
            matchers_1.expect(rootEl).toHaveText('');
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            it('should listen to events', function () {
                var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<input (change)="ctxNumProp = 1">')
                    .createComponent(MyComp2);
                var el = fixture.debugElement.children[0];
                browser_util_1.dispatchEvent(getRenderElement(el.nativeElement), 'change');
                matchers_1.expect(fixture.componentInstance.ctxNumProp).toBe(1);
                fixture.destroy();
            });
        }
    });
}
exports.main = main;
var MyComp2 = (function () {
    function MyComp2() {
        this.ctxProp = 'initial value';
        this.ctxNumProp = 0;
        this.ctxBoolProp = false;
    }
    return MyComp2;
}());
MyComp2 = __decorate([
    core_1.Component({ selector: 'my-comp' })
], MyComp2);
function createWebWorkerBrokerFactory(messageBuses, wwSerializer, uiSerializer, domRendererFactory, uiRenderStore) {
    var uiMessageBus = messageBuses.ui;
    var wwMessageBus = messageBuses.worker;
    // set up the worker side
    var wwBrokerFactory = new client_message_broker_1.ClientMessageBrokerFactory_(wwMessageBus, wwSerializer);
    // set up the ui side
    var uiBrokerFactory = new service_message_broker_1.ServiceMessageBrokerFactory_(uiMessageBus, uiSerializer);
    var renderer = new renderer_1.MessageBasedRenderer2(uiBrokerFactory, uiMessageBus, uiSerializer, uiRenderStore, domRendererFactory);
    renderer.start();
    return wwBrokerFactory;
}
function createWebWorkerRendererFactory2(workerSerializer, uiSerializer, domRendererFactory, uiRenderStore, workerRenderStore) {
    var messageBuses = web_worker_test_util_1.createPairedMessageBuses();
    var brokerFactory = createWebWorkerBrokerFactory(messageBuses, workerSerializer, uiSerializer, domRendererFactory, uiRenderStore);
    var rendererFactory = new RenderFactory(brokerFactory, messageBuses.worker, workerSerializer, workerRenderStore);
    return rendererFactory;
}
var RenderFactory = (function (_super) {
    __extends(RenderFactory, _super);
    function RenderFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderFactory.prototype.createRenderer = function (element, type) {
        lastCreatedRenderer = _super.prototype.createRenderer.call(this, element, type);
        return lastCreatedRenderer;
    };
    return RenderFactory;
}(renderer_2.WebWorkerRendererFactory2));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXJfdjJfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci90ZXN0L3dlYl93b3JrZXJzL3dvcmtlci9yZW5kZXJlcl92Ml9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFnSDtBQUNoSCxpREFBOEM7QUFDOUMscUVBQXdGO0FBQ3hGLDZFQUFxRTtBQUNyRSwrRUFBbUY7QUFDbkYsNkRBQXVFO0FBQ3ZFLG1GQUFpRjtBQUNqRiwyRUFBc0U7QUFFdEUsK0ZBQThIO0FBQzlILDZFQUF5RTtBQUN6RSx5RUFBc0U7QUFDdEUsaUdBQW9HO0FBQ3BHLGlFQUEyRTtBQUMzRSxxRUFBbUY7QUFDbkYsdUVBQTRGO0FBRTVGLElBQUksbUJBQThCLENBQUM7QUFFbkM7SUFDRSxRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDakMseUJBQXlCO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsb0JBQU0sRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFBQyxNQUFNLENBQUM7UUFFMUMsSUFBSSxhQUEwQixDQUFDO1FBQy9CLElBQUksYUFBMEIsQ0FBQztRQUUvQixVQUFVLENBQUM7WUFDVCxVQUFVO1lBQ1YsYUFBYSxHQUFHLElBQUksMEJBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQU0sVUFBVSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ2pDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsdUNBQTZCLEVBQUUsQ0FBQztZQUN0RCxVQUFVLENBQUMsUUFBUSxHQUFHLDhCQUFvQixDQUFDO1lBQzNDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDaEMsU0FBUyxFQUFFO29CQUNULHVCQUFVO29CQUNWLEVBQUMsT0FBTyxFQUFFLDBCQUFXLEVBQUUs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