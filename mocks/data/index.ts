// mocks/data/index.ts
import { lists } from './lists';
import { todos } from './todos';
import { mockUser } from './user';

//dashboard data
export const contents = {
  todos,
  lists,
};

//user data
export const user = mockUser;

// E2Eテスト用のエクスポート
export const mockTodos = todos;
export const mockLists = lists;
export { mockUser };
