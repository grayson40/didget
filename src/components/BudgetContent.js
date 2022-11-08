import React, { useState, useRef, useEffect } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button } from 'react-bootstrap'
import Fab from '@mui/material/Fab';
import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import { ReferenceLine, BarChart, Bar, Cell, XAxis, YAxis } from 'recharts';
import {
  collection,
  getDocs,
  query,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import BudgetItem from './BudgetItem';
import ExpenseItem from './ExpenseItem';

// Color by category dictionaries
const bordFill =
{
  'rent': '#D2B4DE',
  'entertainment': '#E59866',
  'groceries': '#F5B7B1',
  'food': '#F9E79F',
  'insurance': '#AED6F1',
  'academic': '#A2D9CE',
}

const backFill =
{
  'rent': '#A569BD',
  'entertainment': '#D35400',
  'groceries': '#EC7063',
  'food': '#F4D03F',
  'insurance': '#5DADE2',
  'academic': '#45B39D',
}

// Symbol dictionary
const symbolsDict = {
  'Rent': '🏠',
  'Groceries': '🛒',
  'Food': '🍔',
  'Insurance': '📋',
  'Academic': '📚',
  'Entertainment': '🍿'
}

const monthsDict = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

const d = new Date();

export default function BudgetContent({ notInCard, inDate, showButton, isBudget }) {
  if (notInCard !== false) notInCard = true;
  const [open, setOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([])
  const [month, setMonth] = useState(d.getMonth() + 1);
  const [year, setYear] = useState(d.getFullYear())
  const rentLimit = useRef();
  const groceriesLimit = useRef();
  const foodLimit = useRef();
  const insuranceLimit = useRef();
  const academicLimit = useRef();
  const entertainmentLimit = useRef();

  /**
   * Fetches budget data from firebase. Sets budget and graph state.
   * @returns void
   */
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

          setBudgets(
            budgetsRef.docs.map((category) => ({
              id: category.id,
              category: category.data().category,
              limit: category.data().limit,
              current: category.data().current,
              month: category.data().month
            }))
          )
          setGraphData(
            budgetsRef.docs.map((category, index) => ({
              name: category.data().category,
              symbol: symbolsDict[category.data().category],
              value: category.data().current,
              expense: category.data().current / category.data().limit * 100,
              max: 100,
              month: category.data().month
            }))
          )

          // Iterate through expenses and add to category total
          const expensesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/expenses/`)
            )
          );
          setExpenses(
            expensesRef.docs.map((expense) => ({
              id: expense.data().id,
              category: expense.data().category,
              place: expense.data().place,
              total: expense.data().total,
              date: expense.data().date
            }))
          )
        }
      })
    }
    console.log('fetching budget data')
  }

  // Used to fetch users notes from firestore
  useEffect(() => {
    fetchData();
    console.log('in budget page effect')
  }, [])

  /**
   * Closes the add budget modal.
   */
  const handleClose = () => {
    setOpen(false);
  }

  /**
   * Updates the budget state and asynchronously updates the budget item in firebase.
   * @param {*} updatedBudget The updated budget item.
   * @returns void
   */
  const updateBudget = async (id, updatedLimit) => {
    budgets.forEach((budget) => {
      if (budget.id === id) {
        // Update budget
        budget.limit = updatedLimit
      }
    });
    setBudgets(budgets);

    setGraphData(
      budgets.map((category, index) => ({
        name: category.category,
        symbol: symbolsDict[category.category],
        value: category.current,
        expense: category.current / category.limit * 100,
        max: 100,
        month: category.month
      }))
    )

    // update budget in db
    console.log(`${id} ${updatedLimit}`)
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    usersRef.docs.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const budgetsRef = await getDocs(
          query(
            collection(db, `users/${user.id}/budgets`)
          )
        );
        budgetsRef.forEach(async (budget) => {
          if (budget.id === id) {
            const docRef = doc(db, `users/${user.id}/budgets/${budget.id}`)
            await updateDoc(docRef, { limit: updatedLimit })
              .then(() => {
                console.log('document updated')
              })
          }
        })
      }
    })
  }

  /**
   * Appends to budget state array and asynchronously adds the budget item in firebase.
   * @returns void
   */
  const createBudget = async () => {
    var rentTotal = 0, groceriesTotal = 0, foodTotal = 0, insuranceTotal = 0, academicTotal = 0, entertainmentTotal = 0;
    expenses.forEach((expense) => {
      let arr = expense.date.split('/')
      let expenseMonth = parseInt(arr[0])
      if (expenseMonth === month) {
        switch (expense.category) {
          case "rent":
            rentTotal += parseInt(expense.total)
            break;
          case "groceries":
            groceriesTotal += parseInt(expense.total)
            break;
          case "food":
            foodTotal += parseInt(expense.total)
            break;
          case "insurance":
            insuranceTotal += parseInt(expense.total)
            break;
          case "academic":
            academicTotal += parseInt(expense.total)
            break;
          case "entertainment":
            entertainmentTotal += parseInt(expense.total)
            break;
          default:
            break;
        }
      }
    })
    const newBudgets = [
      {
        category: "Rent",
        limit: parseInt(rentLimit.current.value),
        current: rentTotal,
        month: month
      },
      {
        category: "Groceries",
        limit: parseInt(groceriesLimit.current.value),
        current: groceriesTotal,
        month: month
      },
      {
        category: "Food",
        limit: parseInt(foodLimit.current.value),
        current: foodTotal,
        month: month
      },
      {
        category: "Insurance",
        limit: parseInt(insuranceLimit.current.value),
        current: insuranceTotal,
        month: month
      },
      {
        category: "Academic",
        limit: parseInt(academicLimit.current.value),
        current: academicTotal,
        month: month
      },
      {
        category: "Entertainment",
        limit: parseInt(entertainmentLimit.current.value),
        current: entertainmentTotal,
        month: month
      }
    ]

    newBudgets.forEach((budget) => {
      setBudgets((current) => [...current, budget]);
    })

    setGraphData(
      newBudgets.filter(isInMonth).map((category) => ({
        name: category.category,
        symbol: symbolsDict[category.category],
        value: category.current,
        expense: category.current / category.limit * 100,
        max: 100,
        month: category.month
      }))
    )

    // Add budgets to db
    newBudgets.forEach(async (category) => {
      const newBudget = {
        category: category.category,
        limit: category.limit,
        current: category.current,
        month: category.month
      }
      const userRef = await getDocs(
        query(
          collection(db, "users")
        )
      );
      userRef.docs.map(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          const collectionRef = collection(db, `users/${user.id}/budgets/`);
          await addDoc(collectionRef, newBudget);
        }
      })
    })

    fetchData()
    handleClose()
  }

  const deleteBudgets = async () => {
    const newBudgets = budgets.filter((value) => value.month !== month)
    const newGraph = graphData.filter((value) => value.month !== month)
    setBudgets(newBudgets)
    setGraphData(newGraph)
    console.log('deleting budgets')
    const userRef = await getDocs(
      query(
        collection(db, "users")
      )
    );
    userRef.docs.map(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const budgetsRef = await getDocs(
          query(
            collection(db, `users/${user.id}/budgets/`)
          )
        );
        budgetsRef.docs.forEach(async (budget) => {
          if (budget.data().month === month) {
            const docRef = doc(db, `users/${user.id}/budgets/${budget.id}`)
            await deleteDoc(docRef)
              .then(() => {
                console.log('document deleted')
              })
          }
        })
      }
    })
  }

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  // Returns true if budget is in current month
  const isInMonth = (value) => {
    const inMonth = value.month
    return inMonth === month;
  }

  const cardFilter = (value) => {
    // console.log(inDate)
    const arr = inDate.split('/')
    const cardMonth = parseInt(arr[0])
    const inMonth = value.month
    // console.log(`${inMonth} ${cardMonth}`)
    return inMonth === cardMonth
  }

  const expenseFilter = (value) => {
    const arr1 = value.date.split('/')
    const arr2 = inDate.split('/')
    const cardMonth = parseInt(arr1[0])
    const inMonth = parseInt(arr2[0])
    // console.log(`${inMonth} ${cardMonth}`)
    return inMonth === cardMonth
  }

  return (
    <Container fluid style={{ paddingTop: '6%', paddingBottom: '6%', top: "5%", justifyContent: "flex-center" }}>
      {/* Create a vertically aligned bar chart containing the dataset of limits and expense totals */}
      <Container style={{ width: '600px', marginTop: '5%', marginBottom: '5%' }}>
        {showButton ?
          <>
            {graphData.filter(isInMonth).length !== 0 ?
              <BarChart data={graphData.filter(isInMonth)} layout="vertical" width={600} height={250} >
                <Bar dataKey="expense" fill='#FFA07A' barSize={10}>
                  {
                    graphData.filter(isInMonth).map((entry, index) => (
                      <Cell key={'expense'} fill={bordFill[entry.name.toLowerCase()]} />
                    ))
                  }
                </Bar>
                <Bar dataKey="max" barSize={10}>
                  {
                    graphData.filter(isInMonth).map((entry, index) => (
                      <Cell key={'limit'} fill={backFill[entry.name.toLowerCase()]} />
                    ))
                  }
                </Bar>
                {/*
                
                NOTICE NOTICE NOTICE
                BELOW FOR DARK/LIGHT MODES CHANGE STROKE TO BE THE COLOR DESIRED
      
                */}
                <XAxis stroke="black" type="number" reversed />
                <YAxis stroke="black" type="category" width={150} padding={{ left: 20 }} orientation={"right"} dataKey="symbol" />
                <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
              </BarChart>
              : null
            }
          </>
          :
          <>
            {isBudget ?
              <> {graphData.filter(cardFilter).length !== 0 ?
                <BarChart data={graphData.filter(cardFilter)} layout="vertical" width={600} height={250} >
                  <Bar dataKey="expense" fill='#FFA07A' barSize={10}>
                    {
                      graphData.filter(isInMonth).map((entry, index) => (
                        <Cell key={'expense'} fill={bordFill[entry.name.toLowerCase()]} />
                      ))
                    }
                  </Bar>
                  <Bar dataKey="max" barSize={10}>
                    {
                      graphData.filter(isInMonth).map((entry, index) => (
                        <Cell key={'limit'} fill={backFill[entry.name.toLowerCase()]} />
                      ))
                    }
                  </Bar>
                  {/*
                
                NOTICE NOTICE NOTICE
                BELOW FOR DARK/LIGHT MODES CHANGE STROKE TO BE THE COLOR DESIRED
      
                */}
                  <XAxis stroke="black" type="number" reversed />
                  <YAxis stroke="black" type="category" width={150} padding={{ left: 20 }} orientation={"right"} dataKey="symbol" />
                  <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
                </BarChart>
                : <p>{`No budget for ${monthsDict[parseInt(inDate.split('/')[0])]}`}</p>
              }
              </>
              : null
            }
          </>
        }

        {/* popup add window */}
        <Modal show={open} onClose={handleClose} onHide={handleClose}>
          <Modal.Body>
            <h2 className='text-center mb-4'>Create Budget</h2>
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
            <Form>
              <Form.Group id='rent'>
                <Row className="mb-2">
                  <Col className="border-end">Rent</Col>
                  <Col>
                    <Form.Control type='rent' ref={rentLimit} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group id='groceries'>
                <Row className="mb-2">
                  <Col className="border-end">Groceries</Col>
                  <Col>
                    <Form.Control type='groceries' ref={groceriesLimit} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group id='food'>
                <Row className="mb-2">
                  <Col className="border-end">Food</Col>
                  <Col>
                    <Form.Control type='food' ref={foodLimit} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group id='insurance'>
                <Row className="mb-2">
                  <Col className="border-end">Insurance</Col>
                  <Col>
                    <Form.Control type='insurance' ref={insuranceLimit} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group id='academic'>
                <Row className="mb-2">
                  <Col className="border-end">Academic</Col>
                  <Col>
                    <Form.Control type='academic' ref={academicLimit} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group id='entertainment'>
                <Row className="mb-2">
                  <Col className="border-end">Entertainment</Col>
                  <Col>
                    <Form.Control type='entertainment' ref={entertainmentLimit} />
                  </Col>
                </Row>
              </Form.Group>
              <Button className='w-100 mt-3' onClick={createBudget}>
                Create Budget
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {
          showButton ?
            <>
              <Container style={{ width: '600px', marginTop: '5%', marginBottom: '5%' }}>
                <Row>
                  <Col sm={4}>
                    <Button onClick={prevMonth}>Prev</Button>
                  </Col>
                  <Col >{`${monthsDict[month]} ${year}`}</Col>
                  <Col sm={4}>
                    <Button onClick={nextMonth}>Next</Button>
                  </Col>
                </Row>
              </Container>
              <>
                {budgets.filter(isInMonth).length !== 0 ?
                  <>
                    <Card style={{ width: '500px', textAlign: "Center" }} className="mb-2">
                      <Card.Header>
                        Budget
                      </Card.Header>
                      <Card.Header>
                        <Row>
                          <Col className="border-end">Category</Col>
                          <Col>Limit</Col>
                        </Row>
                      </Card.Header>
                    </Card>
                    {budgets.filter(isInMonth).map((item, index) => (
                      <>
                        <BudgetItem
                          key={index}
                          item={item}
                          bordColor={backFill[item.category.toLowerCase()]}
                          backColor={bordFill[item.category.toLowerCase()]}
                          onUpdate={updateBudget}
                        />
                      </>
                    ))
                    }
                  </>
                  : <p>{`No budget for ${monthsDict[month]}`}</p>
                }
              </>
            </>
            :
            <>
              {isBudget ?
                <>{budgets.filter(cardFilter).map((item, index) => (
                  <BudgetItem
                    key={index}
                    item={item}
                    bordColor={backFill[item.category.toLowerCase()]}
                    backColor={bordFill[item.category.toLowerCase()]}
                    onUpdate={updateBudget}
                  />
                ))
                }
                </>
                :
                <>
                  {expenses.filter(expenseFilter).length !== 0 ?
                    <>
                      {expenses.filter(expenseFilter).map((expense, index) => (
                        <ExpenseItem
                          key={index}
                          expense={expense}
                          bordColor={backFill[expense.category.toLowerCase()]}
                          backColor={bordFill[expense.category.toLowerCase()]}
                        />
                      ))}
                    </>
                    : <p>{`No expenses for ${monthsDict[parseInt(inDate.split('/')[0])]}`}</p>
                  }
                </>
              }
            </>
        }

      </Container>
      {showButton &&
        <>
          {
            budgets.filter(isInMonth).length !== 0 ? (<Container style={{ width: '100px', position: "fixed", right: '15%', bottom: "3%", display: 'flex' }}>
              <Fab size={"80px"} color="primary" onClick={deleteBudgets}>
                <FaTrashAlt size={"30px"} />
              </Fab>
            </Container>) : (<Container style={{ width: '100px', position: "fixed", right: '15%', bottom: "3%", display: 'flex' }}>
              <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
                <FaPlus size={"30px"} />
              </Fab>
            </Container>)
          }
        </>
      }
    </Container>
  )
}