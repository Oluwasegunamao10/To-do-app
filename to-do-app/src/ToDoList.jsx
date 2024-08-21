import React, { useState, useEffect, useRef } from "react";
import "./index.css";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const audioRef = useRef(null);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleTimeChange = (event) => {
    setReminderTime(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === "" || reminderTime.trim() === "") {
      alert("Task text and reminder time are required.");
      return;
    }

    const taskTime = new Date(reminderTime).getTime();
    const now = new Date().getTime();

    if (taskTime <= now) {
      alert("Reminder time must be in the future.");
      return;
    }

    const task = { text: newTask, time: reminderTime };
    setTasks((prevTasks) => [...prevTasks, task]);
    setNewTask("");
    setReminderTime("");
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const playSound = () => {
    if (!audioRef.current) {
      const newAudio = new Audio("/From_eden.mp3");
      audioRef.current = newAudio;
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.error("Audio play failed: ", error);
    });
  };

  const stopSound = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    const timers = tasks.map((task, index) => {
      const taskTime = new Date(task.time).getTime();
      const now = new Date().getTime();
      const timeDifference = taskTime - now;

      if (timeDifference > 0) {
        console.log(
          `Setting reminder for task "${task.text}" at ${new Date(taskTime)}`
        );

        return setTimeout(() => {
          playSound();

          if (Notification.permission === "granted") {
            new Notification("Reminder", { body: `Reminder: ${task.text}` });
          } else {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Reminder", {
                  body: `Reminder: ${task.text}`,
                });
              }
            });
          }
        }, timeDifference);
      }
      return null;
    });

    return () => timers.forEach((timer) => timer && clearTimeout(timer));
  }, [tasks]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  const sortedTasks = tasks.sort((a, b) => new Date(a.time) - new Date(b.time));

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          value={reminderTime}
          onChange={handleTimeChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
        <button className="stop-button" onClick={stopSound}>
          Stop Reminder
        </button>
      </div>
      <ol>
        {sortedTasks.map((task, index) => (
          <li key={index}>
            <span className="text">{task.text}</span>
            <span className="time">{new Date(task.time).toLocaleString()}</span>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              Delete
            </button>
            {/* <button className="move-button" onClick={() => moveTaskUp(index)}>
              ⬆
            </button>
            <button className="move-button" onClick={() => moveTaskDown(index)}>
              ⬇
            </button> */}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;
