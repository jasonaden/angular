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
const core_1 = require("@angular/core");
// #docregion NumberPipe
let NumberPipeComponent = class NumberPipeComponent {
    // #docregion NumberPipe
    constructor() {
        this.pi = 3.141592;
        this.e = 2.718281828459045;
    }
};
NumberPipeComponent = __decorate([
    core_1.Component({
        selector: 'number-pipe',
        template: `<div>
    <p>e (no formatting): {{e}}</p>
    <p>e (3.1-5): {{e | number:'3.1-5'}}</p>
    <p>pi (no formatting): {{pi}}</p>
    <p>pi (3.5-5): {{pi | number:'3.5-5'}}</p>
  </div>`
    })
], NumberPipeComponent);
exports.NumberPipeComponent = NumberPipeComponent;
// #enddocregion
// #docregion PercentPipe
let PercentPipeComponent = class PercentPipeComponent {
    // #enddocregion
    // #docregion PercentPipe
    constructor() {
        this.a = 0.259;
        this.b = 1.3495;
    }
};
PercentPipeComponent = __decorate([
    core_1.Component({
        selector: 'percent-pipe',
        template: `<div>
    <p>A: {{a | percent}}</p>
    <p>B: {{b | percent:'4.3-5'}}</p>
  </div>`
    })
], PercentPipeComponent);
exports.PercentPipeComponent = PercentPipeComponent;
// #enddocregion
// #docregion CurrencyPipe
let CurrencyPipeComponent = class CurrencyPipeComponent {
    // #enddocregion
    // #docregion CurrencyPipe
    constructor() {
        this.a = 0.259;
        this.b = 1.3495;
    }
};
CurrencyPipeComponent = __decorate([
    core_1.Component({
        selector: 'currency-pipe',
        template: `<div>
    <p>A: {{a | currency:'USD':false}}</p>
    <p>B: {{b | currency:'USD':true:'4.2-2'}}</p>
  </div>`
    })
], CurrencyPipeComponent);
exports.CurrencyPipeComponent = CurrencyPipeComponent;
// #enddocregion
//# sourceMappingURL=number_pipe.js.map