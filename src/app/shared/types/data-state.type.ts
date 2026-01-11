export interface DataState {
    paging?: {
        index: number;
        recordsPerPage: number;
    };
    sorting?: {
        expressions: Array<{
            fieldName: string;
            dir: string;
        }>;
    };
    startIndex?: number;
    chunkSize?: number;
    [key: string]: unknown;
}
