import capitalize from '../utilities/stringHelpers';

export default function FilterOption(props) {
	const isActive = props.filter === props.title;
	const title = capitalize(props.title);

	function handleFilterChange() {
		props.setFilter(props.title);
	}

	return (
		<span
			className={isActive ? 'todo-filter-active' : 'todo-filter-normal'}
			onClick={handleFilterChange}
		>
			{title}
		</span>
	);
}
