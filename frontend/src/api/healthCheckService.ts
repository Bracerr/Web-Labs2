import axios, { AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface CustomRequestConfig extends AxiosRequestConfig {
  skipHealthCheck?: boolean;
}

export const healthCheckService = {
  async checkServer(): Promise<boolean> {
    try {
      const config: CustomRequestConfig = {
        headers: {
          'api_key': API_KEY
        },
        skipHealthCheck: true
      };
      
      const response = await axios.get(API_URL, config);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}; 