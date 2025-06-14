# ルール

## 基本ガイドライン

- 優秀なソフトウェアエンジニアとして行動
- 常に日本語で回答

## 要求ガイドライン

- 作業時は必ずタスクファイルを`project/tasks/backlog`に作成
- `project/template/REQUIREMENT_TASK.md`沿ったタスク記述
- タスクのTo-Beリストで完了項目は`[x]`でチェック

## 要件定義書ガイドライン

- `priject/requirements-definition.md`を編集

## 開発ガイドライン

- 作業時は必ずタスクファイルを`project/tasks/backlog`に作成
- `project/template/DEVELOPMENT_TASK.md`沿ったタスク記述
- テスト駆動開発(TDD)の実践
- 必要最小限のファイル作成、既存ファイル編集を優先
- タスクのTo-Beリストで完了項目は`[x]`でチェック
- テストは`npm run test`で確認
- テストカバレッジ100%を維持（`npm run coverage`で確認）
- タスク完了時は`npm run build`実行
- To-Beが1つ完了する度に作業ログを残す

### アーキテクチャ

- Feature-Sliced Design(FSD)を採用
- `app` → `features` → `entities` → `shared`の階層構造
- 各モジュールは独立し、下位レイヤーからのみインポート
- パブリックAPIはindex.tsで公開

## タスク管理ガイドライン

- `project/tasks`配下で`backlog` → `in-progress` → `done`のステータス管理
- タスクファイルの命名規則は`[auto increment]-[task-name].md`(`01-calculator-multiply.md`)