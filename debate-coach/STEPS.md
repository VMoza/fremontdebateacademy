# Step-by-Step Development Guide for Debate Coach Web App

## **Overview**
This document provides a step-by-step breakdown for implementing the Debate Coach web app. Each step is designed to be independently testable before moving on to the next.

---

## **Step 1: Set Up the Project** ✅
1. Initialize a **Next.js** project:
   ```sh
   npx create-next-app@latest debate-coach --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"
   cd debate-coach
   ````
2. Install dependencies:
   ```sh
   npm install @supabase/supabase-js
   npx shadcn@latest init
   ```
3. Create basic pages:
   - Home page (`src/app/page.tsx`)
   - Login page (`src/app/login/page.tsx`)
   - Signup page (`src/app/signup/page.tsx`)
   - Speech Recording page (`src/app/speech/page.tsx`)
   - Case Generator page (`src/app/case-generator/page.tsx`)
4. Create a `.env.local` file with placeholders:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # OpenAI Configuration (for future use)
   OPENAI_API_KEY=your_openai_api_key
   ```
5. Create a Supabase client file (`src/lib/supabase.ts`).
6. Start the dev server:
   ```sh
   npm run dev
   ```
   - **Test:** Ensure the Next.js project loads properly and all pages are accessible.

---

## **Step 2: Integrate Supabase Authentication** ✅
1. Create a **Supabase project** at [supabase.io](https://supabase.io) and get API keys.
2. Update the `.env.local` file with your Supabase credentials.
3. Install Supabase auth helpers:
   ```sh
   npm install @supabase/ssr @supabase/supabase-js
   ```
4. Implement authentication functionality:
   - Create Supabase client files:
     - Server-side client (`src/lib/supabase/server.ts`)
     - Client-side client (`src/lib/supabase/client.ts`)
   - Create authentication context (`src/contexts/AuthContext.tsx`)
   - Implement sign-up functionality in `src/app/signup/page.tsx`
   - Implement sign-in functionality in `src/app/login/page.tsx`
   - Implement sign-out functionality in the dashboard
   - Create a dashboard page (`src/app/dashboard/page.tsx`)
5. Protect routes using middleware (`middleware.ts`).
6. **Test:** Ensure users can sign up, log in, and log out. Verify that protected routes redirect to login.

---

## **Step 3: Create the Speech Recording Component** ✅
1. Create a Recorder component (`src/components/Recorder.tsx`) using the Web Audio API.
2. Implement **Start/Stop Recording** buttons with visual feedback.
3. Store recorded audio in **state** and provide it to the parent component.
4. Render the audio file for playback with an audio player.
5. Update the Speech page (`src/app/speech/page.tsx`) to use the Recorder component.
6. **Test:** Ensure audio can be recorded and played back.

---

## **Step 4: Convert Speech to Text** ✅
1. Install required dependencies:
   ```sh
   npm install uuid @types/uuid
   ```
2. Create a transcription API route (`src/app/api/transcribe/route.ts`) using OpenAI's Whisper API.
3. Update the SpeechToText component to send audio to the transcription API.
4. Display the **transcribed speech** below the recorder.
5. Add fallback to sample transcripts in case of API errors.
6. **Test:** Ensure the transcription flow works correctly with real audio.

---

## **Step 5: Send Speech to LLM for Grading** ✅
1. Install the OpenAI package:
   ```sh
   npm install openai
   ```
2. Create an API route (`src/app/api/grade-speech/route.ts`) to handle speech grading.
3. Create a FeedbackDisplay component (`src/components/FeedbackDisplay.tsx`) to show the results.
4. Update the Speech page to send the transcript to the API and display the feedback.
5. **Test:** Ensure grading works and results are displayed properly.

---

## **Step 6: Store Speech and Results in Supabase** ✅
1. Create a `speeches` table in Supabase with Row Level Security:
   ```sql
   -- Create speeches table
   CREATE TABLE speeches (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID REFERENCES auth.users(id) NOT NULL,
       topic TEXT NOT NULL,
       transcript TEXT NOT NULL,
       feedback JSONB NOT NULL,
       score INTEGER NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
   );

   -- Set up Row Level Security (RLS)
   ALTER TABLE speeches ENABLE ROW LEVEL SECURITY;

   -- Create policies to ensure users can only access their own data
   CREATE POLICY select_own_speeches ON speeches FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY insert_own_speeches ON speeches FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY update_own_speeches ON speeches FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY delete_own_speeches ON speeches FOR DELETE USING (auth.uid() = user_id);
   ```
2. Create a speech service (`src/services/speechService.ts`) to handle CRUD operations.
3. Update the FeedbackDisplay component to save speech results to Supabase.
4. Update the dashboard to fetch and display the user's speeches.
5. Create a speech detail page (`src/app/speech/[id]/page.tsx`) to view saved speeches.
6. Improve the SpeechToText component to use real transcription via OpenAI's Whisper API.
7. **Test:** Ensure speeches are saved to Supabase and associated with the correct user.

---

## **Step 7: Implement Debate Case Generator**
1. Create a **topic input form**.
2. Create an API route (`/api/generate-case`).
3. Send topic to LLM (using gpt-4o-mini model) to generate structured MSPDP case.
4. Display the **ARES points** and assign them to speakers.
5. **Test:** Ensure debate cases are generated correctly.

---

## **Step 8: Store and Retrieve Debate Cases**
1. Create a `debate_cases` table in Supabase:
   ```sql
   CREATE TABLE debate_cases (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID REFERENCES auth.users(id),
       topic TEXT,
       case_json JSON,
       created_at TIMESTAMP DEFAULT now()
   );
   ```
2. Save generated cases for users.
3. Fetch past cases in the **dashboard**.
4. **Test:** Ensure saved cases can be retrieved and displayed for the correct user.

---

## **Step 9: Build the User Dashboard**
1. Create a **dashboard page** (`/dashboard`).
2. List past **graded speeches** and **debate cases**.
3. Allow users to **delete** or **re-evaluate** speeches.
4. **Test:** Ensure dashboard displays and functions correctly.

---

## **Step 10: Final UI/UX Polish**
1. Improve **mobile responsiveness**.
2. Add **loading states** and **error handling**.
3. Use **shadcn/ui** for better design consistency.
4. **Test:** Perform a full app walkthrough.

---

## **Deployment**
1. Deploy frontend on **Vercel**.
2. Secure API keys with **environment variables**.
3. Test Supabase integration in production.

---

## **How to Run the Project**
1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file with your Supabase and OpenAI credentials:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

This step-by-step guide ensures a methodical approach to development, allowing testing and validation at each stage. 🚀