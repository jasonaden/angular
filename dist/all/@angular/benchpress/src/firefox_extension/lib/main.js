/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _a = require('chrome'), Cc = _a.Cc, Ci = _a.Ci, Cu = _a.Cu;
var os = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
var ParserUtil = require('./parser_util');
var Profiler = (function () {
    function Profiler() {
        this._profiler = Cc['@mozilla.org/tools/profiler;1'].getService(Ci.nsIProfiler);
    }
    Profiler.prototype.start = function (entries, interval, features, timeStarted) {
        this._profiler.StartProfiler(entries, interval, features, features.length);
        this._profilerStartTime = timeStarted;
        this._markerEvents = [];
    };
    Profiler.prototype.stop = function () { this._profiler.StopProfiler(); };
    Profiler.prototype.getProfilePerfEvents = function () {
        var profileData = this._profiler.getProfileData();
        var perfEvents = ParserUtil.convertPerfProfileToEvents(profileData);
        perfEvents = this._mergeMarkerEvents(perfEvents);
        perfEvents.sort(function (event1, event2) {
            return event1.ts - event2.ts;
        }); // Sort by ts
        return perfEvents;
    };
    /** @internal */
    Profiler.prototype._mergeMarkerEvents = function (perfEvents) {
        this._markerEvents.forEach(function (markerEvent) { perfEvents.push(markerEvent); });
        return perfEvents;
    };
    Profiler.prototype.addStartEvent = function (name, timeStarted) {
        this._markerEvents.push({ ph: 'B', ts: timeStarted - this._profilerStartTime, name: name });
    };
    Profiler.prototype.addEndEvent = function (name, timeEnded) {
        this._markerEvents.push({ ph: 'E', ts: timeEnded - this._profilerStartTime, name: name });
    };
    return Profiler;
}());
function forceGC() {
    Cu.forceGC();
    os.notifyObservers(null, 'child-gc-request', null);
}
;
var mod = require('sdk/page-mod');
var data = require('sdk/self').data;
var profiler = new Profiler();
mod.PageMod({
    include: ['*'],
    contentScriptFile: data.url('installed_script.js'),
    onAttach: function (worker) {
        worker.port.on('startProfiler', function (timeStarted) { return profiler.start(
        /* = profiler memory */ 3000000, 0.1, ['leaf', 'js', 'stackwalk', 'gc'], timeStarted); });
        worker.port.on('stopProfiler', function () { return profiler.stop(); });
        worker.port.on('getProfile', function () { return worker.port.emit('perfProfile', profiler.getProfilePerfEvents()); });
        worker.port.on('forceGC', forceGC);
        worker.port.on('markStart', function (name, timeStarted) { return profiler.addStartEvent(name, timeStarted); });
        worker.port.on('markEnd', function (name, timeEnded) { return profiler.addEndEvent(name, timeEnded); });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL2ZpcmVmb3hfZXh0ZW5zaW9uL2xpYi9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVHLElBQUEsc0JBQWdDLEVBQS9CLFVBQUUsRUFBRSxVQUFFLEVBQUUsVUFBRSxDQUFzQjtBQUN2QyxJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDbkYsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBS0U7UUFBZ0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsK0JBQStCLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUVsRyx3QkFBSyxHQUFMLFVBQU0sT0FBWSxFQUFFLFFBQWEsRUFBRSxRQUFhLEVBQUUsV0FBZ0I7UUFDaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxXQUFXLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELHVCQUFJLEdBQUosY0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6Qyx1Q0FBb0IsR0FBcEI7UUFDRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BELElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxXQUFXLENBQUMsQ0FBQztR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