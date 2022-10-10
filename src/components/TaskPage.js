import React, { useState, useEffect } from 'react'
import { Card, Container } from 'react-bootstrap'
import TopBar from './TopBar'
import Task from './Task'
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function TaskPage(props) {
    // const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState([]);

    const d = new Date();
    const currentMonth = parseInt(d.getMonth() + 1);
    const currentDay = parseInt(d.getDate());

    async function fetchData() {
      if (auth.currentUser) {
        const usersRef = await getDocs(
          query(
            collection(db, 'users')
          )
        );
        // Iterate through the documents fetched
        usersRef.forEach(async (user) => {
          if (user.data().uid === auth.currentUser.uid) {
            const taskRef = await getDocs(
              query(
                collection(db, `users/${user.id}/tasks`)
              )
            );
            setTasks(
              taskRef.docs.map((task) => ({
                id: task.id,
                name: task.data().name,
                deadline: task.data().deadline,
                isChecked: task.data().isChecked
              }))
            )
          }
        })
      }
      console.log('fetching task data')
    }

    // Used to fetch users notes from firestore
    useEffect(() => {
      console.log('in effect')
      fetchData();
    }, [])

    // // date
    // const toDate = () => {
    //   const date = new Date();
    //   const today = `${date.getMonth() + 1}/${date.getDate()}`;
    //   return today;
    // };

    // Returns true if deadline is in current month
    const isInMonth = (value) => {
      const date = value.deadline
      const arr = date.split("/")

      return parseInt(arr[0]) === currentMonth;
    }

    // Returns true if deadlione is in current week
    const isInWeek = (value) => {
      const date = value.deadline
      const arr = date.split("/")
      const day = d.getDay();

      const weekStart = currentDay - day;
      const weekEnd = currentDay + 7 - day;

      return parseInt(arr[0]) === currentMonth && parseInt(arr[1]) >= weekStart && parseInt(arr[1]) <=weekEnd
    }

    // Returns true if deadline is current day
    const isToday = (value) => {
      const date = value.deadline
      const arr = date.split("/")

      return parseInt(arr[0]) === currentMonth && parseInt(arr[1]) === currentDay;
    }  

    return (
        <Container>
            {
              props.inCourse
              ? tasks.map((task) => (
                  <Task key={task.id} task={task} onUpdate={fetchData}/>
                ))
              : 
              <>
                <TopBar name="Tasks" />
                  {/*Card for Due Today*/}
                  <Card className="mb-4">
                      <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due Today</Card.Header>
                      <Card.Body>
                          {/*Card for each task*/}
                          {tasks.filter(isToday).map((task) => (
                              <Task key={task.id} task={task} onUpdate={fetchData}/>
                          ))}
                      </Card.Body>
                  </Card>

                  {/*Card for Due This Week*/}
                  <Card className="mb-4">
                      <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Week</Card.Header>
                      <Card.Body>
                          {/*Card for each task*/}
                          {tasks.filter(isInWeek).map((task) => (
                              <Task key={task.id} task={task} onUpdate={fetchData}/>
                          ))}
                      </Card.Body>
                  </Card>

                  {/*Card for Due This Month*/}
                  <Card className="mb-4">
                      <Card.Header style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>Due This Month</Card.Header>
                      <Card.Body>
                          {/*Card for each task*/}
                          {tasks.filter(isInMonth).map((task) => (
                              <Task key={task.id} task={task} onUpdate={fetchData}/>
                          ))}
                      </Card.Body>
                  </Card>

              </>
            }

        </Container>
    )
}
