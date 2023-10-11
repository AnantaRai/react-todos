import React from "react";

const App = () => {
	const todoRef = React.useRef(null);
	const [todos, setTodos] = React.useState([]);

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
			<InputField onFormSubmit={onFormSubmit} ref={todoRef} />
			<TodoList todos={todos} />
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
				placeholder="What task needs to be completed?"
				ref={ref}
			/>
		</form>
	);
});

const TodoList = ({ todos }) => {
	return (
		<ol>
			{todos.map((todo, idx) => {
				return (
					<li key={`${todo.title}-${idx}`}>
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
