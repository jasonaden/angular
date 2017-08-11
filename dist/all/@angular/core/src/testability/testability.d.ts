import { NgZone } from '../zone/ng_zone';
/**
 * Testability API.
 * `declare` keyword causes tsickle to generate externs, so these methods are
 * not renamed by Closure Compiler.
 * @experimental
 */
export interface PublicTestability {
    isStable(): boolean;
    whenStable(callback: Function): void;
    findProviders(using: any, provider: string, exactMatch: boolean): any[];
}
/**
 * The Testability service provides testing hooks that can be accessed from
 * the browser and by services such as Protractor. Each bootstrapped Angular
 * application on the page will have an instance of Testability.
 * @experimental
 */
export declare class Testability implements PublicTestability {
    private _ngZone;
    /** @internal */
    _pendingCount: number;
    /** @internal */
    _isZoneStable: boolean;
    /**
     * Whether any work was done since the last 'whenStable' callback. This is
     * useful to detect if this could have potentially destabilized another
     * component while it is stabilizing.
     * @internal
     */
    _didWork: boolean;
    /** @internal */
    _callbacks: Function[];
    constructor(_ngZone: NgZone);
    /** @internal */
    _watchAngularEvents(): void;
    increasePendingRequestCount(): number;
    decreasePendingRequestCount(): number;
    isStable(): boolean;
    /** @internal */
    _runCallbacksIfReady(): void;
    whenStable(callback: Function): void;
    getPendingRequestCount(): number;
    /** @deprecated use findProviders */
    findBindings(using: any, provider: string, exactMatch: boolean): any[];
    findProviders(using: any, provider: string, exactMatch: boolean): any[];
}
/**
 * A global registry of {@link Testability} instances for specific elements.
 * @experimental
 */
export declare class TestabilityRegistry {
    /** @internal */
    _applications: Map<any, Testability>;
    constructor();
    registerApplication(token: any, testability: Testability): void;
    getTestability(elem: any): Testability | null;
    getAllTestabilities(): Testability[];
    getAllRootElements(): any[];
    findTestabilityInTree(elem: Node, findInAncestors?: boolean): Testability | null;
}
/**
 * Adapter interface for retrieving the `Testability` service associated for a
 * particular context.
 *
 * @experimental Testability apis are primarily intended to be used by e2e test tool vendors like
 * the Protractor team.
 */
export interface GetTestability {
    addToWindow(registry: TestabilityRegistry): void;
    findTestabilityInTree(registry: TestabilityRegistry, elem: any, findInAncestors: boolean): Testability | null;
}
/**
 * Set the {@link GetTestability} implementation used by the Angular testing framework.
 * @experimental
 */
export declare function setTestabilityGetter(getter: GetTestability): void;
