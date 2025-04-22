'use client';
import React, { useState } from 'react';
import { Category_Res, Category_Req } from '@/core/models';
import { useFetchDataRQ } from '@/hooks/useFetchDataRQ';
import { useQueryClient } from '@tanstack/react-query';
import { useMutateData } from '@/hooks/useMutateData';
import { categoryApi } from '@/core/services';
import { Box } from '@mui/material';
import CategoryList from './category-list';
import CardSkeleton from '@/components/skeletons/card-skeleton';

const Categories = () => {
	const queryClient = useQueryClient();

	const [openNewDialog, setOpenNewDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category_Res | null>(null);

	const { data, isLoading } = useFetchDataRQ({
		queryKey: ['categories'],
		queryFn: categoryApi.categories,
	});

	// Mutations
	const createMutation = useMutateData({
		mutationFn: categoryApi.createCategory,
	});

	const updateMutation = useMutateData({
		mutationFn: (data) => categoryApi.updateCategory(data, data?.id!),
		onSuccessFn: ({ data: transmittedData, variables }) => {
			queryClient.setQueryData(['categories'], (old: { data: Category_Res[] } | undefined) => {
				const currentCategories = old?.data || [];
				return {
					...old,
					data: currentCategories.map((cate) => (cate.id === transmittedData.id ? transmittedData : cate)),
				};
			});
		},
	});

	const deleteMutation = useMutateData({
		mutationFn: categoryApi.deleteCategory,
		onSuccessFn: ({ data: transmittedData, variables }) => {
			queryClient.setQueryData(['categories'], (old: { data: Category_Res[] } | undefined) => {
				const currentCategories = old?.data || [];
				return {
					...old,
					data: currentCategories.filter((category) => category.id !== variables),
				};
			});
		},
	});

	// Handlers [Create]
	const handleSaveNew = (newCategory: Category_Req) => {
		createMutation.mutate(newCategory);
		queryClient.setQueryData(['categories'], (old: { data: Category_Res[] } | undefined) => {
			const currentICategories = old?.data || [];
			return {
				...old,
				data: [...currentICategories, newCategory],
			};
		});
	};

	// Handlers [Edit]
	const handleSelectCategory = (category: Category_Res) => {
		setSelectedCategory(category);
	};

	const handleEditClick = (category: Category_Res) => {
		setSelectedCategory(category);
		setOpenEditDialog(true);
	};

	const handleSaveEdit = (category: Category_Req) => {
		if (selectedCategory) {
			const updatedCategory: Category_Res = {
				...category,
				id: selectedCategory.id,
			};

			// Because each category ID above 1000 is not found in the database, it exists only in the cache.
			if (selectedCategory.id > 1000) {
				queryClient.setQueryData(['categories'], (old: { data: Category_Res[] } | undefined) => {
					const currentCategories = old?.data || [];
					return {
						...old,
						data: currentCategories.map((cate) => (cate.id === selectedCategory.id ? updatedCategory : cate)),
					};
				});
			} else {
				updateMutation.mutate(updatedCategory);
			}

			setOpenEditDialog(false);
			setSelectedCategory(null);
		}
	};

	// Handlers [Delete]
	const handleDeleteClick = (category: Category_Res) => {
		setSelectedCategory(category);
		setOpenDeleteDialog(true);
	};

	const handleConfirmDelete = () => {
		if (selectedCategory?.id) {
			if (selectedCategory.id > 1000) {
				queryClient.setQueryData(['categories'], (old: { data: Category_Res[] } | undefined) => {
					const currentCategories = old?.data || [];
					return {
						...old,
						data: currentCategories.filter((category) => category.id !== selectedCategory.id),
					};
				});
			} else {
				deleteMutation.mutate(selectedCategory.id);
			}
			setOpenDeleteDialog(false);
			setSelectedCategory(null);
		}
	};

	const handleNewDialogOpen = () => setOpenNewDialog(true);
	const handleNewDialogClose = () => setOpenNewDialog(false);
	const handleEditDialogClose = () => setOpenEditDialog(false);
	const handleDeleteDialogClose = () => setOpenDeleteDialog(false);

	if (isLoading) return <CardSkeleton />;

	return (
		<Box sx={{ position: 'relative', pb: 8 }}>
			<CategoryList
				categories={data?.data || []}
				handlers={{
					handleNewDialogOpen,
					handleNewDialogClose,
					handleSaveNew,

					handleSelectCategory,
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
					categoryLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
					selectedCategory,
				}}
			/>
		</Box>
	);
};

export default Categories;
