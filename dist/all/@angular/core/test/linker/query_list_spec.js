"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var change_detection_util_1 = require("@angular/core/src/change_detection/change_detection_util");
var query_list_1 = require("@angular/core/src/linker/query_list");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
function main() {
    testing_internal_1.describe('QueryList', function () {
        var queryList;
        var log;
        testing_internal_1.beforeEach(function () {
            queryList = new query_list_1.QueryList();
            log = '';
        });
        function logAppend(item /** TODO #9100 */) { log += (log.length == 0 ? '' : ', ') + item; }
        testing_internal_1.it('should support resetting and iterating over the new objects', function () {
            queryList.reset(['one']);
            queryList.reset(['two']);
            change_detection_util_1.iterateListLike(queryList, logAppend);
            testing_internal_1.expect(log).toEqual('two');
        });
        testing_internal_1.it('should support length', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.length).toEqual(2);
        });
        testing_internal_1.it('should support map', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.map(function (x) { return x; })).toEqual(['one', 'two']);
        });
        testing_internal_1.it('should support map with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.map(function (x, i) { return x + "_" + i; })).toEqual(['one_0', 'two_1']);
        });
        testing_internal_1.it('should support forEach', function () {
            queryList.reset(['one', 'two']);
            var join = '';
            queryList.forEach(function (x) { return join = join + x; });
            testing_internal_1.expect(join).toEqual('onetwo');
        });
        testing_internal_1.it('should support forEach with index', function () {
            queryList.reset(['one', 'two']);
            var join = '';
            queryList.forEach(function (x, i) { return join = join + x + i; });
            testing_internal_1.expect(join).toEqual('one0two1');
        });
        testing_internal_1.it('should support filter', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.filter(function (x) { return x == 'one'; })).toEqual(['one']);
        });
        testing_internal_1.it('should support filter with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.filter(function (x, i) { return i == 0; })).toEqual(['one']);
        });
        testing_internal_1.it('should support find', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.find(function (x) { return x == 'two'; })).toEqual('two');
        });
        testing_internal_1.it('should support find with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.find(function (x, i) { return i == 1; })).toEqual('two');
        });
        testing_internal_1.it('should support reduce', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.reduce(function (a, x) { return a + x; }, 'start:')).toEqual('start:onetwo');
        });
        testing_internal_1.it('should support reduce with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.reduce(function (a, x, i) { return a + x + i; }, 'start:'))
                .toEqual('start:one0two1');
        });
        testing_internal_1.it('should support toArray', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.reduce(function (a, x) { return a + x; }, 'start:')).toEqual('start:onetwo');
        });
        testing_internal_1.it('should support toArray', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.toArray()).toEqual(['one', 'two']);
        });
        testing_internal_1.it('should support toString', function () {
            queryList.reset(['one', 'two']);
            var listString = queryList.toString();
            testing_internal_1.expect(listString.indexOf('one') != -1).toBeTruthy();
            testing_internal_1.expect(listString.indexOf('two') != -1).toBeTruthy();
        });
        testing_internal_1.it('should support first and last', function () {
            queryList.reset(['one', 'two', 'three']);
            testing_internal_1.expect(queryList.first).toEqual('one');
            testing_internal_1.expect(queryList.last).toEqual('three');
        });
        testing_internal_1.it('should support some', function () {
            queryList.reset(['one', 'two', 'three']);
            testing_internal_1.expect(queryList.some(function (item) { return item === 'one'; })).toEqual(true);
            testing_internal_1.expect(queryList.some(function (item) { return item === 'four'; })).toEqual(false);
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            testing_internal_1.describe('simple observable interface', function () {
                testing_internal_1.it('should fire callbacks on change', testing_1.fakeAsync(function () {
                    var fires = 0;
                    queryList.changes.subscribe({ next: function (_) { fires += 1; } });
                    queryList.notifyOnChanges();
                    testing_1.tick();
                    testing_internal_1.expect(fires).toEqual(1);
                    queryList.notifyOnChanges();
                    testing_1.tick();
                    testing_internal_1.expect(fires).toEqual(2);
                }));
                testing_internal_1.it('should provides query list as an argument', testing_1.fakeAsync(function () {
                    var recorded /** TODO #9100 */;
                    queryList.changes.subscribe({ next: function (v) { recorded = v; } });
                    queryList.reset(['one']);
                    queryList.notifyOnChanges();
                    testing_1.tick();
                    testing_internal_1.expect(recorded).toBe(queryList);
                }));
            });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfbGlzdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9xdWVyeV9saXN0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrR0FBeUY7QUFDekYsa0VBQThEO0FBQzlELGlEQUFzRDtBQUN0RCwrRUFBNEY7QUFDNUYsNkVBQXFFO0FBRXJFO0lBQ0UsMkJBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsSUFBSSxTQUE0QixDQUFDO1FBQ2pDLElBQUksR0FBVyxDQUFDO1FBQ2hCLDZCQUFVLENBQUM7WUFDVCxTQUFTLEdBQUcsSUFBSSxzQkFBUyxFQUFVLENBQUM7WUFDcEMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBRUgsbUJBQW1CLElBQVMsQ0FBQyxpQkFBaUIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVoRyxxQkFBRSxDQUFDLDZEQUE2RCxFQUFFO1lBQ2hFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLHVDQUFlLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLHlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyx1QkFBdUIsRUFBRTtZQUMxQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEMseUJBQU0sQ0FBQyxTQUFTLENB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