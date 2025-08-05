-- Create profile for the correct user ID
INSERT INTO public.user_profiles (user_id, name, email, user_type)
VALUES (
  '8af37974-74ad-4852-9a2c-798b0df7729a',
  'abhijeetkushwaha1213',
  'abhijeetkushwaha1213@gmail.com',
  'exam'
) ON CONFLICT (user_id) DO NOTHING;

-- Also create for the other ID just in case
INSERT INTO public.user_profiles (user_id, name, email, user_type)
VALUES (
  'aeda756d-582f-4bbd-bee3-e81fc79156d3',
  'abhijeetkushwaha1213',
  'abhijeetkushwaha1213@gmail.com',
  'exam'
) ON CONFLICT (user_id) DO NOTHING;