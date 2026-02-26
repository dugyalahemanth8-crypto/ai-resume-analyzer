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

```Bash
git clone https://github.com/dugyalahemanth8-crypto/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2️⃣ Setup Backend
```Bash
cd backend
python -m venv venv
```

Activate the virtual environment:

On Windows:
```Bash
venv\Scripts\activate
```

On Mac/Linux:
```Bash
source venv/bin/activate
```
Install dependencies:
```Bash
pip install -r requirements.txt
```
Create a .env file inside the backend folder and add:
```Code
GROQ_API_KEY=your_key_here
```

3️⃣ Setup Frontend
```Bash
cd ../frontend
npm install
```
▶️ Running the Application
Start the Flask Server
```Bash
python app.py
```
Start the React Application
```Bash
npm start
```
