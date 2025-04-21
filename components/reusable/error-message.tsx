import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ErrorMessageProps {
	message: string;
	onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
	<Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='60vh'>
		<Typography variant='h6' color='error' gutterBottom>
			{message}
		</Typography>
		<Button variant='contained' onClick={onRetry}>
			Retry
		</Button>
	</Box>
);

export default ErrorMessage;
