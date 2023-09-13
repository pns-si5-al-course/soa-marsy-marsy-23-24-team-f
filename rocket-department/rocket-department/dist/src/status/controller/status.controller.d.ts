export declare class StatusController {
    getStatus(): {
        status: string;
    };
    postStatus(body: {
        status: string;
    }, auth: string): {
        status: string;
    };
}
