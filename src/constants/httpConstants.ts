export type HttpStatusMap = {
    readonly OK: number;
    readonly CREATED: number;
    readonly BAD_REQUEST: number;
    readonly NOT_FOUND: number;
    readonly INTERNAL_SERVER_ERROR: number;
};

export const HTTP_STATUS: HttpStatusMap = {
    // Success responses
    OK: 200,
    CREATED: 201,

    // Client error responses
    BAD_REQUEST: 400,
    NOT_FOUND: 404,

    // Server error responses
    INTERNAL_SERVER_ERROR: 500,
} as const;
