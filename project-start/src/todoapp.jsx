/* globals React, ReactDOM, uuid, classNames, ReactSpring */

// A little SVG component for plus sign
const SvgPlus = props => (
	<svg
		aria-hidden="true"
		data-prefix="fas"
		data-icon="plus"
		viewBox="0 0 448 512"
		className="svg-inline--fa fa-plus fa-w-14"
		width="1em"
		height="1em"
		{...props}
	>
		<path
			fill="currentColor"
			d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
		/>
	</svg>
);

// List all todos
const TodoList = ({ todos, toggleTodo, deleteTodo }) => (
	<div className="todo-list">
		{todos.length ? (
			<ReactSpring.Transition
				items={todos}
				keys={item => item.id}
				from={{
					transform: 'translate3d(0,-5px,0)',
					opacity: 0,
					height: 0,
				}}
				enter={{
					transform: 'translate3d(0,0px,0)',
					opacity: 1,
					height: 'auto',
				}}
				leave={{ opacity: 0, height: 0 }}
				native
				config={{
					...ReactSpring.config.wobbly,
				}}
				trail={100}
			>
				{todo => props => (
					<ReactSpring.animated.div
						style={props}
						key={todo.id}
						trail={2000}
					>
						<a
							className={classNames({
								'panel-block': true,
								'todo-list__block': true,
								'todo-list__block--is-done': todo.done,
							})}
							href="#"
							onClick={e => {
								e.preventDefault();
								toggleTodo(todo.id);
							}}
						>
							<span className="todo-list__status" />
							<span className="todo-list__label">
								{todo.label}
							</span>
							<button
								type="button"
								className="delete is-small"
								onClick={e => {
									e.preventDefault();
									deleteTodo(todo.id);
								}}
							/>
						</a>
					</ReactSpring.animated.div>
				)}
			</ReactSpring.Transition>
		) : (
			// todos.map(todo => (

			// ))
			<div className="notification is-warning">
				Nothing to show here. Try adding some todos.
			</div>
		)}
	</div>
);

// Create our application
class TodoApp extends React.Component {
	// Initial State
	state = {
		todos: [
			{
				id: uuid(),
				label: 'Add some todos',
				done: false,
			},
			{
				id: uuid(),
				label: 'I am done',
				done: true,
			},
		],
		input: '',
		filter: 'all',
	};

	// Handler for input
	handleInput = e => {
		this.setState({ input: e.target.value });
	};

	// Set todo filter
	setFilter = filter => {
		this.setState({ filter });
	};

	// Sort todos, with not done at first, then done
	sortTodos = todos => [
		...todos.filter(todo => !todo.done),
		...todos.filter(todo => todo.done),
	];

	// Add a new todo
	addTodo = () => {
		// e.preventDefault();
		this.setState(state => {
			if (state.input === '') {
				return null;
			}
			const todos = [
				...state.todos,
				{
					id: uuid(),
					done: false,
					label: state.input,
				},
			];
			return { todos: this.sortTodos(todos), input: '' };
		});
	};

	// Get todos based on filters
	getTodos = () => {
		const { filter, todos } = this.state;
		if (filter === 'all') {
			return todos;
		}
		const todoState = filter === 'done';
		return todos.filter(todo => todo.done === todoState);
	};

	// Toggle the todo done state
	toggleTodo = id => {
		this.setState(state => {
			const todos = state.todos.map(todo => {
				if (todo.id === id) {
					return {
						...todo,
						done: !todo.done,
						// we override id, to make the animation
						id: uuid(),
					};
				}
				return todo;
			});
			return {
				todos: this.sortTodos(todos),
			};
		});
	};

	deleteTodo = id => {
		this.setState(state => ({
			todos: state.todos.filter(todo => todo.id !== id),
		}));
	};

	render() {
		const { filter, input } = this.state;
		const filters = ['all', 'active', 'done'];
		return (
			<section className="section todo-app">
				<div className="container">
					<nav className="panel todo-app__panel">
						<h1 className="panel-heading todo-app__title">
							Todo Application
						</h1>
						<div className="panel-block">
							<form
								action=""
								className="todo-app__form"
								onSubmit={e => {
									e.preventDefault();
									this.addTodo();
								}}
							>
								<div className="field">
									<div className="control todo-app__widget">
										<input
											type="text"
											className="todo-app__input input is-rounded is-medium"
											placeholder="type here and enter"
											value={input}
											onChange={this.handleInput}
										/>
										<button
											type="submit"
											className="todo-app__submit button is-success is-rounded is-medium"
										>
											<SvgPlus />
										</button>
									</div>
								</div>
							</form>
						</div>
						<div className="panel-tabs todo-app__tabs">
							{filters.map(f => (
								<a
									key={f}
									href="#"
									onClick={e => {
										e.preventDefault();
										this.setFilter(f);
									}}
									className={classNames({
										'is-active': filter === f,
									})}
								>
									{f}
								</a>
							))}
						</div>
						<TodoList
							todos={this.getTodos()}
							toggleTodo={this.toggleTodo}
							deleteTodo={this.deleteTodo}
						/>
					</nav>
				</div>
			</section>
		);
	}
}

// Render our application
document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<TodoApp />, document.querySelector('#app'));
});
