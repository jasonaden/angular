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
var index_1 = require("../index");
function main() {
    function createExtension(ids, caps) {
        return new Promise(function (res, rej) {
            try {
                res(index_1.Injector
                    .create([
                    ids.map(function (id) { return ({ provide: id, useValue: new MockExtension(id) }); }),
                    { provide: index_1.Options.CAPABILITIES, useValue: caps },
                    index_1.WebDriverExtension.provideFirstSupported(ids)
                ])
                    .get(index_1.WebDriverExtension));
            }
            catch (e) {
                rej(e);
            }
        });
    }
    testing_internal_1.describe('WebDriverExtension.provideFirstSupported', function () {
        testing_internal_1.it('should provide the extension that matches the capabilities', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension(['m1', 'm2', 'm3'], { 'browser': 'm2' }).then(function (m) {
                testing_internal_1.expect(m.id).toEqual('m2');
                async.done();
            });
        }));
        testing_internal_1.it('should throw if there is no match', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension(['m1'], { 'browser': 'm2' }).catch(function (err) {
                testing_internal_1.expect(err != null).toBe(true);
                async.done();
            });
        }));
    });
}
exports.main = main;
var MockExtension = (function (_super) {
    __extends(MockExtension, _super);
    function MockExtension(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    MockExtension.prototype.supports = function (capabilities) {
        return capabilities['browser'] === this.id;
    };
    return MockExtension;
}(index_1.WebDriverExtension));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2RyaXZlcl9leHRlbnNpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC93ZWJfZHJpdmVyX2V4dGVuc2lvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILCtFQUE0RztBQUU1RyxrQ0FBK0Q7QUFFL0Q7SUFDRSx5QkFBeUIsR0FBVSxFQUFFLElBQVM7UUFDNUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFNLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDL0IsSUFBSSxDQUFDO2dCQUNILEdBQUcsQ0FBQyxnQkFBUTtxQkFDSCxNQUFNLENBQUM7b0JBQ04sR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQUUsSUFBSyxPQUFBLENBQUMsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQWhELENBQWdELENBQUM7b0JBQ2pFLEVBQUMsT0FBTyxFQUFFLGVBQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztvQkFDL0MsMEJBQWtCLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDO2lCQUM5QyxDQUFDO3FCQUNELEdBQUcsQ0FBQywwQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJCQUFRLENBQUMsMENBQTBDLEVBQUU7UUFFbkQscUJBQUUsQ0FBQyw0REFBNEQsRUFDNUQseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxlQUFlLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnQkFDNUQseUJBQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLG1DQUFtQyxFQUNuQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRztnQkFDbkQseUJBQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFuQ0Qsb0JBbUNDO0FBRUQ7SUFBNEIsaUNBQWtCO0lBQzVDLHVCQUFtQixFQUFVO1FBQTdCLFlBQWlDLGlCQUFPLFNBQUc7UUFBeEIsUUFBRSxHQUFGLEVBQUUsQ0FBUTs7SUFBYSxDQUFDO0lBRTNDLGdDQUFRLEdBQVIsVUFBUyxZQUFrQztRQUN6QyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQU5ELENBQTRCLDBCQUFrQixHQU03QyJ9