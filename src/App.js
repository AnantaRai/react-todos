import React, { useState, useRef } from "react";

function App() {
	const [todos, setTodos] = useState({
		title: null,
		isCompleted: false,
	});

	const todo = useRef(null);

	function onFormSubmit(e) {
		e.preventDefault();
	}
	return (
		<div>
			<h1>Todos</h1>
			<InputField onFormSubmit={onFormSubmit} todo={todo} />
		</div>
	);
}

function InputField({ onFormSubmit, todo }) {
	return (
		<form onSubmit={onFormSubmit}>
			<input
				type="text"
				name="task"
				placeholder="What task needs to be completed?"
				ref={todo}
			/>
		</form>
	);
}

export default App;
