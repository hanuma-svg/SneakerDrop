insert into public.products (name, slug, description, price, image_url, availability)
values
  ('Sole Signal 01', 'sole-signal-01', 'A low-profile runner built around a quiet red upper, considered proportions, and a sole that holds its line from first step to last.', 180.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=88', 'low_stock'),
  ('Night Transit 02', 'night-transit-02', 'A dark, textural daily pair with a softly structured upper and enough visual restraint to move between the late train and the long way home.', 210.00, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1400&q=88', 'coming_soon'),
  ('Rally Form 03', 'rally-form-03', 'A clean court silhouette re-cut for everyday movement, with warm neutrals and a bright edge that keeps the finish from feeling quiet.', 165.00, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1400&q=88', 'in_stock')
on conflict (slug) do nothing;
