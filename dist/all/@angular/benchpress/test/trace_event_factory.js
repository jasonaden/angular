"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TraceEventFactory = (function () {
    function TraceEventFactory(_cat, _pid) {
        this._cat = _cat;
        this._pid = _pid;
    }
    TraceEventFactory.prototype.create = function (ph, name, time, args) {
        if (args === void 0) { args = null; }
        var res = { 'name': name, 'cat': this._cat, 'ph': ph, 'ts': time, 'pid': this._pid };
        if (args != null) {
            res['args'] = args;
        }
        return res;
    };
    TraceEventFactory.prototype.markStart = function (name, time) { return this.create('B', name, time); };
    TraceEventFactory.prototype.markEnd = function (name, time) { return this.create('E', name, time); };
    TraceEventFactory.prototype.start = function (name, time, args) {
        if (args === void 0) { args = null; }
        return this.create('B', name, time, args);
    };
    TraceEventFactory.prototype.end = function (name, time, args) {
        if (args === void 0) { args = null; }
        return this.create('E', name, time, args);
    };
    TraceEventFactory.prototype.instant = function (name, time, args) {
        if (args === void 0) { args = null; }
        return this.create('I', name, time, args);
    };
    TraceEventFactory.prototype.complete = function (name, time, duration, args) {
        if (args === void 0) { args = null; }
        var res = this.create('X', name, time, args);
        res['dur'] = duration;
        return res;
    };
    return TraceEventFactory;
}());
exports.TraceEventFactory = TraceEventFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2VfZXZlbnRfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC90cmFjZV9ldmVudF9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUg7SUFDRSwyQkFBb0IsSUFBWSxFQUFVLElBQVk7UUFBbEMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7SUFBRyxDQUFDO0lBRTFELGtDQUFNLEdBQU4sVUFBTyxFQUFPLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxJQUFnQjtRQUFoQixxQkFBQSxFQUFBLFdBQWdCO1FBQzFELElBQU0sR0FBRyxHQUNVLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQztRQUM1RixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELHFDQUFTLEdBQVQsVUFBVSxJQUFZLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlFLG1DQUFPLEdBQVAsVUFBUSxJQUFZLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVFLGlDQUFLLEdBQUwsVUFBTSxJQUFZLEVBQUUsSUFBWSxFQUFFLElBQWdCO1FBQWhCLHFCQUFBLEVBQUEsV0FBZ0I7UUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFbEcsK0JBQUcsR0FBSCxVQUFJLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBZ0I7UUFBaEIscUJBQUEsRUFBQSxXQUFnQjtRQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUVoRyxtQ0FBTyxHQUFQLFVBQVEsSUFBWSxFQUFFLElBQVksRUFBRSxJQUFnQjtRQUFoQixxQkFBQSxFQUFBLFdBQWdCO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxvQ0FBUSxHQUFSLFVBQVMsSUFBWSxFQUFFLElBQVksRUFBRSxRQUFnQixFQUFFLElBQWdCO1FBQWhCLHFCQUFBLEVBQUEsV0FBZ0I7UUFDckUsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBN0JZLDhDQUFpQiJ9