'use client';
import { useState, useEffect } from "react";

export type Task = {
  name: string;
  description: string;
  status: boolean;
  duedate: string;
};

export default function Home() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskDate, setTaskDate] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/todo", {
      method: "GET",
    })
    .then(res => res.json())
    .then(data => {
      const res_tasks = data.data as Task[];
      setTasks(res_tasks);
    });
  }, []);

  // เพิ่มรายการที่ต้องทำ
  const addTask = () => {
    if (newTask.trim() !== "" && taskDate !== "" && taskDescription.trim() !== "") {
      const newTaskObject = { name: newTask, description: taskDescription, status: false, duedate: taskDate };
      setTasks([...tasks, newTaskObject]);
      setNewTask("");
      setTaskDescription("");
      setTaskDate("");

      fetch('/api/v1/todo', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskObject)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
    }
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        const updatedTask = { ...task, status: !task.status };
        
        fetch('/api/v1/todo', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask)
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        });

        return updatedTask;
      }
      return task;
    });

    const sortedTasks = updatedTasks
      .filter(task => !task.status)
      .concat(updatedTasks.filter(task => task.status));

    setTasks(sortedTasks);
  };

  // ลบรายการที่ต้องทำ
  const deleteTask = (index: number) => {
    const task_to_delete = tasks[index];
    const updatedTasks = tasks.filter((_, i) => i !== index);

    fetch('/api/v1/todo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task_to_delete)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });

    setTasks(updatedTasks);
  };

  return (
    <div className="container mx-auto p-4 bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      
      <div className="mb-4 flex space-x-4 items-center">
        <input
          type="text"
          className="border rounded p-2 w-1/4 h-[40px]"
          placeholder="Add a new TO-DO"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <textarea
          className="border rounded p-2 w-1/3 h-[40px] resize-none"
          placeholder="Add details"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <input
          type="date"
          className="border rounded p-2 h-[40px] w-1/4"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <button onClick={addTask} className="bg-pink-500 text-white p-2 rounded h-[40px] w-1/6">
          Add TO-DO
        </button>
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center justify-between mb-2">
            <div>
              <span
                onClick={() => toggleTaskCompletion(index)}
                className={`cursor-pointer ${task.status ? "line-through text-gray-500" : ""}`}
              >
                {task.name}
              </span>
              <div className="text-gray-700 text-sm">
                {task.description}
              </div>
              <div className="text-gray-500 text-sm">
                {task.duedate}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleTaskCompletion(index)}
                className={`p-1 rounded ${task.status ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                {task.status ? 'Undone' : 'Done'}
              </button>
              <button
                onClick={() => deleteTask(index)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
