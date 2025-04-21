import { useQuery, QueryFunction, keepPreviousData } from '@tanstack/react-query';

interface UseFetchDataRQProps {
	queryKey: unknown[];
	queryFn: QueryFunction<any>;
	enableCondition?: boolean;
	dontFetchOnMount?: boolean;
	onSuccessFn?: (data: any) => void;
	selectFn?: (data: any) => any;
	refetchInterval?: number;
}

export const useFetchDataRQ = ({
	queryKey,
	queryFn,
	enableCondition = true,
	dontFetchOnMount,
	onSuccessFn,
	selectFn,
	refetchInterval,
}: UseFetchDataRQProps) => {
	const data = useQuery({
		queryKey,
		queryFn,
		placeholderData: keepPreviousData, // use isPlaceholderData
		refetchOnWindowFocus: false,
		refetchOnMount: dontFetchOnMount ? false : true,
		retry: 1,
		enabled: enableCondition,
		refetchInterval: refetchInterval,
		select: ({ data }: any) => {
			if (selectFn) {
				return selectFn(data);
			}
			return { data: data };
		},
	});

	if (data.isError) {
		console.error(data?.error?.message);
	}

	if (data.isSuccess && onSuccessFn) {
		onSuccessFn(data.data!);
	}

	return data;
};
