/**
 * Centralized Session Management
 *
 * Provides secure session token generation and validation using
 * cryptographically secure random tokens instead of static strings.
 */

const validSessions = new Set<string>();

/**
 * Generates a cryptographically secure session token
 * @returns A 64-character hex string (32 bytes of randomness)
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Adds a session token to the valid sessions set
 * @param token - The session token to add
 */
export function addSession(token: string): void {
  validSessions.add(token);
}

/**
 * Validates whether a session token is valid
 * @param token - The session token to validate (can be undefined)
 * @returns true if the token is valid, false otherwise
 */
export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  return validSessions.has(token);
}

/**
 * Removes a session token from the valid sessions set
 * @param token - The session token to remove
 */
export function removeSession(token: string): void {
  validSessions.delete(token);
}

/**
 * Gets the count of active sessions (for debugging/monitoring)
 * @returns The number of active sessions
 */
export function getActiveSessionCount(): number {
  return validSessions.size;
}
