export declare class StatusController {
    getStatus(auth: string): {
        status: string;
    };
    postStatus(body: {
        status: string;
    }, auth: string): {
        status: string;
    };
}
