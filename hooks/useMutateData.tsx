import { useMutation, useQueryClient } from '@tanstack/react-query';

interface MutationOptions {
	mutationFn: (...args: any[]) => Promise<any>;
	closeDialog?: () => void;
	onSuccessFn?: (...options: any) => void;
	onErrorFn?: (...options: any) => void;
	invalidateKeys?: any[];
	multipleKeys?: boolean;
	displaySuccess?: boolean;
}

export const useMutateData = (options: MutationOptions) => {
	const queryClient = useQueryClient();

	const data = useMutation({
		mutationFn: options.mutationFn,
		onSuccess(data, variables) {
			if (options.multipleKeys && options.invalidateKeys) {
				options.invalidateKeys.map((key) => queryClient.invalidateQueries(key));
			} else if (options.invalidateKeys) {
				queryClient.invalidateQueries(options.invalidateKeys as any);
			}

			options.onSuccessFn && options.onSuccessFn({ data: data?.data, variables: variables });
		},

		onError: (error: any, variables: any) => {
			if (Array.isArray(error.message)) {
				error.message.map((el: any) => console.error(el));
			} else {
				console.error(error.message ?? 'Error');
			}

			options.onErrorFn && options.onErrorFn(error?.message ?? 'Error', variables);
		},
	});

	return data;
};
