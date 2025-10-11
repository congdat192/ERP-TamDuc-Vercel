interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  jti: string;
}

interface StoredToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const STORAGE_KEY = 'oauth_token';
const TOKEN_BUFFER = 60; // Refresh 60 seconds before expiry

/**
 * Get OAuth token from API
 */
async function fetchOAuthToken(): Promise<OAuthTokenResponse | null> {
  try {
    const response = await fetch(
      'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/oauth-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjaXJwanhianFhZ3JxcmpmbGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTI3NjgsImV4cCI6MjA3Mjk4ODc2OH0.GXxO7aPgF00WOkQ96z2J1P3K3BluPfBcais3h8qLr1I'
        },
        body: JSON.stringify({
          client_id: 'mk_tamduc',
          client_secret: 'Tamduc@123',
          grant_type: 'client_credentials'
        })
      }
    );

    if (!response.ok) {
      console.error('[oauthService] Failed to fetch token:', response.status);
      return null;
    }

    const data = await response.json();
    return data as OAuthTokenResponse;
  } catch (error) {
    console.error('[oauthService] Exception while fetching token:', error);
    return null;
  }
}

/**
 * Get stored token from localStorage
 */
function getStoredToken(): StoredToken | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredToken;
  } catch {
    return null;
  }
}

/**
 * Store token in localStorage
 */
function storeToken(tokenResponse: OAuthTokenResponse): void {
  try {
    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
    const stored: StoredToken = {
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: expiresAt
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('[oauthService] Failed to store token:', error);
  }
}

/**
 * Check if token is expired or about to expire
 */
function isTokenExpired(token: StoredToken): boolean {
  const now = Date.now();
  return now >= (token.expires_at - (TOKEN_BUFFER * 1000));
}

/**
 * Get valid OAuth token (fetch new if needed)
 */
export async function getOAuthToken(): Promise<string | null> {
  // Check if we have a valid stored token
  const stored = getStoredToken();
  if (stored && !isTokenExpired(stored)) {
    console.log('[oauthService] Using cached token');
    return stored.access_token;
  }

  // Fetch new token
  console.log('[oauthService] Fetching new token');
  const tokenResponse = await fetchOAuthToken();
  if (!tokenResponse) {
    return null;
  }

  // Store and return new token
  storeToken(tokenResponse);
  return tokenResponse.access_token;
}

/**
 * Clear stored token
 */
export function clearOAuthToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[oauthService] Failed to clear token:', error);
  }
}
