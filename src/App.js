import React, { forwardRef, useMemo, useRef, useState } from 'react';
import './index.css';

import TodoInputField from './components/TodoInputField';
import FilterOption from './components/FilterOption';

import Todos from './todos.json';
import { config } from './config';
import { Filters, KeyCodes } from './constants';
import EditButton from './components/EditButton';
import DeleteButton from './components/DeleteButton';

function App() {
	const editTodoRef = useRef(null);

	const [todos, setTodos] = useState(
		config.useJsonFileForTodos ? Todos.todoList : []
	);

	const [filter, setFilter] = useState(Filters.All);

	const filteredTodos = useMemo(() => {
		switch (filter) {
			case Filters.All:
				return todos;
			case Filters.Completed:
				return todos.filter((todo) => todo.isCompleted);
			case Filters.Remaining:
				return todos.filter((todo) => !todo.isCompleted);
		}
	}, [filter, todos]);

	function handleTodoInputKeyDown(e) {
		if (e.key === KeyCodes.Enter) {
			const todo = e.target.value.trim();
			if (todo.length > 0) {
				setTodos((prevTodo) => [
					...prevTodo,
					{ title: todo, isCompleted: false, isEditing: false },
				]);
				e.target.value = '';
			}
		}
	}

	const handleCheckboxToggle = (todoIdx) => {
		if (todos[todoIdx] !== 'undefined') {
			setTodos(
				todos.map((todo, idx) =>
					idx === todoIdx ? { ...todo, isCompleted: !todo.isCompleted } : todo
				)
			);
		}
	};

	const handleEdit = (todoIdx) => {
		if (todos[todoIdx] !== 'undefined') {
			setTodos(
				todos.map((todo, idx) =>
					idx === todoIdx ? { ...todo, isEditing: true } : todo
				)
			);
		}
	};

	const handleDelete = (todoIdx) => {
		if (todos[todoIdx] !== 'undefined') {
			setTodos(todos.filter((_, idx) => idx !== todoIdx));
		}
	};

	const handleFocusOut = (todoIdx) => {
		if (todos[todoIdx] !== 'undefined') {
			setTodos(
				todos.map((todo, idx) =>
					idx === todoIdx ? { ...todo, isEditing: false } : todo
				)
			);
		}
	};

	const handleKeyDown = (todoIdx, e) => {
		if (e.key === 'Escape') {
			handleFocusOut(todoIdx);
		} else if (e.key === 'Enter') {
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

	return (
		<div className="container">
			<h1 className="todo-title">Todos</h1>
			<TodoInputField handleTodoInputKeyDown={handleTodoInputKeyDown} />
			<div className="todo-filter-tab-container">
				<FilterOption
					filter={filter}
					setFilter={setFilter}
					title={Filters.All}
				/>
				<FilterOption
					filter={filter}
					setFilter={setFilter}
					title={Filters.Completed}
				/>
				<FilterOption
					filter={filter}
					setFilter={setFilter}
					title={Filters.Remaining}
				/>
			</div>

			<TodoList
				handleCheckboxToggle={handleCheckboxToggle}
				ref={editTodoRef}
				handleEdit={handleEdit}
				handleFocusOut={handleFocusOut}
				handleKeyDown={handleKeyDown}
				handleDelete={handleDelete}
				filteredTodos={filteredTodos}
			/>
		</div>
	);
}

const TodoList = forwardRef((props, ref) => {
	const {
		handleCheckboxToggle,
		handleEdit,
		handleFocusOut,
		handleKeyDown,
		handleDelete,
		filteredTodos,
	} = props;
	return (
		<ol className="todo-list">
			{filteredTodos.map((todo, todoIdx) => {
				return (
					<li key={`${todo.title}-${todoIdx}`} className="todo-list-item">
						{!todo.isEditing && (
							<div className="flex justify-between items-center">
								<div>
									<input
										id={`${todo.title}-${todoIdx}`}
										type="checkbox"
										className="todo-check-box"
										checked={todo.isCompleted ? 'checked' : ''}
										onChange={() => handleCheckboxToggle(todoIdx)}
									/>
									<label
										htmlFor={`${todo.title}-${todoIdx}`}
										className={`todo-check-box-label ${
											todo.isCompleted ? 'line-through' : ''
										}`}
									>
										{todo.title}
									</label>
								</div>
								<div className="flex">
									<EditButton todoIdx={todoIdx} handleEdit={handleEdit} />
									<DeleteButton todoIdx={todoIdx} handleDelete={handleDelete} />
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
