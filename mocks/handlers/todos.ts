// mocks/handlers/todos.ts
import { http, HttpResponse } from 'msw';
import { todos as mockTodos } from '../data/todos';
import { MockTodoListProps, TodoPayload } from '@/types/todos';

let todos = [...mockTodos];

export const todosHandlers = [
  // GET todos
  http.get('/api/todos', () => {
    return HttpResponse.json(todos);
  }),

  // POST todo
  http.post('/api/todos', async ({ request }) => {
    const body = (await request.json()) as TodoPayload<'POST'>;
    const currentTime = new Date().toISOString();
    const newTodo: MockTodoListProps = {
      id: `todo-${Date.now()}`,
      createdTime: currentTime,
      updateTime: currentTime,
      ...body,
    };
    todos.push(newTodo);
    return HttpResponse.json(newTodo, { status: 200 });
  }),

  // PUT todo
  http.put('/api/todos', async ({ request }) => {
    const body = (await request.json()) as TodoPayload<'PUT'>;

    // Toggle bool
    if ('id' in body && 'bool' in body) {
      todos = todos.map((todo) =>
        todo.id === body.id ? { ...todo, bool: body.bool } : todo,
      );
      return HttpResponse.json(
        { message: 'Todo updated toggle' },
        { status: 200 },
      );
    }

    // Update text and status
    if ('id' in body && 'text' in body && 'status' in body) {
      const currentTime = new Date().toISOString();
      const updatedTodo = todos.find((todo) => todo.id === body.id);
      if (!updatedTodo) {
        return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
      }

      const newTodo = {
        ...updatedTodo,
        text: body.text,
        status: body.status,
        updateTime: currentTime,
      };

      todos = todos.map((todo) => (todo.id === body.id ? newTodo : todo));

      return HttpResponse.json(newTodo, { status: 200 });
    }

    // Restatus
    if (body.type === 'restatus') {
      const { oldStatus, status } = body.data;
      todos = todos.map((todo) =>
        todo.status === oldStatus ? { ...todo, status } : todo,
      );
      return HttpResponse.json(
        { message: 'Todo updated successfully' },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { error: 'Invalid payload: Missing required fields.' },
      { status: 400 },
    );
  }),

  // DELETE todo
  http.delete('/api/todos', async ({ request }) => {
    const body = (await request.json()) as { id: string };
    const { id } = body;

    if (!id) {
      return HttpResponse.json(
        { error: 'TodoDelete is required' },
        { status: 400 },
      );
    }

    todos = todos.filter((todo) => todo.id !== id);
    return HttpResponse.json({ message: 'Todo deleted' }, { status: 200 });
  }),
];
