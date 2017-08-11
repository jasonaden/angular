import { ComponentFactoryResolver, ComponentRef, Injector, NgModuleRef } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { TreeNode } from '../util';
export declare class TreeComponent {
    data: TreeNode;
    readonly bgColor: SafeStyle;
}
export declare class AppModule implements Injector, NgModuleRef<any> {
    private sanitizer;
    private componentFactory;
    private renderer2;
    componentRef: ComponentRef<TreeComponent>;
    constructor();
    get(token: any, notFoundValue?: any): any;
    bootstrap(): void;
    tick(): void;
    readonly injector: this;
    readonly componentFactoryResolver: ComponentFactoryResolver;
    readonly instance: this;
    destroy(): void;
    onDestroy(callback: () => void): void;
}
