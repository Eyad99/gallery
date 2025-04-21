import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface DeleteConfirmationDialogProps {
	open: boolean;
	categoryName?: string;
	onClose: () => void;
	onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, categoryName, onClose, onConfirm }) => (
	<Dialog open={open} onClose={onClose}>
		<DialogTitle>Confirm Delete</DialogTitle>
		<DialogContent>
			<Typography>Are you sure you want to delete the category "{categoryName}"? This action cannot be undone.</Typography>
		</DialogContent>
		<DialogActions>
			<Button onClick={onClose}>Cancel</Button>
			<Button onClick={onConfirm} color='error' variant='contained'>
				Delete
			</Button>
		</DialogActions>
	</Dialog>
);

export default DeleteConfirmationDialog;
