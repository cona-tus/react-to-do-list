import { useState } from 'react';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import { DarkModeProvider } from './context/DarkModeContext';

const filters = ['all', 'active', 'completed'];

function App() {
  const [filter, setFilter] = useState(filters[0]);

  return (
    <DarkModeProvider>
      <Header filters={filters} filter={filter} onFilterChange={setFilter} />
      <TodoList filter={filter} />
    </DarkModeProvider>
  );
}

export default App;

// onFilterChange={(filter) => setFilter(filter)}
// 전달하는 인자값과 호출하는 것이 같으므로 함수의 참조값만 전달하기
// onFilterChange={setFilter}
