import React, { useState } from 'react';
import './Signup.css';

function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    interests: [],
    personality: {
      introvert_extrovert: 50,
      active_relaxed: 50,
      spontaneous_planner: 50
    },
    availability: []
  });

  const interestOptions = [
    'カフェ巡り', 'アウトドア', '読書', '映画', '料理',
    'ヨガ', 'ショッピング', 'アート', '音楽', '旅行',
    'スポーツ', 'ゲーム', '写真', '美容', 'ボランティア'
  ];

  const availabilityOptions = [
    '平日の朝', '平日の昼', '平日の夜',
    '週末の朝', '週末の昼', '週末の夜'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interest) => {
    const interests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({ ...formData, interests });
  };

  const handleAvailabilityToggle = (time) => {
    const availability = formData.availability.includes(time)
      ? formData.availability.filter(t => t !== time)
      : [...formData.availability, time];
    
    setFormData({ ...formData, availability });
  };

  const handleSliderChange = (trait, value) => {
    setFormData({
      ...formData,
      personality: {
        ...formData.personality,
        [trait]: value
      }
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('プロフィール作成完了！マッチングを開始します。');
    // Here you would send data to backend
  };

  return (
    <div className="signup-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      <div className="signup-card">
        <h2>プロフィール作成</h2>
        <p className="step-indicator">ステップ {step} / 4</p>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="form-step">
            <h3>基本情報</h3>
            <div className="form-group">
              <label>お名前</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="山田花子"
              />
            </div>
            <div className="form-group">
              <label>年齢</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="25"
              />
            </div>
            <div className="form-group">
              <label>お住まいの地域</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="東京都渋谷区"
              />
            </div>
            <button className="next-btn" onClick={nextStep}>次へ</button>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="form-step">
            <h3>興味・趣味</h3>
            <p className="subtitle">当てはまるものを選んでください（複数選択可）</p>
            <div className="interest-grid">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  className={`interest-btn ${formData.interests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="button-group">
              <button className="back-btn" onClick={prevStep}>戻る</button>
              <button className="next-btn" onClick={nextStep}>次へ</button>
            </div>
          </div>
        )}

        {/* Step 3: Personality */}
        {step === 3 && (
          <div className="form-step">
            <h3>性格・好み</h3>
            <p className="subtitle">あなたに近い方を選んでください</p>
            
            <div className="slider-group">
              <div className="slider-labels">
                <span>内向的</span>
                <span>外向的</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.personality.introvert_extrovert}
                onChange={(e) => handleSliderChange('introvert_extrovert', e.target.value)}
              />
            </div>

            <div className="slider-group">
              <div className="slider-labels">
                <span>アクティブ</span>
                <span>のんびり</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.personality.active_relaxed}
                onChange={(e) => handleSliderChange('active_relaxed', e.target.value)}
              />
            </div>

            <div className="slider-group">
              <div className="slider-labels">
                <span>自然体</span>
                <span>計画的</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.personality.spontaneous_planner}
                onChange={(e) => handleSliderChange('spontaneous_planner', e.target.value)}
              />
            </div>

            <div className="button-group">
              <button className="back-btn" onClick={prevStep}>戻る</button>
              <button className="next-btn" onClick={nextStep}>次へ</button>
            </div>
          </div>
        )}

        {/* Step 4: Availability */}
        {step === 4 && (
          <div className="form-step">
            <h3>空き時間</h3>
            <p className="subtitle">参加可能な時間帯を選んでください（複数選択可）</p>
            <div className="availability-grid">
              {availabilityOptions.map(time => (
                <button
                  key={time}
                  className={`availability-btn ${formData.availability.includes(time) ? 'selected' : ''}`}
                  onClick={() => handleAvailabilityToggle(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="button-group">
              <button className="back-btn" onClick={prevStep}>戻る</button>
              <button className="submit-btn" onClick={handleSubmit}>完了</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;