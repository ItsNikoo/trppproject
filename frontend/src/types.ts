export interface Photo {
    id: number;
    photo_url: string;
}

export interface Item {
    id: number;
    title: string;
    price: number;
    slug: string;
    is_featured: boolean;
    description: string;
    category: string;
    available: boolean;
    preorder: boolean;
    amount: number;
    photos: Photo[];
}

export interface GlobalItem {
    item: Item;
}

export interface Category {
    id: number;
    category: string;
    category_name: string;
}

export interface CartItem {
    id: number;
    item: number;
    size: string;
    quantity: number;
}