# MCP Time Server

現在の日時を様々なフォーマットで取得するMCPサーバー

## セットアップ

### 1. ビルド

```bash
npm install
npm run build
```

### 2. Claude Desktop設定

Claude Desktopの設定ファイル（`claude_desktop_config.json`）にサーバーを追加します：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "time-server": {
      "command": "node",
      "args": ["/path/to/time-ts-mcp/dist/app/index.js"],
      "env": {}
    }
  }
}
```

### 3. Claude Desktopの再起動

設定を反映させるためにClaude Desktopを再起動してください。

### 4. 使用確認

Claude Desktopで以下のようにツールが使用できるようになります：

```
現在の東京時間を教えて
```

```
ニューヨーク時間をRFC形式で表示して
```

## 機能

### getCurrentTime ツール

現在の日時を指定されたタイムゾーンとフォーマットで取得します。

#### パラメータ

- `timezone` (string, optional): タイムゾーン (デフォルト: "Asia/Tokyo")
- `format` (string, optional): フォーマット形式 - "iso" | "rfc" | "custom" (デフォルト: "iso")
- `customFormat` (string, optional): カスタムフォーマット文字列 (デフォルト: "YYYY-MM-DD HH:mm:ss")

#### フォーマット形式

- **iso**: ISO 8601形式 (例: 2025-06-18T15:30:45+09:00)
- **rfc**: RFC 2822形式 (例: Wed, Jun 18, 2025, 15:30:45 GMT+9)
- **custom**: カスタムフォーマット (YYYY, MM, DD, HH, mm, ss のトークンを使用)

#### 使用例

```json
{
  "timezone": "America/New_York",
  "format": "iso"
}
```

```json
{
  "timezone": "UTC",
  "format": "custom",
  "customFormat": "YYYY/MM/DD HH:mm"
}
```

