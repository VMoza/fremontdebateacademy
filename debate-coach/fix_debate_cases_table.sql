-- Check if the side column exists
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'debate_cases'
        AND column_name = 'side'
    ) INTO column_exists;

    IF NOT column_exists THEN
        -- Add the side column if it doesn't exist
        EXECUTE 'ALTER TABLE debate_cases ADD COLUMN side TEXT';
        
        -- Update any existing rows to have a default side value
        EXECUTE 'UPDATE debate_cases SET side = ''affirmative'' WHERE side IS NULL';
        
        -- Make the side column NOT NULL for future inserts
        EXECUTE 'ALTER TABLE debate_cases ALTER COLUMN side SET NOT NULL';
        
        RAISE NOTICE 'Added side column to debate_cases table';
    ELSE
        RAISE NOTICE 'Side column already exists in debate_cases table';
    END IF;
END $$; 