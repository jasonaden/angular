"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var async_pipe_1 = require("./async_pipe");
var date_pipe_1 = require("./date_pipe");
var i18n_pipe_1 = require("./i18n_pipe");
var json_pipe_1 = require("./json_pipe");
var lowerupper_pipe_1 = require("./lowerupper_pipe");
var number_pipe_1 = require("./number_pipe");
var slice_pipe_1 = require("./slice_pipe");
var ExampleAppComponent = (function () {
    function ExampleAppComponent() {
    }
    return ExampleAppComponent;
}());
ExampleAppComponent = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <h1>Pipe Example</h1>\n\n    <h2><code>async</code></h2>\n    <async-promise-pipe></async-promise-pipe>\n    <async-observable-pipe></async-observable-pipe>\n\n    <h2><code>date</code></h2>\n    <date-pipe></date-pipe>\n    \n    <h2><code>json</code></h2>\n    <json-pipe></json-pipe>\n\n    <h2><code>lower</code>, <code>upper</code></h2>\n    <lowerupper-pipe></lowerupper-pipe>\n\n    <h2><code>number</code></h2>\n    <number-pipe></number-pipe>\n    <percent-pipe></percent-pipe>\n    <currency-pipe></currency-pipe>\n\n    <h2><code>slice</code></h2>\n    <slice-string-pipe></slice-string-pipe>\n    <slice-list-pipe></slice-list-pipe>\n\n    <h2><code>i18n</code></h2>\n    <i18n-plural-pipe></i18n-plural-pipe>\n    <i18n-select-pipe></i18n-select-pipe>\n  "
    })
], ExampleAppComponent);
exports.ExampleAppComponent = ExampleAppComponent;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            async_pipe_1.AsyncPromisePipeComponent, async_pipe_1.AsyncObservablePipeComponent, ExampleAppComponent, json_pipe_1.JsonPipeComponent,
            date_pipe_1.DatePipeComponent, lowerupper_pipe_1.LowerUpperPipeComponent, number_pipe_1.NumberPipeComponent, number_pipe_1.PercentPipeComponent,
            number_pipe_1.CurrencyPipeComponent, slice_pipe_1.SlicePipeStringComponent, slice_pipe_1.SlicePipeListComponent,
            i18n_pipe_1.I18nPluralPipeComponent, i18n_pipe_1.I18nSelectPipeComponent
        ],
        imports: [platform_browser_1.BrowserModule],
        bootstrap: [ExampleAppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL3BpcGVzL3RzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFrRDtBQUNsRCw4REFBd0Q7QUFFeEQsMkNBQXFGO0FBQ3JGLHlDQUE4QztBQUM5Qyx5Q0FBNkU7QUFDN0UseUNBQThDO0FBQzlDLHFEQUEwRDtBQUMxRCw2Q0FBK0Y7QUFDL0YsMkNBQThFO0FBa0M5RSxJQUFhLG1CQUFtQjtJQUFoQztJQUNBLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksbUJBQW1CO0lBaEMvQixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLHd3QkE0QlQ7S0FDRixDQUFDO0dBQ1csbUJBQW1CLENBQy9CO0FBRFksa0RBQW1CO0FBYWhDLElBQWEsU0FBUztJQUF0QjtJQUNBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksU0FBUztJQVZyQixlQUFRLENBQUM7UUFDUixZQUFZLEVBQUU7WUFDWixzQ0FBeUIsRUFBRSx5Q0FBNEIsRUFBRSxtQkFBbUIsRUFBRSw2QkFBaUI7WUFDL0YsNkJBQWlCLEVBQUUseUNBQXVCLEVBQUUsaUNBQW1CLEVBQUUsa0NBQW9CO1lBQ3JGLG1DQUFxQixFQUFFLHFDQUF3QixFQUFFLG1DQUFzQjtZQUN2RSxtQ0FBdUIsRUFBRSxtQ0FBdUI7U0FDakQ7UUFDRCxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO1FBQ3hCLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO0tBQ2pDLENBQUM7R0FDVyxTQUFTLENBQ3JCO0FBRFksOEJBQVMifQ==