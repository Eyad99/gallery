const baseURL = 'https://my-json-server.typicode.com/MostafaKMilly/demo/';
 
export interface ApiResponse<T = any> {
	data: T;
	statusCode: number;
	message: string;
}

// Request Interceptor: Add Authorization Header
const requestInterceptor = (config: RequestInit): RequestInit => {
	const token = undefined;
	if (token) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		};
	}
	return config;
};

// Response Interceptor: Handle Errors
const responseInterceptor = async (response: Response & ApiResponse): Promise<ApiResponse> => {
 
	if (!response.ok) {
		const errorData = await response.json();

		if (response.statusCode === 401) {
			window.location.href = '/401';
		} else {
			// toast({
			// 	title: 'Error',
			// 	description: errorData.message || 'Error',
			// 	variant: 'destructive',
			// });
		}
		return Promise.reject(errorData);
	}
	const rawData = await response.json();
	return {
		data: rawData,  
		statusCode: response.status, 
		message: 'Success', 
	};
};

// Helper function for making API requests
const apiRequest = async (url: string, config: RequestInit = {}): Promise<ApiResponse> => {
	const finalConfig = requestInterceptor({
		...config,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...config.headers,
		},
	});

	const response = await fetch(`${baseURL}${url}`, finalConfig);
	return responseInterceptor(response as any & ApiResponse);
};

// CRUD methods
export const get = (url: string, config: RequestInit = {}) => apiRequest(url, { ...config, method: 'GET' });
export const post = (url: string, body: any, config: RequestInit = {}) =>
	apiRequest(url, { ...config, method: 'POST', body: JSON.stringify(body) });
export const put = (url: string, body: any, config: RequestInit = {}) =>
	apiRequest(url, { ...config, method: 'PUT', body: JSON.stringify(body) });
export const destroy = (url: string, config: RequestInit = {}) => apiRequest(url, { ...config, method: 'DELETE' });
export const patch = (url: string, body: any, config: RequestInit = {}) =>
	apiRequest(url, { ...config, method: 'PATCH', body: JSON.stringify(body) });

 