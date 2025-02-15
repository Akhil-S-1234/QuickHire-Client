import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// import { setBlock } from '../../store/slices/authSlice';
// import { useDispatch } from 'react-redux';

interface ErrorResponse {
  status: string;
  message: string;
  data: any;
  timestamp: string;
}

// Create an instance of Axios with custom configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your API base URL in .env file
  timeout: 10000, // Set request timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies (session cookie) are sent with requests
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response, // Return the response directly
  async (error: AxiosError<ErrorResponse>) => {
    const { response, config } = error;
    
    // Handle 401 Unauthorized errors
    if (response?.status === 401) {
      if (
        response.data?.data?.retry 
      ) {
        try {
          
          const originalRequest: InternalAxiosRequestConfig | undefined = config;

          if (originalRequest) {
            return axios(originalRequest);
          } else {
            console.error('Original request is undefined');
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Handle refresh token failure (e.g., redirect to login page)
          console.error('Token refresh failed:', refreshError);
          // You might redirect to login page here, for example:
          // window.location.href = '/login';
        }
      } else {
        console.log('logout')
        // const store = (await import('../../store/store')).store;
        // const { logoutUser } = await import('../../store/slices/authSlice');
        // store.dispatch(logoutUser());
      }
    }

    // Handle 403 Forbidden errors (e.g., user or recruiter is blocked)
    if (response?.status === 403) {
      if (response.data?.message === 'Your account is blocked') {
        const store = (await import('../../store/store')).store;
        const { setBlock } = await import('../../store/slices/userAuthSlice');
        store.dispatch(setBlock(true));        
      }
    }

    // If the error is not handled, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
