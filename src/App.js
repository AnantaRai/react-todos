import React, { useState, useRef } from "react";

const App = () => {
	const todoRef = useRef(null);
	const [todos, setTodos] = useState([]);

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
	return (
		<div>
			<h1>Todos</h1>
			<InputField onFormSubmit={onFormSubmit} todoRef={todoRef} />
			<TodoList todos={todos} />
		</div>
	);
};

const InputField = ({ onFormSubmit, todoRef }) => {
	return (
		<form onSubmit={onFormSubmit}>
			<input
				type="text"
				name="task"
				placeholder="What task needs to be completed?"
				ref={todoRef}
			/>
		</form>
	);
};

const TodoList = ({ todos }) => {
	return (
		<ol>
			{todos.map((todo) => {
				return (
					<li>
						{todo.title} <br />
						<strong>Status:</strong>
						{todo.isCompleted ? "Completed" : "Pending"}
						<hr />
					</li>
				);
			})}
		</ol>
	);
};

export default App;
