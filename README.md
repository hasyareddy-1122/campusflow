CampusFlow
CampusFlow is a centralized student dashboard designed to streamline academic management by integrating real-time attendance tracking, task management, and AI-powered insights.

🚀 Features
AI-Powered Insights: Get dynamic academic summaries and advice via Groq-powered analysis.

Centralized Dashboard: Real-time parallel fetching of academic stats, pending tasks, and upcoming events.

Smart Notices: Automated summarization of notices using AI, supporting both text and image-based content.

Task Management: Integrated CRUD operations for tracking student responsibilities.

🛠 Tech Stack
Frontend: Next.js 14, Tailwind CSS

Backend: Supabase (Database & Auth), n8n (Workflow Automation)

AI Integration: Groq API

Deployment: Vercel

⚙️ Getting Started
To run this project locally, follow these steps:

1. Prerequisites
Node.js (v18+)
npm or yarn
A Supabase account
An n8n instance (for workflow automation)

3. Installation
Clone the repository:
Bash
git clone https://github.com/hasyareddy-1122/campusflow.git
cd campusflow

3. Environment Configuration
Create a file named .env.local in the root directory and add the following variables based on the .env.example template:
Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_connection_string
DIRECT_URL=your_direct_connection_url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
N8N_WEBHOOK_URL=your_n8n_webhook_url
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key

5. Run Locally
Bash
npm install
npm run dev
Open http://localhost:3000 to view the application.
