"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var element_instruction_map_1 = require("../dsl/element_instruction_map");
var util_1 = require("../util");
var shared_1 = require("./shared");
var QUEUED_CLASSNAME = 'ng-animate-queued';
var QUEUED_SELECTOR = '.ng-animate-queued';
var DISABLED_CLASSNAME = 'ng-animate-disabled';
var DISABLED_SELECTOR = '.ng-animate-disabled';
var EMPTY_PLAYER_ARRAY = [];
var NULL_REMOVAL_STATE = {
    namespaceId: '',
    setForRemoval: null,
    hasAnimation: false,
    removedBeforeQueried: false
};
var NULL_REMOVED_QUERIED_STATE = {
    namespaceId: '',
    setForRemoval: null,
    hasAnimation: false,
    removedBeforeQueried: true
};
exports.REMOVAL_FLAG = '__ng_removed';
var StateValue = (function () {
    function StateValue(input) {
        var isObj = input && input.hasOwnProperty('value');
        var value = isObj ? input['value'] : input;
        this.value = normalizeTriggerValue(value);
        if (isObj) {
            var options = util_1.copyObj(input);
            delete options['value'];
            this.options = options;
        }
        else {
            this.options = {};
        }
        if (!this.options.params) {
            this.options.params = {};
        }
    }
    Object.defineProperty(StateValue.prototype, "params", {
        get: function () { return this.options.params; },
        enumerable: true,
        configurable: true
    });
    StateValue.prototype.absorbOptions = function (options) {
        var newParams = options.params;
        if (newParams) {
            var oldParams_1 = this.options.params;
            Object.keys(newParams).forEach(function (prop) {
                if (oldParams_1[prop] == null) {
                    oldParams_1[prop] = newParams[prop];
                }
            });
        }
    };
    return StateValue;
}());
exports.StateValue = StateValue;
exports.VOID_VALUE = 'void';
exports.DEFAULT_STATE_VALUE = new StateValue(exports.VOID_VALUE);
exports.DELETED_STATE_VALUE = new StateValue('DELETED');
var AnimationTransitionNamespace = (function () {
    function AnimationTransitionNamespace(id, hostElement, _engine) {
        this.id = id;
        this.hostElement = hostElement;
        this._engine = _engine;
        this.players = [];
        this._triggers = {};
        this._queue = [];
        this._elementListeners = new Map();
        this._hostClassName = 'ng-tns-' + id;
        addClass(hostElement, this._hostClassName);
    }
    AnimationTransitionNamespace.prototype.listen = function (element, name, phase, callback) {
        var _this = this;
        if (!this._triggers.hasOwnProperty(name)) {
            throw new Error("Unable to listen on the animation trigger event \"" + phase + "\" because the animation trigger \"" + name + "\" doesn't exist!");
        }
        if (phase == null || phase.length == 0) {
            throw new Error("Unable to listen on the animation trigger \"" + name + "\" because the provided event is undefined!");
        }
        if (!isTriggerEventValid(phase)) {
            throw new Error("The provided animation trigger event \"" + phase + "\" for the animation trigger \"" + name + "\" is not supported!");
        }
        var listeners = shared_1.getOrSetAsInMap(this._elementListeners, element, []);
        var data = { name: name, phase: phase, callback: callback };
        listeners.push(data);
        var triggersWithStates = shared_1.getOrSetAsInMap(this._engine.statesByElement, element, {});
        if (!triggersWithStates.hasOwnProperty(name)) {
            addClass(element, util_1.NG_TRIGGER_CLASSNAME);
            addClass(element, util_1.NG_TRIGGER_CLASSNAME + '-' + name);
            triggersWithStates[name] = null;
        }
        return function () {
            // the event listener is removed AFTER the flush has occurred such
            // that leave animations callbacks can fire (otherwise if the node
            // is removed in between then the listeners would be deregistered)
            _this._engine.afterFlush(function () {
                var index = listeners.indexOf(data);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
                if (!_this._triggers[name]) {
                    delete triggersWithStates[name];
                }
            });
        };
    };
    AnimationTransitionNamespace.prototype.register = function (name, ast) {
        if (this._triggers[name]) {
            // throw
            return false;
        }
        else {
            this._triggers[name] = ast;
            return true;
        }
    };
    AnimationTransitionNamespace.prototype._getTrigger = function (name) {
        var trigger = this._triggers[name];
        if (!trigger) {
            throw new Error("The provided animation trigger \"" + name + "\" has not been registered!");
        }
        return trigger;
    };
    AnimationTransitionNamespace.prototype.trigger = function (element, triggerName, value, defaultToFallback) {
        var _this = this;
        if (defaultToFallback === void 0) { defaultToFallback = true; }
        var trigger = this._getTrigger(triggerName);
        var player = new TransitionAnimationPlayer(this.id, triggerName, element);
        var triggersWithStates = this._engine.statesByElement.get(element);
        if (!triggersWithStates) {
            addClass(element, util_1.NG_TRIGGER_CLASSNAME);
            addClass(element, util_1.NG_TRIGGER_CLASSNAME + '-' + triggerName);
            this._engine.statesByElement.set(element, triggersWithStates = {});
        }
        var fromState = triggersWithStates[triggerName];
        var toState = new StateValue(value);
        var isObj = value && value.hasOwnProperty('value');
        if (!isObj && fromState) {
            toState.absorbOptions(fromState.options);
        }
        triggersWithStates[triggerName] = toState;
        if (!fromState) {
            fromState = exports.DEFAULT_STATE_VALUE;
        }
        else if (fromState === exports.DELETED_STATE_VALUE) {
            return player;
        }
        var isRemoval = toState.value === exports.VOID_VALUE;
        // normally this isn't reached by here, however, if an object expression
        // is passed in then it may be a new object each time. Comparing the value
        // is important since that will stay the same despite there being a new object.
        // The removal arc here is special cased because the same element is triggered
        // twice in the event that it contains animations on the outer/inner portions
        // of the host container
        if (!isRemoval && fromState.value === toState.value) {
            // this means that despite the value not changing, some inner params
            // have changed which means that the animation final styles need to be applied
            if (!objEquals(fromState.params, toState.params)) {
                var errors = [];
                var fromStyles_1 = trigger.matchStyles(fromState.value, fromState.params, errors);
                var toStyles_1 = trigger.matchStyles(toState.value, toState.params, errors);
                if (errors.length) {
                    this._engine.reportError(errors);
                }
                else {
                    this._engine.afterFlush(function () {
                        util_1.eraseStyles(element, fromStyles_1);
                        util_1.setStyles(element, toStyles_1);
                    });
                }
            }
            return;
        }
        var playersOnElement = shared_1.getOrSetAsInMap(this._engine.playersByElement, element, []);
        playersOnElement.forEach(function (player) {
            // only remove the player if it is queued on the EXACT same trigger/namespace
            // we only also deal with queued players here because if the animation has
            // started then we want to keep the player alive until the flush happens
            // (which is where the previousPlayers are passed into the new palyer)
            if (player.namespaceId == _this.id && player.triggerName == triggerName && player.queued) {
                player.destroy();
            }
        });
        var transition = trigger.matchTransition(fromState.value, toState.value);
        var isFallbackTransition = false;
        if (!transition) {
            if (!defaultToFallback)
                return;
            transition = trigger.fallbackTransition;
            isFallbackTransition = true;
        }
        this._engine.totalQueuedPlayers++;
        this._queue.push({ element: element, triggerName: triggerName, transition: transition, fromState: fromState, toState: toState, player: player, isFallbackTransition: isFallbackTransition });
        if (!isFallbackTransition) {
            addClass(element, QUEUED_CLASSNAME);
            player.onStart(function () { removeClass(element, QUEUED_CLASSNAME); });
        }
        player.onDone(function () {
            var index = _this.players.indexOf(player);
            if (index >= 0) {
                _this.players.splice(index, 1);
            }
            var players = _this._engine.playersByElement.get(element);
            if (players) {
                var index_1 = players.indexOf(player);
                if (index_1 >= 0) {
                    players.splice(index_1, 1);
                }
            }
        });
        this.players.push(player);
        playersOnElement.push(player);
        return player;
    };
    AnimationTransitionNamespace.prototype.deregister = function (name) {
        var _this = this;
        delete this._triggers[name];
        this._engine.statesByElement.forEach(function (stateMap, element) { delete stateMap[name]; });
        this._elementListeners.forEach(function (listeners, element) {
            _this._elementListeners.set(element, listeners.filter(function (entry) { return entry.name != name; }));
        });
    };
    AnimationTransitionNamespace.prototype.clearElementCache = function (element) {
        this._engine.statesByElement.delete(element);
        this._elementListeners.delete(element);
        var elementPlayers = this._engine.playersByElement.get(element);
        if (elementPlayers) {
            elementPlayers.forEach(function (player) { return player.destroy(); });
            this._engine.playersByElement.delete(element);
        }
    };
    AnimationTransitionNamespace.prototype._destroyInnerNodes = function (rootElement, context, animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        this._engine.driver.query(rootElement, util_1.NG_TRIGGER_SELECTOR, true).forEach(function (elm) {
            if (animate && containsClass(elm, _this._hostClassName)) {
                var innerNs = _this._engine.namespacesByHostElement.get(elm);
                // special case for a host element with animations on the same element
                if (innerNs) {
                    innerNs.removeNode(elm, context, true);
                }
                _this.removeNode(elm, context, true);
            }
            else {
                _this.clearElementCache(elm);
            }
        });
    };
    AnimationTransitionNamespace.prototype.removeNode = function (element, context, doNotRecurse) {
        var _this = this;
        var engine = this._engine;
        if (!doNotRecurse && element.childElementCount) {
            this._destroyInnerNodes(element, context, true);
        }
        var triggerStates = engine.statesByElement.get(element);
        if (triggerStates) {
            var players_1 = [];
            Object.keys(triggerStates).forEach(function (triggerName) {
                // this check is here in the event that an element is removed
                // twice (both on the host level and the component level)
                if (_this._triggers[triggerName]) {
                    var player = _this.trigger(element, triggerName, exports.VOID_VALUE, false);
                    if (player) {
                        players_1.push(player);
                    }
                }
            });
            if (players_1.length) {
                engine.markElementAsRemoved(this.id, element, true, context);
                shared_1.optimizeGroupPlayer(players_1).onDone(function () { return engine.processLeaveNode(element); });
                return;
            }
        }
        // find the player that is animating and make sure that the
        // removal is delayed until that player has completed
        var containsPotentialParentTransition = false;
        if (engine.totalAnimations) {
            var currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
            // when this `if statement` does not continue forward it means that
            // a previous animation query has selected the current element and
            // is animating it. In this situation want to continue fowards and
            // allow the element to be queued up for animation later.
            if (currentPlayers && currentPlayers.length) {
                containsPotentialParentTransition = true;
            }
            else {
                var parent_1 = element;
                while (parent_1 = parent_1.parentNode) {
                    var triggers = engine.statesByElement.get(parent_1);
                    if (triggers) {
                        containsPotentialParentTransition = true;
                        break;
                    }
                }
            }
        }
        // at this stage we know that the element will either get removed
        // during flush or will be picked up by a parent query. Either way
        // we need to fire the listeners for this element when it DOES get
        // removed (once the query parent animation is done or after flush)
        var listeners = this._elementListeners.get(element);
        if (listeners) {
            var visitedTriggers_1 = new Set();
            listeners.forEach(function (listener) {
                var triggerName = listener.name;
                if (visitedTriggers_1.has(triggerName))
                    return;
                visitedTriggers_1.add(triggerName);
                var trigger = _this._triggers[triggerName];
                var transition = trigger.fallbackTransition;
                var elementStates = engine.statesByElement.get(element);
                var fromState = elementStates[triggerName] || exports.DEFAULT_STATE_VALUE;
                var toState = new StateValue(exports.VOID_VALUE);
                var player = new TransitionAnimationPlayer(_this.id, triggerName, element);
                _this._engine.totalQueuedPlayers++;
                _this._queue.push({
                    element: element,
                    triggerName: triggerName,
                    transition: transition,
                    fromState: fromState,
                    toState: toState,
                    player: player,
                    isFallbackTransition: true
                });
            });
        }
        // whether or not a parent has an animation we need to delay the deferral of the leave
        // operation until we have more information (which we do after flush() has been called)
        if (containsPotentialParentTransition) {
            engine.markElementAsRemoved(this.id, element, false, context);
        }
        else {
            // we do this after the flush has occurred such
            // that the callbacks can be fired
            engine.afterFlush(function () { return _this.clearElementCache(element); });
            engine.destroyInnerAnimations(element);
            engine._onRemovalComplete(element, context);
        }
    };
    AnimationTransitionNamespace.prototype.insertNode = function (element, parent) { addClass(element, this._hostClassName); };
    AnimationTransitionNamespace.prototype.drainQueuedTransitions = function (microtaskId) {
        var _this = this;
        var instructions = [];
        this._queue.forEach(function (entry) {
            var player = entry.player;
            if (player.destroyed)
                return;
            var element = entry.element;
            var listeners = _this._elementListeners.get(element);
            if (listeners) {
                listeners.forEach(function (listener) {
                    if (listener.name == entry.triggerName) {
                        var baseEvent = shared_1.makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
                        baseEvent['_data'] = microtaskId;
                        shared_1.listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
                    }
                });
            }
            if (player.markedForDestroy) {
                _this._engine.afterFlush(function () {
                    // now we can destroy the element properly since the event listeners have
                    // been bound to the player
                    player.destroy();
                });
            }
            else {
                instructions.push(entry);
            }
        });
        this._queue = [];
        return instructions.sort(function (a, b) {
            // if depCount == 0 them move to front
            // otherwise if a contains b then move back
            var d0 = a.transition.ast.depCount;
            var d1 = b.transition.ast.depCount;
            if (d0 == 0 || d1 == 0) {
                return d0 - d1;
            }
            return _this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
        });
    };
    AnimationTransitionNamespace.prototype.destroy = function (context) {
        this.players.forEach(function (p) { return p.destroy(); });
        this._destroyInnerNodes(this.hostElement, context);
    };
    AnimationTransitionNamespace.prototype.elementContainsData = function (element) {
        var containsData = false;
        if (this._elementListeners.has(element))
            containsData = true;
        containsData =
            (this._queue.find(function (entry) { return entry.element === element; }) ? true : false) || containsData;
        return containsData;
    };
    return AnimationTransitionNamespace;
}());
exports.AnimationTransitionNamespace = AnimationTransitionNamespace;
var TransitionAnimationEngine = (function () {
    function TransitionAnimationEngine(driver, _normalizer) {
        this.driver = driver;
        this._normalizer = _normalizer;
        this.players = [];
        this.newHostElements = new Map();
        this.playersByElement = new Map();
        this.playersByQueriedElement = new Map();
        this.statesByElement = new Map();
        this.disabledNodes = new Set();
        this.totalAnimations = 0;
        this.totalQueuedPlayers = 0;
        this._namespaceLookup = {};
        this._namespaceList = [];
        this._flushFns = [];
        this._whenQuietFns = [];
        this.namespacesByHostElement = new Map();
        this.collectedEnterElements = [];
        this.collectedLeaveElements = [];
        // this method is designed to be overridden by the code that uses this engine
        this.onRemovalComplete = function (element, context) { };
    }
    /** @internal */
    TransitionAnimationEngine.prototype._onRemovalComplete = function (element, context) { this.onRemovalComplete(element, context); };
    Object.defineProperty(TransitionAnimationEngine.prototype, "queuedPlayers", {
        get: function () {
            var players = [];
            this._namespaceList.forEach(function (ns) {
                ns.players.forEach(function (player) {
                    if (player.queued) {
                        players.push(player);
                    }
                });
            });
            return players;
        },
        enumerable: true,
        configurable: true
    });
    TransitionAnimationEngine.prototype.createNamespace = function (namespaceId, hostElement) {
        var ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
        if (hostElement.parentNode) {
            this._balanceNamespaceList(ns, hostElement);
        }
        else {
            // defer this later until flush during when the host element has
            // been inserted so that we know exactly where to place it in
            // the namespace list
            this.newHostElements.set(hostElement, ns);
            // given that this host element is apart of the animation code, it
            // may or may not be inserted by a parent node that is an of an
            // animation renderer type. If this happens then we can still have
            // access to this item when we query for :enter nodes. If the parent
            // is a renderer then the set data-structure will normalize the entry
            this.collectEnterElement(hostElement);
        }
        return this._namespaceLookup[namespaceId] = ns;
    };
    TransitionAnimationEngine.prototype._balanceNamespaceList = function (ns, hostElement) {
        var limit = this._namespaceList.length - 1;
        if (limit >= 0) {
            var found = false;
            for (var i = limit; i >= 0; i--) {
                var nextNamespace = this._namespaceList[i];
                if (this.driver.containsElement(nextNamespace.hostElement, hostElement)) {
                    this._namespaceList.splice(i + 1, 0, ns);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this._namespaceList.splice(0, 0, ns);
            }
        }
        else {
            this._namespaceList.push(ns);
        }
        this.namespacesByHostElement.set(hostElement, ns);
        return ns;
    };
    TransitionAnimationEngine.prototype.register = function (namespaceId, hostElement) {
        var ns = this._namespaceLookup[namespaceId];
        if (!ns) {
            ns = this.createNamespace(namespaceId, hostElement);
        }
        return ns;
    };
    TransitionAnimationEngine.prototype.registerTrigger = function (namespaceId, name, trigger) {
        var ns = this._namespaceLookup[namespaceId];
        if (ns && ns.register(name, trigger)) {
            this.totalAnimations++;
        }
    };
    TransitionAnimationEngine.prototype.destroy = function (namespaceId, context) {
        var _this = this;
        if (!namespaceId)
            return;
        var ns = this._fetchNamespace(namespaceId);
        this.afterFlush(function () {
            _this.namespacesByHostElement.delete(ns.hostElement);
            delete _this._namespaceLookup[namespaceId];
            var index = _this._namespaceList.indexOf(ns);
            if (index >= 0) {
                _this._namespaceList.splice(index, 1);
            }
        });
        this.afterFlushAnimationsDone(function () { return ns.destroy(context); });
    };
    TransitionAnimationEngine.prototype._fetchNamespace = function (id) { return this._namespaceLookup[id]; };
    TransitionAnimationEngine.prototype.trigger = function (namespaceId, element, name, value) {
        if (isElementNode(element)) {
            this._fetchNamespace(namespaceId).trigger(element, name, value);
            return true;
        }
        return false;
    };
    TransitionAnimationEngine.prototype.insertNode = function (namespaceId, element, parent, insertBefore) {
        if (!isElementNode(element))
            return;
        // special case for when an element is removed and reinserted (move operation)
        // when this occurs we do not want to use the element for deletion later
        var details = element[exports.REMOVAL_FLAG];
        if (details && details.setForRemoval) {
            details.setForRemoval = false;
        }
        // in the event that the namespaceId is blank then the caller
        // code does not contain any animation code in it, but it is
        // just being called so that the node is marked as being inserted
        if (namespaceId) {
            this._fetchNamespace(namespaceId).insertNode(element, parent);
        }
        // only *directives and host elements are inserted before
        if (insertBefore) {
            this.collectEnterElement(element);
        }
    };
    TransitionAnimationEngine.prototype.collectEnterElement = function (element) { this.collectedEnterElements.push(element); };
    TransitionAnimationEngine.prototype.markElementAsDisabled = function (element, value) {
        if (value) {
            if (!this.disabledNodes.has(element)) {
                this.disabledNodes.add(element);
                addClass(element, DISABLED_CLASSNAME);
            }
        }
        else if (this.disabledNodes.has(element)) {
            this.disabledNodes.delete(element);
            removeClass(element, DISABLED_CLASSNAME);
        }
    };
    TransitionAnimationEngine.prototype.removeNode = function (namespaceId, element, context, doNotRecurse) {
        if (!isElementNode(element)) {
            this._onRemovalComplete(element, context);
            return;
        }
        var ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
        if (ns) {
            ns.removeNode(element, context, doNotRecurse);
        }
        else {
            this.markElementAsRemoved(namespaceId, element, false, context);
        }
    };
    TransitionAnimationEngine.prototype.markElementAsRemoved = function (namespaceId, element, hasAnimation, context) {
        this.collectedLeaveElements.push(element);
        element[exports.REMOVAL_FLAG] = {
            namespaceId: namespaceId,
            setForRemoval: context, hasAnimation: hasAnimation,
            removedBeforeQueried: false
        };
    };
    TransitionAnimationEngine.prototype.listen = function (namespaceId, element, name, phase, callback) {
        if (isElementNode(element)) {
            return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
        }
        return function () { };
    };
    TransitionAnimationEngine.prototype._buildInstruction = function (entry, subTimelines) {
        return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, entry.fromState.options, entry.toState.options, subTimelines);
    };
    TransitionAnimationEngine.prototype.destroyInnerAnimations = function (containerElement) {
        var _this = this;
        var elements = this.driver.query(containerElement, util_1.NG_TRIGGER_SELECTOR, true);
        elements.forEach(function (element) {
            var players = _this.playersByElement.get(element);
            if (players) {
                players.forEach(function (player) {
                    // special case for when an element is set for destruction, but hasn't started.
                    // in this situation we want to delay the destruction until the flush occurs
                    // so that any event listeners attached to the player are triggered.
                    if (player.queued) {
                        player.markedForDestroy = true;
                    }
                    else {
                        player.destroy();
                    }
                });
            }
            var stateMap = _this.statesByElement.get(element);
            if (stateMap) {
                Object.keys(stateMap).forEach(function (triggerName) { return stateMap[triggerName] = exports.DELETED_STATE_VALUE; });
            }
        });
        if (this.playersByQueriedElement.size == 0)
            return;
        elements = this.driver.query(containerElement, util_1.NG_ANIMATING_SELECTOR, true);
        if (elements.length) {
            elements.forEach(function (element) {
                var players = _this.playersByQueriedElement.get(element);
                if (players) {
                    players.forEach(function (player) { return player.finish(); });
                }
            });
        }
    };
    TransitionAnimationEngine.prototype.whenRenderingDone = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.players.length) {
                return shared_1.optimizeGroupPlayer(_this.players).onDone(function () { return resolve(); });
            }
            else {
                resolve();
            }
        });
    };
    TransitionAnimationEngine.prototype.processLeaveNode = function (element) {
        var _this = this;
        var details = element[exports.REMOVAL_FLAG];
        if (details && details.setForRemoval) {
            // this will prevent it from removing it twice
            element[exports.REMOVAL_FLAG] = NULL_REMOVAL_STATE;
            if (details.namespaceId) {
                this.destroyInnerAnimations(element);
                var ns = this._fetchNamespace(details.namespaceId);
                if (ns) {
                    ns.clearElementCache(element);
                }
            }
            this._onRemovalComplete(element, details.setForRemoval);
        }
        if (this.driver.matchesElement(element, DISABLED_SELECTOR)) {
            this.markElementAsDisabled(element, false);
        }
        this.driver.query(element, DISABLED_SELECTOR, true).forEach(function (node) {
            _this.markElementAsDisabled(element, false);
        });
    };
    TransitionAnimationEngine.prototype.flush = function (microtaskId) {
        var _this = this;
        if (microtaskId === void 0) { microtaskId = -1; }
        var players = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach(function (ns, element) { return _this._balanceNamespaceList(ns, element); });
            this.newHostElements.clear();
        }
        if (this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            var cleanupFns = [];
            try {
                players = this._flushAnimations(cleanupFns, microtaskId);
            }
            finally {
                for (var i = 0; i < cleanupFns.length; i++) {
                    cleanupFns[i]();
                }
            }
        }
        else {
            for (var i = 0; i < this.collectedLeaveElements.length; i++) {
                var element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }
        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        this._flushFns.forEach(function (fn) { return fn(); });
        this._flushFns = [];
        if (this._whenQuietFns.length) {
            // we move these over to a variable so that
            // if any new callbacks are registered in another
            // flush they do not populate the existing set
            var quietFns_1 = this._whenQuietFns;
            this._whenQuietFns = [];
            if (players.length) {
                shared_1.optimizeGroupPlayer(players).onDone(function () { quietFns_1.forEach(function (fn) { return fn(); }); });
            }
            else {
                quietFns_1.forEach(function (fn) { return fn(); });
            }
        }
    };
    TransitionAnimationEngine.prototype.reportError = function (errors) {
        throw new Error("Unable to process animations due to the following failed trigger transitions\n " + errors.join("\n"));
    };
    TransitionAnimationEngine.prototype._flushAnimations = function (cleanupFns, microtaskId) {
        var _this = this;
        var subTimelines = new element_instruction_map_1.ElementInstructionMap();
        var skippedPlayers = [];
        var skippedPlayersMap = new Map();
        var queuedInstructions = [];
        var queriedElements = new Map();
        var allPreStyleElements = new Map();
        var allPostStyleElements = new Map();
        var disabledElementsSet = new Set();
        this.disabledNodes.forEach(function (node) {
            var nodesThatAreDisabled = _this.driver.query(node, QUEUED_SELECTOR, true);
            for (var i = 0; i < nodesThatAreDisabled.length; i++) {
                disabledElementsSet.add(nodesThatAreDisabled[i]);
            }
        });
        var bodyNode = getBodyNode();
        var allEnterNodes = this.collectedEnterElements.length ?
            this.collectedEnterElements.filter(createIsRootFilterFn(this.collectedEnterElements)) :
            [];
        // this must occur before the instructions are built below such that
        // the :enter queries match the elements (since the timeline queries
        // are fired during instruction building).
        for (var i = 0; i < allEnterNodes.length; i++) {
            addClass(allEnterNodes[i], util_1.ENTER_CLASSNAME);
        }
        var allLeaveNodes = [];
        var leaveNodesWithoutAnimations = [];
        for (var i = 0; i < this.collectedLeaveElements.length; i++) {
            var element = this.collectedLeaveElements[i];
            var details = element[exports.REMOVAL_FLAG];
            if (details && details.setForRemoval) {
                addClass(element, util_1.LEAVE_CLASSNAME);
                allLeaveNodes.push(element);
                if (!details.hasAnimation) {
                    leaveNodesWithoutAnimations.push(element);
                }
            }
        }
        cleanupFns.push(function () {
            allEnterNodes.forEach(function (element) { return removeClass(element, util_1.ENTER_CLASSNAME); });
            allLeaveNodes.forEach(function (element) {
                removeClass(element, util_1.LEAVE_CLASSNAME);
                _this.processLeaveNode(element);
            });
        });
        var allPlayers = [];
        var erroneousTransitions = [];
        for (var i = this._namespaceList.length - 1; i >= 0; i--) {
            var ns = this._namespaceList[i];
            ns.drainQueuedTransitions(microtaskId).forEach(function (entry) {
                var player = entry.player;
                allPlayers.push(player);
                var element = entry.element;
                if (!bodyNode || !_this.driver.containsElement(bodyNode, element)) {
                    player.destroy();
                    return;
                }
                var instruction = _this._buildInstruction(entry, subTimelines);
                if (instruction.errors && instruction.errors.length) {
                    erroneousTransitions.push(instruction);
                    return;
                }
                // if a unmatched transition is queued to go then it SHOULD NOT render
                // an animation and cancel the previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(function () { return util_1.eraseStyles(element, instruction.fromStyles); });
                    player.onDestroy(function () { return util_1.setStyles(element, instruction.toStyles); });
                    skippedPlayers.push(player);
                    return;
                }
                // this means that if a parent animation uses this animation as a sub trigger
                // then it will instruct the timeline builder to not add a player delay, but
                // instead stretch the first keyframe gap up until the animation starts. The
                // reason this is important is to prevent extra initialization styles from being
                // required by the user in the animation.
                instruction.timelines.forEach(function (tl) { return tl.stretchStartingKeyframe = true; });
                subTimelines.append(element, instruction.timelines);
                var tuple = { instruction: instruction, player: player, element: element };
                queuedInstructions.push(tuple);
                instruction.queriedElements.forEach(function (element) { return shared_1.getOrSetAsInMap(queriedElements, element, []).push(player); });
                instruction.preStyleProps.forEach(function (stringMap, element) {
                    var props = Object.keys(stringMap);
                    if (props.length) {
                        var setVal_1 = allPreStyleElements.get(element);
                        if (!setVal_1) {
                            allPreStyleElements.set(element, setVal_1 = new Set());
                        }
                        props.forEach(function (prop) { return setVal_1.add(prop); });
                    }
                });
                instruction.postStyleProps.forEach(function (stringMap, element) {
                    var props = Object.keys(stringMap);
                    var setVal = allPostStyleElements.get(element);
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set());
                    }
                    props.forEach(function (prop) { return setVal.add(prop); });
                });
            });
        }
        if (erroneousTransitions.length) {
            var errors_1 = [];
            erroneousTransitions.forEach(function (instruction) {
                errors_1.push("@" + instruction.triggerName + " has failed due to:\n");
                instruction.errors.forEach(function (error) { return errors_1.push("- " + error + "\n"); });
            });
            allPlayers.forEach(function (player) { return player.destroy(); });
            this.reportError(errors_1);
        }
        // these can only be detected here since we have a map of all the elements
        // that have animations attached to them...
        var enterNodesWithoutAnimations = [];
        for (var i = 0; i < allEnterNodes.length; i++) {
            var element = allEnterNodes[i];
            if (!subTimelines.has(element)) {
                enterNodesWithoutAnimations.push(element);
            }
        }
        var allPreviousPlayersMap = new Map();
        var sortedParentElements = [];
        queuedInstructions.forEach(function (entry) {
            var element = entry.element;
            if (subTimelines.has(element)) {
                sortedParentElements.unshift(element);
                _this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });
        skippedPlayers.forEach(function (player) {
            var element = player.element;
            var previousPlayers = _this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(function (prevPlayer) { shared_1.getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer); });
        });
        allPreviousPlayersMap.forEach(function (players) { return players.forEach(function (player) { return player.destroy(); }); });
        // PRE STAGE: fill the ! styles
        var preStylesMap = allPreStyleElements.size ?
            cloakAndComputeStyles(this.driver, enterNodesWithoutAnimations, allPreStyleElements, animations_1.ɵPRE_STYLE) :
            new Map();
        // POST STAGE: fill the * styles
        var postStylesMap = cloakAndComputeStyles(this.driver, leaveNodesWithoutAnimations, allPostStyleElements, animations_1.AUTO_STYLE);
        var rootPlayers = [];
        var subPlayers = [];
        queuedInstructions.forEach(function (entry) {
            var element = entry.element, player = entry.player, instruction = entry.instruction;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                if (disabledElementsSet.has(element)) {
                    skippedPlayers.push(player);
                    return;
                }
                var innerPlayer = _this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
                player.setRealPlayer(innerPlayer);
                var parentHasPriority = null;
                for (var i = 0; i < sortedParentElements.length; i++) {
                    var parent_2 = sortedParentElements[i];
                    if (parent_2 === element)
                        break;
                    if (_this.driver.containsElement(parent_2, element)) {
                        parentHasPriority = parent_2;
                        break;
                    }
                }
                if (parentHasPriority) {
                    var parentPlayers = _this.playersByElement.get(parentHasPriority);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = shared_1.optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                }
                else {
                    rootPlayers.push(player);
                }
            }
            else {
                util_1.eraseStyles(element, instruction.fromStyles);
                player.onDestroy(function () { return util_1.setStyles(element, instruction.toStyles); });
                subPlayers.push(player);
            }
        });
        subPlayers.forEach(function (player) {
            var playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                var innerPlayer = shared_1.optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });
        // the reason why we don't actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(function (player) {
            if (player.parentPlayer) {
                player.parentPlayer.onDestroy(function () { return player.destroy(); });
            }
            else {
                player.destroy();
            }
        });
        // run through all of the queued removals and see if they
        // were picked up by a query. If not then perform the removal
        // operation right away unless a parent animation is ongoing.
        for (var i = 0; i < allLeaveNodes.length; i++) {
            var element = allLeaveNodes[i];
            var details = element[exports.REMOVAL_FLAG];
            removeClass(element, util_1.LEAVE_CLASSNAME);
            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation)
                continue;
            var players = [];
            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                var queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push.apply(players, queriedPlayerResults);
                }
                var queriedInnerElements = this.driver.query(element, util_1.NG_ANIMATING_SELECTOR, true);
                for (var j = 0; j < queriedInnerElements.length; j++) {
                    var queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push.apply(players, queriedPlayers);
                    }
                }
            }
            if (players.length) {
                removeNodesAfterAnimationDone(this, element, players);
            }
            else {
                this.processLeaveNode(element);
            }
        }
        // this is required so the cleanup method doesn't remove them
        allLeaveNodes.length = 0;
        rootPlayers.forEach(function (player) {
            _this.players.push(player);
            player.onDone(function () {
                player.destroy();
                var index = _this.players.indexOf(player);
                _this.players.splice(index, 1);
            });
            player.play();
        });
        return rootPlayers;
    };
    TransitionAnimationEngine.prototype.elementContainsData = function (namespaceId, element) {
        var containsData = false;
        var details = element[exports.REMOVAL_FLAG];
        if (details && details.setForRemoval)
            containsData = true;
        if (this.playersByElement.has(element))
            containsData = true;
        if (this.playersByQueriedElement.has(element))
            containsData = true;
        if (this.statesByElement.has(element))
            containsData = true;
        return this._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    };
    TransitionAnimationEngine.prototype.afterFlush = function (callback) { this._flushFns.push(callback); };
    TransitionAnimationEngine.prototype.afterFlushAnimationsDone = function (callback) { this._whenQuietFns.push(callback); };
    TransitionAnimationEngine.prototype._getPreviousPlayers = function (element, isQueriedElement, namespaceId, triggerName, toStateValue) {
        var players = [];
        if (isQueriedElement) {
            var queriedElementPlayers = this.playersByQueriedElement.get(element);
            if (queriedElementPlayers) {
                players = queriedElementPlayers;
            }
        }
        else {
            var elementPlayers = this.playersByElement.get(element);
            if (elementPlayers) {
                var isRemovalAnimation_1 = !toStateValue || toStateValue == exports.VOID_VALUE;
                elementPlayers.forEach(function (player) {
                    if (player.queued)
                        return;
                    if (!isRemovalAnimation_1 && player.triggerName != triggerName)
                        return;
                    players.push(player);
                });
            }
        }
        if (namespaceId || triggerName) {
            players = players.filter(function (player) {
                if (namespaceId && namespaceId != player.namespaceId)
                    return false;
                if (triggerName && triggerName != player.triggerName)
                    return false;
                return true;
            });
        }
        return players;
    };
    TransitionAnimationEngine.prototype._beforeAnimationBuild = function (namespaceId, instruction, allPreviousPlayersMap) {
        var _this = this;
        // it's important to do this step before destroying the players
        // so that the onDone callback below won't fire before this
        util_1.eraseStyles(instruction.element, instruction.fromStyles);
        var triggerName = instruction.triggerName;
        var rootElement = instruction.element;
        // when a removal animation occurs, ALL previous players are collected
        // and destroyed (even if they are outside of the current namespace)
        var targetNameSpaceId = instruction.isRemovalTransition ? undefined : namespaceId;
        var targetTriggerName = instruction.isRemovalTransition ? undefined : triggerName;
        instruction.timelines.map(function (timelineInstruction) {
            var element = timelineInstruction.element;
            var isQueriedElement = element !== rootElement;
            var players = shared_1.getOrSetAsInMap(allPreviousPlayersMap, element, []);
            var previousPlayers = _this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(function (player) {
                var realPlayer = player.getRealPlayer();
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                players.push(player);
            });
        });
    };
    TransitionAnimationEngine.prototype._buildAnimation = function (namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
        var _this = this;
        var triggerName = instruction.triggerName;
        var rootElement = instruction.element;
        // we first run this so that the previous animation player
        // data can be passed into the successive animation players
        var allQueriedPlayers = [];
        var allConsumedElements = new Set();
        var allSubElements = new Set();
        var allNewPlayers = instruction.timelines.map(function (timelineInstruction) {
            var element = timelineInstruction.element;
            allConsumedElements.add(element);
            // FIXME (matsko): make sure to-be-removed animations are removed properly
            var details = element[exports.REMOVAL_FLAG];
            if (details && details.removedBeforeQueried)
                return new animations_1.NoopAnimationPlayer();
            var isQueriedElement = element !== rootElement;
            var previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY)
                .map(function (p) { return p.getRealPlayer(); }))
                .filter(function (p) {
                // the `element` is not apart of the AnimationPlayer definition, but
                // Mock/WebAnimations
                // use the element within their implementation. This will be added in Angular5 to
                // AnimationPlayer
                var pp = p;
                return pp.element ? pp.element === element : false;
            });
            var preStyles = preStylesMap.get(element);
            var postStyles = postStylesMap.get(element);
            var keyframes = shared_1.normalizeKeyframes(_this.driver, _this._normalizer, element, timelineInstruction.keyframes, preStyles, postStyles);
            var player = _this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
            // this means that this particular player belongs to a sub trigger. It is
            // important that we match this player up with the corresponding (@trigger.listener)
            if (timelineInstruction.subTimeline && skippedPlayersMap) {
                allSubElements.add(element);
            }
            if (isQueriedElement) {
                var wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
                wrappedPlayer.setRealPlayer(player);
                allQueriedPlayers.push(wrappedPlayer);
            }
            return player;
        });
        allQueriedPlayers.forEach(function (player) {
            shared_1.getOrSetAsInMap(_this.playersByQueriedElement, player.element, []).push(player);
            player.onDone(function () { return deleteOrUnsetInMap(_this.playersByQueriedElement, player.element, player); });
        });
        allConsumedElements.forEach(function (element) { return addClass(element, util_1.NG_ANIMATING_CLASSNAME); });
        var player = shared_1.optimizeGroupPlayer(allNewPlayers);
        player.onDestroy(function () {
            allConsumedElements.forEach(function (element) { return removeClass(element, util_1.NG_ANIMATING_CLASSNAME); });
            util_1.setStyles(rootElement, instruction.toStyles);
        });
        // this basically makes all of the callbacks for sub element animations
        // be dependent on the upper players for when they finish
        allSubElements.forEach(function (element) { shared_1.getOrSetAsInMap(skippedPlayersMap, element, []).push(player); });
        return player;
    };
    TransitionAnimationEngine.prototype._buildPlayer = function (instruction, keyframes, previousPlayers) {
        if (keyframes.length > 0) {
            return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
        }
        // special case for when an empty transition|definition is provided
        // ... there is no point in rendering an empty animation
        return new animations_1.NoopAnimationPlayer();
    };
    return TransitionAnimationEngine;
}());
exports.TransitionAnimationEngine = TransitionAnimationEngine;
var TransitionAnimationPlayer = (function () {
    function TransitionAnimationPlayer(namespaceId, triggerName, element) {
        this.namespaceId = namespaceId;
        this.triggerName = triggerName;
        this.element = element;
        this._player = new animations_1.NoopAnimationPlayer();
        this._containsRealPlayer = false;
        this._queuedCallbacks = {};
        this._destroyed = false;
        this.markedForDestroy = false;
    }
    Object.defineProperty(TransitionAnimationPlayer.prototype, "queued", {
        get: function () { return this._containsRealPlayer == false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransitionAnimationPlayer.prototype, "destroyed", {
        get: function () { return this._destroyed; },
        enumerable: true,
        configurable: true
    });
    TransitionAnimationPlayer.prototype.setRealPlayer = function (player) {
        var _this = this;
        if (this._containsRealPlayer)
            return;
        this._player = player;
        Object.keys(this._queuedCallbacks).forEach(function (phase) {
            _this._queuedCallbacks[phase].forEach(function (callback) { return shared_1.listenOnPlayer(player, phase, undefined, callback); });
        });
        this._queuedCallbacks = {};
        this._containsRealPlayer = true;
    };
    TransitionAnimationPlayer.prototype.getRealPlayer = function () { return this._player; };
    TransitionAnimationPlayer.prototype._queueEvent = function (name, callback) {
        shared_1.getOrSetAsInMap(this._queuedCallbacks, name, []).push(callback);
    };
    TransitionAnimationPlayer.prototype.onDone = function (fn) {
        if (this.queued) {
            this._queueEvent('done', fn);
        }
        this._player.onDone(fn);
    };
    TransitionAnimationPlayer.prototype.onStart = function (fn) {
        if (this.queued) {
            this._queueEvent('start', fn);
        }
        this._player.onStart(fn);
    };
    TransitionAnimationPlayer.prototype.onDestroy = function (fn) {
        if (this.queued) {
            this._queueEvent('destroy', fn);
        }
        this._player.onDestroy(fn);
    };
    TransitionAnimationPlayer.prototype.init = function () { this._player.init(); };
    TransitionAnimationPlayer.prototype.hasStarted = function () { return this.queued ? false : this._player.hasStarted(); };
    TransitionAnimationPlayer.prototype.play = function () { !this.queued && this._player.play(); };
    TransitionAnimationPlayer.prototype.pause = function () { !this.queued && this._player.pause(); };
    TransitionAnimationPlayer.prototype.restart = function () { !this.queued && this._player.restart(); };
    TransitionAnimationPlayer.prototype.finish = function () { this._player.finish(); };
    TransitionAnimationPlayer.prototype.destroy = function () {
        this._destroyed = true;
        this._player.destroy();
    };
    TransitionAnimationPlayer.prototype.reset = function () { !this.queued && this._player.reset(); };
    TransitionAnimationPlayer.prototype.setPosition = function (p) {
        if (!this.queued) {
            this._player.setPosition(p);
        }
    };
    TransitionAnimationPlayer.prototype.getPosition = function () { return this.queued ? 0 : this._player.getPosition(); };
    Object.defineProperty(TransitionAnimationPlayer.prototype, "totalTime", {
        get: function () { return this._player.totalTime; },
        enumerable: true,
        configurable: true
    });
    return TransitionAnimationPlayer;
}());
exports.TransitionAnimationPlayer = TransitionAnimationPlayer;
function deleteOrUnsetInMap(map, key, value) {
    var currentValues;
    if (map instanceof Map) {
        currentValues = map.get(key);
        if (currentValues) {
            if (currentValues.length) {
                var index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                map.delete(key);
            }
        }
    }
    else {
        currentValues = map[key];
        if (currentValues) {
            if (currentValues.length) {
                var index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                delete map[key];
            }
        }
    }
    return currentValues;
}
function normalizeTriggerValue(value) {
    switch (typeof value) {
        case 'boolean':
            return value ? '1' : '0';
        default:
            return value != null ? value.toString() : null;
    }
}
function isElementNode(node) {
    return node && node['nodeType'] === 1;
}
function isTriggerEventValid(eventName) {
    return eventName == 'start' || eventName == 'done';
}
function cloakElement(element, value) {
    var oldValue = element.style.display;
    element.style.display = value != null ? value : 'none';
    return oldValue;
}
function cloakAndComputeStyles(driver, elements, elementPropsMap, defaultStyle) {
    var cloakVals = elements.map(function (element) { return cloakElement(element); });
    var valuesMap = new Map();
    elementPropsMap.forEach(function (props, element) {
        var styles = {};
        props.forEach(function (prop) {
            var value = styles[prop] = driver.computeStyle(element, prop, defaultStyle);
            // there is no easy way to detect this because a sub element could be removed
            // by a parent animation element being detached.
            if (!value || value.length == 0) {
                element[exports.REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
            }
        });
        valuesMap.set(element, styles);
    });
    elements.forEach(function (element, i) { return cloakElement(element, cloakVals[i]); });
    return valuesMap;
}
/*
Since the Angular renderer code will return a collection of inserted
nodes in all areas of a DOM tree, it's up to this algorithm to figure
out which nodes are roots.

By placing all nodes into a set and traversing upwards to the edge,
the recursive code can figure out if a clean path from the DOM node
to the edge container is clear. If no other node is detected in the
set then it is a root element.

This algorithm also keeps track of all nodes along the path so that
if other sibling nodes are also tracked then the lookup process can
skip a lot of steps in between and avoid traversing the entire tree
multiple times to the edge.
 */
function createIsRootFilterFn(nodes) {
    var nodeSet = new Set(nodes);
    var knownRootContainer = new Set();
    var isRoot;
    isRoot = function (node) {
        if (!node)
            return true;
        if (nodeSet.has(node.parentNode))
            return false;
        if (knownRootContainer.has(node.parentNode))
            return true;
        if (isRoot(node.parentNode)) {
            knownRootContainer.add(node);
            return true;
        }
        return false;
    };
    return isRoot;
}
var CLASSES_CACHE_KEY = '$$classes';
function containsClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    else {
        var classes = element[CLASSES_CACHE_KEY];
        return classes && classes[className];
    }
}
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        var classes = element[CLASSES_CACHE_KEY];
        if (!classes) {
            classes = element[CLASSES_CACHE_KEY] = {};
        }
        classes[className] = true;
    }
}
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        var classes = element[CLASSES_CACHE_KEY];
        if (classes) {
            delete classes[className];
        }
    }
}
function getBodyNode() {
    if (typeof document != 'undefined') {
        return document.body;
    }
    return null;
}
function removeNodesAfterAnimationDone(engine, element, players) {
    shared_1.optimizeGroupPlayer(players).onDone(function () { return engine.processLeaveNode(element); });
}
function flattenGroupPlayers(players) {
    var finalPlayers = [];
    _flattenGroupPlayersRecur(players, finalPlayers);
    return finalPlayers;
}
function _flattenGroupPlayersRecur(players, finalPlayers) {
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player instanceof animations_1.ɵAnimationGroupPlayer) {
            _flattenGroupPlayersRecur(player.players, finalPlayers);
        }
        else {
            finalPlayers.push(player);
        }
    }
}
function objEquals(a, b) {
    var k1 = Object.keys(a);
    var k2 = Object.keys(b);
    if (k1.length != k2.length)
        return false;
    for (var i = 0; i < k1.length; i++) {
        var prop = k1[i];
        if (!b.hasOwnProperty(prop) || a[prop] !== b[prop])
            return false;
    }
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvdHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQTJMO0FBTTNMLDBFQUFxRTtBQUVyRSxnQ0FBb0w7QUFHcEwsbUNBQXNIO0FBRXRILElBQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUM7QUFDN0MsSUFBTSxlQUFlLEdBQUcsb0JBQW9CLENBQUM7QUFDN0MsSUFBTSxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQztBQUNqRCxJQUFNLGlCQUFpQixHQUFHLHNCQUFzQixDQUFDO0FBRWpELElBQU0sa0JBQWtCLEdBQWdDLEVBQUUsQ0FBQztBQUMzRCxJQUFNLGtCQUFrQixHQUEwQjtJQUNoRCxXQUFXLEVBQUUsRUFBRTtJQUNmLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFlBQVksRUFBRSxLQUFLO0lBQ25CLG9CQUFvQixFQUFFLEtBQUs7Q0FDNUIsQ0FBQztBQUNGLElBQU0sMEJBQTBCLEdBQTBCO0lBQ3hELFdBQVcsRUFBRSxFQUFFO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFDbkIsWUFBWSxFQUFFLEtBQUs7SUFDbkIsb0JBQW9CLEVBQUUsSUFBSTtDQUMzQixDQUFDO0FBa0JXLFFBQUEsWUFBWSxHQUFHLGNBQWMsQ0FBQztBQVMzQztJQU1FLG9CQUFZLEtBQVU7UUFDcEIsSUFBTSxLQUFLLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsSUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxL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