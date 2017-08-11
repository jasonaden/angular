"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var lifecycle_reflector_1 = require("@angular/compiler/src/lifecycle_reflector");
function hasLifecycleHook(hook, directive) {
    return lifecycle_reflector_1.hasLifecycleHook(new compiler_1.JitReflector(), hook, directive);
}
function main() {
    describe('Create Directive', function () {
        describe('lifecycle', function () {
            describe('ngOnChanges', function () {
                it('should be true when the directive has the ngOnChanges method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnChanges, DirectiveWithOnChangesMethod)).toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnChanges, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngOnDestroy', function () {
                it('should be true when the directive has the ngOnDestroy method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnDestroy, DirectiveWithOnDestroyMethod)).toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnDestroy, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngOnInit', function () {
                it('should be true when the directive has the ngOnInit method', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnInit, DirectiveWithOnInitMethod)).toBe(true); });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnInit, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngDoCheck', function () {
                it('should be true when the directive has the ngDoCheck method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.DoCheck, DirectiveWithOnCheckMethod)).toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.DoCheck, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngAfterContentInit', function () {
                it('should be true when the directive has the ngAfterContentInit method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentInit, DirectiveWithAfterContentInitMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentInit, DirectiveNoHooks)).toBe(false);
                });
            });
            describe('ngAfterContentChecked', function () {
                it('should be true when the directive has the ngAfterContentChecked method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentChecked, DirectiveWithAfterContentCheckedMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentChecked, DirectiveNoHooks)).toBe(false);
                });
            });
            describe('ngAfterViewInit', function () {
                it('should be true when the directive has the ngAfterViewInit method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewInit, DirectiveWithAfterViewInitMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewInit, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngAfterViewChecked', function () {
                it('should be true when the directive has the ngAfterViewChecked method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewChecked, DirectiveWithAfterViewCheckedMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewChecked, DirectiveNoHooks)).toBe(false);
                });
            });
        });
    });
}
exports.main = main;
var DirectiveNoHooks = (function () {
    function DirectiveNoHooks() {
    }
    return DirectiveNoHooks;
}());
var DirectiveWithOnChangesMethod = (function () {
    function DirectiveWithOnChangesMethod() {
    }
    DirectiveWithOnChangesMethod.prototype.ngOnChanges = function (_) { };
    return DirectiveWithOnChangesMethod;
}());
var DirectiveWithOnInitMethod = (function () {
    function DirectiveWithOnInitMethod() {
    }
    DirectiveWithOnInitMethod.prototype.ngOnInit = function () { };
    return DirectiveWithOnInitMethod;
}());
var DirectiveWithOnCheckMethod = (function () {
    function DirectiveWithOnCheckMethod() {
    }
    DirectiveWithOnCheckMethod.prototype.ngDoCheck = function () { };
    return DirectiveWithOnCheckMethod;
}());
var DirectiveWithOnDestroyMethod = (function () {
    function DirectiveWithOnDestroyMethod() {
    }
    DirectiveWithOnDestroyMethod.prototype.ngOnDestroy = function () { };
    return DirectiveWithOnDestroyMethod;
}());
var DirectiveWithAfterContentInitMethod = (function () {
    function DirectiveWithAfterContentInitMethod() {
    }
    DirectiveWithAfterContentInitMethod.prototype.ngAfterContentInit = function () { };
    return DirectiveWithAfterContentInitMethod;
}());
var DirectiveWithAfterContentCheckedMethod = (function () {
    function DirectiveWithAfterContentCheckedMethod() {
    }
    DirectiveWithAfterContentCheckedMethod.prototype.ngAfterContentChecked = function () { };
    return DirectiveWithAfterContentCheckedMethod;
}());
var DirectiveWithAfterViewInitMethod = (function () {
    function DirectiveWithAfterViewInitMethod() {
    }
    DirectiveWithAfterViewInitMethod.prototype.ngAfterViewInit = function () { };
    return DirectiveWithAfterViewInitMethod;
}());
var DirectiveWithAfterViewCheckedMethod = (function () {
    function DirectiveWithAfterViewCheckedMethod() {
    }
    DirectiveWithAfterViewCheckedMethod.prototype.ngAfterViewChecked = function () { };
    return DirectiveWithAfterViewCheckedMethod;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX2xpZmVjeWNsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9kaXJlY3RpdmVfbGlmZWN5Y2xlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBK0M7QUFDL0MsaUZBQTRIO0FBRzVILDBCQUEwQixJQUFXLEVBQUUsU0FBYztJQUNuRCxNQUFNLENBQUMsc0NBQW9CLENBQUMsSUFBSSx1QkFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRDtJQUNFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixRQUFRLENBQUMsV0FBVyxFQUFFO1lBRXBCLFFBQVEsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtvQkFDakUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLG9DQUFLLENBQUMsU0FBUyxFQUFFLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JGLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFDM0IsY0FBUSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsb0NBQUssQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pGLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsRUFBRSxDQUFDLDhEQUE4RCxFQUFFO29CQUNqRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsb0NBQUssQ0FBQyxTQUFTLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgs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