export interface Image_Res {
	id: number;
	name: string;
	url: string;
	uploadDate?: string | Date;
	metadata?: {
		size?: string;
		resolution?: string;
	};
	categoryId: number;
}


export interface Image_Req {
	id?: number;
	name: string;
	url: string;
    metadata?: {
		size?: string;
		resolution?: string;
	};
	categoryId: number;
}
