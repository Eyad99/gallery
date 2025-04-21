import React, { FC, useEffect } from 'react';
import { Dialog, DialogTitle, TextField, Button, DialogActions } from '@mui/material';
import { Category_Req } from '@/core/models';
import { useForm } from 'react-hook-form';

interface CategoryDialogProps {
	open: boolean;
	categoryLoading: boolean;
	title: string;
	category?: Category_Req | null;
	onClose: () => void;
	onSave: (data: Category_Req) => void;
}

const idsGenerator = (function* () {
	let i = 1000;
	while (true) {
		yield ++i;
	}
})();

const CategoryDialog: FC<CategoryDialogProps> = ({ open, categoryLoading, title, category, onClose, onSave }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Category_Req>({
		defaultValues: category || { name: '', description: '', image: '' },
	});

	useEffect(() => {
		reset(category || { name: '', description: '', image: '' });
	}, [category, reset]);

	const onSubmit = (data: Category_Req) => {
		onSave(title.includes('Edit') ? data : { id: idsGenerator.next().value, ...data });
		reset();
		onClose();
	};

	const cancelAndEmpty = () => {
		reset();
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} style={{ padding: '16px' }}>
				<TextField
					{...register('name', { required: 'Name is required' })}
					label='Name'
					fullWidth
					margin='normal'
					error={!!errors.name}
					helperText={errors.name?.message}
				/>
				<TextField {...register('description')} label='Description' fullWidth margin='normal' />

				<DialogActions sx={{ display: 'flex', alignItems: 'baseline' }}>
					<Button onClick={cancelAndEmpty} disabled={categoryLoading}>
						Cancel
					</Button>
					<Button type='submit' variant='contained' sx={{ mt: 2 }} disabled={categoryLoading}>
						{categoryLoading ? 'under processing' : title.includes('Edit') ? 'Save Changes' : 'Create Category'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default React.memo(CategoryDialog);
