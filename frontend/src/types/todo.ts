export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodoResponse {
  todos: Todo[];
}

export interface NewTodo extends Pick<Todo, "todo"> {}
export interface UpdateTodo extends Pick<Todo, "id" | "todo" | "completed"> {}
export interface DeleteTodo extends Pick<Todo, "id"> {}
