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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
/**
 * You can find the AngularJS implementation of this example here:
 * https://github.com/wardbell/ng1DataBinding
 */
// ---- model
var OrderItem = (function () {
    function OrderItem(orderItemId, orderId, productName, qty, unitPrice) {
        this.orderItemId = orderItemId;
        this.orderId = orderId;
        this.productName = productName;
        this.qty = qty;
        this.unitPrice = unitPrice;
    }
    Object.defineProperty(OrderItem.prototype, "total", {
        get: function () { return this.qty * this.unitPrice; },
        enumerable: true,
        configurable: true
    });
    return OrderItem;
}());
var Order = (function () {
    function Order(orderId, customerName, limit, _dataService) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.limit = limit;
        this._dataService = _dataService;
    }
    Object.defineProperty(Order.prototype, "items", {
        get: function () { return this._dataService.itemsFor(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "total", {
        get: function () { return this.items.map(function (i) { return i.total; }).reduce(function (a, b) { return a + b; }, 0); },
        enumerable: true,
        configurable: true
    });
    return Order;
}());
// ---- services
var _nextId = 1000;
var DataService = (function () {
    function DataService() {
        this.currentOrder = null;
        this.orders = [
            new Order(_nextId++, 'J. Coltrane', 100, this), new Order(_nextId++, 'B. Evans', 200, this)
        ];
        this.orderItems = [
            new OrderItem(_nextId++, this.orders[0].orderId, 'Bread', 5, 1),
            new OrderItem(_nextId++, this.orders[0].orderId, 'Brie', 5, 2),
            new OrderItem(_nextId++, this.orders[0].orderId, 'IPA', 5, 3),
            new OrderItem(_nextId++, this.orders[1].orderId, 'Mozzarella', 5, 2),
            new OrderItem(_nextId++, this.orders[1].orderId, 'Wine', 5, 3)
        ];
    }
    DataService.prototype.itemsFor = function (order) {
        return this.orderItems.filter(function (i) { return i.orderId === order.orderId; });
    };
    DataService.prototype.addItemForOrder = function (order) {
        this.orderItems.push(new OrderItem(_nextId++, order.orderId, '', 0, 0));
    };
    DataService.prototype.deleteItem = function (item) { this.orderItems.splice(this.orderItems.indexOf(item), 1); };
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], DataService);
// ---- components
var OrderListComponent = (function () {
    function OrderListComponent(_service) {
        this._service = _service;
        this.orders = _service.orders;
    }
    OrderListComponent.prototype.select = function (order) { this._service.currentOrder = order; };
    return OrderListComponent;
}());
OrderListComponent = __decorate([
    core_1.Component({
        selector: 'order-list-cmp',
        template: "\n    <h1>Orders</h1>\n  \t<div *ngFor=\"let order of orders\" [class.warning]=\"order.total > order.limit\">\n      <div>\n        <label>Customer name:</label>\n        {{order.customerName}}\n      </div>\n\n      <div>\n        <label>Limit: <input [(ngModel)]=\"order.limit\" type=\"number\" placeholder=\"Limit\"></label>\n      </div>\n\n      <div>\n        <label>Number of items:</label>\n        {{order.items.length}}\n      </div>\n\n      <div>\n        <label>Order total:</label>\n        {{order.total}}\n      </div>\n\n      <button (click)=\"select(order)\">Select</button>\n  \t</div>\n  "
    }),
    __metadata("design:paramtypes", [DataService])
], OrderListComponent);
var OrderItemComponent = (function () {
    function OrderItemComponent() {
        this.delete = new core_1.EventEmitter();
    }
    OrderItemComponent.prototype.onDelete = function () { this.delete.emit(this.item); };
    return OrderItemComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", OrderItem)
], OrderItemComponent.prototype, "item", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], OrderItemComponent.prototype, "delete", void 0);
OrderItemComponent = __decorate([
    core_1.Component({
        selector: 'order-item-cmp',
        template: "\n    <div>\n      <div>\n        <label>Product name: <input [(ngModel)]=\"item.productName\" type=\"text\" placeholder=\"Product name\"></label>\n      </div>\n\n      <div>\n        <label>Quantity: <input [(ngModel)]=\"item.qty\" type=\"number\" placeholder=\"Quantity\"></label>\n      </div>\n\n      <div>\n        <label>Unit Price: <input [(ngModel)]=\"item.unitPrice\" type=\"number\" placeholder=\"Unit price\"></label>\n      </div>\n\n      <div>\n        <label>Total:</label>\n        {{item.total}}\n      </div>\n\n      <button (click)=\"onDelete()\">Delete</button>\n    </div>\n  "
    })
], OrderItemComponent);
var OrderDetailsComponent = (function () {
    function OrderDetailsComponent(_service) {
        this._service = _service;
    }
    Object.defineProperty(OrderDetailsComponent.prototype, "order", {
        get: function () { return this._service.currentOrder; },
        enumerable: true,
        configurable: true
    });
    OrderDetailsComponent.prototype.deleteItem = function (item) { this._service.deleteItem(item); };
    OrderDetailsComponent.prototype.addItem = function () { this._service.addItemForOrder(this.order); };
    return OrderDetailsComponent;
}());
OrderDetailsComponent = __decorate([
    core_1.Component({
        selector: 'order-details-cmp',
        template: "\n    <div *ngIf=\"order !== null\">\n      <h1>Selected Order</h1>\n      <div>\n        <label>Customer name: <input [(ngModel)]=\"order.customerName\" type=\"text\" placeholder=\"Customer name\"></label>\n      </div>\n\n      <div>\n        <label>Limit: <input [(ngModel)]=\"order.limit\" type=\"number\" placeholder=\"Limit\"></label>\n      </div>\n\n      <div>\n        <label>Number of items:</label>\n        {{order.items.length}}\n      </div>\n\n      <div>\n        <label>Order total:</label>\n        {{order.total}}\n      </div>\n\n      <h2>Items</h2>\n      <button (click)=\"addItem()\">Add Item</button>\n      <order-item-cmp *ngFor=\"let item of order.items\" [item]=\"item\" (delete)=\"deleteItem(item)\"></order-item-cmp>\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [DataService])
], OrderDetailsComponent);
var OrderManagementApplication = (function () {
    function OrderManagementApplication() {
    }
    return OrderManagementApplication;
}());
OrderManagementApplication = __decorate([
    core_1.Component({
        selector: 'order-management-app',
        providers: [DataService],
        template: "\n    <order-list-cmp></order-list-cmp>\n    <order-details-cmp></order-details-cmp>\n  "
    })
], OrderManagementApplication);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({
        bootstrap: [OrderManagementApplication],
        declarations: [OrderManagementApplication, OrderListComponent, OrderDetailsComponent, OrderItemComponent],
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule]
    })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL29yZGVyX21hbmFnZW1lbnQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkY7QUFDM0Ysd0NBQTJDO0FBQzNDLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFFekU7OztHQUdHO0FBRUgsYUFBYTtBQUViO0lBQ0UsbUJBQ1csV0FBbUIsRUFBUyxPQUFlLEVBQVMsV0FBbUIsRUFDdkUsR0FBVyxFQUFTLFNBQWlCO1FBRHJDLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ3ZFLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO0lBQUcsQ0FBQztJQUVwRCxzQkFBSSw0QkFBSzthQUFULGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMzRCxnQkFBQztBQUFELENBQUMsQUFORCxJQU1DO0FBRUQ7SUFDRSxlQUNXLE9BQWUsRUFBUyxZQUFvQixFQUFTLEtBQWEsRUFDakUsWUFBeUI7UUFEMUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNqRSxpQkFBWSxHQUFaLFlBQVksQ0FBYTtJQUFHLENBQUM7SUFFekMsc0JBQUksd0JBQUs7YUFBVCxjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNyRSxzQkFBSSx3QkFBSzthQUFULGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FB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