import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes/App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from './routes/login.jsx';
import Signup from './routes/signup.jsx';
import Home from './routes/home.jsx';
import { Provider } from 'react-redux';
import gregoStore from './store/index.js';
import Features from './components/features.jsx';
import Dashboard from './components/dashboard.jsx';
import Todo from './routes/todo.jsx';
import Expenses from './routes/expense.jsx';
import Calendar from './routes/calendar.jsx';
import Bot from './routes/bot.jsx';
import MyCalendar from './routes/calendar.jsx';
import EventCalendar from './routes/calendar.jsx';
import CalendarComponent from './routes/calendar.jsx';
import KeepAlive from './routes/KeepAlive.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      
      {
        path: "/login",
        element: <Login/>
       
      },
      {
        path: "/signup",
        element: <Signup/>
       
      },
      {
        path: "/features",
        element: <Features></Features>
       
      },
      
      {
        path: "/task",
        element: <Todo></Todo>
       
      },
      {
        path: "/expenses",
        element: <Expenses></Expenses>
       
      },
      {
        path: "/calendar",
        element: <CalendarComponent></CalendarComponent>
       
      },
      {
        path: "/bot",
        element: <Bot></Bot>
       
      },
      { path: '/keep-alive', element: <KeepAlive /> },
    ],
   
  
  },
]);


createRoot(document.getElementById('root')).render(
  
    <Provider store={gregoStore}>
     <RouterProvider router={router}/>
    </Provider>
 
)
