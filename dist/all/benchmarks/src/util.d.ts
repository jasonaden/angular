export declare function getIntParameter(name: string): number;
export declare function getStringParameter(name: string): any;
export declare function bindAction(selector: string, callback: () => void): void;
export declare function profile(create: () => void, destroy: () => void, name: string): () => void;
