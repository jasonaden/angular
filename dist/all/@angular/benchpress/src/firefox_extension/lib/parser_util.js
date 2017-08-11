"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param {Object} perfProfile The perf profile JSON object.
 * @return {Object[]} An array of recognized events that are captured
 *     within the perf profile.
 */
function convertPerfProfileToEvents(perfProfile) {
    var inProgressEvents = new Map(); // map from event name to start time
    var finishedEvents = []; // Event[] finished events
    var addFinishedEvent = function (eventName, startTime, endTime) {
        var categorizedEventName = categorizeEvent(eventName);
        var args = undefined;
        if (categorizedEventName == 'gc') {
            // TODO: We cannot measure heap size at the moment
            args = { usedHeapSize: 0 };
        }
        if (startTime == endTime) {
            // Finished instantly
            finishedEvents.push({ ph: 'X', ts: startTime, name: categorizedEventName, args: args });
        }
        else {
            // Has duration
            finishedEvents.push({ ph: 'B', ts: startTime, name: categorizedEventName, args: args });
            finishedEvents.push({ ph: 'E', ts: endTime, name: categorizedEventName, args: args });
        }
    };
    var samples = perfProfile.threads[0].samples;
    var _loop_1 = function (i) {
        var sample = samples[i];
        var sampleTime = sample.time;
        // Add all the frames into a set so it's easier/faster to find the set
        // differences
        var sampleFrames = new Set();
        sample.frames.forEach(function (frame) {
            sampleFrames.add(frame['location']);
        });
        // If an event is in the inProgressEvents map, but not in the current sample,
        // then it must have just finished. We add this event to the finishedEvents
        // array and remove it from the inProgressEvents map.
        var previousSampleTime = (i == 0 ? -1 : samples[i - 1].time);
        inProgressEvents.forEach(function (startTime, eventName) {
            if (!(sampleFrames.has(eventName))) {
                addFinishedEvent(eventName, startTime, previousSampleTime);
                inProgressEvents.delete(eventName);
            }
        });
        // If an event is in the current sample, but not in the inProgressEvents map,
        // then it must have just started. We add this event to the inProgressEvents
        // map.
        sampleFrames.forEach(function (eventName) {
            if (!(inProgressEvents.has(eventName))) {
                inProgressEvents.set(eventName, sampleTime);
            }
        });
    };
    // In perf profile, firefox samples all the frames in set time intervals. Here
    // we go through all the samples and construct the start and end time for each
    // event.
    for (var i = 0; i < samples.length; ++i) {
        _loop_1(i);
    }
    // If anything is still in progress, we need to included it as a finished event
    // since recording ended.
    var lastSampleTime = samples[samples.length - 1].time;
    inProgressEvents.forEach(function (startTime, eventName) {
        addFinishedEvent(eventName, startTime, lastSampleTime);
    });
    // Remove all the unknown categories.
    return finishedEvents.filter(function (event) { return event['name'] != 'unknown'; });
}
exports.convertPerfProfileToEvents = convertPerfProfileToEvents;
// TODO: this is most likely not exhaustive.
function categorizeEvent(eventName) {
    if (eventName.indexOf('PresShell::Paint') > -1) {
        return 'render';
    }
    else if (eventName.indexOf('FirefoxDriver.prototype.executeScript') > -1) {
        return 'script';
    }
    else if (eventName.indexOf('forceGC') > -1) {
        return 'gc';
    }
    else {
        return 'unknown';
    }
}
exports.categorizeEvent = categorizeEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9maXJlZm94X2V4dGVuc2lvbi9saWIvcGFyc2VyX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7OztHQUlHO0FBQ0gsb0NBQTJDLFdBQWdCO0lBQ3pELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFpQixvQ0FBb0M7SUFDeEYsSUFBTSxjQUFjLEdBQTJCLEVBQUUsQ0FBQyxDQUFFLDBCQUEwQjtJQUM5RSxJQUFNLGdCQUFnQixHQUFHLFVBQVMsU0FBaUIsRUFBRSxTQUFpQixFQUFFLE9BQWU7UUFDckYsSUFBTSxvQkFBb0IsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLEdBQW1DLFNBQVMsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLGtEQUFrRDtZQUNsRCxJQUFJLEdBQUcsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFDLENBQUM7UUFDM0IsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLHFCQUFxQjtZQUNyQixjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixlQUFlO1lBQ2YsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsSUFB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