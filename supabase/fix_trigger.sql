DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
DECLARE
  new_clinic_id UUID;
BEGIN
  BEGIN
    INSERT INTO public.clinics (name, owner_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'clinic_name', 'Minha Clinica'),
      NEW.id
    )
    RETURNING id INTO new_clinic_id;

    INSERT INTO public.profiles (id, full_name, clinic_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      new_clinic_id
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
