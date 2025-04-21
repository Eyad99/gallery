import React, { FC } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardMedia, useTheme } from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import { Category_Res, Category_Req } from '@/core/models';
import DeleteConfirmationDialog from './delete-confirmation-dialog';
import CategoryDialog from './category-dialog';
import AddEntityCard from '@/components/reusable/add-entity-card';
import CardMenu from '@/components/reusable/card-menu';
import Link from 'next/link';

interface Handlers {
	handleNewDialogOpen: () => void;
	handleNewDialogClose: () => void;
	handleSaveNew: (category: Category_Req) => void;

	handleSelectCategory: (category: Category_Res) => void;
	handleEditClick: (category: Category_Res) => void;
	handleEditDialogClose: () => void;
	handleSaveEdit: (category: Category_Req) => void;

	handleDeleteClick: (category: Category_Res) => void;
	handleConfirmDelete: () => void;
	handleDeleteDialogClose: () => void;
}

interface DialogStates {
	openNewDialog: boolean;
	openEditDialog: boolean;
	openDeleteDialog: boolean;
	categoryLoading: boolean;
	selectedCategory: Category_Res | null;
}

interface CategoryListProps {
	categories: Category_Res[];
	handlers: Handlers;
	dialogStates: DialogStates;
}

const CategoryList: FC<CategoryListProps> = ({ categories, handlers, dialogStates }) => {
	const theme = useTheme();

	return (
		<div>
			<Typography
				variant='h4'
				component='h1'
				gutterBottom
				sx={{
					mb: 4,
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				Browse Categories
			</Typography>
			<Grid container spacing={3}>
				{categories?.map((category: Category_Res) => (
					<Grid size={{ md: 3, xs: 12 }} key={category.id || category.name}>
						<Link href={`category/${category.id}`}>
							<Card
								elevation={2}
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									cursor: 'pointer',
									transition: 'transform 0.2s, box-shadow 0.2s',
									position: 'relative',
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: theme.shadows[8],
									},
								}}
							>
								{/* CardMenu */}
								<CardMenu
									entity={category}
									handlers={{
										handleSelectEntity: () => handlers.handleSelectCategory(category),
										handleEditClick: () => handlers.handleEditClick(category),
										handleDeleteClick: () => handlers.handleDeleteClick(category),
									}}
								/>

								{category.image ? (
									<CardMedia component='img' height='140' image={category.image} alt={category.name} />
								) : (
									<Box
										sx={{
											height: 140,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											bgcolor: 'action.hover',
										}}
									>
										<CategoryIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
									</Box>
								)}
								<CardContent sx={{ flexGrow: 1 }}>
									<Typography gutterBottom variant='h6' component='h2'>
										{category.name}
									</Typography>
									{category.description && (
										<Typography variant='body2' color='text.secondary'>
											{category.description}
										</Typography>
									)}
								</CardContent>
							</Card>
						</Link>
					</Grid>
				))}

				{/* AddEntityCard */}
				<AddEntityCard onClick={handlers.handleNewDialogOpen} title='Add New Category' size={{ md: 3, xs: 12 }} />
			</Grid>

			<DeleteConfirmationDialog
				open={dialogStates.openDeleteDialog}
				categoryName={dialogStates.selectedCategory?.name}
				onClose={handlers.handleDeleteDialogClose}
				onConfirm={handlers.handleConfirmDelete}
			/>

			<CategoryDialog
				open={dialogStates.openEditDialog}
				categoryLoading={dialogStates.categoryLoading}
				title='Edit Category'
				category={dialogStates.selectedCategory}
				onClose={handlers.handleEditDialogClose}
				onSave={handlers.handleSaveEdit}
			/>

			<CategoryDialog
				open={dialogStates.openNewDialog}
				categoryLoading={dialogStates.categoryLoading}
				title='Create New Category'
				category={dialogStates.selectedCategory}
				onClose={handlers.handleNewDialogClose}
				onSave={handlers.handleSaveNew}
			/>
		</div>
	);
};

export default CategoryList;
