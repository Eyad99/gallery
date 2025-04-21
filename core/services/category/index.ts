import { Category_Req } from '@/core/models';
import { destroy, get, post, put } from '@/utils/api';

export const categoryApi = {
	categories: async () => get(`categories`),
	singleCategory: async (categoryId:number) => get(`categories/${categoryId}`),
	createCategory: async (data: Category_Req) => post(`categories`, data),
	updateCategory: async (data: Category_Req, categoryId: number) => put(`categories/${categoryId}`, data),
	deleteCategory: async (categoryId: number) => destroy(`categories/${categoryId}`),
};
