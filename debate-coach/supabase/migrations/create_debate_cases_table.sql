-- Create debate_cases table
CREATE TABLE IF NOT EXISTS debate_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    topic TEXT NOT NULL,
    side TEXT NOT NULL,
    case_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS) to ensure users can only access their own data
ALTER TABLE debate_cases ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own debate cases
CREATE POLICY select_own_cases ON debate_cases
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert only their own debate cases
CREATE POLICY insert_own_cases ON debate_cases
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own debate cases
CREATE POLICY update_own_cases ON debate_cases
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own debate cases
CREATE POLICY delete_own_cases ON debate_cases
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS debate_cases_user_id_idx ON debate_cases (user_id);

-- Grant necessary permissions to authenticated users
GRANT ALL ON debate_cases TO authenticated; 