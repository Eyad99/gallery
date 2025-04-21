export interface Category_Res {
	id: number;
	name: string;
	description: string;
	image: string;
}

export interface Category_Req {
	id?: number;
	name: string;
	description: string;
	image: string;
}
