-- Add missing 'side' column to debate_cases table
ALTER TABLE IF EXISTS debate_cases 
ADD COLUMN IF NOT EXISTS side TEXT;

-- Update any existing rows to have a default side value
UPDATE debate_cases 
SET side = 'affirmative' 
WHERE side IS NULL;

-- Make the side column NOT NULL for future inserts
ALTER TABLE debate_cases 
ALTER COLUMN side SET NOT NULL;

-- Notify about the change
DO $$
BEGIN
  RAISE NOTICE 'Added side column to debate_cases table';
END $$; 