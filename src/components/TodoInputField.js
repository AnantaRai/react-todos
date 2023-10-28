export default function TodoInputField(props) {
	return (
		<input
			type="text"
			name="task"
			className="todo-input"
			placeholder="What task needs to be completed?"
			onKeyDown={props.handleTodoInputKeyDown}
		/>
	);
}
