# openclaw-test3

ヘルスチェック API (Node.js) の実装。

## Endpoints

- `GET /health`
- `GET /api/health`

## Response format

成功:

```json
{
  "data": {
    "status": "ok",
    "service": "health-api",
    "timestamp": "2025-03-20T00:00:00.000Z"
  }
}
```

失敗:

```json
{ "error": { "code": "...", "message": "..." } }
```

## Setup

```bash
cp .env.example .env
npm install
npm start
```
