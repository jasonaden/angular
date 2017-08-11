"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var animation_ast_builder_1 = require("./animation_ast_builder");
var animation_timeline_builder_1 = require("./animation_timeline_builder");
var element_instruction_map_1 = require("./element_instruction_map");
var Animation = (function () {
    function Animation(_driver, input) {
        this._driver = _driver;
        var errors = [];
        var ast = animation_ast_builder_1.buildAnimationAst(input, errors);
        if (errors.length) {
            var errorMessage = "animation validation failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        this._animationAst = ast;
    }
    Animation.prototype.buildTimelines = function (element, startingStyles, destinationStyles, options, subInstructions) {
        var start = Array.isArray(startingStyles) ? util_1.normalizeStyles(startingStyles) :
            startingStyles;
        var dest = Array.isArray(destinationStyles) ? util_1.normalizeStyles(destinationStyles) :
            destinationStyles;
        var errors = [];
        subInstructions = subInstructions || new element_instruction_map_1.ElementInstructionMap();
        var result = animation_timeline_builder_1.buildAnimationTimelines(this._driver, element, this._animationAst, start, dest, options, subInstructions, errors);
        if (errors.length) {
            var errorMessage = "animation building failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        return result;
    };
    return Animation;
}());
exports.Animation = Animation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9kc2wvYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBVUEsZ0NBQXdDO0FBR3hDLGlFQUEwRDtBQUMxRCwyRUFBcUU7QUFFckUscUVBQWdFO0FBRWhFO0lBRUUsbUJBQW9CLE9BQXdCLEVBQUUsS0FBNEM7UUFBdEUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDMUMsSUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLHlDQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFNLFlBQVksR0FBRyxtQ0FBaUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQztZQUMxRSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0NBQWMsR0FBZCxVQUNJLE9BQVksRUFBRSxjQUF1QyxFQUNyRCxpQkFBMEMsRUFBRSxPQUF5QixFQUNyRSxlQUF1QztRQUN6QyxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLHNCQUFlLENBQUMsY0FBYyxDQUFDO1lBQ25CLGNBQWMsQ0FBQztRQUN6RSxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsc0JBQWUsQ0FBQyxpQkFBaUIsQ0FBQztZQUN0QixpQkFBaUIsQ0FBQztRQUM5RSxJQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7UUFDdkIsZUFBZSxHQUFHLGVBQWUsSUFBSSxJQUFJLCtDQUFxQixFQUFFLENBQUM7UUFDakUsSUFBTSxNQUFNLEdBQUcsb0RBQXVCLENBQ2xDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQU0sWUFBWSxHQUFHLGlDQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRyxDQUFDO1lBQ3hFLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQTlCRCxJQThCQztBQTlCWSw4QkFBUyJ9