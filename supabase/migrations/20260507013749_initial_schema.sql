-- Create clinics table
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create profiles table (links auth.users to clinics)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  cpf TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create professionals table
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Clinics: Owners can manage their clinics
CREATE POLICY "Clinics are manageable by owners" ON clinics
  FOR ALL USING (auth.uid() = owner_id);

-- Profiles: Users can manage their own profile
CREATE POLICY "Profiles are manageable by owners" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Patients: Accessible by clinic members
CREATE POLICY "Patients are accessible by clinic members" ON patients
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
  );

-- Professionals: Accessible by clinic members
CREATE POLICY "Professionals are accessible by clinic members" ON professionals
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
  );

-- Services: Accessible by clinic members
CREATE POLICY "Services are accessible by clinic members" ON services
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
  );

-- Appointments: Accessible by clinic members
CREATE POLICY "Appointments are accessible by clinic members" ON appointments
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
  );

-- Functions and Triggers

-- Automatically create a profile and clinic for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_clinic_id UUID;
BEGIN
  -- Create a default clinic for the user
  INSERT INTO clinics (name, owner_id)
  VALUES (COALESCE(new.raw_user_meta_data->>'clinic_name', 'Minha Clínica'), new.id)
  RETURNING id INTO new_clinic_id;

  -- Create the user profile
  INSERT INTO profiles (id, full_name, clinic_id)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''), new_clinic_id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
