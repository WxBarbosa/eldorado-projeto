export interface Category {
    id: number;
    name: string;
}

export interface Device {
    id: number;
    category_id: number;
    color: string;
    part_number: number;
    category_name?: string;
}