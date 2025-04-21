import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface DeleteConfirmationDialogProps {
	open: boolean;
	itemName?: string;
	onClose: () => void;
	onConfirm: () => void;
}

const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = ({ open, itemName, onClose, onConfirm }) => (
	<Dialog open={open} onClose={onClose}>
		<DialogTitle>Confirm Deletion</DialogTitle>
		<DialogContent>
			<Typography>Are you sure you want to delete {itemName ? `"${itemName}"` : 'this item'}? This action cannot be undone.</Typography>
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
