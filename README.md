# openclaw-test3

シンプル電卓 API (Node.js) の実装。

## Endpoints

- `GET /health`
- `POST /api/calc`

## Request body

```json
{
  "a": 10,
  "b": 5,
  "operation": "add"
}
```

`operation` は以下のいずれか:
- `add`
- `subtract`
- `multiply`
- `divide`

## Response format

成功:

```json
{ "data": { "a": 10, "b": 5, "operation": "add", "result": 15 } }
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
