import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, Resume, Feedback
from datetime import datetime
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'resumes.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

with app.app_context():
    db.create_all()


def analyze_with_ai(resume_text: str) -> dict:
    system_prompt = """You are an expert resume reviewer and career coach with 15+ years of experience 
helping candidates land roles at top tech companies. 

Your task: Analyze the given resume and return ONLY a valid JSON object — no markdown, no explanation, 
no preamble. The JSON must have exactly these fields:

{
  "strengths": "A detailed paragraph describing what the candidate does well",
  "weaknesses": "A detailed paragraph describing areas that need improvement",
  "missing_keywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2", "Actionable suggestion 3"],
  "score": 7,
  "score_rationale": "One sentence explaining the score"
}

Rules:
- score must be an integer between 1 and 10
- missing_keywords must be an array of strings
- suggestions must be an array of 3-5 actionable strings
- Return ONLY the JSON object, nothing else
"""

    user_message = f"""Please analyze the following resume:

---
{resume_text}
---

Return your analysis as a strict JSON object following the schema in your instructions."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1500,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r"^```(?:json)?\n?", "", raw)
    raw = re.sub(r"\n?```$", "", raw)

    return json.loads(raw)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()})


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    if not data or not data.get("content"):
        return jsonify({"error": "Resume content is required"}), 400

    content = data["content"].strip()

    if len(content) < 50:
        return jsonify({"error": "Resume content is too short."}), 400

    if len(content) > 15000:
        return jsonify({"error": "Resume content is too long."}), 400

    resume = Resume(content=content)
    db.session.add(resume)
    db.session.flush()

    try:
        ai_result = analyze_with_ai(content)
    except json.JSONDecodeError:
        db.session.rollback()
        return jsonify({"error": "AI returned unexpected format. Try again."}), 502
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"AI analysis failed: {str(e)}"}), 502

    required_fields = ["strengths", "weaknesses", "missing_keywords", "suggestions", "score"]
    for field in required_fields:
        if field not in ai_result:
            db.session.rollback()
            return jsonify({"error": f"AI response missing field: {field}"}), 502

    score = int(ai_result.get("score", 0))
    score = max(1, min(10, score))

    feedback = Feedback(
        resume_id=resume.id,
        strengths=ai_result["strengths"],
        weaknesses=ai_result["weaknesses"],
        missing_keywords=json.dumps(ai_result["missing_keywords"]),
        suggestions=json.dumps(ai_result["suggestions"]),
        score=score,
        score_rationale=ai_result.get("score_rationale", "")
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({
        "id": feedback.id,
        "resume_id": resume.id,
        "strengths": feedback.strengths,
        "weaknesses": feedback.weaknesses,
        "missing_keywords": json.loads(feedback.missing_keywords),
        "suggestions": json.loads(feedback.suggestions),
        "score": feedback.score,
        "score_rationale": feedback.score_rationale,
        "created_at": feedback.created_at.isoformat()
    }), 201


@app.route("/analyses", methods=["GET"])
def get_analyses():
    feedbacks = (
        db.session.query(Feedback, Resume)
        .join(Resume, Feedback.resume_id == Resume.id)
        .order_by(Feedback.created_at.desc())
        .all()
    )

    results = []
    for fb, resume in feedbacks:
        preview = resume.content[:120] + "..." if len(resume.content) > 120 else resume.content
        results.append({
            "id": fb.id,
            "resume_id": resume.id,
            "resume_preview": preview,
            "score": fb.score,
            "score_rationale": fb.score_rationale,
            "strengths": fb.strengths,
            "weaknesses": fb.weaknesses,
            "missing_keywords": json.loads(fb.missing_keywords),
            "suggestions": json.loads(fb.suggestions),
            "created_at": fb.created_at.isoformat()
        })

    return jsonify(results)


@app.route("/analysis/<int:analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    fb = db.session.get(Feedback, analysis_id)
    if not fb:
        return jsonify({"error": "Analysis not found"}), 404

    resume = db.session.get(Resume, fb.resume_id)
    return jsonify({
        "id": fb.id,
        "resume_id": resume.id,
        "resume_content": resume.content,
        "strengths": fb.strengths,
        "weaknesses": fb.weaknesses,
        "missing_keywords": json.loads(fb.missing_keywords),
        "suggestions": json.loads(fb.suggestions),
        "score": fb.score,
        "score_rationale": fb.score_rationale,
        "created_at": fb.created_at.isoformat()
    })


@app.route("/analysis/<int:analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id):
    fb = db.session.get(Feedback, analysis_id)
    if not fb:
        return jsonify({"error": "Analysis not found"}), 404

    resume = db.session.get(Resume, fb.resume_id)
    db.session.delete(fb)
    if resume:
        db.session.delete(resume)
    db.session.commit()

    return jsonify({"message": "Deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)