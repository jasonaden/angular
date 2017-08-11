"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fs = require("fs");
var Options = (function () {
    function Options() {
    }
    return Options;
}());
Options.SAMPLE_ID = new core_1.InjectionToken('Options.sampleId');
Options.DEFAULT_DESCRIPTION = new core_1.InjectionToken('Options.defaultDescription');
Options.SAMPLE_DESCRIPTION = new core_1.InjectionToken('Options.sampleDescription');
Options.FORCE_GC = new core_1.InjectionToken('Options.forceGc');
Options.NO_PREPARE = function () { return true; };
Options.PREPARE = new core_1.InjectionToken('Options.prepare');
Options.EXECUTE = new core_1.InjectionToken('Options.execute');
Options.CAPABILITIES = new core_1.InjectionToken('Options.capabilities');
Options.USER_AGENT = new core_1.InjectionToken('Options.userAgent');
Options.MICRO_METRICS = new core_1.InjectionToken('Options.microMetrics');
Options.USER_METRICS = new core_1.InjectionToken('Options.userMetrics');
Options.NOW = new core_1.InjectionToken('Options.now');
Options.WRITE_FILE = new core_1.InjectionToken('Options.writeFile');
Options.RECEIVED_DATA = new core_1.InjectionToken('Options.receivedData');
Options.REQUEST_COUNT = new core_1.InjectionToken('Options.requestCount');
Options.CAPTURE_FRAMES = new core_1.InjectionToken('Options.frameCapture');
Options.DEFAULT_PROVIDERS = [
    { provide: Options.DEFAULT_DESCRIPTION, useValue: {} },
    { provide: Options.SAMPLE_DESCRIPTION, useValue: {} },
    { provide: Options.FORCE_GC, useValue: false },
    { provide: Options.PREPARE, useValue: Options.NO_PREPARE },
    { provide: Options.MICRO_METRICS, useValue: {} }, { provide: Options.USER_METRICS, useValue: {} },
    { provide: Options.NOW, useValue: function () { return new Date(); } },
    { provide: Options.RECEIVED_DATA, useValue: false },
    { provide: Options.REQUEST_COUNT, useValue: false },
    { provide: Options.CAPTURE_FRAMES, useValue: false },
    { provide: Options.WRITE_FILE, useValue: writeFile }
];
exports.Options = Options;
function writeFile(filename, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, content, function (error) {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9jb21tb25fb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE2QztBQUM3Qyx1QkFBeUI7QUFFekI7SUFBQTtJQTZCQSxDQUFDO0lBQUQsY0FBQztBQUFELENBQUMsQUE3QkQ7QUFDUyxpQkFBUyxHQUFHLElBQUkscUJBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ25ELDJCQUFtQixHQUFHLElBQUkscUJBQWMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3ZFLDBCQUFrQixHQUFHLElBQUkscUJBQWMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3JFLGdCQUFRLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDakQsa0JBQVUsR0FBRyxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQztBQUN4QixlQUFPLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDaEQsZUFBTyxHQUFHLElBQUkscUJBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2hELG9CQUFZLEdBQUcsSUFBSSxxQkFBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDMUQsa0JBQVUsR0FBRyxJQUFJLHFCQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNyRCxxQkFBYSxHQUFHLElBQUkscUJBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzNELG9CQUFZLEdBQUcsSUFBSSxxQkFBYyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDekQsV0FBRyxHQUFHLElBQUkscUJBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN4QyxrQkFBVSxHQUFHLElBQUkscUJBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3JELHFCQUFhLEdBQUcsSUFBSSxxQkFBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDM0QscUJBQWEsR0FBRyxJQUFJLHFCQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUMzRCxzQkFBYyxHQUFHLElBQUkscUJBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzVELHlCQUFpQixHQUFHO0lBQ3pCLEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDO0lBQ3BELEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDO0lBQ25ELEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztJQUM1QyxFQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsVUFBVSxFQUFDO0lBQ3hELEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQztJQUM3RixFQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxjQUFNLE9BQUEsSUFBSSxJQUFJLEVBQUUsRUFBVixDQUFVLEVBQUM7SUFDbEQsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDO0lBQ2pELEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztJQUNqRCxFQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7SUFDbEQsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDO0NBQ25ELENBQUM7QUE1QlMsMEJBQU87QUErQnBCLG1CQUFtQixRQUFnQixFQUFFLE9BQWU7SUFDbEQsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU07UUFDekMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQUMsS0FBSztZQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMifQ==