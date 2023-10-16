import React from "react";
import "./index.css";
import Todos from "./todos.json";
import { config } from "./config";

const App = () => {
	const todoRef = React.useRef(null);
	const [todos, setTodos] = React.useState(
		config.useJsonFileForTodos ? Todos.todoList : []
	);

	const onFormSubmit = (e) => {
		e.preventDefault();

		const todo = todoRef.current.value;
		if (todo.trim().length > 0) {
			setTodos((prevTodo) => [
				...prevTodo,
				{ title: todo, isCompleted: false },
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
	return (
		<div className="w-3/4 mx-auto">
			<h1 className="text-slate-900 font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white mb-8">
				Todos
			</h1>
			<InputField onFormSubmit={onFormSubmit} ref={todoRef} />
			<TodoList todos={todos} handleCheckboxToggle={handleCheckboxToggle} />
		</div>
	);
};

const InputField = React.forwardRef((props, ref) => {
	const { onFormSubmit } = props;
	return (
		<form onSubmit={onFormSubmit}>
			<input
				type="text"
				name="task"
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 mx-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
				placeholder="What task needs to be completed?"
				ref={ref}
			/>
		</form>
	);
});

const TodoList = ({ todos, handleCheckboxToggle }) => {
	return (
		<ol className="w-1/2 mx-auto mt-8">
			{todos.map((todo, todoIdx) => {
				return (
					<li
						key={`${todo.title}-${todoIdx}`}
						className="h-16 border-b border-gray-200 dark:border-gray-800 p-8"
					>
						<input
							id={`${todo.title}-${todoIdx}`}
							type="checkbox"
							defaultValue=""
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
							onChange={() => handleCheckboxToggle(todoIdx)}
						/>
						<label
							htmlFor={`${todo.title}-${todoIdx}`}
							className={`ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${
								todo.isCompleted ? "line-through" : ""
							}`}
						>
							{todo.title}
						</label>
					</li>
				);
			})}
		</ol>
	);
};

export default App;
