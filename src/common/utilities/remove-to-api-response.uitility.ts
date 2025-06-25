export const sensitiveData = ['permissions'];
export function removeToAPIResponse(data: any): any {
  if (Array.isArray(data)) {
    // If data is an array, process each element recursively
    return data.map((item) => removeToAPIResponse(item));
  } else if (data && typeof data === 'object') {
    // Handle special object types explicitly
    if (data instanceof Date || data instanceof RegExp) {
      return data; // Return as-is for non-plain objects
    }
    if (data instanceof Set) {
      // Convert Set to Array and process recursively
      return Array.from(data).map((item) => removeToAPIResponse(item));
    }
    if (data instanceof Map) {
      // Convert Map to an object and process recursively
      return Object.fromEntries(Array.from(data.entries()).map(([key, value]) => [key, removeToAPIResponse(value)]));
    }

    // If it's a plain object, remove the `toAPIResponse` property
    const { toAPIResponse, ...rest } = data;
    for (const key of Object.keys(rest)) {
      // if key === permissions then remove it
      if (sensitiveData.includes(key)) {
        delete rest[key];
        continue;
      }
      rest[key] = removeToAPIResponse(rest[key]);
    }
    return rest;
  }
  // Return non-object, non-array values as-is
  return data;
}
