"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animation_ast_1 = require("./animation_ast");
var animation_transition_factory_1 = require("./animation_transition_factory");
/**
 * @experimental Animation support is experimental.
 */
function buildTrigger(name, ast) {
    return new AnimationTrigger(name, ast);
}
exports.buildTrigger = buildTrigger;
/**
* @experimental Animation support is experimental.
*/
var AnimationTrigger = (function () {
    function AnimationTrigger(name, ast) {
        var _this = this;
        this.name = name;
        this.ast = ast;
        this.transitionFactories = [];
        this.states = {};
        ast.states.forEach(function (ast) {
            var defaultParams = (ast.options && ast.options.params) || {};
            _this.states[ast.name] = new animation_transition_factory_1.AnimationStateStyles(ast.style, defaultParams);
        });
        balanceProperties(this.states, 'true', '1');
        balanceProperties(this.states, 'false', '0');
        ast.transitions.forEach(function (ast) {
            _this.transitionFactories.push(new animation_transition_factory_1.AnimationTransitionFactory(name, ast, _this.states));
        });
        this.fallbackTransition = createFallbackTransition(name, this.states);
    }
    Object.defineProperty(AnimationTrigger.prototype, "containsQueries", {
        get: function () { return this.ast.queryCount > 0; },
        enumerable: true,
        configurable: true
    });
    AnimationTrigger.prototype.matchTransition = function (currentState, nextState) {
        var entry = this.transitionFactories.find(function (f) { return f.match(currentState, nextState); });
        return entry || null;
    };
    AnimationTrigger.prototype.matchStyles = function (currentState, params, errors) {
        return this.fallbackTransition.buildStyles(currentState, params, errors);
    };
    return AnimationTrigger;
}());
exports.AnimationTrigger = AnimationTrigger;
function createFallbackTransition(triggerName, states) {
    var matchers = [function (fromState, toState) { return true; }];
    var animation = new animation_ast_1.SequenceAst([]);
    var transition = new animation_ast_1.TransitionAst(matchers, animation);
    return new animation_transition_factory_1.AnimationTransitionFactory(triggerName, transition, states);
}
function balanceProperties(obj, key1, key2) {
    if (obj.hasOwnProperty(key1)) {
        if (!obj.hasOwnProperty(key2)) {
            obj[key2] = obj[key1];
        }
    }
    else if (obj.hasOwnProperty(key2)) {
        obj[key1] = obj[key2];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9hbmltYXRpb25fdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBLGlEQUFpRjtBQUNqRiwrRUFBZ0c7QUFHaEc7O0dBRUc7QUFDSCxzQkFBNkIsSUFBWSxFQUFFLEdBQWU7SUFDeEQsTUFBTSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFGRCxvQ0FFQztBQUVEOztFQUVFO0FBQ0Y7SUFLRSwwQkFBbUIsSUFBWSxFQUFTLEdBQWU7UUFBdkQsaUJBY0M7UUFka0IsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFKaEQsd0JBQW1CLEdBQWlDLEVBQUUsQ0FBQztRQUV2RCxXQUFNLEdBQWdELEVBQUUsQ0FBQztRQUc5RCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7WUFDcEIsSUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hFLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksbURBQW9CLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FBQztRQUVILGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTdDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUN6QixLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUkseURBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN4RixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxzQkFBSSw2Q0FBZTthQUFuQixjQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFekQsMENBQWUsR0FBZixVQUFnQixZQUFpQixFQUFFLFNBQWM7UUFDL0MsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7UUFDbkYsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVELHNDQUFXLEdBQVgsVUFBWSxZQUFpQixFQUFFLE1BQTRCLEVBQUUsTUFBYTtRQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUEvQkQsSUErQkM7QUEvQlksNENBQWdCO0FBaUM3QixrQ0FDSSxXQUFtQixFQUNuQixNQUFtRDtJQUNyRCxJQUFNLFFBQVEsR0FBRyxDQUFDLFVBQUMsU0FBYyxFQUFFLE9BQVksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztJQUMxRCxJQUFNLFNBQVMsR0FBRyxJQUFJLDJCQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsSUFBTSxVQUFVLEdBQUcsSUFBSSw2QkFBYSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxRCxNQUFNLENBQUMsSUFBSSx5REFBMEIsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFFRCwyQkFBMkIsR0FBeUIsRUFBRSxJQUFZLEVBQUUsSUFBWTtJQUM5RSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0FBQ0gsQ0FBQyJ9