import React from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';
import { useDarkMode } from '../../context/DarkModeContext';
import styles from './Header.module.css';

export default function Header({ filters, filter, onFilterChange }) {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          THINGS
          <br />
          TO DO
        </h1>
        <div className={styles.theme}>
          <span className={styles.icon}>
            {darkMode && <HiMoon />}
            {!darkMode && <HiSun />}
          </span>
          <label className={styles.switch}>
            <input
              type='checkbox'
              onChange={toggleDarkMode}
              checked={darkMode && true}
            />
            <div className={`${styles.slider} ${styles.round}`}></div>
          </label>
        </div>
      </div>
      <ul className={styles.filters}>
        {filters.map((value, index) => (
          <li key={index}>
            <button
              className={`${styles.filter} ${
                filter === value && styles.selected
              }`}
              onClick={() => onFilterChange(value)}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </header>
  );
}
