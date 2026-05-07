// Generates a real base64-encoded JWT structure
// so JwtService.isTokenExpired() works correctly

function base64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateFakeJwt(payload: object, expiresInSeconds = 86400): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = base64url(JSON.stringify({
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  }));

  // Fake signature — MSW doesn't verify it, JwtService only checks exp
  const signature = base64url('mock-signature');

  return `${header}.${fullPayload}.${signature}`;
}