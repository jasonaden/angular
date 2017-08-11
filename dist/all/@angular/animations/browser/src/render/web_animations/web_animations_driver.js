"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var web_animations_player_1 = require("./web_animations_player");
var WebAnimationsDriver = (function () {
    function WebAnimationsDriver() {
    }
    WebAnimationsDriver.prototype.matchesElement = function (element, selector) {
        return shared_1.matchesElement(element, selector);
    };
    WebAnimationsDriver.prototype.containsElement = function (elm1, elm2) { return shared_1.containsElement(elm1, elm2); };
    WebAnimationsDriver.prototype.query = function (element, selector, multi) {
        return shared_1.invokeQuery(element, selector, multi);
    };
    WebAnimationsDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return window.getComputedStyle(element)[prop];
    };
    WebAnimationsDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var fill = delay == 0 ? 'both' : 'forwards';
        var playerOptions = { duration: duration, delay: delay, fill: fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        var previousWebAnimationPlayers = previousPlayers.filter(function (player) { return player instanceof web_animations_player_1.WebAnimationsPlayer; });
        return new web_animations_player_1.WebAnimationsPlayer(element, keyframes, playerOptions, previousWebAnimationPlayers);
    };
    return WebAnimationsDriver;
}());
exports.WebAnimationsDriver = WebAnimationsDriver;
function supportsWebAnimations() {
    return typeof Element !== 'undefined' && typeof Element.prototype['animate'] === 'function';
}
exports.supportsWebAnimations = supportsWebAnimations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBVUEsb0NBQXVFO0FBRXZFLGlFQUE0RDtBQUU1RDtJQUFBO0lBK0JBLENBQUM7SUE5QkMsNENBQWMsR0FBZCxVQUFlLE9BQVksRUFBRSxRQUFnQjtRQUMzQyxNQUFNLENBQUMsdUJBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELDZDQUFlLEdBQWYsVUFBZ0IsSUFBUyxFQUFFLElBQVMsSUFBYSxNQUFNLENBQUMsd0JBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRGLG1DQUFLLEdBQUwsVUFBTSxPQUFZLEVBQUUsUUFBZ0IsRUFBRSxLQUFjO1FBQ2xELE1BQU0sQ0FBQyxvQkFBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYSxPQUFZLEVBQUUsSUFBWSxFQUFFLFlBQXFCO1FBQzVELE1BQU0sQ0FBRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFTLENBQUMsSUFBSSxDQUFXLENBQUM7SUFDbkUsQ0FBQztJQUVELHFDQUFPLEdBQVAsVUFDSSxPQUFZLEVBQUUsU0FBdUIsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQ3RGLGVBQXVDO1FBQXZDLGdDQUFBLEVBQUEsb0JBQXVDO1FBQ3pDLElBQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUM5QyxJQUFNLGFBQWEsR0FBcUMsRUFBQyxRQUFRLFVBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO1FBRWhGLHNFQUFzRTtRQUN0RSx3RUFBd0U7UUFDeEUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQU0sMkJBQTJCLEdBQTBCLGVBQWUsQ0FBQyxNQUFNLENBQzdFLFVBQUEsTUFBTSxJQUFNLE1BQU0sQ0FBQyxNQUFNLFlBQVksMkNBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsSUFBSSwyQ0FBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUEvQkQsSUErQkM7QUEvQlksa0RBQW1CO0FBaUNoQztJQUNFLE1BQU0sQ0FBQyxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksT0FBWSxPQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLFVBQVUsQ0FBQztBQUNwRyxDQUFDO0FBRkQsc0RBRUMifQ==