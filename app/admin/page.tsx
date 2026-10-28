import { AdminDashboard } from '@/components/admin-dashboard';
import { requireAdmin } from '@/lib/auth';
import type { Product, WaitlistEntry } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { user, supabase } = await requireAdmin();
  const [{ data: productData }, { data: waitlistData }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('waitlist').select('id, product_id, email, created_at, products(name, slug)').order('created_at', { ascending: false }),
  ]);
  const products = ((productData ?? []) as Product[]).map((product) => ({ ...product, price: Number(product.price) }));
  const waitlist = (waitlistData ?? []).map((entry) => {
    const productRelation = entry.products as Pick<Product, 'name' | 'slug'> | Pick<Product, 'name' | 'slug'>[] | null | undefined;
    return { ...entry, products: Array.isArray(productRelation) ? productRelation[0] ?? null : productRelation };
  }) as unknown as WaitlistEntry[];
  return <AdminDashboard initialProducts={products} initialWaitlist={waitlist} userEmail={user.email ?? 'Authenticated administrator'} />;
}
