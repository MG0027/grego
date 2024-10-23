import Sidebar from "./sidebar";
import styles from './dashboard.module.css';
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TaskPieChart from "./taskpiechart";
import { Link } from "react-router-dom";

function Dashboard() {
    const { name } = useSelector(state => state.user);
    const events = useSelector(state => state.event);
    const expenses = useSelector(state => state.expense);
    const incomes = useSelector(state=> state.income);

    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const headRef = useRef(null);
    useGSAP(() => {
        gsap.from(headRef.current, {
            x: -300,
            opacity: 0,
            duration: 1.5,
            delay: 0.5,
        });
    }, []);

    const totalIncome = incomes.filter(income => !income.hide).reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.filter(expense => !expense.hide).reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    const hasEventsToday = events.some(event => event.date?.split('T')[0] === todayDate);

    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <main className={styles.mainContent}>
                <h1 ref={headRef}>
                    <img src="/images/depositphotos_115133630-stock-illustration-namaste-icon-cartoon-style-removebg-preview.png" alt="Namaste" />
                    Namaste, {name}
                </h1>
                <div className={styles.y}>
                    <div className={styles.taskm}>
                        <TaskPieChart />
                        <button style={{backgroundColor:'royalblue',border:'1px solid grey'}}>
                            <Link to='/task' style={{ textDecoration: 'none', color: 'whitesmoke',backgroundColor:'transparent' }}>Check Your Tasks</Link>
                        </button>
                    </div>
                    <div className={styles.w}>
                        <div className={styles.x}>
                            <h4>Today's Scheduled Events</h4>
                            {hasEventsToday ? (
                                events.filter(event => event.date?.split('T')[0] === todayDate).map((event, index) => (
                                    <div key={index}>
                                        <h5>{event.event}</h5>
                                    </div>
                                ))
                            ) : (
                                <h5>No Events</h5>
                            )}
                            <button style={{backgroundColor:'whitesmoke', border:'1px solid black'}}><Link to='/calendar' style={{ textDecoration: 'none', color: 'black',backgroundColor:'transparent' }}>Check Events</Link></button>
                        </div>
                        <div className={styles.q}>
                            <div className={styles.z}><h4>Current Balance</h4></div>
                            <div className={styles.a}><h5 style={{ color: 'green' }}>Income:</h5> <h5>₹{totalIncome}</h5></div>
                            <div className={styles.b}><h5 style={{ color: 'red' }}>Expenses:</h5> <h5>₹{totalExpense}</h5></div>
                            <div className={styles.c}><h5>Balance:</h5> <h5>₹{balance}</h5></div>
                            <button><Link to='/expenses' style={{ textDecoration: 'none', color: 'white',backgroundColor:'transparent' }}>Track Now</Link></button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
