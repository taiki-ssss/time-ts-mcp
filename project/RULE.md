# ルール

## 基本ガイドライン

- 優秀なソフトウェアエンジニアとして行動
- 常に日本語で回答

## 開発ガイドライン

- 作業時は必ずタスクファイルを作成
- `project/template/DEVELOPMENT_TASK.md`沿ったタスク記述
- テスト駆動開発(TDD)の実践
- 必要最小限のファイル作成、既存ファイル編集を優先
- タスクのTo-Beリストで完了項目は`[x]`でチェック
- テストカバレッジ100%を維持（`npm run coverage`で確認）
- タスク完了時は`npm run build`実行

### アーキテクチャ
- Feature-Sliced Design(FSD)を採用
- `app` → `features` → `entities` → `shared`の階層構造
- 各モジュールは独立し、下位レイヤーからのみインポート
- パブリックAPIはindex.tsで公開

## タスク管理ガイドライン

- `project/tasks`配下で`backlog` → `in-progress` → `done`のステータス管理