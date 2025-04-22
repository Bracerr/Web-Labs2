interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface TokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static setTokens(tokens: Tokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  static getTokens(): Tokens | null {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  }

  static removeTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getTokens()?.accessToken;
  }

  static getUserIdFromToken(): number | null {
    const tokens = this.getTokens();
    if (!tokens?.accessToken) return null;

    try {
      const base64Payload = tokens.accessToken.split('.')[1];
      const payload = JSON.parse(atob(base64Payload)) as TokenPayload;
      return payload.id;
    } catch {
      return null;
    }
  }
}
