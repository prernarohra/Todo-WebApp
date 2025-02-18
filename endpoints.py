from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from tkinter import *
from fastapi.middleware.cors import CORSMiddleware
import os, json

app = FastAPI()

Datafile = 'data.json'

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoItem(BaseModel):
    title: str
    description: str
    completed: bool = False

def read_data():
    if os.path.exists(Datafile):
        with open(Datafile, "r") as file:
            return json.load(file)
    else:
        return {"items": []}
    
def write_data(data):
    with open(Datafile, "w") as file:
        json.dump(data, file, indent=4)

@app.get("/todos")
def get_todos():
    data = read_data()
    visible = [item for item in data['todo_list'] if not item.get ("hidden",False)]
    return (visible)

@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    data = read_data()
    for todo in data["todo_list"]:
        if todo["id"]== todo_id:
            return todo
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

@app.post("/todos")
def add_todo(todo: TodoItem):
    data = read_data()
    if data["todo_list"]:
        last_id = max(item["id"] for item in data["todo_list"])
    else:
        last_id = 0
    new_id = last_id + 1
    new_todo = {
        "id": new_id,
        "title": todo.title,
        "description": todo.description,
        "completed": False
    }
    data["todo_list"].append(new_todo)
    write_data(data)
    return new_todo

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, updated_todo: TodoItem):
    data = read_data()
    for todo in data["todo_list"]:
        if todo["id"] == todo_id:
            todo["title"] = updated_todo.title
            todo["description"] = updated_todo.description
            todo["completed"] = False
            write_data(data)
            return todo
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    data = read_data()
    for todo in data["todo_list"][:]:
        if todo["id"] == todo_id:
            data["todo_list"].remove(todo)
            write_data(data)
            return {"message": "Todo item deleted"}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Todo with ID {todo_id} not found"
    )



