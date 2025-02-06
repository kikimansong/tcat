import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '@/lib/cookie';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;

const axiosAuth = axios.create({
  baseURL: baseUrl,
});

/**
 * 요청 인터셉터 - 요청시 헤더에 엑세스 토큰을 포함
 */
axiosAuth.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('request interceptor error: ', error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 401 (토큰 만료 시) 에러 처리 및 토큰 재발급
 */
axiosAuth.interceptors.response.use(
  async (response) => {
    if (response.status == 200 && response.data.code == 401) {
      try {
        const token = getCookie('access_token');
        const refresh = await axios.post(`${baseUrl}/api/v1/auth/token/refresh`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        switch (refresh.data.code) {
          case 200 :  // 리프레시 토큰이 만료되지 않았을 경우 이전 api 재호출
            const newToken = refresh.data.data;
            setCookie('access_token', newToken, { path: '/', secure: true, sameSite: 'lax' });
            return axiosAuth(response.config);

          case 401 :  // 리프레시 토큰이 만료됐을 경우 쿠키 삭제
            removeCookie('access_token');
            break;
        }

      } catch (error) {
        console.error(error);
      }
    }
    
    return response;
  },
  (error) => {
    console.error('response interceptor error: ', error);
    return Promise.reject(error);
  }
);

export default axiosAuth;