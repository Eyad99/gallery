import React, { FC, useEffect } from 'react';
import { Dialog, DialogTitle, TextField, Button, DialogActions, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Image_Req, Image_Res, Category_Res } from '@/core/models';
import { Controller, useForm } from 'react-hook-form';

interface ImageDialogProps {
	open: boolean;
	title: string;
	onClose: () => void;
	onSave: (data: Image_Req) => void;
	image?: Image_Res | null;
	categories: Category_Res[];
}

const idsGenerator = (function* () {
	let i = 1000;
	while (true) {
		yield ++i;
	}
})();

const ImageDialog: FC<ImageDialogProps> = ({ open, title, onClose, onSave, image, categories }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
		control,
	} = useForm<Image_Req>({
		defaultValues: {
			name: '',
			url: '',
			categoryId: undefined,
			metadata: { size: '', resolution: '' },
			id: idsGenerator.next().value as number,
		},
	});

	useEffect(() => {
		if (image) {
			setValue('name', image.name);
			setValue('url', image.url);
			setValue('categoryId', +image.categoryId.toString());
			setValue('metadata.size', image.metadata?.size || '');
			setValue('metadata.resolution', image.metadata?.resolution || '');
			setValue('id', image.id);
		} else {
			reset({
				name: '',
				url: '',
				categoryId: undefined,
				metadata: { size: '', resolution: '' },
				id: idsGenerator.next().value as number,
			});
		}
	}, [image, reset, setValue]);

	const onSubmit = (data: Image_Req) => {
		onSave(data);
		reset();
		onClose();
	};

	const cancelAndEmpty = () => {
		reset();
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>{title}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} style={{ padding: '16px' }}>
				<TextField
					{...register('name', { required: 'Name is required' })}
					label='Image Name'
					fullWidth
					margin='normal'
					error={!!errors.name}
					helperText={errors.name?.message}
				/>

				<FormControl fullWidth margin='normal'>
					<input
						type='file'
						accept='image/*'
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) {
								const reader = new FileReader();
								reader.onloadend = () => {
									if (reader.result) {
										// Set base64 image string as the URL
										setValue('url', reader.result.toString(), { shouldValidate: true });
									}
								};
								reader.readAsDataURL(file);
							}
						}}
					/>
					{errors.url && <span style={{ color: 'red' }}>{errors.url.message}</span>}
				</FormControl>

				<FormControl fullWidth margin='normal' error={!!errors.categoryId}>
					<InputLabel id='category-label'>Category</InputLabel>
					<Controller
						name='categoryId'
						control={control}
						rules={{ required: 'Category is required' }}
						render={({ field }) => (
							<Select {...field} labelId='category-label' label='Category' value={field.value ?? ''}>
								{categories.map((category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						)}
					/>
					{errors.categoryId && <p style={{ color: 'red', margin: '4px 14px 0' }}>{errors.categoryId.message}</p>}
				</FormControl>

				<TextField {...register('metadata.size')} label='Size (e.g., 1.2 MB)' fullWidth margin='normal' />
				<TextField {...register('metadata.resolution')} label='Resolution (e.g., 1920x1080)' fullWidth margin='normal' />
				<DialogActions>
					<Button onClick={cancelAndEmpty}>Cancel</Button>
					<Button type='submit' variant='contained'>
						{title.includes('Upload') ? 'Upload Image' : 'Save Changes'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default React.memo(ImageDialog);
