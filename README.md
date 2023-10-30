# 📌 투두 리스트 앱, 'THINGS' 토이 프로젝트

![things-thumb](https://user-images.githubusercontent.com/90844424/226153188-1984f8d5-309f-440f-8358-4823348b989b.jpg)

<br/>

🔗 THINGS [[Live Demo](https://conatus-react-todo-list.netlify.app/)]

<br/>
<br/>

## 1. Project

### 1-1. Project Description

THINGS는 투두리스트 앱입니다. 할 일을 추가하고 삭제할 수 있으며, 할 일을 상태별로 필터링하여 볼 수 있습니다. 또한 DarkMode와 LightMode 테마가 지원됩니다.

<br/>

<sub>\* 본 애플리케이션은 인터넷 강의를 참고하여 만들었으나, 필요하다고 판단되는 부분에서 원본 코드를 수정했습니다. 또한 새롭게 디자인했습니다.</sub>

<br/>

### 1-2. Project Duration & Participants

- 2023-3-18 ~ 2023-3-19
- 개인 프로젝트 (1인)

<br/>
<br/>

## 2. Skills

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff)
![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff)
![SCSS](https://img.shields.io/badge/Postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

## 3. Main Features

1. [할 일 생성]()
2. [할 일 삭제]()
3. [할 일 상태 변경]()
4. [목록 필터링]()
5. [로컬 스토리지에 저장]()

<br/>

### 3-1. Create Todo

![things-create](https://user-images.githubusercontent.com/90844424/226148685-5081e069-d5bc-42a2-a687-6cfcf08c39ca.gif)

사용자는 입력창에 텍스트를 입력하여 할 일을 생성할 수 있습니다. 사용자가 값을 입력할 때 onChange 이벤트가 발생하여 setText()를 통해 text 값을 업데이트합니다. 폼 제출 시에 props로 전달받은 `onAdd()` 함수를 호출해 객체를 생성합니다.

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

`addHandler()`는 이전의 todos 배열에 새로운 todo 아이템을 추가하는 함수입니다. 기존의 todos를 스프레드 연산자로 펼쳐놓고, `<AddTodo />` 컴포넌트에서 전달받은 todo 아이템을 추가하여 `setTodos()`를 통해 todos 배열을 업데이트 합니다.

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
<br/>

### 3-2. Delete Todo item

![things-delete](https://user-images.githubusercontent.com/90844424/226149571-da0de5ef-6a61-43c9-ae36-708fd6147593.gif)

사용자는 label 요소를 클릭하여 해당 아이템을 삭제할 수 있습니다. label 요소에 onClick 이벤트를 설정하여 `<TodoList />` 컴포넌트에서 전달받은 `onDelete()` 함수를 호출합니다.

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

`<TodoList />` 컴포넌트의 todos의 상태를 변경하여 개별 아이템을 삭제합니다. todos 배열에 `filter()` 메서드를 사용하여 `<TodoItem />` 컴포넌트에서 전달받은 deleted의 id와 todo의 id가 일치하지 않는 새로운 배열을 만들어 setTodos()로 todos를 업데이트 합니다.

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
<br/>

### 3-3. Update Todo Status

![things-update](https://user-images.githubusercontent.com/90844424/226150354-9212bc85-018d-4225-bb3e-4fb22d846e68.jpg)

사용자가 체크박스를 체크하여 해당 아이템의 상태를 변경할 수 있습니다. input 요소에 onChange 이벤트를 등록하여 타켓의 체크 여부를 확인합니다. 체크가 되었다면 상태를 'completed'로, 아니면 'active'로 설정해줍니다.

```jsx
export default function TodoItem({ todo, onUpdate, onDelete }) {
  const { id, text, status } = todo;

  const changeHandler = (e) => {
    const status = e.target.checked ? 'completed' : 'active';
    onUpdate({ ...todo, status });
  };

  // deleteHandler...

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
<br/>

### 3-4. Filter Todo List

![things-filter](https://user-images.githubusercontent.com/90844424/226151495-6b91a07a-ff6b-4e71-8a22-0737586e77ee.gif)

사용자는 Header의 All, Active, Completed를 클릭해 화면에 표시할 투두리스트를 필터링할 수 있습니다. filters 배열('all', 'active', 'completed')을 만들고, 상태의 초기값을 `filters[0]`로 설정합니다. `<Header />` 컴포넌트에 사용할 filters의 배열과 현재 선택된 filter, 그리고 필터가 변경이 되면 호출할 onFilterChange를 props로 전달해줍니다. 마찬가지로 `<TodoList />` 컴포넌트에도 변경된 현재 filter를 전달합니다.

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

전달받은 filters에 `map()` 메서드를 사용하여 각각의 필터(value)를 li 요소로 변환해줍니다. 이때 key는 index 값으로 지정합니다. onClick 이벤트로 필터가 클릭될 때 `onFilterChange()`를 통해 선택된 버튼의 value를 filter로 설정합니다.

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

`<TodoList />` 컴포넌트에서는 리스트를 필터링하여 해당하는 요소만 화면에 보여줍니다. `getFilteredItem()` 함수를 만들어 기존 todos와 현재 filter를 전달해주고 필터링된 아이템만 받아옵니다. filtered 배열을 `map()`하여 필터링된 아이템만 렌더링합니다.

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
```

<br/>

filter의 상태가 'all'이라면 todos를 반환하고, 아니라면 `filter()` 메서드를 이용해서 개별 todo의 status가 filter에 해당하는 것만 반환합니다.

```jsx
function getFilteredItem(todos, filter) {
  if (filter === 'all') {
    return todos;
  }
  return todos.filter((todo) => todo.status === filter);
}
```

<br/>
<br/>

### 3-5. Save data in Local Storage

![things-localstorage](https://user-images.githubusercontent.com/90844424/226152841-0fbe30c5-58a2-4019-a331-916c8f5e8cc4.jpg)

아이템을 추가함과 동시에 로컬스토리지에 데이터가 저장되어 새로고침 시에도 초기화되지 않습니다.

useEffect의 디펜던시로 todos를 제공하여 todos가 업데이트될 때마다 로컬스토리지에 데이터를 저장합니다. `JSON.stringify`를 사용하여 todos 배열을 JSON 문자열로 변환합니다. useState의 초기값으로 getItem을 호출하여 로컬 스토리지에 저장된 정보를 불러옵니다. 로컬스토리지에 todos가 있다면 `JSON.parse`로 todos를 파싱하여 가져오고, 없다면 빈 배열을 반환합니다.

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

## 4. UI/UX

### 4-1. Change Theme (Light or DarkMode)

![things-theme](https://user-images.githubusercontent.com/90844424/226151587-8f18f327-9d82-4861-b0fa-708f8ec9045c.gif)

사용자는 버튼을 토글링하여 라이트모드와 다크모드로 테마를 변경할 수 있습니다. context를 이용하여 컴포넌트 트리 전체에 데이터를 공유합니다. `<DarkModeProvider>`로 감싼 하위 트리에서 Provider의 value로 전달한 darkMode, toggleDarkMode에 접근할 수 있습니다.

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

<br/>

- `DarkModeProvider()`를 만들어 children을 인자로 받아오고, useState를 이용해 darkMode 데이터를 저장합니다. Provider의 value로 darkMode와 toggleDarkMode를 설정하여 하위 트리에서 `toggleDarkMode()`를 호출하면 darkMode 상태를 반대로 설정할 수 있도록 합니다. `updateDarkMode()`는 html에 'dark' 클래스를 추가하거나 제거하여 스타일을 변경하도록 만드는 함수입니다. 토글링이 될 때마다 로컬스토리지에 테마를 저장합니다.

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

<br/>

context를 사용하는 곳에서 useContext()를 이용해 컨텍스트를 명시해야하므로 이를 간소화하기 위해 Custom Hook을 만들어 줍니다.

```jsx
export const useDarkMode = () => useContext(DarkModeContext);
```

<br/>

useEffect를 사용해 앱이 처음 실행되어 페이지가 로드되었을 때 로컬스토리지에 저장된 테마 정보를 불러옵니다. 로컬 스토리지를 체크하여 현재 테마가 다크모드인지 아닌지 불리언 값을 `isDark` 변수에 할당합니다.

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

<br/>

`setDarkMode(isDark)`와 `updateDarkMode(isDark)`에 값을 전달해 상태를 업데이트하고, html 요소의 클래스를 조작합니다.

```css
html.dark {
  --color-bg: #4d5a93;
  --color-nav: #40405b;
  --color-text: #fdfffd;
}
```

<br/>

커스텀 훅인 `useDarkMode()`를 가져와 darkMode의 상태에 따라 아이콘과 input의 checked 여부를 변경해줍니다. input에 onChange 이벤트가 발생하면 `toggleDarkMode` 호출합니다.

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

THINGS 앱은 화면 크기에 따라 유동적으로 사이즈가 조절됩니다. 미디어 쿼리를 지정해 480px 이하에서는 width와 height를 100%로 설정하여 화면 전체를 꽉 채울 수 있도록 합니다.

```css
@media (max-width: 480px) {
  #root {
    width: 100%;
    height: 100%;
  }
}
```

<br/>
<br/>
