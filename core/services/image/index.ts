import { Image_Req } from '@/core/models';
import { destroy, get, post, put } from '@/utils/api';

export const imageApi = {
	images: async () => get(`images`),
	singleImage: async (imageId:number) => get(`images/${imageId}`),
	createImage: async (data: Image_Req) => post(`images`, data),
	updateImage: async (data: Image_Req, imageId: number) => put(`images/${imageId}`, data),
	deleteImage: async (imageId: number) => destroy(`images/${imageId}`),
};
