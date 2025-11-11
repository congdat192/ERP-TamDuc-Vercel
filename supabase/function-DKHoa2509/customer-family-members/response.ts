// ================================================================
// RESPONSE HELPERS
// ================================================================
/**
 * Create success response
 */ export function successResponse(data, message, requestId, duration, permissionType) {
  const response = {
    success: true,
    message,
    data,
    meta: {
      request_id: requestId,
      duration_ms: duration,
      permission_type: permissionType
    }
  };
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-Response-Time': `${duration}ms`,
      'Cache-Control': 'private, no-cache'
    }
  });
}
/**
 * Create error response
 */ export function errorResponse(error, description, status, requestId) {
  const response = {
    success: false,
    error,
    error_description: description,
    meta: {
      request_id: requestId,
      duration_ms: 0
    }
  };
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId
    }
  });
}
/**
 * Create 401 Unauthorized response
 */ export function unauthorizedResponse(description, requestId) {
  return errorResponse('Invalid token', description, 401, requestId);
}
/**
 * Create 403 Forbidden response
 */ export function forbiddenResponse(description, requestId) {
  return errorResponse('Insufficient permissions', description, 403, requestId);
}
/**
 * Create 400 Bad Request response
 */ export function badRequestResponse(description, requestId) {
  return errorResponse('Invalid request', description, 400, requestId);
}
/**
 * Create 404 Not Found response
 */ export function notFoundResponse(description, requestId) {
  return errorResponse('Not found', description, 404, requestId);
}
/**
 * Create 500 Internal Server Error response
 */ export function internalErrorResponse(description, requestId) {
  return errorResponse('Internal server error', description, 500, requestId);
}
/**
 * CORS headers for OPTIONS request
 */ export function corsResponse() {
  return new Response('ok', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-OAuth-Token',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}
