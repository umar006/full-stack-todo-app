export interface Todo {
  id: string;
  todo: string;
  completed: boolean;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface NewTodo extends Pick<Todo, "todo"> {}
export interface UpdateTodo extends Pick<Todo, "id" | "todo" | "completed"> {}
export interface DeleteTodo extends Pick<Todo, "id"> {}
