// Lightweight error formatter to make Firebase (and other) errors friendlier
export default function formatError(err) {
  if (!err) return "An unexpected error occurred.";

  // If Firebase provides a code like 'auth/email-already-in-use', map it
  const code = err.code || (typeof err === 'string' ? null : null);
  const msg = err.message || (typeof err === 'string' ? err : '');

  const mapCode = (c) => {
    if (!c) return null;
    const clean = c.toLowerCase();
    if (clean.includes('email-already-in-use') || clean.includes('email-already-exists')) return 'An account with this email already exists.';
    if (clean.includes('invalid-email')) return 'Please enter a valid email address.';
  if (clean.includes('weak-password')) return 'Password is too weak. Use at least 8 characters.';
    if (clean.includes('user-not-found')) return 'No account found with that email.';
    if (clean.includes('wrong-password')) return 'Incorrect password. Please try again.';
    if (clean.includes('too-many-requests')) return 'Too many attempts. Please try again later.';
    if (clean.includes('network-request-failed')) return 'Network error. Check your internet connection.';
    return null;
  };

  // Try code mapping first
  const fromCode = mapCode(code);
  if (fromCode) return fromCode;

  // If message contains an auth/ code, extract and map
  const authMatch = msg.match(/auth\/([-a-zA-Z0-9_]+)/);
  if (authMatch && authMatch[1]) {
    const fromAuth = mapCode(authMatch[1]);
    if (fromAuth) return fromAuth;
  }

  // Otherwise, clean the message by removing Firebase prefixes and codes
  let cleaned = msg.replace(/^Firebase:\s*/i, '').trim();
  // remove (auth/xxxxx) segments
  cleaned = cleaned.replace(/\(auth\/[^)]+\)/g, '').trim();
  // If it's still long or contains 'Error', try to be concise
  if (!cleaned) return 'An unexpected error occurred.';
  return cleaned;
}
