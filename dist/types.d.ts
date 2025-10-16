export type Deployment = {
    id: string;
    created_on: string;
};
export type CloudflareResponse = {
    success: boolean;
    errors: any[];
    result: Deployment[];
    result_info?: {
        page: number;
        per_page: number;
        total_pages: number;
        total_count: number;
    };
};
