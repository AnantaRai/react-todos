import React, { forwardRef, useRef, useState } from "react";
import "./index.css";
import Todos from "./todos.json";
import { config } from "./config";

const App = () => {
	const todoRef = useRef(null);
	const editTodoRef = useRef(null);

	const [todos, setTodos] = useState(
		config.useJsonFileForTodos ? Todos.todoList : []
	);

	const [displayMode, setDisplayMode] = useState({
		all: true,
		completed: false,
		remaining: false,
	});

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

	const handleDelete = (todoIdx) => {
		if (todos[todoIdx] !== "undefined") {
			setTodos(todos.filter((_, idx) => idx !== todoIdx));
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
		} else if (e.key === "Enter") {
			const editedTodo = e.target.value;
			if (editedTodo.trim().length > 0) {
				setTodos(
					todos.map((todo, idx) =>
						idx === todoIdx
							? { ...todo, title: e.target.value, isEditing: false }
							: todo
					)
				);
			}
		}
	};

	const handleDisplayModeChange = (mode) => {
		if (displayMode.hasOwnProperty(mode)) {
			switch (mode) {
				case "all":
					setDisplayMode({
						all: true,
						completed: false,
						remaining: false,
					});
					break;
				case "completed":
					setDisplayMode({
						all: false,
						completed: true,
						remaining: false,
					});
					break;
				case "remaining":
					setDisplayMode({
						all: false,
						completed: false,
						remaining: true,
					});
					break;
			}
		}
	};
	return (
		<div className="container">
			<h1 className="todo-title">Todos</h1>
			<InputField onFormSubmit={onFormSubmit} ref={todoRef} />
			<div className="flex justify-center items-center my-4">
				{Object.keys(displayMode).map((mode) => {
					return (
						<span
							key={mode}
							className={`inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ${
								displayMode[mode] ? "text-green-500" : "text-gray-600"
							}  ring-1 ring-inset ${
								displayMode[mode] ? "ring-green-500" : "ring-gray-500/10"
							}  mr-4 hover:cursor-pointer`}
							onClick={() => handleDisplayModeChange(mode)}
						>
							{mode.toUpperCase()}
						</span>
					);
				})}
			</div>

			<TodoList
				todos={todos}
				handleCheckboxToggle={handleCheckboxToggle}
				ref={editTodoRef}
				handleEditMode={handleEditMode}
				handleFocusOut={handleFocusOut}
				handleKeyDown={handleKeyDown}
				handleDelete={handleDelete}
				displayMode={displayMode}
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
		handleDelete,
		displayMode,
	} = props;
	return (
		<ol className="todo-list">
			{displayMode.all &&
				todos.map((todo, todoIdx) => {
					return (
						<li key={`${todo.title}-${todoIdx}`} className="todo-list-item">
							{!todo.isEditing && (
								<div className="flex justify-between items-center">
									<div>
										<input
											id={`${todo.title}-${todoIdx}`}
											type="checkbox"
											className="todo-check-box"
											checked={todo.isCompleted ? "checked" : ""}
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
									<div className="flex">
										<span
											className="hover:cursor-pointer mr-2"
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
										<span
											className="hover:cursor-pointer ml-2"
											onClick={() => handleDelete(todoIdx)}
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
													d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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

			{displayMode.completed &&
				todos.map((todo, todoIdx) => {
					if (todo.isCompleted) {
						return (
							<li key={`${todo.title}-${todoIdx}`} className="todo-list-item">
								{!todo.isEditing && (
									<div className="flex justify-between items-center">
										<div>
											<input
												id={`${todo.title}-${todoIdx}`}
												type="checkbox"
												className="todo-check-box"
												checked={todo.isCompleted ? "checked" : ""}
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
										<div className="flex">
											<span
												className="hover:cursor-pointer mr-2"
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
											<span
												className="hover:cursor-pointer ml-2"
												onClick={() => handleDelete(todoIdx)}
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
														d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
					}
				})}

			{displayMode.remaining &&
				todos.map((todo, todoIdx) => {
					if (!todo.isCompleted) {
						return (
							<li key={`${todo.title}-${todoIdx}`} className="todo-list-item">
								{!todo.isEditing && (
									<div className="flex justify-between items-center">
										<div>
											<input
												id={`${todo.title}-${todoIdx}`}
												type="checkbox"
												className="todo-check-box"
												checked={todo.isCompleted ? "checked" : ""}
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
										<div className="flex">
											<span
												className="hover:cursor-pointer mr-2"
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
											<span
												className="hover:cursor-pointer ml-2"
												onClick={() => handleDelete(todoIdx)}
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
														d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
					}
				})}
		</ol>
	);
});

export default App;
