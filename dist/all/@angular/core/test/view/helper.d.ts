import { ArgumentType, NodeCheckFn, NodeDef, ViewData, ViewDefinition } from '@angular/core/src/view/index';
export declare function isBrowser(): boolean;
export declare const ARG_TYPE_VALUES: ArgumentType[];
export declare function checkNodeInlineOrDynamic(check: NodeCheckFn, view: ViewData, nodeIndex: number, argType: ArgumentType, values: any[]): any;
export declare function createRootView(def: ViewDefinition, context?: any, projectableNodes?: any[][], rootSelectorOrNode?: any): ViewData;
export declare function createEmbeddedView(parent: ViewData, anchorDef: NodeDef, context?: any): ViewData;
export declare function recordNodeToRemove(node: Node): void;
