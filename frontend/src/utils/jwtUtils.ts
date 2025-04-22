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
    if (!token) {
      console.error('Token is empty');
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.error('Invalid token format');
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      if (!payload.id || typeof payload.id !== 'number') {
        console.error('Token payload does not contain valid id');
        return null;
      }

      return payload;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  },

  getUserId(): number | null {
    const tokens = TokenStorage.getTokens();
    if (!tokens?.accessToken) {
      console.error('No access token found');
      return null;
    }

    const payload = this.decodeToken(tokens.accessToken);
    if (!payload?.id) {
      console.error('No user id in token payload');
      return null;
    }

    return payload.id;
  },
};

export const getUserIdFromToken = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const payload: JwtPayload = JSON.parse(jsonPayload);
    return payload.id;
  } catch {
    return null;
  }
};
