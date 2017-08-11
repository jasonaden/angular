export declare const CreateBtn = "#createDom";
export declare const DestroyBtn = "#destroyDom";
export declare const DetectChangesBtn = "#detectChanges";
export declare const RootEl = "#root";
export declare const NumberOfChecksEl = "#numberOfChecks";
export interface Benchmark {
    id: string;
    url: string;
    buttons: string[];
    ignoreBrowserSynchronization?: boolean;
    extraParams?: {
        name: string;
        value: any;
    }[];
}
export declare const Benchmarks: Benchmark[];
