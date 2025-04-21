import React, { FC, useState, useMemo } from 'react';
import {
	Box,
	Grid,
	Card,
	CardContent,
	Typography,
	CardMedia,
	IconButton,
	Menu,
	MenuItem as MuiMenuItem,
	ListItemIcon,
	ListItemText,
	TextField,
	Select,
	MenuItem as SelectMenuItem,
	FormControl,
	InputLabel,
	Button,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Image_Res, Category_Res, Image_Req } from '@/core/models';
import ImageDialog from './image-dialog';
import DeleteConfirmationDialog from './delete-confirmation-dialog';
import CardMenu from '@/components/reusable/card-menu';
import AddEntityCard from '@/components/reusable/add-entity-card';

export interface Handlers {
	handleNewDialogOpen: () => void;
	handleNewDialogClose: () => void;
	handleSaveNew: (image: Image_Req) => void;
	handleSelectImage: (image: Image_Res) => void;
	handleEditClick: (image: Image_Res) => void;
	handleEditDialogClose: () => void;
	handleSaveEdit: (image: Image_Req) => void;
	handleDeleteClick: (image: Image_Res) => void;
	handleConfirmDelete: () => void;
	handleDeleteDialogClose: () => void;
}

interface DialogStates {
	openNewDialog: boolean;
	openEditDialog: boolean;
	openDeleteDialog: boolean;
	imageLoading: boolean;
	selectedImage: Image_Res | null;
}

interface Filters {
	name: string;
	metadata: {
		size: string;
		resolution: string;
	};
	categoryId: string | 'all';
	register: any;
	handleClearFilters: () => void;
}

interface ImageListProps {
	images: Image_Res[];
	categories: Category_Res[];
	handlers: Handlers;
	dialogStates: DialogStates;
	filters: Filters;
}

const ImageList: FC<ImageListProps> = ({ images, categories, handlers, dialogStates, filters }) => {
	// Filter images based on form values
	const filteredImages = useMemo(() => {
		return images.filter((image) => {
			const matchesName = image.name.toLowerCase().includes(filters.name.toLowerCase());
			const matchesSize =
				!filters.metadata.size || (image.metadata?.size || '').toLowerCase().includes(filters.metadata.size.toLowerCase());
			const matchesResolution =
				!filters.metadata.resolution ||
				(image.metadata?.resolution || '').toLowerCase().includes(filters.metadata.resolution.toLowerCase());
			const matchesCategory = filters.categoryId === 'all' || image.categoryId.toString() === filters.categoryId;
			return matchesName && matchesSize && matchesResolution && matchesCategory;
		});
	}, [images, filters.name, filters.metadata.size, filters.metadata.resolution, filters.categoryId]);

	const getCategoryName = (categoryId: number | string) => {
		const category = categories.find((cat) => cat.id.toString() === categoryId.toString());
		return category ? category.name : 'Unknown';
	};

	return (
		<div>
			<Typography variant='h4' component='h1' gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
				Image Gallery
			</Typography>
			{/* Filter Controls */}
			<Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
				<TextField {...filters.register('name')} label='Search by Name' sx={{ flex: '1 1 200px' }} />
				<TextField {...filters.register('metadata.size')} label='Filter by Size (e.g., 1.2 MB)' sx={{ flex: '1 1 200px' }} />
				<TextField {...filters.register('metadata.resolution')} label='Filter by resolution (e.g., 1920x1080)' sx={{ flex: '1 1 200px' }} />
				<FormControl sx={{ flex: '1 1 200px' }}>
					<InputLabel>Filter by Category</InputLabel>
					<Select {...filters.register('categoryId')} label='Filter by Category' defaultValue='all'>
						<SelectMenuItem value='all'>All Categories</SelectMenuItem>
						{categories.map((category) => (
							<SelectMenuItem key={category.id} value={category.id.toString()}>
								{category.name}
							</SelectMenuItem>
						))}
					</Select>
				</FormControl>
				<Button variant='outlined' onClick={filters.handleClearFilters} sx={{ flex: '0 1 auto' }}>
					Clear Filters
				</Button>
			</Box>

			{/* Image Gallery */}
			<Grid container spacing={3}>
				{filteredImages.length === 0 ? (
					<Grid size={{ xs: 12 }}>
						<Typography variant='body1' color='text.secondary' textAlign='center'>
							No images match the current filters.
						</Typography>
					</Grid>
				) : (
					filteredImages.map((image) => (
						<Grid size={{ md: 3, sm: 6, xs: 12 }} key={image.id}>
							<Card
								elevation={2}
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									transition: 'transform 0.2s, box-shadow 0.2s',
									position: 'relative',
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: (theme) => theme.shadows[8],
									},
								}}
							>
								{/* CardMenu */}
								<CardMenu
									entity={image}
									handlers={{
										handleSelectEntity: () => handlers.handleSelectImage(image),
										handleEditClick: () => handlers.handleEditClick(image),
										handleDeleteClick: () => handlers.handleDeleteClick(image),
									}}
								/>

								{image.url ? (
									<CardMedia component='img' height='140' image={image.url} alt={image.name} sx={{ objectFit: 'cover' }} />
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
										<Typography variant='body2' color='text.secondary'>
											No Image
										</Typography>
									</Box>
								)}
								<CardContent sx={{ flexGrow: 1 }}>
									<Typography gutterBottom variant='h6' component='h2'>
										{image.name}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										Category: {getCategoryName(image.categoryId)}
									</Typography>
									{/* <Typography variant='body2' color='text.secondary'>
										Uploaded: {new Date(image.uploadDate).toLocaleDateString()}
									</Typography> */}
									{image.metadata && (
										<>
											<Typography variant='body2' color='text.secondary'>
												Size: {image.metadata.size || 'Unknown'}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Resolution: {image.metadata.resolution || 'Unknown'}
											</Typography>
										</>
									)}
								</CardContent>
							</Card>
						</Grid>
					))
				)}

				{/* AddEntityCard */}
				<AddEntityCard onClick={handlers.handleNewDialogOpen} title='Add New Image' size={{ md: 3, sm: 6, xs: 12 }} />
			</Grid>
			<ImageDialog
				open={dialogStates.openNewDialog}
				title='Upload New Image'
				onClose={handlers.handleNewDialogClose}
				onSave={handlers.handleSaveNew}
				categories={categories}
			/>
			<ImageDialog
				open={dialogStates.openEditDialog}
				title='Edit Image'
				onClose={handlers.handleEditDialogClose}
				onSave={handlers.handleSaveEdit}
				image={dialogStates.selectedImage}
				categories={categories}
			/>
			<DeleteConfirmationDialog
				open={dialogStates.openDeleteDialog}
				itemName={dialogStates.selectedImage?.name}
				onClose={handlers.handleDeleteDialogClose}
				onConfirm={handlers.handleConfirmDelete}
			/>
		</div>
	);
};

export default ImageList;
