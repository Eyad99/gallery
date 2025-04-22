import { Annotation_Req } from '@/core/models';
import { destroy, get, post, put } from '@/utils/api';

export const annotationApi = {
	annotations: async () => get(`annotations`),
	singleAnnotationByImage: async (imageId:number) => get(`images/${imageId}/annotations`),
	createAnnotation: async (data: Annotation_Req) => post(`annotations`, data),
	updateAnnotation: async (data: Annotation_Req, annotationId: number) => put(`annotations/${annotationId}`, data),
	deleteAnnotation: async (annotationId: number) => destroy(`annotations/${annotationId}`),
};
