# Supabase Database Setup

To set up the required tables in your Supabase project, follow these steps:

## 1. Log in to your Supabase Dashboard

Go to [https://app.supabase.io/](https://app.supabase.io/) and log in to your account.

## 2. Select your Project

Click on the project you created for the Debate Coach application.

## 3. Open the SQL Editor

In the left sidebar, click on "SQL Editor".

## 4. Create the Speeches Table

Copy and paste the following SQL into the SQL Editor and click "Run":

```sql
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

-- Grant necessary permissions to authenticated users
GRANT ALL ON speeches TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
```

## 5. Verify the Table Creation

After running the SQL, go to the "Table Editor" in the left sidebar. You should see the `speeches` table listed.

## 6. Verify RLS Policies

To ensure the RLS policies are correctly set up, run the following SQL:

```sql
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
```

You should see four policies for the speeches table:
- select_own_speeches
- insert_own_speeches
- update_own_speeches
- delete_own_speeches

## 7. Fix RLS Issues (If Needed)

If you're experiencing RLS-related errors, run this SQL to reset and fix the policies:

```sql
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

-- Grant necessary permissions to authenticated users
GRANT ALL ON speeches TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
```

## 8. Test the Application

Now you can return to the application and test saving speech results. The error should be resolved.

## Future Table Setup (for Step 8)

When you reach Step 8, you'll need to create the `debate_cases` table. Here's the SQL for that:

```sql
-- Create debate_cases table
CREATE TABLE IF NOT EXISTS debate_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    topic TEXT NOT NULL,
    case_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE debate_cases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY select_own_cases ON debate_cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own_cases ON debate_cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_own_cases ON debate_cases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY delete_own_cases ON debate_cases FOR DELETE USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS debate_cases_user_id_idx ON debate_cases (user_id);

-- Grant necessary permissions
GRANT ALL ON debate_cases TO authenticated;
``` 