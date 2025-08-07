// import { useState, useCallback } from 'react';
// import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';



// // Create Axios instance
// const apiClient = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 🔁 change to your base URL
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });



// // Add interceptor for auth token
// apiClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             // Make sure headers exist
//             if (!config.headers) {
//                 config.headers = new AxiosHeaders();
//             } else if (!(config.headers instanceof AxiosHeaders)) {
//                 // Convert to AxiosHeaders if needed
//                 config.headers = AxiosHeaders.from(config.headers);
//             }

//             // Now safely set Authorization header
//             config.headers.set('Authorization', `Bearer ${token}`);
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Transform function type
// type Transformer<T> = (data: any) => T;

// const useApi = () => {
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<Error | null>(null);

//     const get = useCallback(
//         async <T = any>(
//             url: string,
//             config: AxiosRequestConfig = {},
//             transform?: Transformer<T>
//         ): Promise<T> => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response: AxiosResponse = await apiClient.get(url, config);
//                 return transform ? transform(response.data) : response.data;
//             } catch (err: any) {
//                 setError(err);
//                 throw err;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         []
//     );

//     const post = useCallback(
//         async <T = any>(
//             url: string,
//             data: any = {},
//             config: AxiosRequestConfig = {},
//             transform?: Transformer<T>
//         ): Promise<T> => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const isFormData = data instanceof FormData;

//                 const headers = AxiosHeaders.from({
//                     ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
//                     ...(config.headers || {}),
//                 });

//                 const response: AxiosResponse = await apiClient.post(url, data, {
//                     ...config,
//                     headers,
//                 });

//                 return transform ? transform(response.data) : response.data;
//             } catch (err: any) {
//                 setError(err);
//                 throw err;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         []
//     );

//     return { get, post, loading, error };
// };

// export default useApi;
