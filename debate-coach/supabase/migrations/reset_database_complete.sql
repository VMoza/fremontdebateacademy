-- Drop policies for debate_cases if they exist
DROP POLICY IF EXISTS select_own_cases ON debate_cases;
DROP POLICY IF EXISTS insert_own_cases ON debate_cases;
DROP POLICY IF EXISTS update_own_cases ON debate_cases;
DROP POLICY IF EXISTS delete_own_cases ON debate_cases;

-- Drop policies for speeches if they exist
DROP POLICY IF EXISTS select_own_speeches ON speeches;
DROP POLICY IF EXISTS insert_own_speeches ON speeches;
DROP POLICY IF EXISTS update_own_speeches ON speeches;
DROP POLICY IF EXISTS delete_own_speeches ON speeches;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS debate_cases;
DROP TABLE IF EXISTS speeches;

-- Create speeches table
CREATE TABLE IF NOT EXISTS speeches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    topic TEXT NOT NULL,
    transcript TEXT NOT NULL,
    feedback JSONB NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS) for speeches
ALTER TABLE speeches ENABLE ROW LEVEL SECURITY;

-- Create policies for speeches
CREATE POLICY select_own_speeches ON speeches
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY insert_own_speeches ON speeches
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_speeches ON speeches
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY delete_own_speeches ON speeches
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for speeches
CREATE INDEX IF NOT EXISTS speeches_user_id_idx ON speeches (user_id);

-- Grant permissions for speeches
GRANT ALL ON speeches TO authenticated;

-- Create debate_cases table
CREATE TABLE IF NOT EXISTS debate_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    topic TEXT NOT NULL,
    side TEXT NOT NULL,
    case_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS) for debate_cases
ALTER TABLE debate_cases ENABLE ROW LEVEL SECURITY;

-- Create policies for debate_cases
CREATE POLICY select_own_cases ON debate_cases
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY insert_own_cases ON debate_cases
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_cases ON debate_cases
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY delete_own_cases ON debate_cases
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for debate_cases
CREATE INDEX IF NOT EXISTS debate_cases_user_id_idx ON debate_cases (user_id);

-- Grant permissions for debate_cases
GRANT ALL ON debate_cases TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 