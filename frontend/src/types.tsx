export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: {
        name: string;
        id: number;
    }; 
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
}