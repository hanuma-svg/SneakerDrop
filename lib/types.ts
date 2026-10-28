export type Availability = 'in_stock' | 'low_stock' | 'coming_soon' | 'sold_out';

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  availability: Availability;
  created_at: string;
  updated_at: string;
};

export type WaitlistEntry = {
  id: string;
  product_id: string;
  email: string;
  created_at: string;
  products?: Pick<Product, 'name' | 'slug'> | null;
};

export const availabilityLabels: Record<Availability, string> = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  coming_soon: 'Coming soon',
  sold_out: 'Sold out',
};
