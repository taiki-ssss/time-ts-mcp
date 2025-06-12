# MCP Server Template

Claude Codeで開発する用のMCPサーバーテンプレート

## ディレクトリ構造

```
mcp-template/
  ├── CLAUDE.md                      # プロジェクト指示書
  ├── README.md
  ├── package.json
  ├── tsconfig.json
  ├── vitest.config.ts               # テスト設定
  ├── coverage/                      # テストカバレッジレポート
  ├── dist/                          # ビルド成果物
  ├── project/                       # プロジェクト管理
  │   ├── RULE.md                    # 開発ルール
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
      │   └── calculator/  # 電卓機能
      ├── entities/        # エンティティ層
      └── shared/          # 共有層
          └── lib/
```

## カスタムコマンド

- `/project:rule`: プロジェクトのルールをに確認する
- `/project:task`: タスクの件数を確認する

## 参考リンク

- [Claude Code Manage permissions](https://docs.anthropic.com/en/docs/claude-code/security)
- [Feature-Sliced Design](https://feature-sliced.github.io/documentation/)