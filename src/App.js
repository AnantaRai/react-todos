import React, { useMemo, useState } from 'react';
import './index.css';

import TodoInputField from './components/TodoInputField';
import TodoEditField from './components/TodoEditField';
import FilterOption from './components/FilterOption';
import EditButton from './components/EditButton';
import DeleteButton from './components/DeleteButton';

import Todos from './todos.json';
import { config } from './config';
import { Filters, KeyCodes } from './constants';

function App() {
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

	function handleCheckboxToggle(todoIdx) {
		setTodos(
			todos.map((todo, idx) =>
				idx === todoIdx ? { ...todo, isCompleted: !todo.isCompleted } : todo
			)
		);
	}

	function handleEdit(todoIdx) {
		setTodos(
			todos.map((todo, idx) =>
				idx === todoIdx ? { ...todo, isEditing: true } : todo
			)
		);
	}

	function handleDelete(todoIdx) {
		setTodos(todos.filter((_, idx) => idx !== todoIdx));
	}

	function handleEditFieldFocusOut(todoIdx) {
		setTodos(
			todos.map((todo, idx) =>
				idx === todoIdx ? { ...todo, isEditing: false } : todo
			)
		);
	}

	function handleUpdate(editedTodo, todoIdx) {
		const trimedEditedTodo = editedTodo.trim();
		if (trimedEditedTodo.length > 0) {
			setTodos(
				todos.map((todo, idx) =>
					idx === todoIdx
						? { ...todo, title: trimedEditedTodo, isEditing: false }
						: todo
				)
			);
		}
	}

	function handleKeyDown(todoIdx, e) {
		switch (e.key) {
			case KeyCodes.Escape:
				handleEditFieldFocusOut(todoIdx);
			case KeyCodes.Enter:
				handleUpdate(e.target.value, todoIdx);
		}
	}

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
				handleEdit={handleEdit}
				handleEditFieldFocusOut={handleEditFieldFocusOut}
				handleKeyDown={handleKeyDown}
				handleDelete={handleDelete}
				filteredTodos={filteredTodos}
			/>
		</div>
	);
}

function TodoList(props) {
	const {
		handleCheckboxToggle,
		handleEdit,
		handleEditFieldFocusOut,
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
						{todo.isEditing ? (
							<TodoEditField
								todo={todo}
								todoIdx={todoIdx}
								handleEditFieldFocusOut={handleEditFieldFocusOut}
								handleKeyDown={handleKeyDown}
							/>
						) : null}
					</li>
				);
			})}
		</ol>
	);
}

export default App;
