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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var EMPTY_ARRAY = [];
var ServerRendererFactory2 = (function () {
    function ServerRendererFactory2(ngZone, document, sharedStylesHost) {
        this.ngZone = ngZone;
        this.document = document;
        this.sharedStylesHost = sharedStylesHost;
        this.rendererByCompId = new Map();
        this.schema = new compiler_1.DomElementSchemaRegistry();
        this.defaultRenderer = new DefaultServerRenderer2(document, ngZone, this.schema);
    }
    ;
    ServerRendererFactory2.prototype.createRenderer = function (element, type) {
        if (!element || !type) {
            return this.defaultRenderer;
        }
        switch (type.encapsulation) {
            case core_1.ViewEncapsulation.Native:
            case core_1.ViewEncapsulation.Emulated: {
                var renderer = this.rendererByCompId.get(type.id);
                if (!renderer) {
                    renderer = new EmulatedEncapsulationServerRenderer2(this.document, this.ngZone, this.sharedStylesHost, this.schema, type);
                    this.rendererByCompId.set(type.id, renderer);
                }
                renderer.applyToHost(element);
                return renderer;
            }
            case core_1.ViewEncapsulation.Native:
                throw new Error('Native encapsulation is not supported on the server!');
            default: {
                if (!this.rendererByCompId.has(type.id)) {
                    var styles = platform_browser_1.ɵflattenStyles(type.id, type.styles, []);
                    this.sharedStylesHost.addStyles(styles);
                    this.rendererByCompId.set(type.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
        }
    };
    ServerRendererFactory2.prototype.begin = function () { };
    ServerRendererFactory2.prototype.end = function () { };
    return ServerRendererFactory2;
}());
ServerRendererFactory2 = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [core_1.NgZone, Object, platform_browser_1.ɵSharedStylesHost])
], ServerRendererFactory2);
exports.ServerRendererFactory2 = ServerRendererFactory2;
var DefaultServerRenderer2 = (function () {
    function DefaultServerRenderer2(document, ngZone, schema) {
        this.document = document;
        this.ngZone = ngZone;
        this.schema = schema;
        this.data = Object.create(null);
    }
    DefaultServerRenderer2.prototype.destroy = function () { };
    DefaultServerRenderer2.prototype.createElement = function (name, namespace, debugInfo) {
        if (namespace) {
            return platform_browser_1.ɵgetDOM().createElementNS(platform_browser_1.ɵNAMESPACE_URIS[namespace], name);
        }
        return platform_browser_1.ɵgetDOM().createElement(name);
    };
    DefaultServerRenderer2.prototype.createComment = function (value, debugInfo) { return platform_browser_1.ɵgetDOM().createComment(value); };
    DefaultServerRenderer2.prototype.createText = function (value, debugInfo) { return platform_browser_1.ɵgetDOM().createTextNode(value); };
    DefaultServerRenderer2.prototype.appendChild = function (parent, newChild) { platform_browser_1.ɵgetDOM().appendChild(parent, newChild); };
    DefaultServerRenderer2.prototype.insertBefore = function (parent, newChild, refChild) {
        if (parent) {
            platform_browser_1.ɵgetDOM().insertBefore(parent, refChild, newChild);
        }
    };
    DefaultServerRenderer2.prototype.removeChild = function (parent, oldChild) {
        if (parent) {
            platform_browser_1.ɵgetDOM().removeChild(parent, oldChild);
        }
    };
    DefaultServerRenderer2.prototype.selectRootElement = function (selectorOrNode, debugInfo) {
        var el;
        if (typeof selectorOrNode === 'string') {
            el = platform_browser_1.ɵgetDOM().querySelector(this.document, selectorOrNode);
            if (!el) {
                throw new Error("The selector \"" + selectorOrNode + "\" did not match any elements");
            }
        }
        else {
            el = selectorOrNode;
        }
        platform_browser_1.ɵgetDOM().clearNodes(el);
        return el;
    };
    DefaultServerRenderer2.prototype.parentNode = function (node) { return platform_browser_1.ɵgetDOM().parentElement(node); };
    DefaultServerRenderer2.prototype.nextSibling = function (node) { return platform_browser_1.ɵgetDOM().nextSibling(node); };
    DefaultServerRenderer2.prototype.setAttribute = function (el, name, value, namespace) {
        if (namespace) {
            platform_browser_1.ɵgetDOM().setAttributeNS(el, platform_browser_1.ɵNAMESPACE_URIS[namespace], namespace + ':' + name, value);
        }
        else {
            platform_browser_1.ɵgetDOM().setAttribute(el, name, value);
        }
    };
    DefaultServerRenderer2.prototype.removeAttribute = function (el, name, namespace) {
        if (namespace) {
            platform_browser_1.ɵgetDOM().removeAttributeNS(el, platform_browser_1.ɵNAMESPACE_URIS[namespace], name);
        }
        else {
            platform_browser_1.ɵgetDOM().removeAttribute(el, name);
        }
    };
    DefaultServerRenderer2.prototype.addClass = function (el, name) { platform_browser_1.ɵgetDOM().addClass(el, name); };
    DefaultServerRenderer2.prototype.removeClass = function (el, name) { platform_browser_1.ɵgetDOM().removeClass(el, name); };
    DefaultServerRenderer2.prototype.setStyle = function (el, style, value, flags) {
        platform_browser_1.ɵgetDOM().setStyle(el, style, value);
    };
    DefaultServerRenderer2.prototype.removeStyle = function (el, style, flags) {
        platform_browser_1.ɵgetDOM().removeStyle(el, style);
    };
    // The value was validated already as a property binding, against the property name.
    // To know this value is safe to use as an attribute, the security context of the
    // attribute with the given name is checked against that security context of the
    // property.
    DefaultServerRenderer2.prototype._isSafeToReflectProperty = function (tagName, propertyName) {
        return this.schema.securityContext(tagName, propertyName, true) ===
            this.schema.securityContext(tagName, propertyName, false);
    };
    DefaultServerRenderer2.prototype.setProperty = function (el, name, value) {
        checkNoSyntheticProp(name, 'property');
        platform_browser_1.ɵgetDOM().setProperty(el, name, value);
        // Mirror property values for known HTML element properties in the attributes.
        var tagName = el.tagName.toLowerCase();
        if (value != null && (typeof value === 'number' || typeof value == 'string') &&
            this.schema.hasElement(tagName, EMPTY_ARRAY) &&
            this.schema.hasProperty(tagName, name, EMPTY_ARRAY) &&
            this._isSafeToReflectProperty(tagName, name)) {
            this.setAttribute(el, name, value.toString());
        }
    };
    DefaultServerRenderer2.prototype.setValue = function (node, value) { platform_browser_1.ɵgetDOM().setText(node, value); };
    DefaultServerRenderer2.prototype.listen = function (target, eventName, callback) {
        var _this = this;
        // Note: We are not using the EventsPlugin here as this is not needed
        // to run our tests.
        checkNoSyntheticProp(eventName, 'listener');
        var el = typeof target === 'string' ? platform_browser_1.ɵgetDOM().getGlobalEventTarget(this.document, target) : target;
        var outsideHandler = function (event) { return _this.ngZone.runGuarded(function () { return callback(event); }); };
        return this.ngZone.runOutsideAngular(function () { return platform_browser_1.ɵgetDOM().onAndCancel(el, eventName, outsideHandler); });
    };
    return DefaultServerRenderer2;
}());
var AT_CHARCODE = '@'.charCodeAt(0);
function checkNoSyntheticProp(name, nameKind) {
    if (name.charCodeAt(0) === AT_CHARCODE) {
        throw new Error("Found the synthetic " + nameKind + " " + name + ". Please include either \"BrowserAnimationsModule\" or \"NoopAnimationsModule\" in your application.");
    }
}
var EmulatedEncapsulationServerRenderer2 = (function (_super) {
    __extends(EmulatedEncapsulationServerRenderer2, _super);
    function EmulatedEncapsulationServerRenderer2(document, ngZone, sharedStylesHost, schema, component) {
        var _this = _super.call(this, document, ngZone, schema) || this;
        _this.component = component;
        var styles = platform_browser_1.ɵflattenStyles(component.id, component.styles, []);
        sharedStylesHost.addStyles(styles);
        _this.contentAttr = platform_browser_1.ɵshimContentAttribute(component.id);
        _this.hostAttr = platform_browser_1.ɵshimHostAttribute(component.id);
        return _this;
    }
    EmulatedEncapsulationServerRenderer2.prototype.applyToHost = function (element) { _super.prototype.setAttribute.call(this, element, this.hostAttr, ''); };
    EmulatedEncapsulationServerRenderer2.prototype.createElement = function (parent, name) {
        var el = _super.prototype.createElement.call(this, parent, name);
        _super.prototype.setAttribute.call(this, el, this.contentAttr, '');
        return el;
    };
    return EmulatedEncapsulationServerRenderer2;
}(DefaultServerRenderer2));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyX3JlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3NyYy9zZXJ2ZXJfcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQTJEO0FBQzNELHNDQUEyTjtBQUMzTiw4REFBeVE7QUFFelEsSUFBTSxXQUFXLEdBQVUsRUFBRSxDQUFDO0FBRzlCLElBQWEsc0JBQXNCO0lBS2pDLGdDQUNZLE1BQWMsRUFBNEIsUUFBYSxFQUN2RCxnQkFBa0M7UUFEbEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUE0QixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQ3ZELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFOdEMscUJBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7UUFFaEQsV0FBTSxHQUFHLElBQUksbUNBQXdCLEVBQUUsQ0FBQztRQUs5QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksc0JBQXNCLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUFBLENBQUM7SUFFRiwrQ0FBYyxHQUFkLFVBQWUsT0FBWSxFQUFFLElBQXdCO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUM5QixDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDM0IsS0FBSyx3QkFBaUIsQ0FBQyxNQUFNLENBQUM7WUFDOUIsS0FBSyx3QkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixD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