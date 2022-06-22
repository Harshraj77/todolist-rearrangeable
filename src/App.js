import React from "react";
import "./App.css";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [todo, setTodo] = React.useState("");
  const [todoEditing, setTodoEditing] = React.useState(null);
  const [editingText, setEditingText] = React.useState("");

  React.useEffect(() => {
    const json = localStorage.getItem("todos");
    const loadedTodos = JSON.parse(json);
    if (loadedTodos) {
      setTodos(loadedTodos);
    }
  }, []);

  React.useEffect(() => {
    const json = JSON.stringify(todos);
    localStorage.setItem("todos", json);
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();

    const newTodo = {
      id: new Date().getTime(),
      text: todo,
      completed: false,
    };
    setTodos([...todos].concat(newTodo));
    setTodo("");
  }

  function deleteTodo(id) {
    let updatedTodos = [...todos].filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  }

  function toggleComplete(id) {
    let updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(updatedTodos);
  }

  function submitEdits(id) {
    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.text = editingText;
      }
      return todo;
    });
    setTodos(updatedTodos);
    setTodoEditing(null);
  }

  return (
    <div id="todo-list">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
        />
        <button type="submit">Add Todo</button>
      </form>
      <DragDropContext
        onDragEnd={(...props) => {
          console.log(props);
        }}
      >
        <Droppable droppableId="droppable-1">
          {(provided, _) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {todos.map((todo) => (
                <Draggable
                  key={todo.id}
                  draggableId={"draggable-" + todo.id}
                  index={0}
                >
                  {(provided, _) => (
                    <div key={todo.id} className="todo" ref={provided.innerRef} {...provided.draggableProps} >
                      <div className="todo-text">
                        <input
                          type="checkbox"
                          id="completed"
                          checked={todo.completed}
                          onChange={() => toggleComplete(todo.id)}
                        />
                        {todo.id === todoEditing ? (
                          <input
                            type="text"
                            onChange={(e) => setEditingText(e.target.value)}
                            {...provided.dragHandleProps} />
                        ) : (
                          <div>{todo.text}</div>
                        )}
                      </div>
                      <div className="todo-actions">
                        {todo.id === todoEditing ? (
                          <button onClick={() => submitEdits(todo.id)}>
                            Submit Edits
                          </button>
                        ) : (
                          <button onClick={() => setTodoEditing(todo.id)}>
                            Edit
                          </button>
                        )}

                        <button onClick={() => deleteTodo(todo.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
