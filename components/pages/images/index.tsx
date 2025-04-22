'use client';
import React, { useState } from 'react';
import { imageApi, categoryApi } from '@/core/services';
import { Image_Res, Image_Req } from '@/core/models';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchDataRQ } from '@/hooks/useFetchDataRQ';
import { useMutateData } from '@/hooks/useMutateData';
import { Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import CardSkeleton from '@/components/skeletons/card-skeleton';
import ImageList from './image-list';

interface FilterForm {
	name: string;
	metadata: {
		size: string;
		resolution: string;
	};
	categoryId: string | 'all';
}

const Images = () => {
	const queryClient = useQueryClient();

	const [openNewDialog, setOpenNewDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedImage, setSelectedImage] = useState<Image_Res | null>(null);

	// Initialize React Hook Form for filters
	const { register, watch, reset } = useForm<FilterForm>({
		defaultValues: {
			name: '',
			metadata: {
				size: '',
				resolution: '',
			},
			categoryId: 'all',
		},
	});

	// Watch filter values
	const filters = watch();

	const { data: imagesData, isLoading } = useFetchDataRQ({
		queryKey: ['images'],
		queryFn: imageApi.images,
	});

	const { data: categoriesData } = useFetchDataRQ({
		queryKey: ['categories'],
		queryFn: categoryApi.categories,
	});

	// Mutations
	const createMutation = useMutateData({
		mutationFn: imageApi.createImage,
	});

	const updateMutation = useMutateData({
		mutationFn: (data) => imageApi.updateImage(data, data?.id!),
		onSuccessFn: ({ data: transmittedData }) => {
			queryClient.setQueryData(['images'], (old: { data: Image_Res[] } | undefined) => {
				const currentImages = old?.data || [];
				return {
					...old,
					data: currentImages.map((image) => (image.id === transmittedData.id ? transmittedData : image)),
				};
			});
		},
	});

	const deleteMutation = useMutateData({
		mutationFn: imageApi.deleteImage,
		onSuccessFn: ({ data: transmittedData, variables }) => {
			queryClient.setQueryData(['images'], (old: { data: Image_Res[] } | undefined) => {
				const currentImages = old?.data || [];
				return {
					...old,
					data: currentImages.filter((image) => image.id !== variables),
				};
			});
		},
	});

	// Handlers [Create]
	const handleSaveNew = (image: Image_Req) => {
		createMutation.mutate(image);

		queryClient.setQueryData(['images'], (old: { data: Image_Res[] } | undefined) => {
			const currentImages = old?.data || [];
			return {
				...old,
				data: [...currentImages, { ...image, uploadDate: new Date().toISOString() }],
			};
		});
	};

	// Handlers [Edit]
	const handleSelectImage = (image: Image_Res) => setSelectedImage(image);
	const handleEditClick = (image: Image_Res) => {
		setSelectedImage(image);
		setOpenEditDialog(true);
	};
	const handleSaveEdit = (image: Image_Req) => {
		if (selectedImage) {
			const updatedImage: Image_Res = {
				...image,
				id: selectedImage.id,
			};

			// Because each image ID above 1000 is not found in the database, it exists only in the cache.
			if (selectedImage.id > 1000) {
				queryClient.setQueryData(['images'], (old: { data: Image_Res[] } | undefined) => {
					const currentImages = old?.data || [];
					return {
						...old,
						data: currentImages.map((cate) => (cate.id === selectedImage.id ? updatedImage : cate)),
					};
				});
			} else {
				updateMutation.mutate(updatedImage);
			}

			setOpenEditDialog(false);
			setSelectedImage(null);
		}
	};

	// Handlers [Delete]
	const handleDeleteClick = (image: Image_Res) => {
		setSelectedImage(image);
		setOpenDeleteDialog(true);
	};
	const handleConfirmDelete = () => {
		if (selectedImage?.id) {
			if (Number(selectedImage.id) > 1000) {
				queryClient.setQueryData(['images'], (old: { data: Image_Res[] } | undefined) => {
					const currentImages = old?.data || [];
					return {
						...old,
						data: currentImages.filter((image) => image.id !== selectedImage.id),
					};
				});
			} else {
				deleteMutation.mutate(selectedImage.id);
			}
			setOpenDeleteDialog(false);
			setSelectedImage(null);
		}
	};

	// Dialog handlers
	const handleNewDialogOpen = () => setOpenNewDialog(true);
	const handleNewDialogClose = () => setOpenNewDialog(false);
	const handleEditDialogClose = () => setOpenEditDialog(false);
	const handleDeleteDialogClose = () => setOpenDeleteDialog(false);

	// Filter reset handler
	const handleClearFilters = () => reset();

	if (isLoading) return <CardSkeleton />;

	return (
		<Container sx={{ py: 4 }}>
			<ImageList
				images={imagesData?.data || []}
				categories={categoriesData?.data || []}
				handlers={{
					handleNewDialogOpen,
					handleNewDialogClose,
					handleSaveNew,

					handleSelectImage,
					handleEditClick,
					handleEditDialogClose,
					handleSaveEdit,

					handleDeleteClick,
					handleConfirmDelete,
					handleDeleteDialogClose,
				}}
				dialogStates={{
					openNewDialog,
					openEditDialog,
					openDeleteDialog,
					imageLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
					selectedImage,
				}}
				filters={{
					name: filters.name,
					metadata: {
						size: filters.metadata.size,
						resolution: filters.metadata.resolution,
					},
					categoryId: filters.categoryId,
					register,
					handleClearFilters,
				}}
			/>
		</Container>
	);
};

export default Images;
