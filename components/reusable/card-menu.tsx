import React, { FC, useState } from 'react';
import { IconButton, Menu, MenuItem as MuiMenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Category_Res, Image_Res } from '@/core/models';

interface CardMenuProps {
	entity: Image_Res | Category_Res;
	handlers: {
		handleSelectEntity: (entity: Image_Res | Category_Res) => void;
		handleEditClick: (entity: Image_Res | Category_Res) => void;
		handleDeleteClick: (entity: Image_Res | Category_Res) => void;
	};
}

const CardMenu: FC<CardMenuProps> = ({ entity, handlers }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		handlers.handleSelectEntity(entity);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event?: React.MouseEvent) => {
		event?.stopPropagation();
		setAnchorEl(null);
	};

	return (
		<Box
			sx={{
				position: 'absolute',
				top: 8,
				right: 8,
				zIndex: 2,
			}}
		>
			<IconButton
				onClick={handleOpen}
				size='small'
				aria-label='more'
				aria-controls={`menu-${entity.id}`}
				aria-haspopup='true'
				sx={{
					bgcolor: 'background.paper',
					'&:hover': { bgcolor: 'background.paper' },
				}}
			>
				<MoreVertIcon fontSize='small' />
			</IconButton>
			<Menu anchorEl={anchorEl} open={open} onClose={(e: React.MouseEvent) => handleClose(e)}>
				<MuiMenuItem
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleClose();
						handlers.handleEditClick(entity);
					}}
				>
					<ListItemIcon>
						<EditIcon fontSize='small' color='primary' />
					</ListItemIcon>
					<ListItemText primary='Edit' />
				</MuiMenuItem>
				<MuiMenuItem
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleClose();
						handlers.handleDeleteClick(entity);
					}}
				>
					<ListItemIcon>
						<DeleteIcon fontSize='small' color='error' />
					</ListItemIcon>
					<ListItemText primary='Delete' />
				</MuiMenuItem>
			</Menu>
		</Box>
	);
};

export default CardMenu;
