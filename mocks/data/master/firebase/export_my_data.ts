/**
 * テスト環境用エクスポートデータ
 * 既存の開発環境からエクスポートしたFirebaseデータ
 */

import { UserData } from '@/types/auth/authData';
import { TodoListProps } from '@/types/todos';
import { StatusListProps } from '@/types/lists';
import { Timestamp } from 'firebase-admin/firestore';

// テストアカウント情報
export const TEST_ACCOUNTS = [
  {
    email: '4244pretty@rowdydow.com',
    password: 'testpassword123',
  },
  {
    email: 'sakai111893@gmail.com',
    password: 'testpassword123',
  },
];

// テスト用ユーザーデータ
export const EXPORTED_USERS: UserData[] = [
  {
    id: 'test-user-1',
    email: '4244pretty@rowdydow.com',
    name: 'Test User 1',
    role: 'USER',
    createdAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
  },
  {
    id: 'test-admin-1',
    email: 'sakai111893@gmail.com',
    name: 'Test Admin',
    role: 'ADMIN',
    createdAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
  },
];

// テスト用Todoデータ（本番Firestore構造: /users/{userId}/todos/{todoId}）
export const EXPORTED_TODOS_BY_USER: Record<string, TodoListProps[]> = {
  'test-user-1': [
    {
      id: 'todo-1',
      text: 'Next.js App Routerの学習',
      status: 'in-progress',
      bool: true,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'todo-2',
      text: 'React Hooksの理解を深める',
      status: 'todo',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'todo-3',
      text: 'TypeScriptの型安全性を活用',
      status: 'done',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
  ],
  'test-admin-1': [
    {
      id: 'todo-4',
      text: 'Firebase Emulatorの設定',
      status: 'in-progress',
      bool: true,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'todo-5',
      text: 'Docker環境の構築',
      status: 'done',
      bool: false,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'todo-6',
      text: '管理者権限のテスト',
      status: 'todo',
      bool: true,
      createdTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
      updateTime: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    },
  ],
};

// テスト用リストデータ（本番Firestore構造: /users/{userId}/lists/{listId}）
export const EXPORTED_LISTS_BY_USER: Record<string, StatusListProps[]> = {
  'test-user-1': [
    {
      id: 'list-1-user',
      category: 'todo',
      number: 1,
    },
    {
      id: 'list-2-user',
      category: 'in-progress',
      number: 2,
    },
    {
      id: 'list-3-user',
      category: 'done',
      number: 3,
    },
  ],
  'test-admin-1': [
    {
      id: 'list-1-admin',
      category: 'todo',
      number: 1,
    },
    {
      id: 'list-2-admin',
      category: 'in-progress',
      number: 2,
    },
    {
      id: 'list-3-admin',
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
