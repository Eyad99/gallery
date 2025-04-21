import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			<Typography gutterBottom variant='h2' component='h2'>
				404 Not Found
			</Typography>
			<Link href='/'>
				<Typography gutterBottom variant='h6' component='h6'>
					Return to home
				</Typography>
			</Link>
		</Box>
	);
}
