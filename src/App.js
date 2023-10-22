import React, { forwardRef, useRef } from "react";
import "./index.css";
import Todos from "./todos.json";
import { config } from "./config";

const App = () => {
	const todoRef = useRef(null);
	const editTodoRef = useRef(null);

	const [todos, setTodos] = React.useState(
		config.useJsonFileForTodos ? Todos.todoList : []
	);

	const onFormSubmit = (e) => {
		e.preventDefault();

		const todo = todoRef.current.value;
		if (todo.trim().length > 0) {
			setTodos((prevTodo) => [
				...prevTodo,
				{ title: todo, isCompleted: false, isEditing: false },
			]);
			todoRef.current.value = null;
		}
	};

	const handleCheckboxToggle = (todoIdx) => {
		if (todos[todoIdx] !== "undefined") {
			setTodos(
				todos.map((todo, idx) =>
					idx === todoIdx ? { ...todo, isCompleted: !todo.isCompleted } : todo
				)
			);
		}
	};

	const handleEditMode = (todoIdx) => {
		if (todos[todoIdx] !== "undefined") {
			setTodos(
				todos.map((todo, idx) =>
					idx === todoIdx ? { ...todo, isEditing: true } : todo
				)
			);
		}
	};

	const handleFocusOut = (todoIdx) => {
		if (todos[todoIdx] !== "undefined") {
			setTodos(
				todos.map((todo, idx) =>
					idx === todoIdx ? { ...todo, isEditing: false } : todo
				)
			);
		}
	};

	const handleKeyDown = (todoIdx, e) => {
		if (e.key === "Escape") {
			handleFocusOut(todoIdx);
		}
	};
	return (
		<div className="container">
			<h1 className="todo-title">Todos</h1>
			<InputField onFormSubmit={onFormSubmit} ref={todoRef} />
			<TodoList
				todos={todos}
				handleCheckboxToggle={handleCheckboxToggle}
				ref={editTodoRef}
				handleEditMode={handleEditMode}
				handleFocusOut={handleFocusOut}
				handleKeyDown={handleKeyDown}
			/>
		</div>
	);
};

const InputField = forwardRef((props, ref) => {
	const { onFormSubmit } = props;
	return (
		<form onSubmit={onFormSubmit}>
			<input
				type="text"
				name="task"
				className="todo-input"
				placeholder="What task needs to be completed?"
				ref={ref}
			/>
		</form>
	);
});

const TodoList = forwardRef((props, ref) => {
	const {
		todos,
		handleCheckboxToggle,
		handleEditMode,
		handleFocusOut,
		handleKeyDown,
	} = props;
	return (
		<ol className="todo-list">
			{todos.map((todo, todoIdx) => {
				return (
					<li key={`${todo.title}-${todoIdx}`} className="todo-list-item">
						{!todo.isEditing && (
							<div className="flex justify-between items-center">
								<div>
									<input
										id={`${todo.title}-${todoIdx}`}
										type="checkbox"
										className="todo-check-box"
										onChange={() => handleCheckboxToggle(todoIdx)}
									/>
									<label
										htmlFor={`${todo.title}-${todoIdx}`}
										className={`todo-check-box-label ${
											todo.isCompleted ? "line-through" : ""
										}`}
									>
										{todo.title}
									</label>
								</div>
								<div>
									<span
										className="hover:cursor-pointer"
										onClick={() => handleEditMode(todoIdx)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
											/>
										</svg>
									</span>
								</div>
							</div>
						)}

						{todo.isEditing && (
							<input
								type="text"
								name="task"
								ref={ref}
								className="todo-edit-input"
								defaultValue={todo.title}
								onBlur={() => handleFocusOut(todoIdx)}
								autoFocus
								onKeyDown={(e) => handleKeyDown(todoIdx, e)}
							/>
						)}
					</li>
				);
			})}
		</ol>
	);
});

export default App;
