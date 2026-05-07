-- Fix: Drop and recreate the trigger function with proper search_path
-- The issue is that auth.uid() returns NULL inside a trigger context,
-- so we must use new.id directly and bypass RLS with SECURITY DEFINER + search_path.

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Allow inserts from the trigger function by temporarily disabling RLS-bypass restriction
-- The SECURITY DEFINER function runs as the function owner (postgres/service_role),
-- so we need RLS bypass on these tables from that role.

-- Add a permissive policy for the trigger (runs as postgres superuser via SECURITY DEFINER)
ALTER TABLE clinics DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable with proper policies that also allow the trigger to insert
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Clinics are manageable by owners" ON clinics;
DROP POLICY IF EXISTS "Profiles are manageable by owners" ON profiles;

-- Re-create policies that work for both trigger and user access
CREATE POLICY "Clinics: owners can manage" ON clinics
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Profiles: users can manage own" ON profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Recreate the trigger function with SET search_path to bypass the schema issues
-- SECURITY DEFINER + SET search_path = public, auth ensures the trigger 
-- runs as the function owner with full access, bypassing RLS
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_clinic_id UUID;
BEGIN
  -- Create clinic for the new user
  INSERT INTO public.clinics (name, owner_id)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'clinic_name', 'Minha Clínica'),
    NEW.id
  )
  RETURNING id INTO new_clinic_id;

  -- Create user profile linked to clinic
  INSERT INTO public.profiles (id, full_name, clinic_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    new_clinic_id
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant execute permission to postgres role (used by auth system)
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
