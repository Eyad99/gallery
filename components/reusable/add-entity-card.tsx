import React from 'react';
import { Box, Card, Grid, Typography, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AddEntityCardProps {
	onClick: () => void;
	title: string;
	size: any;
}
const AddEntityCard: React.FC<AddEntityCardProps> = ({ onClick, title, size }) => {
	const theme = useTheme();

	return (
		<Grid size={size}>
			<Card
				elevation={2}
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					cursor: 'pointer',
					transition: 'transform 0.2s, box-shadow 0.2s',
					border: '2px dashed',
					borderColor: 'primary.light',
					backgroundColor: 'rgba(25, 118, 210, 0.04)',
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: theme.shadows[8],
						borderColor: 'primary.main',
					},
				}}
				onClick={onClick}
			>
				<Box
					sx={{
						height: '100%',
						minHeight: 200,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						p: 3,
					}}
				>
					<AddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
					<Typography variant='h6' color='primary.main' align='center'>
						{title}
					</Typography>
				</Box>
			</Card>
		</Grid>
	);
};

export default AddEntityCard;
