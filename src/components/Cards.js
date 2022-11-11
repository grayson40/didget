/*  Cards Componenet
 *
 *
 * 
 */



import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Collapse } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NotesContent from './NotesContent';
import ScheduleContent from './ScheduleContent';
import BudgetContent from './BudgetContent';
import {  PieChart, Pie, Cell, Legend } from 'recharts';
import { auth, db } from '../firebase';
import {
    collection,
    getDocs,
    query
  } from 'firebase/firestore';




export default function Cards({ date }) {
    const [budgetBool, setBudgetBool] = useState(false)
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
              const budgetsRef = await getDocs(
                query(
                  collection(db, `users/${user.id}/budgets`)
                )
              );
              if (budgetsRef.docs.length === 0) {
                setBudgetBool(false);
              } else {
                setBudgetBool(true);
                
              }
            }
        })
    }
}

  // Used to fetch users notes from firestore
  useEffect(() => {
    fetchData();
    console.log('in budget page effect')
  }, [])

    const [open1, setOpen1] = useState(true);
    // const [open2, setOpen2] = useState(true)
    const [open3, setOpen3] = useState(true);
    const [open4, setOpen4] = useState(true);
    

  //    Use sample data for the different categories of bar graph
  const data = [
    {name: 'Rent',          value: 600.00,  expense: 100, limit: 600, max: 100},
    {name: 'Groceries',     value: 138.25,   expense: 40,  limit: 200, max: 100},
    {name: 'Food',          value: 45.65,   expense: 60,  limit: 100, max: 100},
    {name: 'Insurance',     value: 200.00,  expense: 100, limit: 200, max: 100},
    {name: 'Academic',      value: 18.99,   expense: 25,  limit: 60, max: 100},
    {name: 'Entertainment', value: 75.00,   expense: 75,  limit: 100, max: 100}
  ];


  //    Use sample data for the different categories of pie chart
  const expenseData = [
    {name: 'Rent',          value: 600.00},
    {name: 'Groceries',     value: 38.25},
    {name: 'Food',          value: 22.18},
    {name: 'Insurance',     value: 200.00},
    {name: 'Academic',      value: 18.99},
    {name: 'Entertainment', value: 15.99}
  ];

  //    Use constants to hold colors for categories

  const limitColors = [
    '#5DADE2',
    '#45B39D',
    '#F4D03F',
    '#D35400',
    '#EC7063',
    '#A569BD'
  ];


    const [isBudget, setIsBudget] = useState(true);

  // Render Cards
  return (
    <div>
        <Container fixed = "top" fluid style = {{ paddingTop: '6%', paddingBottom: '6%', width: '600px', marginTop: "5%"}}>
            <Card className="mb-3 dashboardCard">
                <Button
                    onClick={() => setOpen1(!open1)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open1}
                    className="mb-2"
                >
                    Tasks
                </Button>
                <Collapse in={open1}>
                    <div>
                      <ScheduleContent showButton={false} inDate={date}/>
                    </div>
                </Collapse>
            </Card>
            <Card className="mb-3 dashboardCard">
                <Button
                    onClick={() => setOpen3(!open3)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open3}
                >
                    Financial
                </Button>
                <Collapse in={open3}>
                    <Container fluid style = {{ paddingTop: '6%', paddingBottom: '6%'}}>
                    <div class="container-fluid justify-content-center align-content-center" height={500}>
                        {budgetBool ?
                        /* Create a vertically aligned bar chart containing the dataset of limits and expense totals */
                        <BudgetContent notInCard={false} homepage = {true}/>
                       
                        :
                        /* Create a pie chart to hold the data of each individual category */
                        <PieChart width={400} height={250}>
                            <Pie data={expenseData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                            {
                                data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={limitColors[index]}/>
                                ))
                            }
                            </Pie>
                            <Legend layout='vertical' verticalAlign='middle' align='right'/>
                        </PieChart>
                        }
                        
                        <div style={{textAlign: 'center'}}>
                          <Button style={{marginRight: '20px'}} onClick={(e) => setIsBudget(true)}>Budget</Button>
                          <Button onClick={(e) => setIsBudget(false)}>Expenses</Button>
                        </div>
                        <BudgetContent isBudget={isBudget} inDate={date}/>
                    </div>
                    </Container>
                </Collapse>
            </Card>
            <Card className="mb-3 dashboardCard">
                <Button
                    onClick={() => setOpen4(!open4)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open4}
                >
                    Notes
                </Button>
                <Collapse in={open4}>
                    <div>
                        <NotesContent showButton={false} date={date}/>
                    </div>
                </Collapse>
            </Card>
        </Container>
    </div>
  );
}