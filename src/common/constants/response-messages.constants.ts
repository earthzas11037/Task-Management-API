export const EXCEPTION_MESSAGES = {
  SERVER_ERROR: `An unexpected error occurred. Please contact our support team, and we'll get this sorted for you as soon as possible!`,
  NOT_FOUND: 'The requested resource could not be found.',
  BAD_REQUEST: 'Invalid request.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  CONFLICT: 'Data conflict. Please try again.',
  VALIDATION_ERROR: 'Validation failed.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  SERVICE_UNAVAILABLE: 'Service is currently unavailable.',
  TIMEOUT: 'Request timed out.',
};

export enum ResponseCodes {
  SUCCESS = '1000',
  CREATED = '1001',
  UPDATED = '1002',
  DELETED = '1003',
  SAVED = '1004',
  ACCEPTED = '1005',
  NO_CONTENT = '1006',
  PARTIAL_CONTENT = '1007',
  NOT_MODIFIED = '1008',
  RESET_CONTENT = '1009',
  INTERNAL_SERVER_ERROR = '5000',
}

export const RESPONSE_MESSAGES: ResponseMessages = {
  SUCCESS: {
    message: 'Operation was successful.',
    statusCode: 200, // OK
    responseCode: ResponseCodes.SUCCESS,
  },
  CREATED: {
    message: 'Resource has been created successfully.',
    statusCode: 201, // Created
  },
  UPDATED: {
    message: 'Resource has been updated successfully.',
    statusCode: 200, // OK (Alternatively, you could use 204 if you don't return content)
  },
  DELETED: {
    message: 'Resource has been deleted successfully.',
    statusCode: 200, // OK (Alternatively, you could use 204 if you don't return content)
  },
  SAVED: {
    message: 'Data has been saved.',
    statusCode: 200, // OK
  },
  ACCEPTED: {
    message: 'Request has been accepted for processing.',
    statusCode: 202, // Accepted
  },
  NO_CONTENT: {
    message: 'Operation was successful but no content to return.',
    statusCode: 204, // No Content
  },
  PARTIAL_CONTENT: {
    message: 'Partial content returned.',
    statusCode: 206, // Partial Content
  },
  NOT_MODIFIED: {
    message: 'Resource has not been modified.',
    statusCode: 304, // Not Modified
  },
  RESET_CONTENT: {
    message: 'Reset content successfully.',
    statusCode: 205, // Reset Content
  },
  INTERNAL_SERVER_ERROR: {
    message: EXCEPTION_MESSAGES.INTERNAL_SERVER_ERROR,
    statusCode: 500, // Internal Server Error
    responseCode: ResponseCodes.INTERNAL_SERVER_ERROR,
  },
};

export interface ResponseMessage {
  message: string;
  statusCode: number;
  responseCode?: string; // This is optional because not all response messages have a response code
}

export interface ResponseMessages {
  SUCCESS: ResponseMessage;
  CREATED: ResponseMessage;
  UPDATED: ResponseMessage;
  DELETED: ResponseMessage;
  SAVED: ResponseMessage;
  ACCEPTED: ResponseMessage;
  NO_CONTENT: ResponseMessage;
  PARTIAL_CONTENT: ResponseMessage;
  NOT_MODIFIED: ResponseMessage;
  RESET_CONTENT: ResponseMessage;
  INTERNAL_SERVER_ERROR: ResponseMessage;
}

// export interface ResponseMessages {
//   [key: string]: ResponseMessage; // Allows for dynamic keys
// }
