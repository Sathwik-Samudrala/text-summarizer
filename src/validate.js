const MIN_LENGTH = 10;
const MAX_LENGTH = 10_000;

/**
 * Returns an error message string if invalid, or null if valid.
 */
export function validateInput(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return 'Input text cannot be empty. Provide a file path as an argument or pipe text via stdin.';
  }
  if (text.trim().length < MIN_LENGTH) {
    return `Input text is too short (minimum ${MIN_LENGTH} characters).`;
  }
  if (text.length > MAX_LENGTH) {
    return `Input text is too long (maximum ${MAX_LENGTH} characters). Please trim your input.`;
  }
  return null;
}