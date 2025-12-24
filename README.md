# FriendMatch - 女性限定IRL友達マッチングアプリ

東京で新しい友達を作るための、安全で信頼できる少人数グループマッチングプラットフォームです。

## 🎯 プロジェクト概要

FriendMatchは、女性限定のIRL（対面）友達マッチングアプリのMVP（最小実用製品）です。RealRootsや222にインスパイアされ、安全性と日本の文化的規範を最優先に設計されています。

### 主な特徴

- 👥 **少人数グループマッチング**: 4〜6人の相性の良いグループを自動生成
- 🔒 **安全第一**: 本人確認必須、通報機能、チェックイン/アウト機能
- 🎌 **日本最適化**: 日本語UI、日本の文化的配慮（静かモード、エチケットルール）
- 📅 **6週間コホート制**: 週1回の集まりで徐々に仲を深める
- 🏙️ **東京エリア対応**: 新宿、渋谷、恵比寿、吉祥寺など
- 💬 **グループチャット**: イベント確定後、ロジスティクス用のチャット解放
- ⭐ **フィードバックシステム**: イベント後の評価と継続希望の確認

## 🚀 クイックスタート

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/eneco-corporate/matcing_apps.git
cd matcing_apps

# 2. 依存関係をインストール
npm install

# 3. Prismaクライアントを生成
npm run db:generate

# 4. データベースを作成
npm run db:push

# 5. サンプルデータを投入
npm run db:seed

# 6. 開発サーバーを起動
npm run dev
```

### ブラウザでアクセス

```
http://localhost:3000
```

### テストアカウント

**一般ユーザー（認証済み、グループあり）:**
- メール: `yuki@example.com`
- パスワード: `password123`
- 所属: 渋谷カフェ好きコホート

**管理者:**
- メール: `admin@friendmatch.app`
- パスワード: `admin123`
- アクセス: 管理パネル（`/admin`）

**その他のユーザー（全員パスワード: `password123`）:**
- `sakura@example.com`
- `haruka@example.com`
- `mio@example.com`
- `aoi@example.com`

## 📚 主要機能

### 1. 認証システム

**2つの認証方法:**
- ✅ メールアドレス＋パスワード
- ✅ マジックリンク（メール送信）

**セキュリティ:**
- bcryptによるパスワードハッシュ化
- HTTP-onlyセッションcookie
- CSRF保護（SameSite cookie）
- セッション有効期限30日

### 2. マルチステップオンボーディング

**4ステップのプロフィール作成:**

1. **基本情報** - ニックネーム、生まれ年、自己紹介
2. **興味・趣味** - 最大5つまで選択可能（カフェ巡り、ヨガ、読書など）
3. **ライフスタイル** - 会話の深さ、お酒・喫煙の可否、静かモード
4. **マッチング設定** - 希望年齢層、エリア、参加可能時間帯

### 3. 本人確認システム

- 📸 身分証明書のアップロード
- 🤳 自撮り写真のアップロード
- ⏳ 管理者による審査（1-2営業日）
- ✅ 認証済みユーザーのみイベント参加可能

### 4. マッチングアルゴリズム

**相性スコアリング（0-100点）:**
- 年齢の相性: 20点
- エリアの重複: 15点
- 時間帯の重複: 15点
- 興味の重複: 20点
- ライフスタイル: 15点
- 静かモード: 10点
- 境界線の尊重: 5点

**グループ形成:** 4〜6人、最低スコア30点

### 5. イベント管理

- 📅 6週間のコホートシステム
- 💡 会話のきっかけプロンプト
- 👥 RSVP機能
- ✅ チェックイン/チェックアウト

### 6. 安全機能

- 本人確認必須
- 通報機能
- コミュニティガイドライン
- チェックイン/アウト機能

## 🗄️ データベース構造

### 16のデータモデル

**ユーザー関連:**
- User, Profile, Verification, Preference

**グループ関連:**
- Group, GroupMember

**イベント関連:**
- Event, RSVP

**コミュニケーション:**
- ChatThread, Message, PromptCard, EventPromptAssignment

**安全・フィードバック:**
- Feedback, Report, AdminAuditLog

**その他:**
- MagicLink, Waitlist

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes, Prisma, SQLite
- **認証**: カスタムJWT + マジックリンク
- **メール**: Nodemailer

## 📁 プロジェクト構造

```
matcing_apps/
├── src/
│   ├── app/              # Next.js App Router（全ページ）
│   ├── components/       # 再利用可能UIコンポーネント
│   └── lib/             # ビジネスロジック（auth, matching, email）
├── prisma/
│   ├── schema.prisma    # データベーススキーマ
│   └── seed.ts          # サンプルデータ
├── public/              # 静的ファイル
└── ドキュメント/         # 7つの詳細ドキュメント
```

## 🔧 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run db:generate  # Prismaクライアント生成
npm run db:push      # データベース作成
npm run db:seed      # サンプルデータ投入
npm run db:studio    # Prisma Studio（DB GUI）起動
```

