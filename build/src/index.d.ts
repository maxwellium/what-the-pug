export declare const enum Quote {
    SINGLE = "'",
    DOUBLE = "\""
}
export declare const enum Indentation {
    SPACE = " ",
    TAB = "\t"
}
export declare function escape(src: string, quote: Quote): string;
export declare function transform(html: string, quote?: Quote, indentSize?: number, indentChar?: Indentation): string[];
