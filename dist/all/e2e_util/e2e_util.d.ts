export declare function readCommandLine(extraOptions?: {
    [key: string]: any;
}): {
    'bundles': boolean;
};
export declare function openBrowser(config: {
    url: string;
    params?: {
        name: string;
        value: any;
    }[];
    ignoreBrowserSynchronization?: boolean;
}): void;
/**
 * @experimental This API will be moved to Protractor.
 */
export declare function verifyNoBrowserErrors(): void;
