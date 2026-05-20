# Implementation Plan: GitHub Repository & User Profile Analyzer

This plan outlines the steps required to get the current repository analyzer project fully operational, set up the necessary environment files, and expand the application's scope to support **GitHub User Profile-Level Analysis**.

---

## 🛠️ Step 1: Getting the Cloned Project Operational
To run the project, we need to prepare the environment and build the dependencies:

1. **Install Node.js dependencies & Build Frontend:**
   - Navigate to the `frontend/` directory.
   - Run `npm install` followed by `npm run build`.
   - This compiles the TypeScript + React assets into `frontend/dist`.
2. **Install Python backend requirements:**
   - Run `pip install -r requirements.txt`.
3. **Verify Redis integration:**
   - Verify that Redis is connected if Docker is active. If not, verify that the application successfully falls back to direct, non-cached API calling (the code currently handles this beautifully).
4. **Boot Server:**
   - Launch the FastAPI server using `run.bat` or `python -m uvicorn main:app --port 8000 --reload`.

---

## 🚀 Step 2: Expanding to User Profile Level
We will expand the scope of the application from analyzing a single repository (e.g. `facebook/react`) to analyzing a **GitHub User Profile** (e.g. `octocat`). 

### 1. Backend Architecture Updates (`models.py` & `github_service.py` & `routes/api.py`)

#### A. New Data Models (`models.py`)
We will create structured models representing a GitHub user's profile and analysis:
- `ProfileAnalyzeRequest`: Validates GitHub username input.
- `RepoPortfolioItem`: Basic information about a repository owned by the user (name, description, stars, forks, language, size, and activity).
- `DeveloperPersona`: AI-generated insights on the user's coding style, strengths, development focus, and areas for growth.
- `ProfileAnalysisData`: The complete, aggregated payload returned by the profile API:
  - `profile_info` (name, username, avatar, bio, company, location, followers, following, public_repos)
  - `languages` (aggregated percentage of language usage across all public repositories)
  - `commits` (monthly activity distribution)
  - `repositories` (portfolio repository list)
  - `persona` (AI developer archetype and review)

#### B. GitHub Service Enhancements (`github_integration/github_service.py`)
We will add functions to fetch user data:
- `fetch_user_profile(username: str)`: Fetches basic user profile metrics.
- `fetch_user_repos(username: str)`: Fetches the user's public repositories.
- `fetch_user_aggregated_stats(username: str)`: Iterates through repositories (up to 15-20 to avoid rate limits) to sum stars/forks and aggregate global language bytes.
- `fetch_user_recent_commits(username: str)`: Fetches aggregate commit counts for recent repositories.

#### C. LLM Profile Analysis (`analysis_engine/llm_reviewer.py` & `deep_scanner.py`)
We will add helper functions to ask the LLM to inspect the user's language profile, public portfolio, and bios:
- `generate_developer_persona(profile_info, languages, repositories)`: Prompts the LLM (OpenAI or Gemini compatibility layer) to output a structured JSON containing:
  - `vibe_check`: A fun, punchy 2-3 sentence overview of their developer presence.
  - `archetype`: e.g. "Full-Stack System Architect", "Frontend Wizard", "Hobbyist Explorer".
  - `strengths`: e.g. "Excellent project documentation, consistent release schedules."
  - `growth_areas`: e.g. "Mostly lone-wolf repositories; could benefit from open-source collaboration."
  - `vibe_score`: 0 to 100 rating of their overall profile presentation.

#### D. API Endpoints (`routes/api.py`)
We will expose two new endpoints:
- `POST /api/v1/analyze/profile`: Main profile analysis endpoint (fetches profile, aggregates repo data, caches, and returns).
- `GET /api/v1/analyze/profile/deep`: Optional deep scan AI-generation endpoint to create their developer persona.

---

### 2. Frontend Interface Updates (`frontend/src/`)

#### A. Tabs on Landing Page (`LandingPage.tsx`)
- Add a stunning, modern navigation switcher:
  - **🔍 Repository Mode** (Analyze a specific project codebase)
  - **👤 Developer Profile Mode** (Analyze a user's entire GitHub footprint)
- In **Profile Mode**, change the input placeholder to `"Enter GitHub Username (e.g. octocat)..."` and validate as a valid username instead of `owner/repo`.

#### B. Unified Routing & Pages (`AnalyzePage.tsx`)
- Detect if the search parameter is `?repo=owner/repo` or `?username=user`.
- Call the appropriate service hooks (we will create `useAnalyzeProfile` hook).

#### C. Profile Dashboard Dashboard Layout (`layouts/ProfileDashboardLayout.tsx`)
Create a completely custom, premium developer dashboard:
1. **Developer Profile Card (Header):**
   - High-fidelity layout with banner, avatar, name, bio, location, followers/following, public repo count, and total stars.
2. **Interactive Developer Persona Card (AI Insights):**
   - Renders the LLM-generated developer archetype, vibe-check summary, key strengths, and growth recommendations.
3. **Global Tech Stack Breakdown:**
   - Responsive donut chart or bar chart representing aggregated language bytes across all projects.
4. **Repository Portfolio Explorer:**
   - Grid layout showing the user's top projects with stars, forks, main language, and a computed "vibe score". Clicking a project links to GitHub or directly initiates a repository-level scan!
5. **Activity/Commit Flow Chart:**
   - Displays developer commit trends over recent months.

---

## 📅 Execution Roadmap
1. **Bootstrap Phase:** Install dependencies and run the server to ensure standard repository analyzer is fully working.
2. **Backend Phase:** Implement new profile models, fetch endpoints, and AI review service inside Python code.
3. **Frontend Phase:** Add Tab switching, update Landing Page styling, create Profile analysis hook, and build the custom Profile Dashboard UI.
4. **Validation Phase:** Test with example users (e.g., standard GitHub users) to ensure seamless operation.
