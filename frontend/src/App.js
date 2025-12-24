import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">女友コレクション</h1>
          <button className="login-btn">ログイン</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">あなたの仲間を見つけよう</h1>
          <p className="hero-subtitle">
            あなたの街で、価値観の合う女性たちとグループ体験を通じて繋がりましょう
          </p>
          <button className="cta-button">始める</button>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>使い方</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>プロフィール作成</h3>
            <p>あなたの興味、性格、スケジュールを教えてください</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>マッチング</h3>
            <p>相性の良い少人数グループをご紹介します</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>実際に会う</h3>
            <p>ガイド付きグループ体験で、lasting friendships を築きましょう</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>フレンドマッチの特徴</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>🎯 厳選されたマッチング</h3>
            <p>あなたの興味や価値観に合った人と出会えます</p>
          </div>
          <div className="feature">
            <h3>👥 少人数グループ</h3>
            <p>深いつながりを作るための親密な集まり</p>
          </div>
          <div className="feature">
            <h3>📅 企画済みイベント</h3>
            <p>計画は私たちにお任せ、あなたは交流に集中できます</p>
          </div>
          <div className="feature">
            <h3>🌟 安心な空間</h3>
            <p>女性が友情を築くための温かいコミュニティ</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <h2>あなたの仲間を見つける準備はできましたか？</h2>
        <button className="cta-button">今すぐ参加</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 フレンドマッチ. Built with ❤️</p>
      </footer>
    </div>
  );
}

export default App;