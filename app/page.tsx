import Categories from '@/components/pages/categories';
import Images from '@/components/pages/images';
import { Container } from '@mui/material';

export default function Home() {
	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			<Categories />
			<Images />
		</Container>
	);
}
