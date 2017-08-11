"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../../index");
var trace_event_factory_1 = require("../trace_event_factory");
function main() {
    testing_internal_1.describe('chrome driver extension', function () {
        var CHROME45_USER_AGENT = '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2499.0 Safari/537.36"';
        var log;
        var extension;
        var blinkEvents = new trace_event_factory_1.TraceEventFactory('blink.console', 'pid0');
        var v8Events = new trace_event_factory_1.TraceEventFactory('v8', 'pid0');
        var v8EventsOtherProcess = new trace_event_factory_1.TraceEventFactory('v8', 'pid1');
        var chromeTimelineEvents = new trace_event_factory_1.TraceEventFactory('disabled-by-default-devtools.timeline', 'pid0');
        var chrome45TimelineEvents = new trace_event_factory_1.TraceEventFactory('devtools.timeline', 'pid0');
        var chromeTimelineV8Events = new trace_event_factory_1.TraceEventFactory('devtools.timeline,v8', 'pid0');
        var chromeBlinkTimelineEvents = new trace_event_factory_1.TraceEventFactory('blink,devtools.timeline', 'pid0');
        var chromeBlinkUserTimingEvents = new trace_event_factory_1.TraceEventFactory('blink.user_timing', 'pid0');
        var benchmarkEvents = new trace_event_factory_1.TraceEventFactory('benchmark', 'pid0');
        var normEvents = new trace_event_factory_1.TraceEventFactory('timeline', 'pid0');
        function createExtension(perfRecords, userAgent, messageMethod) {
            if (perfRecords === void 0) { perfRecords = null; }
            if (userAgent === void 0) { userAgent = null; }
            if (messageMethod === void 0) { messageMethod = 'Tracing.dataCollected'; }
            if (!perfRecords) {
                perfRecords = [];
            }
            if (userAgent == null) {
                userAgent = CHROME45_USER_AGENT;
            }
            log = [];
            extension = index_1.Injector
                .create([
                index_1.ChromeDriverExtension.PROVIDERS, {
                    provide: index_1.WebDriverAdapter,
                    useValue: new MockDriverAdapter(log, perfRecords, messageMethod)
                },
                { provide: index_1.Options.USER_AGENT, useValue: userAgent }
            ])
                .get(index_1.ChromeDriverExtension);
            return extension;
        }
        testing_internal_1.it('should force gc via window.gc()', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().gc().then(function (_) {
                testing_internal_1.expect(log).toEqual([['executeScript', 'window.gc()']]);
                async.done();
            });
        }));
        testing_internal_1.it('should clear the perf logs and mark the timeline via console.time() on the first call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().timeBegin('someName').then(function () {
                testing_internal_1.expect(log).toEqual([['logs', 'performance'], ['executeScript', "console.time('someName');"]]);
                async.done();
            });
        }));
        testing_internal_1.it('should mark the timeline via console.time() on the second call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var ext = createExtension();
            ext.timeBegin('someName')
                .then(function (_) {
                log.splice(0, log.length);
                ext.timeBegin('someName');
            })
                .then(function () {
                testing_internal_1.expect(log).toEqual([['executeScript', "console.time('someName');"]]);
                async.done();
            });
        }));
        testing_internal_1.it('should mark the timeline via console.timeEnd()', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().timeEnd('someName', null).then(function (_) {
                testing_internal_1.expect(log).toEqual([['executeScript', "console.timeEnd('someName');"]]);
                async.done();
            });
        }));
        testing_internal_1.it('should mark the timeline via console.time() and console.timeEnd()', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().timeEnd('name1', 'name2').then(function (_) {
                testing_internal_1.expect(log).toEqual([['executeScript', "console.timeEnd('name1');console.time('name2');"]]);
                async.done();
            });
        }));
        testing_internal_1.it('should normalize times to ms and forward ph and pid event properties', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.complete('FunctionCall', 1100, 5500, null)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.complete('script', 1.1, 5.5, null),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should normalize "tdur" to "dur"', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var event = chromeTimelineV8Events.create('X', 'FunctionCall', 1100, null);
            event['tdur'] = 5500;
            createExtension([event]).readPerfLog().then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.complete('script', 1.1, 5.5, null),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should report FunctionCall events as "script"', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('FunctionCall', 0)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.start('script', 0),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should report EvaluateScript events as "script"', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('EvaluateScript', 0)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.start('script', 0),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should report minor gc', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([
                chromeTimelineV8Events.start('MinorGC', 1000, { 'usedHeapSizeBefore': 1000 }),
                chromeTimelineV8Events.end('MinorGC', 2000, { 'usedHeapSizeAfter': 0 }),
            ])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events.length).toEqual(2);
                testing_internal_1.expect(events[0]).toEqual(normEvents.start('gc', 1.0, { 'usedHeapSize': 1000, 'majorGc': false }));
                testing_internal_1.expect(events[1]).toEqual(normEvents.end('gc', 2.0, { 'usedHeapSize': 0, 'majorGc': false }));
                async.done();
            });
        }));
        testing_internal_1.it('should report major gc', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([
                chromeTimelineV8Events.start('MajorGC', 1000, { 'usedHeapSizeBefore': 1000 }),
                chromeTimelineV8Events.end('MajorGC', 2000, { 'usedHeapSizeAfter': 0 }),
            ])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events.length).toEqual(2);
                testing_internal_1.expect(events[0]).toEqual(normEvents.start('gc', 1.0, { 'usedHeapSize': 1000, 'majorGc': true }));
                testing_internal_1.expect(events[1]).toEqual(normEvents.end('gc', 2.0, { 'usedHeapSize': 0, 'majorGc': true }));
                async.done();
            });
        }));
        ['Layout', 'UpdateLayerTree', 'Paint'].forEach(function (recordType) {
            testing_internal_1.it("should report " + recordType + " as \"render\"", testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([
                    chrome45TimelineEvents.start(recordType, 1234),
                    chrome45TimelineEvents.end(recordType, 2345)
                ])
                    .readPerfLog()
                    .then(function (events) {
                    testing_internal_1.expect(events).toEqual([
                        normEvents.start('render', 1.234),
                        normEvents.end('render', 2.345),
                    ]);
                    async.done();
                });
            }));
        });
        testing_internal_1.it("should report UpdateLayoutTree as \"render\"", testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([
                chromeBlinkTimelineEvents.start('UpdateLayoutTree', 1234),
                chromeBlinkTimelineEvents.end('UpdateLayoutTree', 2345)
            ])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.start('render', 1.234),
                    normEvents.end('render', 2.345),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should ignore FunctionCalls from webdriver', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('FunctionCall', 0, { 'data': { 'scriptName': 'InjectedScript' } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([]);
                async.done();
            });
        }));
        testing_internal_1.it('should ignore FunctionCalls with empty scriptName', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('FunctionCall', 0, { 'data': { 'scriptName': '' } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([]);
                async.done();
            });
        }));
        testing_internal_1.it('should report navigationStart', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeBlinkUserTimingEvents.instant('navigationStart', 1234)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([normEvents.instant('navigationStart', 1.234)]);
                async.done();
            });
        }));
        testing_internal_1.it('should report receivedData', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chrome45TimelineEvents.instant('ResourceReceivedData', 1234, { 'data': { 'encodedDataLength': 987 } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([normEvents.instant('receivedData', 1.234, { 'encodedDataLength': 987 })]);
                async.done();
            });
        }));
        testing_internal_1.it('should report sendRequest', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chrome45TimelineEvents.instant('ResourceSendRequest', 1234, { 'data': { 'url': 'http://here', 'requestMethod': 'GET' } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([normEvents.instant('sendRequest', 1.234, { 'url': 'http://here', 'method': 'GET' })]);
                async.done();
            });
        }));
        testing_internal_1.describe('readPerfLog (common)', function () {
            testing_internal_1.it('should execute a dummy script before reading them', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                // TODO(tbosch): This seems to be a bug in ChromeDriver:
                // Sometimes it does not report the newest events of the performance log
                // to the WebDriver client unless a script is executed...
                createExtension([]).readPerfLog().then(function (_) {
                    testing_internal_1.expect(log).toEqual([['executeScript', '1+1'], ['logs', 'performance']]);
                    async.done();
                });
            }));
            ['Rasterize', 'CompositeLayers'].forEach(function (recordType) {
                testing_internal_1.it("should report " + recordType + " as \"render\"", testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([
                        chromeTimelineEvents.start(recordType, 1234),
                        chromeTimelineEvents.end(recordType, 2345)
                    ])
                        .readPerfLog()
                        .then(function (events) {
                        testing_internal_1.expect(events).toEqual([
                            normEvents.start('render', 1.234),
                            normEvents.end('render', 2.345),
                        ]);
                        async.done();
                    });
                }));
            });
            testing_internal_1.describe('frame metrics', function () {
                testing_internal_1.it('should report ImplThreadRenderingStats as frame event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([benchmarkEvents.instant('BenchmarkInstrumentation::ImplThreadRenderingStats', 1100, { 'data': { 'frame_count': 1 } })])
                        .readPerfLog()
                        .then(function (events) {
                        testing_internal_1.expect(events).toEqual([
                            normEvents.instant('frame', 1.1),
                        ]);
                        async.done();
                    });
                }));
                testing_internal_1.it('should not report ImplThreadRenderingStats with zero frames', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([benchmarkEvents.instant('BenchmarkInstrumentation::ImplThreadRenderingStats', 1100, { 'data': { 'frame_count': 0 } })])
                        .readPerfLog()
                        .then(function (events) {
                        testing_internal_1.expect(events).toEqual([]);
                        async.done();
                    });
                }));
                testing_internal_1.it('should throw when ImplThreadRenderingStats contains more than one frame', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([benchmarkEvents.instant('BenchmarkInstrumentation::ImplThreadRenderingStats', 1100, { 'data': { 'frame_count': 2 } })])
                        .readPerfLog()
                        .catch(function (err) {
                        testing_internal_1.expect(function () {
                            throw err;
                        }).toThrowError('multi-frame render stats not supported');
                        async.done();
                    });
                }));
            });
            testing_internal_1.it('should report begin timestamps', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([blinkEvents.create('S', 'someName', 1000)])
                    .readPerfLog()
                    .then(function (events) {
                    testing_internal_1.expect(events).toEqual([normEvents.markStart('someName', 1.0)]);
                    async.done();
                });
            }));
            testing_internal_1.it('should report end timestamps', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([blinkEvents.create('F', 'someName', 1000)])
                    .readPerfLog()
                    .then(function (events) {
                    testing_internal_1.expect(events).toEqual([normEvents.markEnd('someName', 1.0)]);
                    async.done();
                });
            }));
            testing_internal_1.it('should throw an error on buffer overflow', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([
                    chromeTimelineEvents.start('FunctionCall', 1234),
                ], CHROME45_USER_AGENT, 'Tracing.bufferUsage')
                    .readPerfLog()
                    .catch(function (err) {
                    testing_internal_1.expect(function () {
                        throw err;
                    }).toThrowError('The DevTools trace buffer filled during the test!');
                    async.done();
                });
            }));
            testing_internal_1.it('should match chrome browsers', function () {
                testing_internal_1.expect(createExtension().supports({ 'browserName': 'chrome' })).toBe(true);
                testing_internal_1.expect(createExtension().supports({ 'browserName': 'Chrome' })).toBe(true);
            });
        });
    });
}
exports.main = main;
var MockDriverAdapter = (function (_super) {
    __extends(MockDriverAdapter, _super);
    function MockDriverAdapter(_log, _events, _messageMethod) {
        var _this = _super.call(this) || this;
        _this._log = _log;
        _this._events = _events;
        _this._messageMethod = _messageMethod;
        return _this;
    }
    MockDriverAdapter.prototype.executeScript = function (script) {
        this._log.push(['executeScript', script]);
        return Promise.resolve(null);
    };
    MockDriverAdapter.prototype.logs = function (type) {
        var _this = this;
        this._log.push(['logs', type]);
        if (type === 'performance') {
            return Promise.resolve(this._events.map(function (event) { return ({
                'message': JSON.stringify({ 'message': { 'method': _this._messageMethod, 'params': event } }, null, 2)
            }); }));
        }
        else {
            return null;
        }
    };
    return MockDriverAdapter;
}(index_1.WebDriverAdapter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lX2RyaXZlcl9leHRlbnNpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC93ZWJkcml2ZXIvY2hyb21lX2RyaXZlcl9leHRlbnNpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwrRUFBaUg7QUFFakgscUNBQTJHO0FBQzNHLDhEQUF5RDtBQUV6RDtJQUNFLDJCQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsSUFBTSxtQkFBbUIsR0FDckIsMkhBQTJILENBQUM7UUFFaEksSUFBSSxHQUFVLENBQUM7UUFDZixJQUFJLFNBQWdDLENBQUM7UUFFckMsSUFBTSxXQUFXLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkUsSUFBTSxRQUFRLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLHVDQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRSxJQUFNLG9CQUFvQixHQUN0QixJQUFJLHVDQUFpQixDQUFDLHVDQUF1QyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLElBQU0sc0JBQXNCLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRixJQUFNLHNCQUFzQixHQUFHLElBQUksdUNBQWlCLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckYsSUFBTSx5QkFBeUIsR0FBRyxJQUFJLHVDQUFpQixDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNGLElBQU0sMkJBQTJCLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2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