const api = '/api/todos';

async function fetchTodos() {
  const res = await fetch(api);
  return res.json();
}

function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => { if (k === 'class') e.className = v; else e[k] = v; });
  children.flat().forEach(c => { if (typeof c === 'string') e.appendChild(document.createTextNode(c)); else if (c) e.appendChild(c); });
  return e;
}

async function render() {
  const todos = await fetchTodos();
  const list = document.getElementById('todos');
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = el('li', { class: 'todo' + (todo.done ? ' done' : '') });

    const checkbox = el('input'); checkbox.type = 'checkbox'; checkbox.checked = !!todo.done;
    checkbox.addEventListener('change', async () => {
      await fetch(`${api}/${todo.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...todo, done: checkbox.checked }) });
      render();
    });

    const title = el('div', { class: 'title' }, todo.title, todo.due_date ? el('div', {}, el('small', {}, `Due: ${todo.due_date}`)) : null);

    const editBtn = el('button', { class: 'edit' }, 'Edit');
    editBtn.addEventListener('click', async () => {
      const newTitle = prompt('Title', todo.title);
      if (newTitle == null) return;
      const newDue = prompt('Due date (YYYY-MM-DD)', todo.due_date || '');
      await fetch(`${api}/${todo.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...todo, title: newTitle, due_date: newDue || null }) });
      render();
    });

    const delBtn = el('button', { class: 'delete' }, 'Delete');
    delBtn.addEventListener('click', async () => {
      if (!confirm('Delete this todo?')) return;
      await fetch(`${api}/${todo.id}`, { method: 'DELETE' });
      render();
    });

    li.append(checkbox, title, editBtn, delBtn);
    list.appendChild(li);
  });
}

document.getElementById('todo-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const due_date = document.getElementById('due_date').value || null;
  if (!title) return alert('Title is required');
  await fetch(api, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title, due_date }) });
  document.getElementById('title').value = '';
  document.getElementById('due_date').value = '';
  render();
});

render();