const EXTERNAL_API_BASE = 'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1';
const CLIENT_ID = 'mk_tamduc';
const CLIENT_SECRET = 'Tamduc@123';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAuthToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log('[TokenManager] Using cached token');
    return cachedToken;
  }

  console.log('[TokenManager] Fetching new token...');

  const response = await fetch(`${EXTERNAL_API_BASE}/get-token-supabase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });

  if (!response.ok) {
    throw new Error(`Token fetch failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.success && data.data && data.data.access_token) {
    cachedToken = data.data.access_token;
    tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
    console.log('[TokenManager] New token obtained, expires:', data.data.expires_at_vn);
  } else {
    throw new Error('Invalid token response structure');
  }

  if (!cachedToken) {
    throw new Error('Failed to obtain token');
  }

  return cachedToken;
}

export const EXTERNAL_API = {
  BASE_URL: EXTERNAL_API_BASE,
  
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await getAuthToken();
    const url = `${EXTERNAL_API_BASE}${endpoint}`;
    
    console.log(`[API] ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error ${response.status}:`, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }
};
