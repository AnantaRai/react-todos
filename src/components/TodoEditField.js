export default function TodoEditField(props) {
	return (
		<input
			type="text"
			name="task"
			className="todo-edit-input"
			defaultValue={props.todo.title}
			onBlur={() => props.handleEditFieldFocusOut(props.todoIdx)}
			autoFocus
			onKeyDown={(e) => props.handleKeyDown(props.todoIdx, e)}
		/>
	);
}