## 🔒 セキュリティ

### 実装済み
- ✅ bcryptパスワードハッシュ化
- ✅ HTTP-only Cookie
- ✅ CSRF保護
- ✅ SQLインジェクション対策（Prisma）
- ✅ ファイルアップロード検証

### 今後追加予定
- ⚠️ レート制限
- ⚠️ 入力サニタイゼーション
- ⚠️ XSS対策の強化

## 🌍 多言語対応

- **主要言語**: 日本語
- **フォールバック**: 英語
- **日付フォーマット**: ja-JP

## 📱 レスポンシブデザイン

- モバイルファースト設計
- タッチフレンドリー
- ブレークポイント: sm(640px), md(768px), lg(1024px)

## 🚀 デプロイ

### 開発環境
SQLiteとローカルファイルストレージでそのままデプロイ可能

### 本番環境への移行

1. **データベース**: SQLite → PostgreSQL
   ```bash
   # Supabase, Railway, PlanetScale推奨
   ```

2. **ファイルストレージ**: ローカル → S3/GCS
   ```bash
   # AWS S3, Google Cloud Storage, Cloudflare R2推奨
   ```

3. **メール**: コンソール → SMTP
   ```bash
   # SendGrid, Postmark, AWS SES推奨
   ```

### Vercelデプロイ

```bash
npm install -g vercel
vercel
```

## 🔄 今後の機能

### 近日中
- リアルタイムチャット
- フィードバックシステムUI
- 通報フロー完成

### 中期的
- 💳 決済統合（Stripe）
- 🔔 プッシュ通知
- 📊 分析ダッシュボード

### 長期的
- 🤖 ML ベースマッチング
- 🌏 他都市展開
- 📱 モバイルアプリ

## 🐛 既知の制限事項（MVP）

1. メール: 開発環境ではコンソール出力のみ
2. ファイルストレージ: ローカルファイルシステム
3. マッチング: 手動トリガーのみ
4. 決済: 未実装
5. リアルタイムチャット: ページ更新必要

## 📞 サポート

### ドキュメント
- [クイックスタート](QUICKSTART.md) - 5分で起動
- [セットアップガイド](SETUP.md) - 詳細な設定
- [アーキテクチャ](ARCHITECTURE.md) - 技術解説
- [プロジェクト概要](PROJECT_SUMMARY.md) - 完成状況

### トラブルシューティング

**ポート3000が使用中:**
```bash
lsof -ti:3000 | xargs kill -9
```

**データベースエラー:**
```bash
rm -rf node_modules prisma/dev.db
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

## 🎓 学習リソース

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Prisma ガイド](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🎯 プロジェクト統計

- **総ファイル数**: 50+
- **コード行数**: 8,000+
- **ドキュメント**: 25,000+ 語
- **データベースモデル**: 16
- **APIルート**: 15+
- **UIコンポーネント**: 10+

## 🌟 特徴

### アーキテクチャ
- ✨ 100% TypeScript - 完全な型安全性
- 🏗️ モジュラー設計 - 再利用可能なコンポーネント
- 📝 完全ドキュメント化 - すべての関数にコメント
- 🔒 セキュリティ優先 - 認証・認可を基盤に設計

### ビジネス価値
- 💰 低コスト - 無料ツールでMVP構築
- ⚡ 高速開発 - 20時間で完全なMVP
- 📈 スケーラブル - 簡単にPostgreSQL/クラウド移行可能
- 🔧 拡張性 - 新機能追加が容易

## 📄 ライセンス

Proprietary - All rights reserved

---

**FriendMatchで、東京に新しい友情の輪を広げましょう！** 🎊

安全で、楽しく、本物のつながりを。
