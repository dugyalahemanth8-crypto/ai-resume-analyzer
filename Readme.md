# AI Resume Analyzer 📄🚀

An AI-powered web application that analyzes resumes, extracts key information, and provides improvement suggestions using the Groq LPU™ Inference Engine for lightning-fast results.

## 🌟 Features
* **PDF Parsing:** Extracts text content from uploaded resumes.
* **AI Analysis:** Evaluates skills, experience, and formatting using Groq AI.
* **Actionable Feedback:** Provides specific suggestions to improve ATS (Applicant Tracking System) scores.
* **Fast Response:** Leverages Groq's high-speed inference for near-instant analysis.

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS
* **Backend:** Python (Flask)
* **AI Engine:** Groq Cloud API (Llama 3 / Mixtral)
* **File Handling:** PyPDF2 or pdfminer.six

## 🚀 Getting Started

### Prerequisites
* Python 3.8+
* Node.js & npm
* A Groq API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/dugyalahemanth8-crypto/ai-resume-analyzer.git](https://github.com/dugyalahemanth8-crypto/ai-resume-analyzer.git)
   cd ai-resume-analyzer
Setup Backend:

Bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
source venv/bin/activate  
pip install -r requirements.txt
Create a .env file in the backend folder and add: GROQ_API_KEY=your_key_here

Setup Frontend:

Bash
cd ../frontend
npm install
Running the App
Start Flask Server:

Bash
# From the backend directory
python app.py
Start React App:

Bash
# From the frontend directory
npm start