import axios from 'axios';
export * from './queries';

export function getBaseUrl(): string {
  const web = typeof window !== 'undefined';
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;
  return base || (web ? 'http://localhost:5000' : 'http://localhost:5000');
}

export type TokenProvider = {
  getAccessToken: () => Promise<string | null> | string | null;
};

let tokenProvider: TokenProvider | null = null;
export function setTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

const web = typeof window !== 'undefined';
export const api = axios.create({ baseURL: getBaseUrl(), withCredentials: web });

api.interceptors.request.use(async (config) => {
  if (!web && tokenProvider) {
    const token = await tokenProvider.getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


