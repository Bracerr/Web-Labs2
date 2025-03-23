interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const TokenStorage = {
  setTokens(tokens: Tokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  getTokens(): Tokens | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  },

  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!this.getTokens();
  },
};
