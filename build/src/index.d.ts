export declare const enum Quote {
    SINGLE = "'",
    DOUBLE = "\""
}
export declare function escape(src: string, quote: Quote): string;
export declare function transform(html: string, quote?: Quote, indent?: number): string[];
