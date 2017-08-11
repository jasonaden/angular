"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_serializer_1 = require("./event_serializer");
var EventDispatcher = (function () {
    function EventDispatcher(_sink, _serializer) {
        this._sink = _sink;
        this._serializer = _serializer;
    }
    EventDispatcher.prototype.dispatchAnimationEvent = function (player, phaseName, element) {
        this._sink.emit({
            'element': this._serializer.serialize(element, 2 /* RENDER_STORE_OBJECT */),
            'animationPlayer': this._serializer.serialize(player, 2 /* RENDER_STORE_OBJECT */),
            'phaseName': phaseName,
        });
        return true;
    };
    EventDispatcher.prototype.dispatchRenderEvent = function (element, eventTarget, eventName, event) {
        var serializedEvent;
        // TODO (jteplitz602): support custom events #3350
        switch (event.type) {
            case 'click':
            case 'mouseup':
            case 'mousedown':
            case 'dblclick':
            case 'contextmenu':
            case 'mouseenter':
            case 'mouseleave':
            case 'mousemove':
            case 'mouseout':
            case 'mouseover':
            case 'show':
                serializedEvent = event_serializer_1.serializeMouseEvent(event);
                break;
            case 'keydown':
            case 'keypress':
            case 'keyup':
                serializedEvent = event_serializer_1.serializeKeyboardEvent(event);
                break;
            case 'input':
            case 'change':
            case 'blur':
                serializedEvent = event_serializer_1.serializeEventWithTarget(event);
                break;
            case 'abort':
            case 'afterprint':
            case 'beforeprint':
            case 'cached':
            case 'canplay':
            case 'canplaythrough':
            case 'chargingchange':
            case 'chargingtimechange':
            case 'close':
            case 'dischargingtimechange':
            case 'DOMContentLoaded':
            case 'downloading':
            case 'durationchange':
            case 'emptied':
            case 'ended':
            case 'error':
            case 'fullscreenchange':
            case 'fullscreenerror':
            case 'invalid':
            case 'languagechange':
            case 'levelfchange':
            case 'loadeddata':
            case 'loadedmetadata':
            case 'obsolete':
            case 'offline':
            case 'online':
            case 'open':
            case 'orientatoinchange':
            case 'pause':
            case 'pointerlockchange':
            case 'pointerlockerror':
            case 'play':
            case 'playing':
            case 'ratechange':
            case 'readystatechange':
            case 'reset':
            case 'scroll':
            case 'seeked':
            case 'seeking':
            case 'stalled':
            case 'submit':
            case 'success':
            case 'suspend':
            case 'timeupdate':
            case 'updateready':
            case 'visibilitychange':
            case 'volumechange':
            case 'waiting':
                serializedEvent = event_serializer_1.serializeGenericEvent(event);
                break;
            case 'transitionend':
                serializedEvent = event_serializer_1.serializeTransitionEvent(event);
                break;
            default:
                throw new Error(eventName + ' not supported on WebWorkers');
        }
        this._sink.emit({
            'element': this._serializer.serialize(element, 2 /* RENDER_STORE_OBJECT */),
            'eventName': eventName,
            'eventTarget': eventTarget,
            'event': serializedEvent,
        });
        // TODO(kegluneq): Eventually, we want the user to indicate from the UI side whether the event
        // should be canceled, but for now just call `preventDefault` on the original DOM event.
        return false;
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZGlzcGF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci9zcmMvd2ViX3dvcmtlcnMvdWkvZXZlbnRfZGlzcGF0Y2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBLHVEQUEwSjtBQUUxSjtJQUNFLHlCQUFvQixLQUF3QixFQUFVLFdBQXVCO1FBQXpELFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0lBRWpGLGdEQUFzQixHQUF0QixVQUF1QixNQUFXLEVBQUUsU0FBaUIsRUFBRSxPQUFZO1FBQ2pFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2QsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sOEJBQXNDO1lBQ25GLGlCQUFpQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sOEJBQXNDO1lBQzFGLFdBQVcsRUFBRSxTQUFTO1NBQ3ZCLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsNkNBQW1CLEdBQW5CLFVBQW9CLE9BQVksRUFBRSxXQUFtQixFQUFFLFNBQWlCLEVBQUUsS0FBVTtRQUNsRixJQUFJLGVBQW9CLENBQUM7UUFDekIsa0RBQWtEO1FBQ2xELE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxTQUFTLENBQUM7WUFDZixLQUFLLFdBQVcsQ0FBQztZQUNqQixLQUFLLFVBQVUsQ0FBQztZQUNoQixLQUFLLGFBQWEsQ0FBQztZQUNuQixLQUFLLFlBQVksQ0FBQztZQUNsQixLQUFLLFlBQVksQ0FBQztZQUNsQixLQUFLLFdBQVcsQ0FBQztZQUNqQixLQUFLLFVBQVUs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