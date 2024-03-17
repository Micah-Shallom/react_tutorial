import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from "./components/AddTask";
import Footer from './components/Footer';
import About from './components/About';

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasksFromServer = async () => {
     const tasks = await fetchTasks()

     setTasks(tasks)
    }
    getTasksFromServer()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:1000/tasks/`)
    const data = await res.json()
    
    return data
  }
  const fetchTasksID = async (id) => {
    const res = await fetch(`http://localhost:1000/tasks/${id}`)
    const data = await res.json()
    
    return data
  }


  const showAddFunc = (show) => {
    setShowAddTask(show)
  }
  console.log(tasks)
  const addTask = async (task) => {
    const res = await fetch("http://localhost:1000/tasks", {
        method : 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(task)
      })
    
    const data = await res.json()
    setTasks([...tasks, data])
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:1000/tasks/${id}`,{
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id)) //this is just an update to the UI cause the deleted task is currently not in the task state
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTasksID(id)
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:1000/tasks/${id}`, {
      method: "PUT",
      headers:{
        "Content-type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    })
    
    const data = await res.json()
    
    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
  }

  return (
    <Router>
    <div className="container">
          <Header title="Task Tracker" onAdd={() => showAddFunc(!showAddTask)} showAdd={showAddTask}/>
          <Routes>
            <Route path='/' element={
              <>
                {showAddTask && <AddTask onAdd={addTask}/>}
                {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : "No Tasks To Show"}
              </>
            }/>
            <Route element={<About />} path='/about' />
          </Routes>
          <Footer/>
    </div>
    </Router>
  );
}

export default App;
