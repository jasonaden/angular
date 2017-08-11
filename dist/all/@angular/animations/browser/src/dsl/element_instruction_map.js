"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ElementInstructionMap = (function () {
    function ElementInstructionMap() {
        this._map = new Map();
    }
    ElementInstructionMap.prototype.consume = function (element) {
        var instructions = this._map.get(element);
        if (instructions) {
            this._map.delete(element);
        }
        else {
            instructions = [];
        }
        return instructions;
    };
    ElementInstructionMap.prototype.append = function (element, instructions) {
        var existingInstructions = this._map.get(element);
        if (!existingInstructions) {
            this._map.set(element, existingInstructions = []);
        }
        existingInstructions.push.apply(existingInstructions, instructions);
    };
    ElementInstructionMap.prototype.has = function (element) { return this._map.has(element); };
    ElementInstructionMap.prototype.clear = function () { this._map.clear(); };
    return ElementInstructionMap;
}());
exports.ElementInstructionMap = ElementInstructionMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9pbnN0cnVjdGlvbl9tYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9lbGVtZW50X2luc3RydWN0aW9uX21hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVNBO0lBQUE7UUFDVSxTQUFJLEdBQUcsSUFBSSxHQUFHLEVBQXVDLENBQUM7SUF1QmhFLENBQUM7SUFyQkMsdUNBQU8sR0FBUCxVQUFRLE9BQVk7UUFDbEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxzQ0FBTSxHQUFOLFVBQU8sT0FBWSxFQUFFLFlBQTRDO1FBQy9ELElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDRCxvQkFBb0IsQ0FBQyxJQUFJLE9BQXpCLG9CQUFvQixFQUFTLFlBQVksRUFBRTtJQUM3QyxDQUFDO0lBRUQsbUNBQUcsR0FBSCxVQUFJLE9BQVksSUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdELHFDQUFLLEdBQUwsY0FBVSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoQyw0QkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkM7QUF4Qlksc0RBQXFCIn0=