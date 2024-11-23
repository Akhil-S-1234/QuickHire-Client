import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ErrorResponse {
  status: string;
  message: string;
  data: any;
  timestamp: string;
}

// Create an instance of Axios with custom configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your API base URL in .env file
  timeout: 5000, // Set request timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies (session cookie) are sent with requests

});



// // axiosInstance.interceptors.response.use(
// //   (response: AxiosResponse) => response, // Return the response directly
// //   (error: AxiosError) => {
// //     // Handle errors globally (e.g., logging out on 401)
// //     if (error.response?.status === 401) {
// //       // Perform action on unauthorized access
// //     }
// //     return Promise.reject(error);
// //   }
// // );

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response, // Return the response directly
  async (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {

      if (error.response.data?.message === 'Access token is missing' || error.response.data?.message === 'Invalid or expired access token') {
        try {

          axiosInstance.get('/api/users/refreshtoken')

          const originalRequest: InternalAxiosRequestConfig | undefined = error.config;

          if (originalRequest) {
            return axios(originalRequest);
          } else {
            console.error('Original request is undefined');
            return Promise.reject(error);
          }
 
        } catch (refreshError) {
          // Handle refresh token failure (e.g., redirect to login page)
          console.error('Token refresh failed:', refreshError);
        }
      }
    }

    // If error is not handled, reject the promise
    return Promise.reject(error);
  }
);


export default axiosInstance;
