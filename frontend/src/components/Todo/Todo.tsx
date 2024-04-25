import { useState } from "react";
import type { Todo as TodoType } from "../../types/todo";

interface TodoProps {
  todo: TodoType;
  onChange: (todo: TodoType) => void;
  onDelete: (todo: TodoType) => void;
}

export const Todo = ({ todo, onChange, onDelete }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoEdit, setEditTodo] = useState(todo.todo);

  let todoContent = (
    <>
      <label
        htmlFor={todo.id}
        data-id={todo.id}
        className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
      >
        {todo.todo}
      </label>
      {!todo.completed && (
        <button onClick={() => setIsEditing(true)}>edit</button>
      )}
    </>
  );

  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todoEdit}
          onChange={(e) => setEditTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange({ ...todo, todo: todoEdit });
              setIsEditing(false);
            }
          }}
          onBlur={() => {
            onChange({ ...todo, todo: todoEdit });
            setIsEditing(false);
          }}
        />
        <button
          onClick={() => {
            onChange({ ...todo, todo: todoEdit });
            setIsEditing(false);
          }}
        >
          save
        </button>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center ps-3">
        <input
          id={todo.id}
          type="checkbox"
          checked={todo.completed}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          onChange={(e) => onChange({ ...todo, completed: e.target.checked })}
        />
        {todoContent}
        <button onClick={() => onDelete(todo)}>delete</button>
      </div>
    </>
  );
};
