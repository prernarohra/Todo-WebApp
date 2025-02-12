import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTitle, setTitle] = useState<string>('');
    const [newDescription, setDescription] = useState<string>('');
    const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse = await axios.get('http://127.0.0.1:8000/todos');
        const responseData: Todo[] = response.data;
        setTodos(responseData);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchData(); 
  }, []);

  const validateFields = (fields: Record<string, string | null | undefined>) => {
    const emptyFields: string[] = [];
    Object.entries(fields).forEach(([fieldName, value]) => {
    if (value === null || value === undefined || value.trim() === "") {
      // throw new Error(`${fieldName} cannot be null or empty`);
      emptyFields.push(fieldName);  
    }
  });
  if (emptyFields.length > 0) {
    throw new Error(`${emptyFields.join(" and ")} cannot be empty`);
  }
};

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const addTodo = async () => {
    try{
      validateFields({
        "Title field": newTitle,
        "Description field": newDescription,
      });
      const dataToSend = {title: newTitle.trim(), description: newDescription.trim(), completed: false  };
      const response: AxiosResponse = await axios.post('http://127.0.0.1:8000/todos', dataToSend);
      const addedTodo: Todo = response.data;   
      // setTodos((prevTodos) => [...prevTodos, addedTodo]);
      setTodos((prevTodos) => [addedTodo, ...prevTodos]);
      setTitle('');
      setDescription('');
    }
    catch (error: any) {
      handleError(error.message || 'Error adding todo');
    }
  };

  const startEditing = (todo: Todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const updateTodo = async () => {
    try{
      validateFields({
        "Title field": newTitle,
        "Description field": newDescription,
      });
      if (currentTodo) {
          const dataToUpdate = {id: currentTodo.id, title: newTitle.trim(), description: newDescription.trim(), completed: currentTodo.completed};
          const response: AxiosResponse<Todo> = await axios.put(`http://127.0.0.1:8000/todos/${currentTodo.id}`,dataToUpdate);
          const responseData: Todo = response.data;
            setTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo.id === currentTodo.id ? responseData : todo
              )
            );
            setIsEditing(false);
            setCurrentTodo(null);
            setTitle('');
            setDescription('');
        }
       } catch (error: any) {
        handleError(error.message || 'Error updating todo');
      }
  };
  const deleteTodo = async (id: number) => {
    try {
    await axios.delete(`http://127.0.0.1:8000/todos/${id}`);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      handleError('Error deleting todo');
    }
    };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Todo List</h1>
      <div style={{ marginBottom: '20px' , alignItems: 'center', display: 'flex', gap: '10px'}}>
        <input 
          type="text" 
          value={newTitle} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter a new todo" 
          style={{ padding: '8px', width: '300px', alignItems: 'center', borderRadius: '4px', flex: 1, border: '1px solid #ddd'}}/>
          <input 
          type="text" 
          value={newDescription} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter a new todo descrption" 
          style={{ padding: '8px', width: '300px', alignItems: 'center', borderRadius: '4px', flex: 1, border: '1px solid #ddd'}}/>
        <button
          onClick={isEditing ? updateTodo : addTodo}
          style={{ marginLeft: '10px', padding: '8px 16px', cursor: 'pointer', backgroundColor: isEditing ? 'orange' : 'blue', color: 'white', border: 'none', borderRadius: '4px', alignItems: 'center'}}>
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              marginBottom: '10px', backgroundColor: '#ffdddd', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#555' }}>{todo.title}</h3>
            <p style={{ margin: 0, color: '#777' }}>{todo.description}</p>
              <div>
                <button
                  onClick={() => startEditing(todo)}
                  style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                  Delete
                </button>
              </div>
          </li>
        ))}
      </ul>
      {showError && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}>
          <h3 style={{ color: 'red' }}>Error</h3>
          <p>{errorMessage}</p>
          <button
            onClick={() => setShowError(false)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
            Ok
          </button>
        </div>
      )}
    </div>
  );
};

export default App;