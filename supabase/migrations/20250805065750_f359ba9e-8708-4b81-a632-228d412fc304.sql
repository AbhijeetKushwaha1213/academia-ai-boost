-- Create trigger for automatic profile creation on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Manually create missing profile for existing user
INSERT INTO public.user_profiles (user_id, name, email, user_type)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'name', SPLIT_PART(email, '@', 1)) as name,
  email,
  'exam' as user_type
FROM auth.users 
WHERE id = 'aeda756d-582f-4bbd-bee3-e81fc79156d3'
AND NOT EXISTS (
  SELECT 1 FROM public.user_profiles WHERE user_id = 'aeda756d-582f-4bbd-bee3-e81fc79156d3'
);