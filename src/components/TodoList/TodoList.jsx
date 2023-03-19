import React, { useEffect, useState } from 'react';
import AddTodo from '../AddTodo/AddTodo';

import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.css';

export default function TodoList({ filter }) {
  const [todos, setTodos] = useState(() => getItem());

  const addHandler = (todo) => {
    setTodos((todos) => [...todos, todo]);
  };

  const updateHandler = (updated) => {
    setTodos(todos.map((todo) => (todo.id === updated.id ? updated : todo)));
  };

  const deleteHandler = (deleted) => {
    setTodos(todos.filter((todo) => todo.id !== deleted.id));
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const filtered = getFilteredItem(todos, filter);

  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {filtered.map((item) => (
          <TodoItem
            key={item.id}
            todo={item}
            onUpdate={updateHandler}
            onDelete={deleteHandler}
          />
        ))}
        {filtered.length === 0 && (
          <p className={styles.fallback}>할 일이 존재하지 않습니다.</p>
        )}
      </ul>
      <AddTodo onAdd={addHandler} />
    </section>
  );
}

function getItem() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}

function getFilteredItem(todos, filter) {
  if (filter === 'all') {
    return todos;
  }
  return todos.filter((todo) => todo.status === filter);
}
