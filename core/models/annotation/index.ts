export interface Annotation_Res {
    id: number | string;
    imageId: number | string;
    coordinates:{
        x: number;
        y: number;
        width: number;
        height: number;
    }
    color: string;
}

export interface Annotation_Req {
    imageId: number | string;
    coordinates:{
        x: number;
        y: number;
        width: number;
        height: number;
    }
    color: string;
}