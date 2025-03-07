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

-- Set up Row Level Security (RLS) to ensure users can only access their own data
ALTER TABLE speeches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own speeches
CREATE POLICY select_own_speeches ON speeches
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert only their own speeches
CREATE POLICY insert_own_speeches ON speeches
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own speeches
CREATE POLICY update_own_speeches ON speeches
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own speeches
CREATE POLICY delete_own_speeches ON speeches
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS speeches_user_id_idx ON speeches (user_id); 