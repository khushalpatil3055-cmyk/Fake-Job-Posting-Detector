import { useState } from 'react';

const styles = {
  body: {
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: '40px 16px',
  },
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  badge: {
    display: 'inline-block',
    background: '#eef2ff',
    color: '#4f46e5',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    padding: '4px 14px',
    borderRadius: '20px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  divider: {
    height: '1px',
    background: '#f0f0f0',
    margin: '24px 0',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    letterSpacing: '0.3px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a1a2e',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    lineHeight: '1.6',
    transition: 'border-color 0.2s',
  },
  checkboxRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '500',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#4f46e5',
    cursor: 'pointer',
  },
  selectGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '28px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#374151',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    transition: 'background 0.2s',
  },
  buttonLoading: {
    width: '100%',
    padding: '14px',
    background: '#a5b4fc',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'not-allowed',
    letterSpacing: '0.5px',
  },
  resultFake: {
    marginTop: '24px',
    padding: '24px',
    background: '#fff5f5',
    border: '1.5px solid #fca5a5',
    borderRadius: '12px',
    textAlign: 'center',
  },
  resultReal: {
    marginTop: '24px',
    padding: '24px',
    background: '#f0fdf4',
    border: '1.5px solid #86efac',
    borderRadius: '12px',
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: '20px',
    fontWeight: '800',
    margin: '0 0 8px',
  },
  resultScore: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 16px',
  },
  scoreBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
    fontSize: '12px',
    color: '#9ca3af',
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '10px',
    letterSpacing: '0.3px',
  },
};

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    telecommuting: 0,
    has_logo: 0,
    has_questions: 0,
    employment_type: 'Unknown',
    experience: 'Unknown',
    education: 'Unknown',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit() {
    if (!formData.text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Error connecting to backend. Make sure FastAPI is running.');
    }
    setLoading(false);
  }

  const confidenceLabel = (score) => {
    const abs = Math.abs(score);
    if (abs > 2) return 'Very High';
    if (abs > 1) return 'High';
    if (abs > 0.5) return 'Moderate';
    return 'Low';
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>AI + ML POWERED</div>
          <h1 style={styles.title}>Fake Job Posting Detector</h1>
          <p style={styles.subtitle}>
            Paste any job posting below and our ML model will analyze it instantly
          </p>
        </div>

        <div style={styles.divider} />

        {/* Text Input */}
        <label style={styles.label}>Job Posting Text</label>
        <textarea
          name="text"
          placeholder="Paste job title + description + requirements here..."
          rows={7}
          style={styles.textarea}
          onChange={handleChange}
        />

        <div style={{ height: '20px' }} />

        {/* Checkboxes */}
        <div style={styles.sectionLabel}>Job Details</div>
        <div style={styles.checkboxRow}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" style={styles.checkbox}
              onChange={(e) => setFormData({ ...formData, telecommuting: e.target.checked ? 1 : 0 })}
            />
            Remote / Telecommuting
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" style={styles.checkbox}
              onChange={(e) => setFormData({ ...formData, has_logo: e.target.checked ? 1 : 0 })}
            />
            Has Company Logo
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" style={styles.checkbox}
              onChange={(e) => setFormData({ ...formData, has_questions: e.target.checked ? 1 : 0 })}
            />
            Has Screening Questions
          </label>
        </div>

        {/* Dropdowns */}
        <div style={styles.selectGrid}>
          <div>
            <div style={styles.sectionLabel}>Employment Type</div>
            <select name="employment_type" style={styles.select} onChange={handleChange}>
              <option value="Unknown">Unknown</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <div style={styles.sectionLabel}>Experience Level</div>
            <select name="experience" style={styles.select} onChange={handleChange}>
              <option value="Unknown">Unknown</option>
              <option value="Entry level">Entry level</option>
              <option value="Mid-Senior level">Mid-Senior</option>
              <option value="Director">Director</option>
              <option value="Executive">Executive</option>
              <option value="Internship">Internship</option>
              <option value="Associate">Associate</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>
          </div>
          <div>
            <div style={styles.sectionLabel}>Education</div>
            <select name="education" style={styles.select} onChange={handleChange}>
              <option value="Unknown">Unknown</option>
              <option value="Bachelor's Degree">Bachelor's</option>
              <option value="Master's Degree">Master's</option>
              <option value="High School or equivalent">High School</option>
              <option value="Certification">Certification</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Vocational">Vocational</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={loading ? styles.buttonLoading : styles.button}
        >
          {loading ? 'Analyzing...' : '🔍 Analyze Job Posting'}
        </button>

        {/* Result */}
        {result && (
          <div style={result.is_fake ? styles.resultFake : styles.resultReal}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>
              {result.is_fake ? '🚨' : '✅'}
            </div>
            <div style={{
              ...styles.resultTitle,
              color: result.is_fake ? '#dc2626' : '#16a34a'
            }}>
              {result.is_fake ? 'FAKE JOB DETECTED' : 'LOOKS LIKE A REAL JOB'}
            </div>
            <p style={styles.resultScore}>
              Model confidence: {confidenceLabel(result.confidence_score)}
            </p>
            <span style={{
              ...styles.scoreBadge,
              background: result.is_fake ? '#fee2e2' : '#dcfce7',
              color: result.is_fake ? '#dc2626' : '#16a34a',
            }}>
              Score: {result.confidence_score.toFixed(2)}
            </span>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          Built with Python · Scikit-learn · SVM · FastAPI · React
        </div>

      </div>
    </div>
  );
}