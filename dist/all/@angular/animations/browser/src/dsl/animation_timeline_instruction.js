"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createTimelineInstruction(element, keyframes, preStyleProps, postStyleProps, duration, delay, easing, subTimeline) {
    if (easing === void 0) { easing = null; }
    if (subTimeline === void 0) { subTimeline = false; }
    return {
        type: 1 /* TimelineAnimation */,
        element: element,
        keyframes: keyframes,
        preStyleProps: preStyleProps,
        postStyleProps: postStyleProps,
        duration: duration,
        delay: delay,
        totalTime: duration + delay, easing: easing, subTimeline: subTimeline
    };
}
exports.createTimelineInstruction = createTimelineInstruction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RpbWVsaW5lX2luc3RydWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9kc2wvYW5pbWF0aW9uX3RpbWVsaW5lX2luc3RydWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBdUJBLG1DQUNJLE9BQVksRUFBRSxTQUF1QixFQUFFLGFBQXVCLEVBQUUsY0FBd0IsRUFDeEYsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsTUFBNEIsRUFDN0QsV0FBNEI7SUFESyx1QkFBQSxFQUFBLGFBQTRCO0lBQzdELDRCQUFBLEVBQUEsbUJBQTRCO0lBQzlCLE1BQU0sQ0FBQztRQUNMLElBQUksMkJBQXNEO1FBQzFELE9BQU8sU0FBQTtRQUNQLFNBQVMsV0FBQTtRQUNULGFBQWEsZUFBQTtRQUNiLGNBQWMsZ0JBQUE7UUFDZCxRQUFRLFVBQUE7UUFDUixLQUFLLE9BQUE7UUFDTCxTQUFTLEVBQUUsUUFBUSxHQUFHLEtBQUssRUFBRSxNQUFNLFFBQUEsRUFBRSxXQUFXLGFBQUE7S0FDakQsQ0FBQztBQUNKLENBQUM7QUFkRCw4REFjQyJ9