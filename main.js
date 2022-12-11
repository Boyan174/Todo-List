window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the form
		e.target.reset();

		displayTodos()
	})

	displayTodos()
})

function displayTodos() {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.forEach(todo => {
		const toDoElement = document.createElement('div');
		toDoElement.classList.add('toDoElement');
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');
		const pomoButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		pomoButton.classList.add('pomo');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');


		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';
		pomoButton.innerHTML = 'Start'

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(pomoButton);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);
		toDoElement.appendChild(todoItem);
		todoList.appendChild(toDoElement);

		if (todo.done) {
			todoItem.classList.add('done');
		}

		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			displayTodos()

		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				displayTodos()

			})
		})

		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			displayTodos()
		})

		// START POMODORO
		pomoButton.addEventListener('click', () => {

			pomoSection = document.createElement('div');
			pomoSection.innerHTML = `
		<h1 id="taskName"></h1>
		<h1 class="timer" id="timer">25:00</h1>
		<div>
			<button class="start-timer" id="start-timer">START</button>
			<button id="break-timer">BREAK</button>
			<button id="stop-timer">STOP</button>
		</div>`;
		toDoElement.appendChild(pomoSection);
			pomoSection.classList.add("pomodoro-function");
			pomoSection.setAttribute("id", "pomodoro-function")

			
			let startPomodoro = document.getElementById("start-timer");
			let breakPomodoro = document.getElementById("break-timer");
			let stopPomodoro = document.getElementById("stop-timer");
			let timerclock = document.getElementById("timer");
			let pomodoroSection = document.getElementById("pomodoro-function");
			let taskName = document.getElementById("taskName");

			taskName.innerHTML = `${todo.content}`;

			startPomodoro.addEventListener('click', function () {
				// clearInterval(timerBreak);
				timerclock.innerHTML = "25:00";
				let totalseconds = 1500;
				timer = setInterval(function () {
					if (totalseconds === 0) {
						timerclock.innerHTML = "Take a break!"
					}
					totalseconds = totalseconds - 1;
					let minutes = Math.floor(totalseconds / 60);
					let seconds = totalseconds % 60;
					timerclock.innerHTML = `${minutes}:${seconds}`
				}, 1000)
			})

			stopPomodoro.addEventListener('click', function () {
				toDoElement.appendChild(todoItem);
				toDoElement.removeChild(pomoSection);
			});

			breakPomodoro.addEventListener('click', function () {
				clearInterval(timer);
				totalseconds = 300;
				timerclock.innerHTML = "5:00";
				timerBreak = setInterval(function () {
					if (totalseconds === 0) {
						timerclock.innerHTML = "Start working!";
						clearInterval(timerBreak);
					}
					totalseconds = totalseconds - 1;
					let minutes = Math.floor(totalseconds / 60);
					let seconds = totalseconds % 60;
					timerclock.innerHTML = `${minutes}:${seconds}`
				}, 1000)
			});
			// END POMODRO

			toDoElement.removeChild(todoItem);
			toDoElement.appendChild(pomoSection);
			pomoSection.classList.add('todo-item')
		})

	})
}