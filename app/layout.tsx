import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ReactQueryProvider from '@/utils/ReactQueryProvider';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Gallery',
	description: 'Gallery',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient();

	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<AppRouterCacheProvider options={{ key: 'css' }}>
					<ReactQueryProvider>
						<HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
					</ReactQueryProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
