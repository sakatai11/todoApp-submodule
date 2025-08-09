/**
 * 開発環境用エクスポートデータ
 * エミュレータに初回アクセスする際の開発用Firebaseデータ
 */

import { UserData } from '@/types/auth/authData';
import { TodoListProps } from '@/types/todos';
import { StatusListProps } from '@/types/lists';
import { Timestamp } from 'firebase-admin/firestore';

// 開発アカウント情報
export const DEV_ACCOUNTS = [
  {
    email: 'dev.user@todoapp.com',
    password: 'devpassword123',
  },
  {
    email: 'developer@example.com',
    password: 'devpassword123',
  },
  {
    email: 'dev.admin@todoapp.com',
    password: 'devpassword123',
  },
];

// 開発用ユーザーデータ
export const EXPORTED_USERS: UserData[] = [
  {
    id: 'dev-user-1',
    email: 'dev.user@todoapp.com',
    name: 'Dev User',
    role: 'USER',
    createdAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
  },
  {
    id: 'dev-user-2',
    email: 'developer@example.com',
    name: 'Developer Sample',
    role: 'USER',
    createdAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
  },
  {
    id: 'dev-admin-1',
    email: 'dev.admin@todoapp.com',
    name: 'Dev Admin',
    role: 'ADMIN',
    createdAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
  },
];

// 開発用Todoデータ（本番Firestore構造: /users/{userId}/todos/{todoId}）
export const EXPORTED_TODOS_BY_USER: Record<string, TodoListProps[]> = {
  'dev-user-1': [
    {
      id: 'dev-todo-1',
      text: 'プロジェクトセットアップ',
      status: 'done',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-todo-2',
      text: 'APIエンドポイントの実装',
      status: 'in-progress',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-todo-3',
      text: 'ユニットテストの作成',
      status: 'todo',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-todo-4',
      text: 'フロントエンドコンポーネント開発',
      status: 'in-progress',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-todo-5',
      text: 'レスポンシブデザインの調整',
      status: 'todo',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
  ],
  'dev-user-2': [
    {
      id: 'dev-sample-todo-1',
      text: 'Docker環境のセットアップ',
      status: 'done',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-sample-todo-2',
      text: 'Firebase Emulatorの設定',
      status: 'done',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-sample-todo-3',
      text: '統合テストの実行',
      status: 'in-progress',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-sample-todo-4',
      text: 'ドキュメント作成',
      status: 'todo',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
  ],
  'dev-admin-1': [
    {
      id: 'dev-admin-todo-1',
      text: 'システム要件定義',
      status: 'done',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-admin-todo-2',
      text: 'データベース設計',
      status: 'done',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-admin-todo-3',
      text: 'セキュリティ監査',
      status: 'in-progress',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-admin-todo-4',
      text: 'デプロイメント戦略策定',
      status: 'todo',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-admin-todo-5',
      text: 'パフォーマンステスト計画',
      status: 'todo',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'dev-admin-todo-6',
      text: 'ユーザーアクセス権限設定',
      status: 'in-progress',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
  ],
};

// 開発用リストデータ（本番Firestore構造: /users/{userId}/lists/{listId}）
export const EXPORTED_LISTS_BY_USER: Record<string, StatusListProps[]> = {
  'dev-user-1': [
    {
      id: 'dev-list-1-user',
      category: 'todo',
      number: 1,
    },
    {
      id: 'dev-list-2-user',
      category: 'in-progress',
      number: 2,
    },
    {
      id: 'dev-list-3-user',
      category: 'done',
      number: 3,
    },
  ],
  'dev-user-2': [
    {
      id: 'dev-list-1-sample',
      category: 'todo',
      number: 1,
    },
    {
      id: 'dev-list-2-sample',
      category: 'in-progress',
      number: 2,
    },
    {
      id: 'dev-list-3-sample',
      category: 'done',
      number: 3,
    },
  ],
  'dev-admin-1': [
    {
      id: 'dev-list-1-admin',
      category: 'todo',
      number: 1,
    },
    {
      id: 'dev-list-2-admin',
      category: 'in-progress',
      number: 2,
    },
    {
      id: 'dev-list-3-admin',
      category: 'done',
      number: 3,
    },
  ],
};

// ユーザーIDでデータを取得するヘルパー関数（本番Firestore構造対応）
export const getTodosByUserId = (userId: string): TodoListProps[] => {
  return EXPORTED_TODOS_BY_USER[userId] || [];
};

export const getListsByUserId = (userId: string): StatusListProps[] => {
  return EXPORTED_LISTS_BY_USER[userId] || [];
};