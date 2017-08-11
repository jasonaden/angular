"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var index_1 = require("@angular/core/src/view/index");
var dom_renderer_1 = require("@angular/platform-browser/src/dom/dom_renderer");
var dom_sanitization_service_1 = require("@angular/platform-browser/src/security/dom_sanitization_service");
var util_1 = require("../util");
var trustedEmptyColor;
var trustedGreyColor;
var TreeComponent = (function () {
    function TreeComponent() {
        this.data = util_1.emptyTree;
    }
    Object.defineProperty(TreeComponent.prototype, "bgColor", {
        get: function () { return this.data.depth % 2 ? trustedEmptyColor : trustedGreyColor; },
        enumerable: true,
        configurable: true
    });
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
var viewFlags = 0 /* None */;
function TreeComponent_Host() {
    return index_1.viewDef(viewFlags, [
        index_1.elementDef(0 /* None */, null, null, 1, 'tree', null, null, null, null, TreeComponent_0),
        index_1.directiveDef(32768 /* Component */, null, 0, TreeComponent, []),
    ]);
}
function TreeComponent_1() {
    return index_1.viewDef(viewFlags, [
        index_1.elementDef(0 /* None */, null, null, 1, 'tree', null, null, null, null, TreeComponent_0),
        index_1.directiveDef(32768 /* Component */, null, 0, TreeComponent, [], { data: [0, 'data'] }),
    ], function (check, view) {
        var cmp = view.component;
        check(view, 1, 0 /* Inline */, cmp.data.left);
    });
}
function TreeComponent_2() {
    return index_1.viewDef(viewFlags, [
        index_1.elementDef(0 /* None */, null, null, 1, 'tree', null, null, null, null, TreeComponent_0),
        index_1.directiveDef(32768 /* Component */, null, 0, TreeComponent, [], { data: [0, 'data'] }),
    ], function (check, view) {
        var cmp = view.component;
        check(view, 1, 0 /* Inline */, cmp.data.left);
    });
}
function TreeComponent_0() {
    return index_1.viewDef(viewFlags, [
        index_1.elementDef(0 /* None */, null, null, 1, 'span', null, [[4 /* TypeElementStyle */, 'backgroundColor', null]]),
        index_1.textDef(null, [' ', ' ']),
        index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 1, null, TreeComponent_1),
        index_1.directiveDef(0 /* None */, null, 0, common_1.NgIf, [core_1.ViewContainerRef, core_1.TemplateRef], { ngIf: [0, 'ngIf'] }),
        index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 1, null, TreeComponent_2),
        index_1.directiveDef(0 /* None */, null, 0, common_1.NgIf, [core_1.ViewContainerRef, core_1.TemplateRef], { ngIf: [0, 'ngIf'] }),
    ], function (check, view) {
        var cmp = view.component;
        check(view, 3, 0 /* Inline */, cmp.data.left != null);
        check(view, 5, 0 /* Inline */, cmp.data.right != null);
    }, function (check, view) {
        var cmp = view.component;
        check(view, 0, 0 /* Inline */, cmp.bgColor);
        check(view, 1, 0 /* Inline */, cmp.data.value);
    });
}
var AppModule = (function () {
    function AppModule() {
        index_1.initServicesIfNeeded();
        this.sanitizer = new dom_sanitization_service_1.DomSanitizerImpl(document);
        this.renderer2 = new dom_renderer_1.DomRendererFactory2(null, null);
        trustedEmptyColor = this.sanitizer.bypassSecurityTrustStyle('');
        trustedGreyColor = this.sanitizer.bypassSecurityTrustStyle('grey');
        this.componentFactory =
            index_1.createComponentFactory('#root', TreeComponent, TreeComponent_Host, {}, {}, []);
    }
    AppModule.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = core_1.Injector.THROW_IF_NOT_FOUND; }
        switch (token) {
            case core_1.RendererFactory2:
                return this.renderer2;
            case core_1.Sanitizer:
                return this.sanitizer;
            case core_1.RootRenderer:
            case core_1.ErrorHandler:
                return null;
            case core_1.NgModuleRef:
                return this;
        }
        return core_1.Injector.NULL.get(token, notFoundValue);
    };
    AppModule.prototype.bootstrap = function () {
        this.componentRef =
            this.componentFactory.create(core_1.Injector.NULL, [], this.componentFactory.selector, this);
    };
    AppModule.prototype.tick = function () { this.componentRef.changeDetectorRef.detectChanges(); };
    Object.defineProperty(AppModule.prototype, "injector", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModule.prototype, "componentFactoryResolver", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModule.prototype, "instance", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    AppModule.prototype.destroy = function () { };
    AppModule.prototype.onDestroy = function (callback) { };
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzJfbmV4dC90cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQXFDO0FBQ3JDLHNDQUFzTTtBQUN0TSxzREFBbU47QUFDbk4sK0VBQW1GO0FBQ25GLDRHQUE0RztBQUU1RyxnQ0FBNEM7QUFFNUMsSUFBSSxpQkFBNEIsQ0FBQztBQUNqQyxJQUFJLGdCQUEyQixDQUFDO0FBRWhDO0lBQUE7UUFDRSxTQUFJLEdBQWEsZ0JBQVMsQ0FBQztJQUU3QixDQUFDO0lBREMsc0JBQUksa0NBQU87YUFBWCxjQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDdEYsb0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLHNDQUFhO0FBSzFCLElBQUksU0FBUyxlQUFpQixDQUFDO0FBRS9CO0lBQ0UsTUFBTSxDQUFDLGVBQU8sQ0FBQyxTQUFTLEVBQUU7UUFDeEIsa0JBQVUsZUFBaUIsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxlQUFlLENBQUM7UUFDMUYsb0JBQVksd0JBQXNCLElBQUksRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FBQztLQUM5RCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7SUFDRSxNQUFNLENBQUMsZUFBTyxDQUNWLFNBQVMsRUFDVDtRQUNFLGtCQUFVLGVBQWlCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsZUFBZSxD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