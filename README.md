# openclaw-test3

ユーザー認証 REST API（Node.js + Express）の実装。

## Features

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/refresh`
- SQLite による users テーブル
- bcrypt によるパスワードハッシュ化
- JWT access / refresh token
- express-validator による入力バリデーション

## Response format

成功:

```json
{ "data": { } }
```

失敗:

```json
{ "error": { "code": "...", "message": "..." } }
```

## Setup

```bash
cp .env.example .env
npm install
npm run db:init
npm start
```
