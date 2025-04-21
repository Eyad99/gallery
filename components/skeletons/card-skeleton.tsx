import React from 'react';
import { Grid, Card, CardContent, useTheme, Skeleton } from '@mui/material';

const CardSkeleton = () => {
	const theme = useTheme();

	return (
		<Grid container spacing={3} sx={{ py: 3 }}>
			{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
				<Grid size={{ md: 3, xs: 12 }} key={item}>
					<Card
						elevation={2}
						sx={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							transition: 'transform 0.2s, box-shadow 0.2s',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: theme.shadows[8],
							},
						}}
					>
						<Skeleton variant='rectangular' height={140} />
						<CardContent>
							<Skeleton variant='text' height={40} />
							<Skeleton variant='text' />
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default CardSkeleton;
