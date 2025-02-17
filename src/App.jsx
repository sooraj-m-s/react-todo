import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [toDo, setTodo] = useState('');
  const [toDos, setToDos] = useState(() => {
    return JSON.parse(localStorage.getItem('toDos')) || []
  });
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem('toDos', JSON.stringify(toDos));
  }, [toDos]);

  const addTodo = () => {
    const trimmedTodo = toDo.trim();
    if (!trimmedTodo) {
      setError('Please enter a valid todo');
      return;
    }
    const exists = toDos.some(todo => 
      todo.text.toLowerCase() === trimmedTodo.toLowerCase()
    );
    if (exists) {
      setError('This todo already exists!');
      return;
    }
    setToDos([...toDos, { text: trimmedTodo, marked: false }]);
    setTodo('');
    setError('');
  };

  const toggleMark = (index) => {
    setToDos(toDos.map((todo, i) => 
      i === index ? { ...todo, marked: !todo.marked } : todo
    ));
  };

  const swapTodo = (currentIndex, newIndex) => {
    if (newIndex < 0 || newIndex >= toDos.length) return;
    const newTodo = [...toDos];
    [newTodo[currentIndex], newTodo[newIndex]] = 
      [newTodo[newIndex], newTodo[currentIndex]];
    setToDos(newTodo);
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...toDos];
    updatedTodos.splice(index, 1);
    setToDos(updatedTodos);
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(toDos[index].text);
    setError("");
  };
  const saveEdit = (index) => {
    const trimmedEdit = editText.trim();
    if (!trimmedEdit) {
      setError("Please enter a valid todo");
      return;
    }
    const exists = toDos.some(
      (todo, i) =>
        i !== index && todo.text.toLowerCase() === trimmedEdit.toLowerCase()
    );
    if (exists) {
      setError("This todo already exists!");
      return;
    }
    const updated = toDos.map((todo, i) =>
      i === index ? { ...todo, text: trimmedEdit } : todo
    );
    setToDos(updated);
    setEditIndex(null);
    setEditText("");
    setError("");
  };
  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
    setError("");
  };

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <div className="form-container">
        <input type="text" value={toDo}onChange={e => {setTodo(e.target.value);setError('');}}
          placeholder="Enter a todo" className="todo-input"/>
        <button onClick={addTodo} className="todo-button">Add Todo</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <h4>Saved Todos:</h4>
      <ul className="todo-list">
        {toDos.map((n, index) => (
          <li key={index} className="todo-item">
            {}
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="todo-input"
                />
                <button onClick={() => saveEdit(index)} className="move-button">✔</button>
                <button onClick={cancelEdit} className="move-button">✖</button>
              </>
            ) : (
              <>
                <span className={`todo-text ${n.marked ? 'completed' : ''}`}>{n.text}</span>
                <div className="action-buttons">
                  <button onClick={() => toggleMark(index)} className="move-button">{n.marked ? '✖' : '✔'}</button>
                  <button 
                    onClick={() => swapTodo(index, index - 1)}
                    disabled={index === 0}
                    className="move-button">⬆</button>
                  <button 
                    onClick={() => swapTodo(index, index + 1)}
                    disabled={index === toDos.length - 1}
                    className="move-button">⬇</button>
                  <button onClick={() => startEdit(index)} className="move-button">Edit</button>
                  <button onClick={() => deleteTodo(index)} className="move-button">❌</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div class="credits">
        Developed by <a href="https://www.linkedin.com/in/sooraj-m-s/" target="_blank">Sooraj M S</a>
      </div>
    </div>
  );
};

export default App;
