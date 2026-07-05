import pickle
import numpy as np
from scipy.sparse import hstack
import os
import gdown

# Download model files if not present
MODEL_PATH = 'model.pkl'
TFIDF_PATH = 'tfidf.pkl'

if not os.path.exists(MODEL_PATH):
    gdown.download(
        'https://drive.google.com/uc?id=1rohCx84GAxU0TmuYjXEcpdNPkN2FaPCr',
        MODEL_PATH, quiet=False
    )

if not os.path.exists(TFIDF_PATH):
    gdown.download(
        'https://drive.google.com/uc?id=1W3iRqgvAau9IYhdrxLFcYbx_DOOk_bxg',
        TFIDF_PATH, quiet=False
    )

# Load model and tfidf
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

with open(TFIDF_PATH, 'rb') as f:
    tfidf = pickle.load(f)
    
ALL_COLUMNS = ['telecommuting', 'has_company_logo', 'has_questions', 
 'employment_type_Contract', 'employment_type_Full-time', 
 'employment_type_Other', 'employment_type_Part-time', 
 'employment_type_Temporary', 'employment_type_Unknown', 
 'required_experience_Associate', 'required_experience_Director', 
 'required_experience_Entry level', 'required_experience_Executive', 
 'required_experience_Internship', 'required_experience_Mid-Senior level', 
 'required_experience_Not Applicable', 'required_experience_Unknown', 
 'required_education_Associate Degree', "required_education_Bachelor's Degree", 
 'required_education_Certification', 'required_education_Doctorate', 
 'required_education_High School or equivalent', "required_education_Master's Degree", 
 'required_education_Professional', 'required_education_Some College Coursework Completed', 
 'required_education_Some High School Coursework', 'required_education_Unknown', 
 'required_education_Unspecified', 'required_education_Vocational', 
 'required_education_Vocational - Degree', 'required_education_Vocational - HS Diploma']

def predict_job(text, telecommuting, has_logo, has_questions, employment_type, experience, education):
    
    # Step 1: Convert text to TF-IDF numbers
    text_tfidf = tfidf.transform([text])
    
    # Step 2: Create empty array of 31 zeros
    numeric_features = np.zeros(len(ALL_COLUMNS))
    
    # Step 3: Fill in simple yes/no features
    numeric_features[ALL_COLUMNS.index('telecommuting')] = telecommuting
    numeric_features[ALL_COLUMNS.index('has_company_logo')] = has_logo
    numeric_features[ALL_COLUMNS.index('has_questions')] = has_questions
    
    # Step 4: Turn on correct employment type column
    emp_col = f'employment_type_{employment_type}'
    if emp_col in ALL_COLUMNS:
        numeric_features[ALL_COLUMNS.index(emp_col)] = 1
    
    # Step 5: Turn on correct experience column
    exp_col = f'required_experience_{experience}'
    if exp_col in ALL_COLUMNS:
        numeric_features[ALL_COLUMNS.index(exp_col)] = 1
    
    # Step 6: Turn on correct education column
    edu_col = f'required_education_{education}'
    if edu_col in ALL_COLUMNS:
        numeric_features[ALL_COLUMNS.index(edu_col)] = 1
    
    # Step 7: Combine text + numeric features
    final_features = hstack([text_tfidf, numeric_features.reshape(1, -1)])
    
    # Step 8: Predict
    prediction = model.predict(final_features)[0]
    confidence = model.decision_function(final_features)[0]
    
    return {
        'is_fake': bool(prediction),
        'confidence_score': float(confidence)
    }

