"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("@angular/animations/browser");
var core_1 = require("@angular/core");
var ANIMATION_PREFIX = '@';
var DISABLE_ANIMATIONS_FLAG = '@.disabled';
var AnimationRendererFactory = (function () {
    function AnimationRendererFactory(delegate, engine, _zone) {
        this.delegate = delegate;
        this.engine = engine;
        this._zone = _zone;
        this._currentId = 0;
        this._microtaskId = 1;
        this._animationCallbacksBuffer = [];
        this._rendererCache = new Map();
        this._cdRecurDepth = 0;
        engine.onRemovalComplete = function (element, delegate) {
            // Note: if an component element has a leave animation, and the component
            // a host leave animation, the view engine will call `removeChild` for the parent
            // component renderer as well as for the child component renderer.
            // Therefore, we need to check if we already removed the element.
            if (delegate && delegate.parentNode(element)) {
                delegate.removeChild(element.parentNode, element);
            }
        };
    }
    AnimationRendererFactory.prototype.createRenderer = function (hostElement, type) {
        var _this = this;
        var EMPTY_NAMESPACE_ID = '';
        // cache the delegates to find out which cached delegate can
        // be used by which cached renderer
        var delegate = this.delegate.createRenderer(hostElement, type);
        if (!hostElement || !type || !type.data || !type.data['animation']) {
            var renderer = this._rendererCache.get(delegate);
            if (!renderer) {
                renderer = new BaseAnimationRenderer(EMPTY_NAMESPACE_ID, delegate, this.engine);
                // only cache this result when the base renderer is used
                this._rendererCache.set(delegate, renderer);
            }
            return renderer;
        }
        var componentId = type.id;
        var namespaceId = type.id + '-' + this._currentId;
        this._currentId++;
        this.engine.register(namespaceId, hostElement);
        var animationTriggers = type.data['animation'];
        animationTriggers.forEach(function (trigger) { return _this.engine.registerTrigger(componentId, namespaceId, hostElement, trigger.name, trigger); });
        return new AnimationRenderer(this, namespaceId, delegate, this.engine);
    };
    AnimationRendererFactory.prototype.begin = function () {
        this._cdRecurDepth++;
        if (this.delegate.begin) {
            this.delegate.begin();
        }
    };
    AnimationRendererFactory.prototype._scheduleCountTask = function () {
        var _this = this;
        Zone.current.scheduleMicroTask('incremenet the animation microtask', function () { return _this._microtaskId++; });
    };
    /* @internal */
    AnimationRendererFactory.prototype.scheduleListenerCallback = function (count, fn, data) {
        var _this = this;
        if (count >= 0 && count < this._microtaskId) {
            this._zone.run(function () { return fn(data); });
            return;
        }
        if (this._animationCallbacksBuffer.length == 0) {
            Promise.resolve(null).then(function () {
                _this._zone.run(function () {
                    _this._animationCallbacksBuffer.forEach(function (tuple) {
                        var fn = tuple[0], data = tuple[1];
                        fn(data);
                    });
                    _this._animationCallbacksBuffer = [];
                });
            });
        }
        this._animationCallbacksBuffer.push([fn, data]);
    };
    AnimationRendererFactory.prototype.end = function () {
        var _this = this;
        this._cdRecurDepth--;
        // this is to prevent animations from running twice when an inner
        // component does CD when a parent component insted has inserted it
        if (this._cdRecurDepth == 0) {
            this._zone.runOutsideAngular(function () {
                _this._scheduleCountTask();
                _this.engine.flush(_this._microtaskId);
            });
        }
        if (this.delegate.end) {
            this.delegate.end();
        }
    };
    AnimationRendererFactory.prototype.whenRenderingDone = function () { return this.engine.whenRenderingDone(); };
    return AnimationRendererFactory;
}());
AnimationRendererFactory = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.RendererFactory2, browser_1.ɵAnimationEngine, core_1.NgZone])
], AnimationRendererFactory);
exports.AnimationRendererFactory = AnimationRendererFactory;
var BaseAnimationRenderer = (function () {
    function BaseAnimationRenderer(namespaceId, delegate, engine) {
        this.namespaceId = namespaceId;
        this.delegate = delegate;
        this.engine = engine;
        this.destroyNode = this.delegate.destroyNode ? function (n) { return delegate.destroyNode(n); } : null;
    }
    Object.defineProperty(BaseAnimationRenderer.prototype, "data", {
        get: function () { return this.delegate.data; },
        enumerable: true,
        configurable: true
    });
    BaseAnimationRenderer.prototype.destroy = function () {
        this.engine.destroy(this.namespaceId, this.delegate);
        this.delegate.destroy();
    };
    BaseAnimationRenderer.prototype.createElement = function (name, namespace) {
        return this.delegate.createElement(name, namespace);
    };
    BaseAnimationRenderer.prototype.createComment = function (value) { return this.delegate.createComment(value); };
    BaseAnimationRenderer.prototype.createText = function (value) { return this.delegate.createText(value); };
    BaseAnimationRenderer.prototype.appendChild = function (parent, newChild) {
        this.delegate.appendChild(parent, newChild);
        this.engine.onInsert(this.namespaceId, newChild, parent, false);
    };
    BaseAnimationRenderer.prototype.insertBefore = function (parent, newChild, refChild) {
        this.delegate.insertBefore(parent, newChild, refChild);
        this.engine.onInsert(this.namespaceId, newChild, parent, true);
    };
    BaseAnimationRenderer.prototype.removeChild = function (parent, oldChild) {
        this.engine.onRemove(this.namespaceId, oldChild, this.delegate);
    };
    BaseAnimationRenderer.prototype.selectRootElement = function (selectorOrNode) { return this.delegate.selectRootElement(selectorOrNode); };
    BaseAnimationRenderer.prototype.parentNode = function (node) { return this.delegate.parentNode(node); };
    BaseAnimationRenderer.prototype.nextSibling = function (node) { return this.delegate.nextSibling(node); };
    BaseAnimationRenderer.prototype.setAttribute = function (el, name, value, namespace) {
        this.delegate.setAttribute(el, name, value, namespace);
    };
    BaseAnimationRenderer.prototype.removeAttribute = function (el, name, namespace) {
        this.delegate.removeAttribute(el, name, namespace);
    };
    BaseAnimationRenderer.prototype.addClass = function (el, name) { this.delegate.addClass(el, name); };
    BaseAnimationRenderer.prototype.removeClass = function (el, name) { this.delegate.removeClass(el, name); };
    BaseAnimationRenderer.prototype.setStyle = function (el, style, value, flags) {
        this.delegate.setStyle(el, style, value, flags);
    };
    BaseAnimationRenderer.prototype.removeStyle = function (el, style, flags) {
        this.delegate.removeStyle(el, style, flags);
    };
    BaseAnimationRenderer.prototype.setProperty = function (el, name, value) {
        if (name.charAt(0) == ANIMATION_PREFIX && name == DISABLE_ANIMATIONS_FLAG) {
            this.disableAnimations(el, !!value);
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    };
    BaseAnimationRenderer.prototype.setValue = function (node, value) { this.delegate.setValue(node, value); };
    BaseAnimationRenderer.prototype.listen = function (target, eventName, callback) {
        return this.delegate.listen(target, eventName, callback);
    };
    BaseAnimationRenderer.prototype.disableAnimations = function (element, value) {
        this.engine.disableAnimations(element, value);
    };
    return BaseAnimationRenderer;
}());
exports.BaseAnimationRenderer = BaseAnimationRenderer;
var AnimationRenderer = (function (_super) {
    __extends(AnimationRenderer, _super);
    function AnimationRenderer(factory, namespaceId, delegate, engine) {
        var _this = _super.call(this, namespaceId, delegate, engine) || this;
        _this.factory = factory;
        _this.namespaceId = namespaceId;
        return _this;
    }
    AnimationRenderer.prototype.setProperty = function (el, name, value) {
        if (name.charAt(0) == ANIMATION_PREFIX) {
            if (name.charAt(1) == '.' && name == DISABLE_ANIMATIONS_FLAG) {
                this.disableAnimations(el, !!value);
            }
            else {
                this.engine.process(this.namespaceId, el, name.substr(1), value);
            }
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    };
    AnimationRenderer.prototype.listen = function (target, eventName, callback) {
        var _this = this;
        if (eventName.charAt(0) == ANIMATION_PREFIX) {
            var element = resolveElementFromTarget(target);
            var name_1 = eventName.substr(1);
            var phase = '';
            // @listener.phase is for trigger animation callbacks
            // @@listener is for animation builder callbacks
            if (name_1.charAt(0) != ANIMATION_PREFIX) {
                _a = parseTriggerCallbackName(name_1), name_1 = _a[0], phase = _a[1];
            }
            return this.engine.listen(this.namespaceId, element, name_1, phase, function (event) {
                var countId = event['_data'] || -1;
                _this.factory.scheduleListenerCallback(countId, callback, event);
            });
        }
        return this.delegate.listen(target, eventName, callback);
        var _a;
    };
    return AnimationRenderer;
}(BaseAnimationRenderer));
exports.AnimationRenderer = AnimationRenderer;
function resolveElementFromTarget(target) {
    switch (target) {
        case 'body':
            return document.body;
        case 'document':
            return document;
        case 'window':
            return window;
        default:
            return target;
    }
}
function parseTriggerCallbackName(triggerName) {
    var dotIndex = triggerName.indexOf('.');
    var trigger = triggerName.substring(0, dotIndex);
    var phase = triggerName.substr(dotIndex + 1);
    return [trigger, phase];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3JlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL3NyYy9hbmltYXRpb25fcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsdURBQWdGO0FBQ2hGLHNDQUFrSDtBQUVsSCxJQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUM3QixJQUFNLHVCQUF1QixHQUFHLFlBQVksQ0FBQztBQUc3QyxJQUFhLHdCQUF3QjtJQU9uQyxrQ0FDWSxRQUEwQixFQUFVLE1BQXVCLEVBQVUsS0FBYTtRQUFsRixhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQVB0RixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLDhCQUF5QixHQUE2QixFQUFFLENBQUM7UUFDekQsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBb0MsQ0FBQztRQUM3RCxrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUl4QixNQUFNLENBQUMsaUJBQWlCLEdBQUcsVUFBQyxPQUFZLEVBQUUsUUFBbUI7WUFDM0QseUVBQXlFO1lBQ3pFLGlGQUFpRjtZQUNqRixrRUFBa0U7WUFDbEUsaUVBQWlFO1lBQ2pFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3BELENBQUM7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsaURBQWMsR0FBZCxVQUFlLFdBQWdCLEVBQUUsSUFBbUI7UUFBcEQsaUJBMEJDO1FB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