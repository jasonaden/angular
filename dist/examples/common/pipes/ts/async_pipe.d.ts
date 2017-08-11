import { Observable } from 'rxjs/Observable';
export declare class AsyncPromisePipeComponent {
    greeting: Promise<string> | null;
    arrived: boolean;
    private resolve;
    constructor();
    reset(): void;
    clicked(): void;
}
export declare class AsyncObservablePipeComponent {
    time: Observable<string>;
}
