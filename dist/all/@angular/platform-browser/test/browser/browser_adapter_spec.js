"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
function main() {
    testing_internal_1.describe('cookies', function () {
        testing_internal_1.it('sets cookie values', function () {
            dom_adapter_1.getDOM().setCookie('my test cookie', 'my test value');
            dom_adapter_1.getDOM().setCookie('my other cookie', 'my test value 2');
            testing_internal_1.expect(dom_adapter_1.getDOM().getCookie('my test cookie')).toBe('my test value');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9hZGFwdGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvYnJvd3Nlci9icm93c2VyX2FkYXB0ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUFnRjtBQUNoRiw2RUFBcUU7QUFHckU7SUFDRSwyQkFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixxQkFBRSxDQUFDLG9CQUFvQixFQUFFO1lBQ3ZCLG9CQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdEQsb0JBQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3pELHlCQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBUkQsb0JBUUMifQ==