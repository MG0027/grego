import React, { useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import styles from "./todo.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { taskActions } from "../store/taskslice";
import "bootstrap-icons/font/bootstrap-icons.css";
import API_BASE_URL from "../config";

function Todo() {
  const [showInput, setShowInput] = useState(false);
  const { userId } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const taskNameRef = useRef();
  const dueDateTimeRef = useRef();
  const tasks = useSelector((state) => state.task);
  console.log(tasks);
  console.log(Array.isArray(tasks));
  const inCompletedTask = tasks.filter((task) => task.completed === false);
  console.log(inCompletedTask);

  const addTask = async () => {
    const taskName = taskNameRef.current.value;
    const dueDateTime = dueDateTimeRef.current.value;

    if (!taskName || !dueDateTime) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/task/add-task`, {
        userId: userId,
        task: taskName,
        duedatetime: dueDateTime,
      });
      console.log(response.data);
      if (response.status === 200) {
        const { taskId } = response.data;
        dispatch(
          taskActions.addtask({
            taskId,
            task: taskName,
            duedatetime: dueDateTime,
            completed: false,
          })
        );

        taskNameRef.current.value = "";
        dueDateTimeRef.current.value = "";
        setShowInput(false);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const removeTask = async (taskId) => {
    console.log(taskId);
    try {
      await axios.delete(`${API_BASE_URL}/task/${userId}/${taskId}`, {
        data: {
          userId: userId,
          taskId: taskId,
        },
      });

      dispatch(
        taskActions.removetask({
          taskId,
        })
      );
    } catch (error) {
      console.error("Error removing task", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  const changeStatus = async (taskId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/task/${userId}/${taskId}`,
        {
          completed: true,
        }
      );
      const updatedTask = response.data;
      dispatch(taskActions.settask(updatedTask));
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <div className={styles.todo}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>
          <img
            src="/images/scrum-process-icon-task-icon-time-icon-computer-icon-programming-data-floppy-disk-software-directory-line-art-png-clipart-removebg-preview.png"
            alt="Task Manager Icon"
          />
          Task Manager
        </h1>
        <div className={styles.taskscreen}>
          {!showInput && (
            <button
              onClick={() => setShowInput(true)}
              className={styles.addTaskButton}
            >
              <span className={styles.addicon}>+</span>
              Add Task
            </button>
          )}

          {showInput && (
            <div className={styles.taskInput}>
              <input
                type="text"
                ref={taskNameRef}
                placeholder="Enter a new task"
                className={styles.inputField}
              />
              <input
                type="datetime-local"
                ref={dueDateTimeRef}
                className={styles.duedate}
              />
              <button onClick={addTask} className={styles.submitTaskButton}>
                <span className={styles.addicon}>+</span>
              </button>
            </div>
          )}
          <div className={styles.tasklist}>
            <h4>Your Tasks</h4>
            {inCompletedTask.length > 0 ? (
              inCompletedTask.map((task, index) => {
                console.log(task);
                const { formattedDate, formattedTime } = formatDateTime(
                  task.duedatetime
                );
                return (
                  <div key={index} className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <p className={styles.taskName}>{task.task}</p>
                      <div className={styles.taskDateTime}>
                        <span>Due date: {formattedDate}</span>
                        <span>Due time: {formattedTime}</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        backgroundColor: "transparent",
                        justifyContent: "right",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => changeStatus(task._id)}
                        className={styles.checkb}
                      >
                        {" "}
                        <span className={styles.check}>
                          <i
                            className="bi bi-check2"
                            style={{
                              backgroundColor: "whitesmoke",
                              color: "green",
                              border: "none",
                            }}
                          ></i>
                        </span>
                      </button>
                      <button
                        onClick={() => removeTask(task._id)}
                        className={styles.deleteButton}
                      >
                        <span className={styles.deleteIcon}>×</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p
                style={{ backgroundColor: "transparent", textAlign: "center" }}
              >
                No tasks available. Add a new task.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Todo;
