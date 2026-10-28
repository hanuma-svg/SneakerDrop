import { z } from 'zod';

export const availabilitySchema = z.enum(['in_stock', 'low_stock', 'coming_soon', 'sold_out']);

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(120),
  slug: z.string().trim().min(2, 'Slug must be at least 2 characters.').max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and single hyphens.'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters.').max(1000),
  price: z.coerce.number().finite().min(0, 'Price cannot be negative.').max(100000),
  image_url: z.string().trim().url('Enter a valid image URL.').refine((value) => /^https?:\/\//i.test(value), 'Image URL must start with http or https.'),
  availability: availabilitySchema,
});

export const waitlistSchema = z.object({
  product_id: z.string().uuid('Product reference is invalid.'),
  email: z.string().trim().email('Enter a valid email address.').max(320),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export type ProductInput = z.infer<typeof productSchema>;
