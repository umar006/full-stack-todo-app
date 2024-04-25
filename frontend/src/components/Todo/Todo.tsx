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
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="font-bold text-center uppercase transition-all text-xs my-4 mx-2 py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            edit
          </button>
        </div>
      )}
    </>
  );

  if (isEditing) {
    todoContent = (
      <div className="flex my-4 ml-2 w-full space-x-2">
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
          className="w-full flex-1 border border-slate-400 rounded-md py-3 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
        />
        <button
          onClick={() => {
            onChange({ ...todo, todo: todoEdit });
            setIsEditing(false);
          }}
          className="font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
        >
          save
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center">
        <input
          id={todo.id}
          type="checkbox"
          checked={todo.completed}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          onChange={(e) => onChange({ ...todo, completed: e.target.checked })}
        />
        {todoContent}
        <button
          onClick={() => onDelete(todo)}
          className="rounded-lg border border-gray-900 my-4 py-3 px-6 text-center text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
        >
          delete
        </button>
      </div>
    </>
  );
};
