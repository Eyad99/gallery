'use client';
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
	Box,
	Card,
	CardContent,
	Typography,
	CircularProgress,
	Button,
	Container,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { Image_Res, Annotation_Res, Annotation_Req } from '@/core/models';
import { imageApi, categoryApi, annotationApi } from '@/core/services';
import { useFetchDataRQ } from '@/hooks/useFetchDataRQ';
import { useMutateData } from '@/hooks/useMutateData';
import DeleteConfirmationDialog from '@/components/pages/annotations/delete-confirmation-dialog';
import ErrorMessage from '@/components/reusable/error-message';
import dynamic from 'next/dynamic';

const AnnotationCanvas = dynamic(() => import('@/components/reusable/annotation-canvas'), { ssr: false });

const SingleImage = () => {
	const router = useRouter();
	const params = useParams<{ id: string }>();

	const queryClient = useQueryClient();
	const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation_Res | null>(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [annotationColor, setAnnotationColor] = useState('#ff0000');

	const id = Number(params.id);

	const { data, isLoading, isError, error } = useFetchDataRQ({
		queryKey: ['image', id],
		queryFn: () => imageApi.singleImage(id),
		enableCondition: id > 1000 ? false : !!id,
	});

	const { data: categoriesData } = useFetchDataRQ({
		queryKey: ['categories'],
		queryFn: categoryApi.categories,
	});

	const { data: annotationsData } = useFetchDataRQ({
		queryKey: ['annotations', id],
		queryFn: () => annotationApi.singleAnnotationByImage(id),
		enableCondition: id > 1000 ? false : !!id,
	});

	// Mutations
	const createAnnotationMutation = useMutateData({
		mutationFn: annotationApi.createAnnotation,
	});

	const deleteAnnotationMutation = useMutateData({
		mutationFn: annotationApi.deleteAnnotation,
		onSuccessFn: ({ data: transmittedData, variables }) => {
			queryClient.setQueryData(['annotations', id], (old: { data: Annotation_Res[] } | undefined) => {
				const currentAnnotations = old?.data || [];
				return {
					...old,
					data: currentAnnotations.filter((annotation) => annotation.id !== variables),
				};
			});
		},
	});

	// Get image from cache or API
	const image = useMemo(() => {
		if (isNaN(id)) return null;
		if (id > 1000) {
			const cachedImages = queryClient.getQueryData<{ data: Image_Res[] }>(['images']);
			return cachedImages?.data.find((img) => img.id === id) || null;
		}
		return data?.data || null;
	}, [id, queryClient, data]);

	// Get annotations from cache or API
	const annotations = useMemo(() => {
		if (id > 1000) {
			const cachedAnnotations = queryClient.getQueryData<{ data: Annotation_Res[] }>(['annotations', id]);
			return cachedAnnotations?.data || [];
		}
		return annotationsData?.data || [];
	}, [id, queryClient, annotationsData]);

	// Handlers
	const handleSaveAnnotation = (annotation: Annotation_Req) => {
		createAnnotationMutation.mutate(annotation);

		queryClient.setQueryData(['annotations', id], (old: { data: Annotation_Res[] } | undefined) => {
			const currentImages = old?.data || [];
			return {
				...old,
				data: [...currentImages, annotation],
			};
		});
	};

	const handleDeleteAnnotation = (annotation: Annotation_Res) => {
		setSelectedAnnotation(annotation);
		setOpenDeleteDialog(true);
	};

	const handleConfirmDelete = () => {
		if (selectedAnnotation?.id) {
			if (+selectedAnnotation?.id > 1000) {
				queryClient.setQueryData(['annotations', id], (old: { data: Annotation_Res[] } | undefined) => {
					const currentAnnotations = old?.data || [];
					return {
						...old,
						data: currentAnnotations.filter((ann) => +ann.id !== +selectedAnnotation.id),
					};
				});
			} else {
				deleteAnnotationMutation.mutate(selectedAnnotation.id);
			}
			setOpenDeleteDialog(false);
			setSelectedAnnotation(null);
		}
	};

	const getCategoryName = (categoryId: number | string) => {
		const category = categoriesData?.data.find((cat: any) => +cat.id === +categoryId);
		return category ? category.name : 'Unknown';
	};

	if (isLoading && id <= 1000) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' minHeight='60vh'>
				<CircularProgress />
			</Box>
		);
	}

	if (isError && id <= 1000) {
		return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load image'} onRetry={() => router.refresh()} />;
	}

	if (!image) {
		return <ErrorMessage message='Image not found' onRetry={() => router.push('/')} />;
	}

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Box>
				<Button variant='outlined' onClick={() => router.push('/')} sx={{ mb: 3 }}>
					Back to Images
				</Button>
				<Card
					elevation={3}
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						alignItems: 'center',
						p: 2,
					}}
				>
					<Box sx={{ flex: 1, position: 'relative' }}>
						<AnnotationCanvas
							imageUrl={image.url}
							annotations={annotations}
							imageId={id}
							onSaveAnnotation={handleSaveAnnotation}
							onDeleteAnnotation={handleDeleteAnnotation}
							annotationColor={annotationColor}
						/>
						<FormControl sx={{ mt: 2, minWidth: 120 }}>
							<InputLabel>Annotation Color</InputLabel>
							<Select value={annotationColor} onChange={(e) => setAnnotationColor(e.target.value)} label='Annotation Color'>
								<MenuItem value='#ff0000'>Red</MenuItem>
								<MenuItem value='#00ff00'>Green</MenuItem>
								<MenuItem value='#0000ff'>Blue</MenuItem>
								<MenuItem value='#ffff00'>Yellow</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<CardContent sx={{ flex: 1, p: 3 }}>
						<Typography variant='h4' component='h1' gutterBottom>
							{image.name}
						</Typography>
						<Typography variant='body1' color='text.secondary' paragraph>
							Category: {getCategoryName(image.categoryId)}
						</Typography>
						<Typography variant='body1' color='text.secondary' paragraph>
							Uploaded: {new Date(image.uploadDate).toLocaleDateString()}
						</Typography>
						{image.metadata && (
							<>
								<Typography variant='body1' color='text.secondary'>
									Size: {image.metadata.size || 'Unknown'}
								</Typography>
								<Typography variant='body1' color='text.secondary'>
									Type: {image.metadata.type || 'Unknown'}
								</Typography>
							</>
						)}
					</CardContent>
				</Card>
			</Box>
			<DeleteConfirmationDialog
				open={openDeleteDialog}
				itemName='this annotation'
				onClose={() => setOpenDeleteDialog(false)}
				onConfirm={handleConfirmDelete}
			/>
		</Container>
	);
};

export default SingleImage;
