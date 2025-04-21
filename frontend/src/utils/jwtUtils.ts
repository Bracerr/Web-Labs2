import { TokenStorage } from './tokenStorage';

interface JwtPayload {
  id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export const jwtUtils = {
  decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  },

  getUserId(): number | null {
    const tokens = TokenStorage.getTokens();
    if (!tokens) return null;
    
    const payload = this.decodeToken(tokens.accessToken);
    return payload ? payload.id : null;
  }
};

export const getUserIdFromToken = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload: JwtPayload = JSON.parse(jsonPayload);
    return payload.id;
  } catch (error) {
    return null;
  }
}; 