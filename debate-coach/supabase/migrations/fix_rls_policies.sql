-- Drop existing policies to ensure clean setup
DROP POLICY IF EXISTS select_own_speeches ON speeches;
DROP POLICY IF EXISTS insert_own_speeches ON speeches;
DROP POLICY IF EXISTS update_own_speeches ON speeches;
DROP POLICY IF EXISTS delete_own_speeches ON speeches;

-- Make sure RLS is enabled
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

-- Verify the policies
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    tablename = 'speeches';

-- Grant necessary permissions to authenticated users
GRANT ALL ON speeches TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 