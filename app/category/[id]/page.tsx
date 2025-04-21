'use client';
import React from 'react';
import ErrorMessage from '@/components/reusable/error-message';
import { Box, Card, CardContent, CardMedia, Typography, CircularProgress, Button, Container } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useFetchDataRQ } from '@/hooks/useFetchDataRQ';
import { useQueryClient } from '@tanstack/react-query';
import { Category_Res } from '@/core/models';
import { categoryApi } from '@/core/services';
import Link from 'next/link';

const SingleCategory = () => {
	const queryClient = useQueryClient();

	const params = useParams<{ id: string }>();
	const router = useRouter();

	const { data, isLoading, isError, error } = useFetchDataRQ({
		queryKey: ['category', Number(params?.id)],
		queryFn: () => categoryApi.singleCategory(Number(Number(params?.id))),
		enableCondition: Number(params?.id) > 1000 ? false : !!Number(params?.id),
	});

	if (isLoading) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' minHeight='60vh'>
				<CircularProgress />
			</Box>
		);
	}

	if (Number(params?.id) > 1000 ? false : isError) {
		return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load category'} onRetry={() => router.refresh()} />;
	}

	if (Number(params?.id) > 1000 ? false : !data?.data) {
		return <ErrorMessage message='Category not found' onRetry={() => router.push('/')} />;
	}

	const category =
		Number(params?.id) > 1000
			? (() => {
					const cachedData = queryClient.getQueryData<{ data: Category_Res[] }>(['categories']);
					const currentCategories = cachedData?.data || [];
					return currentCategories.find((cat) => cat.id === Number(params?.id)) || null;
			  })()
			: data?.data || null;

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Box>
				<Button variant='outlined' sx={{ mb: 3 }}>
					<Link href={'/'}>Back to Categories</Link>
				</Button>
				<Card
					elevation={3}
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						alignItems: 'center',
						p: 2,
					}}
				>
					{category.image ? (
						<CardMedia
							component='img'
							sx={{
								width: { xs: '100%', md: 300 },
								height: 200,
								objectFit: 'cover',
								borderRadius: 1,
							}}
							image={category.image}
							alt={category.name}
						/>
					) : (
						<Box
							sx={{
								width: { xs: '100%', md: 300 },
								height: 200,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								bgcolor: 'action.hover',
								borderRadius: 1,
							}}
						>
							<Typography variant='h6' color='text.secondary'>
								No Image
							</Typography>
						</Box>
					)}
					<CardContent sx={{ flex: 1, p: 3 }}>
						<Typography variant='h4' component='h1' gutterBottom>
							{category.name}
						</Typography>
						<Typography variant='body1' color='text.secondary' paragraph>
							{category.description || 'No description available.'}
						</Typography>
						<Typography variant='caption' color='text.secondary'>
							Category ID: {category.id}
						</Typography>
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
};

export default SingleCategory;
