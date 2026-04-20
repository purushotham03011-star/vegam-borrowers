-- 1. Create a table for Borrowers (Users)
CREATE TABLE IF NOT EXISTS borrowers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mobile TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT,
    email TEXT,
    custom_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for Loan Applications
CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    borrower_id UUID REFERENCES borrowers(id) ON DELETE CASCADE NOT NULL,
    borrower_name TEXT NOT NULL,
    
    -- Asset Details
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    year TEXT,
    condition TEXT,
    
    -- Specific details stored as JSON (RAM, Engine CC, etc)
    specs JSONB, 
    
    -- Loan Data
    interest_rate NUMERIC,
    total_repayment NUMERIC,
    
    -- Status
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create a table for Loan Summaries (Redundant data for quick reporting)
CREATE TABLE IF NOT EXISTS loan_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    borrower_name TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    total_repayment NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create a table for Application Status (Detailed tracking)
CREATE TABLE IF NOT EXISTS application_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    borrower_id UUID REFERENCES borrowers(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    asset_details JSONB,
    loan_requested JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status ENABLE ROW LEVEL SECURITY;

-- 6. Create Policies to allow your web app to Write/Read data
-- Note: For a production app with authentication, these would be stricter.
-- For this public form, we allow inserts and selects.

-- Borrowers Policies
CREATE POLICY "Enable insert for everyone" ON borrowers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for everyone" ON borrowers FOR SELECT USING (true);
CREATE POLICY "Enable update for everyone" ON borrowers FOR UPDATE USING (true);

-- Loan Applications Policies
CREATE POLICY "Enable insert for everyone" ON loan_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for everyone" ON loan_applications FOR SELECT USING (true);

-- Loan Summaries Policies
CREATE POLICY "Enable insert for everyone" ON loan_summaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for everyone" ON loan_summaries FOR SELECT USING (true);

-- Application Status Policies
CREATE POLICY "Enable insert for everyone" ON application_status FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for everyone" ON application_status FOR SELECT USING (true);
