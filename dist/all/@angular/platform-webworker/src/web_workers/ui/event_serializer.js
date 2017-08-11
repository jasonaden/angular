"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var MOUSE_EVENT_PROPERTIES = [
    'altKey', 'button', 'clientX', 'clientY', 'metaKey', 'movementX', 'movementY', 'offsetX',
    'offsetY', 'region', 'screenX', 'screenY', 'shiftKey'
];
var KEYBOARD_EVENT_PROPERTIES = [
    'altkey', 'charCode', 'code', 'ctrlKey', 'isComposing', 'key', 'keyCode', 'location', 'metaKey',
    'repeat', 'shiftKey', 'which'
];
var TRANSITION_EVENT_PROPERTIES = ['propertyName', 'elapsedTime', 'pseudoElement'];
var EVENT_PROPERTIES = ['type', 'bubbles', 'cancelable'];
var NODES_WITH_VALUE = new Set(['input', 'select', 'option', 'button', 'li', 'meter', 'progress', 'param', 'textarea']);
function serializeGenericEvent(e) {
    return serializeEvent(e, EVENT_PROPERTIES);
}
exports.serializeGenericEvent = serializeGenericEvent;
// TODO(jteplitz602): Allow users to specify the properties they need rather than always
// adding value and files #3374
function serializeEventWithTarget(e) {
    var serializedEvent = serializeEvent(e, EVENT_PROPERTIES);
    return addTarget(e, serializedEvent);
}
exports.serializeEventWithTarget = serializeEventWithTarget;
function serializeMouseEvent(e) {
    return serializeEvent(e, MOUSE_EVENT_PROPERTIES);
}
exports.serializeMouseEvent = serializeMouseEvent;
function serializeKeyboardEvent(e) {
    var serializedEvent = serializeEvent(e, KEYBOARD_EVENT_PROPERTIES);
    return addTarget(e, serializedEvent);
}
exports.serializeKeyboardEvent = serializeKeyboardEvent;
function serializeTransitionEvent(e) {
    var serializedEvent = serializeEvent(e, TRANSITION_EVENT_PROPERTIES);
    return addTarget(e, serializedEvent);
}
exports.serializeTransitionEvent = serializeTransitionEvent;
// TODO(jteplitz602): #3374. See above.
function addTarget(e, serializedEvent) {
    if (NODES_WITH_VALUE.has(e.target.tagName.toLowerCase())) {
        var target = e.target;
        serializedEvent['target'] = { 'value': target.value };
        if (target.files) {
            serializedEvent['target']['files'] = target.files;
        }
    }
    return serializedEvent;
}
function serializeEvent(e, properties) {
    var serialized = {};
    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];
        serialized[prop] = e[prop];
    }
    return serialized;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfc2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci9zcmMvd2ViX3dvcmtlcnMvdWkvZXZlbnRfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILElBQU0sc0JBQXNCLEdBQUc7SUFDN0IsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFNBQVM7SUFDeEYsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVU7Q0FDdEQsQ0FBQztBQUVGLElBQU0seUJBQXlCLEdBQUc7SUFDaEMsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTO0lBQy9GLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTztDQUM5QixDQUFDO0FBRUYsSUFBTSwyQkFBMkIsR0FBRyxDQUFDLGNBQWMsRUFBRSxhQUFhLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFFckYsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFM0QsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsQ0FDNUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFFN0YsK0JBQXNDLENBQVE7SUFDNUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRkQsc0RBRUM7QUFFRCx3RkFBd0Y7QUFDeEYsK0JBQStCO0FBQy9CLGtDQUF5QyxDQUFRO0lBQy9DLElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM1RCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBSEQsNERBR0M7QUFFRCw2QkFBb0MsQ0FBYTtJQUMvQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFGRCxrREFFQztBQUVELGdDQUF1QyxDQUFnQjtJQUNyRCxJQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLHlCQUF5QixDQUFDLENBQUM7SUFDckUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUhELHdEQUdDO0FBRUQsa0NBQXlDLENBQWtCO0lBQ3pELElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztJQUN2RSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBSEQsNERBR0M7QUFFRCx1Q0FBdUM7QUFDdkMsbUJBQW1CLENBQVEsRUFBRSxlQUFxQztJQUNoRSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQWUsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFBTSxNQUFNLEdBQXFCLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDMUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQztRQUNwRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqQixlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNwRCxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFDekIsQ0FBQztBQUVELHdCQUF3QixDQUFNLEVBQUUsVUFBb0I7SUFDbEQsSUFBTSxVQUFVLEdBQXVCLEVBQUUsQ0FBQztJQUMxQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMzQyxJQUFNLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQixDQUFDIn0=