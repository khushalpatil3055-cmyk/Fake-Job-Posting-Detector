# 🔍 Fake Job Posting Detector

> An end-to-end AI + Machine Learning system that detects fraudulent job postings using NLP and classical ML — deployed as a full-stack web application.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat&logo=python)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-orange?style=flat)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=flat)
![React](https://img.shields.io/badge/React-Frontend-61dafb?style=flat&logo=react)
![NLP](https://img.shields.io/badge/NLP-TF--IDF-purple?style=flat)

---

## 🚨 Problem Statement

Fake job postings are a growing problem — especially for freshers and students. Scammers post fraudulent listings to steal personal information, charge fake fees, or commit identity fraud. This project builds an ML-powered system that automatically detects suspicious job postings in real time.

---

## 🌐 Live Demo

> 🔗 Coming Soon — deployment in progress

---

## 📸 Screenshots

| Input Form | Fake Job Detected | Real Job Result |
|------------|-------------------|-----------------|
| Paste any job posting | 🚨 FAKE JOB DETECTED | ✅ LOOKS LIKE A REAL JOB |

---

## 🏗️ Project Architecture

```
User (React Frontend)
        ↓  HTTP POST /predict
FastAPI Backend
        ↓
predictor.py
        ↓  TF-IDF + One-Hot Encoding → 5031 features
SVM Model (LinearSVC)
        ↓
{ is_fake: true/false, confidence_score: float }
        ↓
Result displayed to user
```

---

## 🤖 ML Model Details

| Component | Details |
|-----------|---------|
| Dataset | Real or Fake Job Postings (Kaggle) — 17,880 samples |
| Class Distribution | 95.16% Real vs 4.84% Fake (imbalanced) |
| Text Features | TF-IDF Vectorizer (5000 features, 1-2 grams) |
| Numeric Features | 31 (One-Hot Encoded categories + binary flags) |
| Total Features | 5,031 |
| Models Compared | Logistic Regression, Random Forest, SVM |
| Final Model | SVM — LinearSVC (class_weight='balanced') |
| F1-Score (Fake) | **0.84** |
| Recall (Fake) | **90%** (catches 9 out of 10 fake jobs) |
| Accuracy | 98% |
| Tuning | GridSearchCV (best C=1.0) |

### Why SVM Over Other Models?

| Model | Precision | Recall | F1-Score |
|-------|-----------|--------|----------|
| Logistic Regression | 0.54 | 0.93 | 0.68 |
| Random Forest | 0.99 | 0.53 | 0.69 |
| **SVM (chosen)** | **0.78** | **0.90** | **0.84** |

> Random Forest had the highest accuracy (98%) but only caught 53% of fake jobs — missing almost half of all scams. SVM achieved the best F1-score with strong recall, making it the safest choice for real-world scam detection.

### Key Features Used

**Text Features (TF-IDF):**
- Combined: job title + description + requirements + company profile
- Top fake indicators: `link`, `money`, `signing`, `urgent`
- Top real indicators: `php`, `hardware`, `team`, `installation`

**Numeric Features:**
- `has_company_logo` — fake jobs rarely have a logo (33% vs 82%)
- `has_questions` — fake jobs rarely ask screening questions (29% vs 50%)
- `telecommuting` — remote job indicator
- One-Hot Encoded: `employment_type`, `required_experience`, `required_education`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| ML Model | Scikit-learn (LinearSVC) |
| NLP | TF-IDF Vectorizer |
| Data Processing | Pandas, NumPy |
| Visualization | Matplotlib, Seaborn |
| Backend API | FastAPI + Uvicorn |
| Frontend | React.js |
| Model Serialization | Pickle |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
fake-job-detector/
│
├── notebooks/
│   ├── 01_EDA.ipynb              ← Exploratory Data Analysis
│   ├── 02_preprocessing.ipynb    ← Data cleaning + feature engineering
│   └── 03_model_training.ipynb   ← Model training + evaluation + tuning
│
├── backend/
│   └── app/
│       ├── main.py               ← FastAPI server + /predict endpoint
│       ├── predictor.py          ← ML prediction logic
│       ├── model.pkl             ← Trained SVM model (generated locally)
│       └── tfidf.pkl             ← Fitted TF-IDF vectorizer (generated locally)
│
├── frontend/
│   └── src/
│       ├── App.js                ← Main React UI component
│       └── index.js              ← React entry point
│
├── data/
│   └── fake_job_postings.csv     ← Dataset (download from Kaggle)
│
├── .gitignore
└── README.md
```

---

## ⚙️ How To Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone The Repository
```bash
git clone https://github.com/khushalpatil3055-cmyk/Fake-Job-Posting-Detector.git
cd Fake-Job-Posting-Detector
```

### 2. Download Dataset
- Go to [Kaggle — Real or Fake Job Postings](https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction)
- Download `fake_job_postings.csv`
- Place it inside the `data/` folder

### 3. Set Up Python Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install pandas numpy matplotlib seaborn scikit-learn fastapi uvicorn
```

### 4. Generate Model Files
Run these notebooks **in order** in Jupyter:
```bash
jupyter notebook
```
1. `notebooks/02_preprocessing.ipynb` → generates `tfidf.pkl` + `processed_data.pkl`
2. `notebooks/03_model_training.ipynb` → generates `model.pkl`

### 5. Start The Backend
```bash
cd backend/app
uvicorn main:app --reload
```
API running at: `http://127.0.0.1:8000`
API docs at: `http://127.0.0.1:8000/docs`

### 6. Start The Frontend
```bash
cd frontend
npm install
npm start
```
App running at: `http://localhost:3000`

---

## 🔌 API Reference

### POST `/predict`

**Request Body:**
```json
{
  "text": "Job title + description + requirements",
  "telecommuting": 0,
  "has_logo": 1,
  "has_questions": 1,
  "employment_type": "Full-time",
  "experience": "Entry level",
  "education": "Bachelor's Degree"
}
```

**Response:**
```json
{
  "is_fake": false,
  "confidence_score": -2.94
}
```

| Field | Type | Description |
|-------|------|-------------|
| `is_fake` | boolean | True = fake job detected |
| `confidence_score` | float | Positive = fake, Negative = real. Higher absolute value = more confident |

---

## 📊 Model Performance

```
              precision    recall  f1-score   support

    Real (0)       0.99      0.99      0.99      3403
    Fake (1)       0.78      0.90      0.84       173

    accuracy                           0.98      3576
```

**Confusion Matrix:**
```
                 Predicted Real    Predicted Fake
Actual Real           3266              137
Actual Fake             12              161
```
- ✅ 161 fake jobs correctly caught
- ⚠️ Only 12 fake jobs missed
- ⚠️ 137 real jobs flagged (false alarms — better safe than sorry)

---

## 💡 Key Learnings

- **Accuracy is misleading** on imbalanced datasets — F1-score and recall matter more
- **class_weight='balanced'** is essential when minority class is only 4.84%
- **stratify=y** in train/test split ensures both sets maintain the same class ratio
- **SVM coefficients** provide direct model explainability — no black box
- **Recall > Precision** in scam detection — missing a scam is worse than a false alarm

---

## 🔮 Future Improvements

- [ ] Deploy backend on Render.com
- [ ] Deploy frontend on Vercel
- [ ] Add more hand-crafted features (sentiment analysis, grammar error detection)
- [ ] Train on larger dataset from PhishTank / LinkedIn scraping
- [ ] Add bulk CSV upload for enterprise use
- [ ] SMOTE for synthetic minority oversampling

---

## 👨‍💻 Author

**Khushal Patil**
- LinkedIn: [khushalcodess](https://linkedin.com/in/khushalcodess)
- GitHub: [khushalcodes](https://github.com/khushalcodess)

---

*Built as an AI & ML internship portfolio project — demonstrating the full ML lifecycle from EDA to deployment.*
