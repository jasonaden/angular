"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function visitAnimationNode(visitor, node, context) {
    switch (node.type) {
        case 7 /* Trigger */:
            return visitor.visitTrigger(node, context);
        case 0 /* State */:
            return visitor.visitState(node, context);
        case 1 /* Transition */:
            return visitor.visitTransition(node, context);
        case 2 /* Sequence */:
            return visitor.visitSequence(node, context);
        case 3 /* Group */:
            return visitor.visitGroup(node, context);
        case 4 /* Animate */:
            return visitor.visitAnimate(node, context);
        case 5 /* Keyframes */:
            return visitor.visitKeyframes(node, context);
        case 6 /* Style */:
            return visitor.visitStyle(node, context);
        case 8 /* Reference */:
            return visitor.visitReference(node, context);
        case 9 /* AnimateChild */:
            return visitor.visitAnimateChild(node, context);
        case 10 /* AnimateRef */:
            return visitor.visitAnimateRef(node, context);
        case 11 /* Query */:
            return visitor.visitQuery(node, context);
        case 12 /* Stagger */:
            return visitor.visitStagger(node, context);
        default:
            throw new Error("Unable to resolve animation metadata node #" + node.type);
    }
}
exports.visitAnimationNode = visitAnimationNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2RzbF92aXNpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9kc2wvYW5pbWF0aW9uX2RzbF92aXNpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBeUJBLDRCQUNJLE9BQTRCLEVBQUUsSUFBdUIsRUFBRSxPQUFZO0lBQ3JFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xCO1lBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBZ0MsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6RTtZQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQThCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckU7WUFDRSxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFtQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9FO1lBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBaUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzRTtZQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQThCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckU7WUFDRSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFnQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pFO1lBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBMEMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNyRjtZQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQThCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckU7WUFDRSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFrQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdFO1lBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFxQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25GO1lBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBbUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvRTtZQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQThCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckU7WUFDRSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFnQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pFO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBOEMsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO0lBQy9FLENBQUM7QUFDSCxDQUFDO0FBaENELGdEQWdDQyJ9