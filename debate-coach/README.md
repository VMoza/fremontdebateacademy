# Debate Coach Web App Architecture

## **Tech Stack**
- **Frontend**: Next.js (React, TailwindCSS for styling, shadcn/ui for UI components)
- **Backend**: Next.js API routes (serverless functions for LLM processing)
- **Database & Auth**: Supabase (PostgreSQL, authentication)
- **Audio Processing**: Web APIs for recording, possibly Whisper API for speech-to-text
- **LLM API**: OpenAI GPT-4 (or another model) for grading and case generation  

---

## **Core Features & Architecture**
### **1. Authentication & User Management**
- **Sign up/login** using Supabase Auth (OAuth, email/password)
- Store user profiles in Supabase (e.g., saved speeches, debate cases)
  
### **2. Speech Recording & Grading (Tab 1)**
#### **Frontend:**
- Page to **select a topic** (dropdown or manual entry)
- Button to **start recording** (uses Web Audio API)
- Convert recorded speech to text (Whisper API or browser Speech-to-Text)
- Call **LLM API** with the transcript for **grading & feedback**
- Display structured feedback (rubric-based scoring for MSPDP format)

#### **Backend:**
- API route (`/api/grade-speech`) to send speech transcript to LLM
- Store speech transcript, LLM feedback, and score in Supabase

---

### **3. Debate Case Generator (Tab 2)**
#### **Frontend:**
- Page for entering a debate topic  
- Button to generate a **structured MSPDP case**  
- Display results with **Assertion, Reasoning, Evidence, Source (ARES) points**  
- Assign points to **Speaker 1 & Speaker 2**  
- Option to save cases for later

#### **Backend:**
- API route (`/api/generate-case`) to process user input and call LLM
- Store generated cases in Supabase  

---

### **4. User Dashboard & Saved Data**
- Page for users to view past **graded speeches** & **generated debate cases**  
- Option to delete or re-evaluate old speeches  
- Simple database schema:
  ```sql
  users (id, email, name, created_at)
  speeches (id, user_id, topic, transcript, feedback, score, created_at)
  debate_cases (id, user_id, topic, case_json, created_at)
  ```

---

## **Tech Implementation Plan**
1. **Set up Next.js project** with TailwindCSS & shadcn/ui  
2. **Integrate Supabase** for authentication & database  
3. **Build Speech Recording & Grading Flow**  
   - Use Web Audio API for recording  
   - Process audio into text (Whisper API or browser API)  
   - Send transcript to LLM via API route  
   - Display feedback  
4. **Develop Debate Case Generator**  
   - Take user topic input  
   - Call LLM API for structured case generation  
   - Display & save results  
5. **Create User Dashboard** for saved speeches & cases  
6. **Polish UI/UX for mobile & desktop**  

---