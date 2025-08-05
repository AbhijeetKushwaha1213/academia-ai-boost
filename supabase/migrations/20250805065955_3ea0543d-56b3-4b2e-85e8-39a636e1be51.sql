-- Create profile for the correct user ID only (the one that exists in auth.users)
INSERT INTO public.user_profiles (user_id, name, email, user_type)
VALUES (
  '8af37974-74ad-4852-9a2c-798b0df7729a',
  'abhijeetkushwaha1213',
  'abhijeetkushwaha1213@gmail.com',
  'exam'
) ON CONFLICT (user_id) DO NOTHING;