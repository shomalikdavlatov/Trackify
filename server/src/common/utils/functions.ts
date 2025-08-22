export function decodeJWT(token: string): any {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace('-', '+').replace('_', '/'); // Replace URL-safe base64 chars
    const decoded = atob(base64); // Decode the base64 string
    return JSON.parse(decoded); // Parse the JSON string into an object
}
