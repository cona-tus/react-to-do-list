import React from 'react';
import styles from './TodoItem.module.css';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const { id, text, status } = todo;

  const changeHandler = (e) => {
    const status = e.target.checked ? 'completed' : 'active';
    onUpdate({ ...todo, status });
  };

  const deleteHandler = () => {
    onDelete(todo);
  };

  return (
    <li className={styles.todo}>
      <input
        className={styles.checkbox}
        type='checkbox'
        id={id}
        checked={status === 'completed'}
        onChange={changeHandler}
      />
      <label htmlFor='id' className={styles.text} onClick={deleteHandler}>
        {text}
      </label>
    </li>
  );
}
