import "../styles/Content.css";
import { useEffect, useState, useRef } from "react";

const Content = () => {
  const HOST: string = "http://localhost:3000/api/todo-list";

  interface Todo {
    id: number;
    todo: string;
    urgency: number;
  }

  const [todoList, setTodoList] = useState<Todo[]>([]);
  const fetchTodo = async () => {
    try {
      const response = await fetch(HOST);
      if (!response.ok) throw Error("Failed recieve data");
      const data = await response.json();
      setTodoList(data);
    } catch (err) {
      console.log(err);
    }
  };

  //
  const uploadData = async (upMethod: string, upData: any) => {
    try {
      const response = await fetch(HOST, {
        method: upMethod,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(upData),
      });
      console.log(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  //Create
  const [newTodo, setNewTodo] = useState<string>("");
  const [newTodoUrgency, setNewTodoUrgency] = useState<number>(3);

  const [updateTodo, setUpdateTodo] = useState<string>("");
  const [updateTodoUrgency, setUpdateTodoUrgency] = useState<number>(3);

  const handleAddTodo = async () => {
    const newTodoObject = {
      id: todoList.length ? todoList[todoList.length - 1].id + 1 : 1,
      todo: newTodo,
      urgency: newTodoUrgency,
    };

    setTodoList([...todoList, newTodoObject]);
    await uploadData("POST", newTodoObject);
    await fetchTodo();
  };

  //Update

  // -Reset Input
  const inputReset = () => {
    setEditId(null);
    setUpdateTodo("");
    setUpdateTodoUrgency(3);
  };

  const handleUpdateTodo = () => {
    const updatedTodoList = todoList.map((todo) => {
      if (editId === todo.id) {
        todo.todo = updateTodo;
        todo.urgency = updateTodoUrgency;
        return todo;
      } else return todo;
    });
    setTodoList(updatedTodoList);
    uploadData("PUT", {
      id: editId,
      todo: updateTodo,
      urgency: updateTodoUrgency,
    });
    inputReset();
  };

  //Delete
  const handleDeleteTodo = (todoId: number) => {
    const newTodoList = todoList.filter((todo) => {
      return todoId !== todo.id;
    });
    setTodoList(newTodoList);
    console.log(todoId);
    uploadData("DELETE", { id: todoId });
  };

  //Edit Mode
  const [editId, setEditId] = useState<null | number>(null);
  const turnEditMode = (todo: Todo) => {
    setUpdateTodo(todo.todo);
    setUpdateTodoUrgency(todo.urgency);
    setEditId(todo.id);
  };

  //Sort Todo
  const sortTodo = () => {
    const todoSorted = [...todoList];
    todoSorted.sort((a, b) => b.urgency - a.urgency);
    todoSorted.forEach((todo, index) => {
      todo.id = index + 1;
    });
    setTodoList(todoSorted);
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <main>
      <div className="todo__inputContainer">
        <input
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          className="todo__inputField"
        />
        <select
          onChange={(e) => {
            setNewTodoUrgency(Number(e.target.value));
          }}
          className="todo__selectUrgency"
        >
          <option value={3}>high</option>
          <option value={2}>medium</option>
          <option value={1}>low</option>
        </select>
        <button
          onClick={() => {
            handleAddTodo();
          }}
          className="todo__addButton"
        >
          +
        </button>
        <button
          className="todo__contextButton todo__contextButton--Sort"
          onClick={() => {
            sortTodo();
          }}
        >
          &#xf04ba;
        </button>
      </div>
      <ul className="todo__list">
        {todoList.map((todo) => (
          <li className="todo__cell" key={todo.id}>
            {editId && editId === todo.id ? (
              <>
                <input
                  className="todo__inputField todo__inputField--edit"
                  defaultValue={todo.todo}
                  onChange={(e) => {
                    setUpdateTodo(e.target.value);
                  }}
                />
                <select
                  className="todo__selectUrgency todo__selectUrgency--edit"
                  defaultValue={todo.urgency}
                  onChange={(e) => {
                    setUpdateTodoUrgency(Number(e.target.value));
                  }}
                >
                  <option value={3}>high</option>
                  <option value={2}>medium</option>
                  <option value={1}>low</option>
                </select>
                <div className="todo__buttonContainer">
                  <button
                    className="todo__contextButton todo__contextButton--Apply"
                    onClick={() => {
                      handleUpdateTodo();
                    }}
                  >
                    &#xf00c;
                  </button>
                  <button
                    className="todo__contextButton todo__contextButton--Deny"
                    onClick={() => {
                      inputReset();
                    }}
                  >
                    &#xf00d;
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="todo__text">{todo.todo}</div>
                <div className="todo__urgency">
                  {todo.urgency === 3
                    ? "high"
                    : todo.urgency === 2
                    ? "medium"
                    : "low"}
                </div>
                <div className="todo__buttonContainer">
                  <button
                    className="todo__contextButton todo__contextButton--Edit"
                    onClick={() => {
                      turnEditMode(todo);
                    }}
                  >
                    &#xf044;
                  </button>
                  <button
                    className="todo__contextButton todo__contextButton--Delete"
                    onClick={() => {
                      handleDeleteTodo(todo.id);
                    }}
                  >
                    &#xf01b4;
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Content;
