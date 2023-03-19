# ✔️ 투두 리스트 앱, 'THINGS' 토이 프로젝트

![things-thumb](https://user-images.githubusercontent.com/90844424/226153188-1984f8d5-309f-440f-8358-4823348b989b.jpg)

<br />

[![Netlify Status](https://api.netlify.com/api/v1/badges/0f032ec3-152f-4c59-bc38-12e43b1b1a00/deploy-status)](https://app.netlify.com/sites/conatus-react-todo-list/deploys) | [Live Demo](https://conatus-react-todo-list.netlify.app/)

<br/>
<br/>

# 1. Project

## 1-1. Project Information

> 띵스는 간편한 투두리스트 애플리케이션입니다. 할 일을 추가하고 삭제할 수 있으며, 할 일의 상태로 목록을 필터링하여 효과적으로 업무를 관리할 수 있습니다. 또한 다크모드/라이트모드 테마가 지원됩니다.

<br/>

## 1-2. Project Duration & Participants

- 2023-3-18 ~ 2023-3-19
- 개인 프로젝트 (1인)

<br/>
<br/>

# 2. Skills

![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff)
![SCSS](https://img.shields.io/badge/Postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

# 3. Main Features

## 3-1. Create a new Task

![things-create](https://user-images.githubusercontent.com/90844424/226148685-5081e069-d5bc-42a2-a687-6cfcf08c39ca.gif)

사용자는 입력창에 텍스트를 입력하여 할 일을 생성할 수 있습니다.

- `AddTodo`는 사용자의 입력을 기반으로 State를 관리하고 업데이트하는 <u>제어 컴포넌트(Controlled Component)</u>입니다.
- 사용자가 값을 입력할 때마다 `onChange` 이벤트가 발생하여 setText()를 통해 text 값을 변경합니다.
- 변경된 text 값을 input의 value에 할당해줍니다.
- TodoList 컴포넌트로부터 onAdd를 props으로 받아오고, form 제출 시에 `onAdd()`를 호출하여 아이템의 <u>id, text, status</u>를 생성합니다.

```jsx
export default function AddTodo({ onAdd }) {
  const [text, setText] = useState('');

  const changeHandler = (e) => {
    setText(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (text.trim().length === 0) {
      return;
    }
    onAdd({ id: uuidv4(), text, status: 'active' });
    setText('');
  };

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <input
        className={styles.input}
        type='text'
        placeholder='할 일을 입력하세요.'
        value={text}
        onChange={changeHandler}
      />
      <button className={styles.button} type='submit'>
        <AiOutlinePlus />
      </button>
    </form>
  );
}
```

<br/>

- `addHandler()`는 이전의 todos 배열에 새로운 todo 아이템을 추가하는 함수입니다.
- `setTodos()`를 통해 이전의 todos를 스프레드 연산자로 펼쳐놓고, AddTodo 컴포넌트에서 전달받은 todo 아이템을 추가하여 <u>todos 배열을 업데이트 합니다.</u>

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const addHandler = (todo) => {
    setTodos((todos) => [...todos, todo]);
  };

  return (
    <section className={styles.container}>
      <ul>...</ul>
      <AddTodo onAdd={addHandler} />
    </section>
  );
}
```

<br/>

## 3-2. Delete Todo item

![things-delete](https://user-images.githubusercontent.com/90844424/226149571-da0de5ef-6a61-43c9-ae36-708fd6147593.gif)

사용자는 label 요소에 마우스를 오버하여 해당 아이템을 삭제할 수 있습니다.

- label 요소에 onClick 이벤트를 설정하여 TodoList 컴포넌트에서 props로 전달받은 onDelete(todo)를 호출합니다.

```jsx
export default function TodoItem({ todo, onDelete }) {
  const { id, text, status } = todo;

  const deleteHandler = () => {
    onDelete(todo);
  };

  return (
    <li className={styles.todo}>
      <input className={styles.checkbox} type='checkbox' id={id} />
      <label htmlFor='id' className={styles.text} onClick={deleteHandler}>
        {text}
      </label>
    </li>
  );
}
```

<br/>

- todos에 `filter()` 메서드를 사용하여 TodoItem에서 전달받은 <u>deleted의 id와 todo의 id가 일치하지 않는 새로운 배열</u>을 만들어 setTodos()로 todos를 업데이트 합니다.

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const deleteHandler = (deleted) => {
    setTodos(todos.filter((todo) => todo.id !== deleted.id));
  };

  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {todos.map((item) => (
          <TodoItem key={item.id} todo={item} onDelete={deleteHandler} />
        ))}
      </ul>
    </section>
  );
}
```

<br/>

## 3-3. Update Todo Status

![things-update](https://user-images.githubusercontent.com/90844424/226150354-9212bc85-018d-4225-bb3e-4fb22d846e68.jpg)

사용자가 체크박스를 체크하여 해당 아이템의 상태를 변경할 수 있습니다.

- `onChange` 이벤트를 통해 체크박스의 상태가 변경될 때마다 event target의 checked 여부를 확인합니다. 체크가 되었다면 상태를 'completed'로, 아니면 'active'로 설정해줍니다.
- input에 checked 상태는 <u>status가 'completed'일 때만 true</u>가 되도록 합니다.

```jsx
export default function TodoItem({ todo, onUpdate, onDelete }) {
  const { id, text, status } = todo;

  const changeHandler = (e) => {
    const status = e.target.checked ? 'completed' : 'active';
    onUpdate({ ...todo, status });
  };

  // ...

  return (
    <li className={styles.todo}>
      <input
        className={styles.checkbox}
        type='checkbox'
        id={id}
        checked={status === 'completed'}
        onChange={changeHandler}
      />
      <label>...</label>
    </li>
  );
}
```

<br/>

## 3-4. Filter Todo List

![things-filter](https://user-images.githubusercontent.com/90844424/226151495-6b91a07a-ff6b-4e71-8a22-0737586e77ee.gif)

사용자는 Header의 All, Active, Completed를 클릭해 화면에 표시할 투두리스트를 필터링할 수 있습니다.

- App에서는 고정된 filters 배열('all', 'active', 'completed')이 있습니다.
- useState의 초기값을 `filters[0]`인 'all'로 설정합니다.
- Header 컴포넌트에 사용할 filters의 배열과 현재 선택된 filter, 그리고 필터가 변경이 되면 호출할 `onFilterChange={setFilter}`를 전달해줍니다.
- 마찬가지로 TodoList 컴포넌트에도 변경된 현재 filter를 전달합니다.

```jsx
<Header onFilterChange={(filter) => setFilter(filter)} />
// 전달하는 인자값과 호출하는 것이 같으므로 함수의 참조값만 전달할 수 있습니다.
<Header onFilterChange={setFilter} />
```

```jsx
const filters = ['all', 'active', 'completed'];

function App() {
  const [filter, setFilter] = useState(filters[0]);

  return (
      <Header filters={filters} filter={filter} onFilterChange={setFilter} />
      <TodoList filter={filter} />
  );
}

export default App;
```

<br/>

- Header 컴포넌트의 filters에 `map()` 메서드를 사용하여 각각의 필터(value)를 li 요소로 변환해줍니다. 이때 key는 index 값으로 지정합니다.
- onClick 이벤트로 필터가 클릭될 때 `onFilterChange()`를 선택된 버튼의 value로 설정합니다.

```jsx
export default function Header({ filters, filter, onFilterChange }) {
  return (
    <header className={styles.header}>
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
```

- TodoList 컴포넌트에서는 리스트를 필터링하여 해당하는 요소만 보여줍니다.
- `getFilteredItem()` 함수를 만들어 기존 todos와 현재 filter를 전달해주어 필터링된 아이템만 받아옵니다.
- filter의 상태가 'all'이라면 todos를 반환하고, 아니라면 `filter()` 메서드를 이용해서 <u>각각의 todo의 status가 filter에 해당하는 것만 반환합니다.</u>
- filtered 배열을 `map()`하여 필터된 아이템만 렌더링합니다.

```jsx
export default function TodoList({ filter }) {
  const [todos, setTodos] = useState([]);

  //   addHandler, updateHandler, deleteHandler...

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

function getFilteredItem(todos, filter) {
  if (filter === 'all') {
    return todos;
  }
  return todos.filter((todo) => todo.status === filter);
}
```

<br/>

## 3-4. Save data in Local Storage

![things-localstorage](https://user-images.githubusercontent.com/90844424/226152841-0fbe30c5-58a2-4019-a331-916c8f5e8cc4.jpg)

아이템을 추가함과 동시에 로컬스토리지에 데이터가 저장되어 새로고침 시에도 초기화되지 않습니다.

- 특정 값이 변경 될 때마다 무언가를 수행하기 위해서는 `useEffect`를 사용합니다.
- useEffect의 디펜던시로 todos를 제공하여 todos의 state가 업데이트될 때마다 로컬스토리지에 데이터를 저장합니다.
- 이때 `JSON.stringify`를 사용하여 todos 배열을 JSON 문자열로 변환합니다.
- useState의 초기값으로 getItem을 호출하여 로컬 스토리지에 저장된 정보를 불러옵니다.
- 로컬스토리지에 todos가 있다면 todos를 파싱하여 가져오고, 없다면 빈 배열을 반환합니다.

```jsx
export default function TodoList({ filter }) {
  const [todos, setTodos] = useState(() => getItem());

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
}

function getItem() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}
```

<br/>
<br/>

# 4. UI/UX

## 4-1. Change Theme (Light or DarkMode)

![things-theme](https://user-images.githubusercontent.com/90844424/226151587-8f18f327-9d82-4861-b0fa-708f8ec9045c.gif)

사용자는 버튼을 토글링하여 라이트모드와 다크모드로 테마를 변경할 수 있습니다.

> 리액트에서 데이터는 위에서 아래로 props를 통해 전달됩니다. context를 이용하면 트리 단계마다 일일이 props를 전달하지 않고, 컴포넌트 트리 전체에 전반적인 데이터를 공유할 수 있으므로 다크모드로 활용 가능합니다.

- App에서 `<DarkModeProvider>`로 감싼 하위 트리에서 Provider의 value로 전달한 darkMode, toggleDarkMode에 접근할 수 있습니다.

```jsx
function App() {
  return (
    <DarkModeProvider>
      <Header />
      <TodoList />
    </DarkModeProvider>
  );
}

export default App;
```

- context를 사용하기 위해서 `React.createContext`로 Context 객체를 생성합니다.

```jsx
const DarkModeContext = createContext();
```

- `DarkModeProvider()`를 만들어 children을 인자로 받아오고, useState를 이용해 darkMode 데이터를 저장합니다.
- Provider의 value로 darkMode와 toggleDarkMode를 설정하여 하위 트리에서 toggleDarkMode()를 호출하면 darkMode 상태를 반대로 설정할 수 있도록 합니다.
- `updateDarkMode()`는 html에 'dark' 클래스를 추가하거나 제거하여 스타일을 변경하도록 만드는 함수입니다. 토글링이 될 때마다 로컬스토리지에 테마를 저장합니다.

```jsx
export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    updateDarkMode(!darkMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function updateDarkMode(darkMode) {
  if (darkMode) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
}
```

- context를 사용하는 곳에서 useContext()를 이용해 컨텍스트를 명시해야하므로 이를 간소화하기 위해 Custom Hook을 만들어 줍니다.
- 커스텀 훅을 통해 <u>컴포넌트 로직을 함수로 뽑아내어 재사용할 수 있습니다.</u>

```jsx
export const useDarkMode = () => useContext(DarkModeContext);
```

- 앱이 처음 실행되어 페이지가 로드되었을 때 로컬스토리지에 저장된 테마 정보를 불러옵니다.
- 이때 사용할 수 있는 훅이 useEffect()입니다. useEffect를 통해 컴포넌트가 렌더링 된 이후에 수행할 일을 지정합니다.
- 여기서는 Provider가 처음 마운트 되었을 때 브라우저의 로컬스토리지를 확인할 수 있도록 useEffect에 텅빈 디펜던시를 제공합니다.

- 로컬스토리지를 체크하여 현재 테마가 다크모드인지 아닌지 불리언 값을 isDark 변수에 할당합니다.
- setDarkMode(isDark)와 updateDarkMode(isDark)에 값을 전달해 상태를 업데이트하고, html 요소의 클래스를 조작합니다.

```jsx
useEffect(() => {
  const isDark =
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  setDarkMode(isDark);
  updateDarkMode(isDark);
}, []);
```

```css
html.dark {
  --color-bg: #4d5a93;
  --color-nav: #40405b;
  --color-text: #fdfffd;
}
```

<br/>

- Header 컴포넌트에서 커스텀 훅인 `useDarkMode()`를 받아옵니다.
- darkMode의 상태에 따라 아이콘과 input의 checked 여부를 변경해줍니다.
- input에 onChange 이벤트가 발생하면 toggleDarkMode 호출합니다.

```jsx
export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className={styles.header}>
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
        </label>
      </div>
    </header>
  );
}
```

<br/>

## 4-2. Responsive Web

![things-responsive](https://user-images.githubusercontent.com/90844424/226153088-a62ca572-9977-48cf-aec6-f9a45cd02342.jpg)

화면 크기에 따라 유동적으로 사이즈가 조절되는 반응형 웹으로 코드를 작성하였습니다.

```css
@media (max-width: 480px) {
  #root {
    width: 100%;
    height: 100%;
  }
}
```
