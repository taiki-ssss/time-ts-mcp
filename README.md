# MCP Server テンプレート

Claude Codeで開発する用のMCPサーバーテンプレート

## ディレクトリ構造

```
mcp-template/
  ├── CLAUDE.md                      # Claude Memoryに保存される
  ├── README.md
  ├── package.json
  ├── tsconfig.json
  ├── eslint.config.mjs
  ├── vitest.config.ts
  ├── coverage/                      # テストカバレッジレポート
  ├── dist/                          # ビルド成果物
  ├── project/                       # プロジェクト管理
  │   ├── RULE.md                    # プロジェクトルール
  │   ├── TECK_STACK.md              # 技術スタック
  │   ├── requirements-definition.md # 要件定義書
  │   ├── references                 # 参考資料
  │   ├── tasks/                     # タスク管理
  │   │   ├── backlog/               # 未着手課題
  │   │   ├── in-progress/           # 着手中課題
  │   │   └── done/                  # 完了課題
  │   └── template/                  # タスクテンプレート
  └── src/                 # FSDアーキテクチャ
      ├── app/             # アプリケーション層
      ├── features/        # 機能層
      ├── entities/        # エンティティ層
      └── shared/          # 共有層
          └── lib/
```

## カスタムコマンド

- `/project:rule`: プロジェクトのルールをに確認する
- `/project:task`: タスクの件数を確認する

## 参考リンク

- [Claude Code Manage permissions](https://docs.anthropic.com/en/docs/claude-code/security)
- [built our multi-agent research system](https://www.anthropic.com/engineering/built-multi-agent-research-system)
- [Feature-Sliced Design](https://feature-sliced.github.io/documentation/)