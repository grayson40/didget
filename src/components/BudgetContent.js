import React, { useState, useRef, useEffect } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button, ProgressBar } from 'react-bootstrap'
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
import HabitItem from './HabitItem';
import ExpenseItem from './ExpenseItem';
import '../styles/budget.css'

// Color by category dictionaries
const bordFill =
{
  'rent': '#D2B4DE',
  'entertainment': '#E59866',
  'groceries': '#F5B7B1',
  'food': '#F9E79F',
  'insurance': '#AED6F1',
  'academic': '#A2D9CE',
  'debt': '#614d4b'
}

const backFill =
{
  'rent': '#A569BD',
  'entertainment': '#D35400',
  'groceries': '#EC7063',
  'food': '#F4D03F',
  'insurance': '#5DADE2',
  'academic': '#45B39D',
  'debt': '#423736'
}

// Symbol dictionary
const symbolsDict = {
  'Rent': '🏠',
  'Groceries': '🛒',
  'Food': '🍔',
  'Insurance': '📋',
  'Academic': '📚',
  'Entertainment': '🍿',
  'Debt': '💳'
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
  const [incomes, setIncomes] = useState([])
  const [month, setMonth] = useState(d.getMonth() + 1);
  const [year, setYear] = useState(d.getFullYear())
  const rentLimit = useRef();
  const groceriesLimit = useRef();
  const foodLimit = useRef();
  const insuranceLimit = useRef();
  const academicLimit = useRef();
  const entertainmentLimit = useRef();
  const debtLimit = useRef();
  const incomeRef = useRef();

  // const toDate = () => {
  //   let date = new Date();
  //   const today = `${date.getMonth() + 1}/${date.getFullYear()}`
  //   return today;
  // };


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

          const incomesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/incomes`)
            )
          );
          setIncomes(
            incomesRef.docs.map((income) => ({
              id: income.id,
              income: income.data().income,
              month: income.data().month,
              year: income.data().year
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
    var rentTotal = 0, groceriesTotal = 0, foodTotal = 0, insuranceTotal = 0, academicTotal = 0, entertainmentTotal = 0, debtTotal = 0;
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
          case "debt":
            debtTotal += parseInt(expense.total)
            break
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
      },
      {
        category: "Debt",
        limit: parseInt(debtLimit.current.value),
        current: debtTotal,
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

    const userRef = await getDocs(
      query(
        collection(db, "users")
      )
    );

    // Add budgets to db
    newBudgets.forEach(async (category) => {
      const newBudget = {
        category: category.category,
        limit: category.limit,
        current: category.current,
        month: category.month
      }
      userRef.docs.map(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          const collectionRef = collection(db, `users/${user.id}/budgets/`);
          await addDoc(collectionRef, newBudget);
        }
      })
    })

    if (incomes.filter(isInMonth).length === 0) {
      const newIncome = {
        income: parseInt(incomeRef.current.value),
        month: month,
        year: year
      }
      userRef.docs.map(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          const incomesRef = collection(db, `users/${user.id}/incomes/`);
          await addDoc(incomesRef, newIncome);
        }
      })
    }

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

  const expenseInMonth = (value) => {
    const arr = value.date.split('/')
    const _month = parseInt(arr[0])
    return _month === month;
  }

  const calculateExpenseTotal = () => {
    let total = 0;
    expenses.filter(expenseInMonth).forEach((expense) => {
      total += expense.total
    })
    return total
  }

  const calculateIncomeAverage = () => {
    let total = 0
    let count = 0
    if (incomes.length === 0) return 0
    incomes.forEach((income) => {
          total += income.income
          count++
    })
    return parseInt(total/count)
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
    const expDate = new Date(value.date)
    const d = new Date(inDate)
    return expDate.getMonth() === d.getMonth() && expDate.getDate() === d.getDate()
  }

  const updateIncome = async (id, newIncome) => {
    console.log(`${id} ${newIncome}`)
    incomes.forEach((income) => {
      if (income.id === id) {
        income.income = parseInt(newIncome)
        console.log('set new Income')
      }
    })
    setIncomes(incomes)
    const userRef = await getDocs(
      query(
        collection(db, "users")
      )
    );
    userRef.docs.map(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const incomesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/incomes/`)
          )
        );
        incomesRef.docs.forEach(async (income) => {
          console.log(income.id)
          if (income.id === id) {
            console.log('in here')
            const docRef = doc(db, `users/${user.id}/incomes/${income.id}`)
            await updateDoc(docRef, {income: parseInt(newIncome)})
              .then(console.log('document updated'))
          }
        })
      }
    })
    fetchData()
  }

  const InlineEdit = ({ element }) => {
    const [editingValue, setEditingValue] = useState(element.income);
    
    const onChange = (event) => {
      setEditingValue(event.target.value);
    }
    
    const onKeyDown = (event) => {
      if (event.key === "Enter" || event.key === "Escape") {
        event.target.blur();
      }
    }
    
    const onBlur = (event) => {
      const val = parseInt(event.target.value)
      if (event.target.value.trim() === "") {
        setEditingValue(element.income);
      } else {
        if (val !== element.income) {
          updateIncome(element.id, val)
        }
      }
    }
  
    return (
      <input
        class='inline'
        type="text"
        aria-label="Field name"
        value={editingValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    )
  }

  const deleteIncome = async (id) => {
    const newIncomes = incomes.filter((income) => income.id !== id)
    setIncomes(newIncomes)
    const userRef = await getDocs(
      query(
        collection(db, "users")
      )
    );
    userRef.docs.map(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        const incomesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/incomes/`)
          )
        );
        incomesRef.docs.forEach(async (income) => {
          console.log(income.id)
          if (income.id === id) {
            console.log('in here')
            const docRef = doc(db, `users/${user.id}/incomes/${income.id}`)
            await deleteDoc(docRef)
              .then(console.log('document deleted'))
          }
        })
      }
    })
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

        {/* Income Card */}
        {incomes.filter(isInMonth).length !== 0 ?
          incomes.filter(isInMonth).map((income) => (
            <Card style={{ color: 'white', width: '500px', textAlign: "Center" }} className="mb-2">
              <Card.Header>
                <Row className="mb-2">
                  <Col className="border-end">Income</Col>
                  <Col>$<InlineEdit element={income}/> <Button onClick={(e) => deleteIncome(income.id)}><FaTrashAlt /></Button></Col>
                </Row>
                <Row>
                  <Col>
                    {calculateExpenseTotal() < income.income
                      ? <ProgressBar animated variant="success" now={(calculateExpenseTotal()/income.income * 100)} label={`$${calculateExpenseTotal()}`} />
                      : <ProgressBar animated variant="danger" now={(calculateExpenseTotal()/income.income * 100)} label={`$${calculateExpenseTotal()}`} />
                    }
                  </Col>
                </Row>
              </Card.Header>
            </Card>
          ))
          : <p>{`No income for ${monthsDict[month]}`}</p>
        }

        {/* popup add window */}
        <Modal show={open} onClose={handleClose} onHide={handleClose}>
          <Modal.Body>
            <h2 className='text-center mb-4'>Create Budget</h2>
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
            <Form>
              {/* TODO: add budget category and limit fields */}
              <Form.Group id='income'>
                <Row className="mb-2">
                  <Col className="border-end">Income</Col>
                  <Col>
                  {incomes.filter(isInMonth).length === 0 
                  ?<Form.Control type='income' ref={incomeRef} placeholder={calculateIncomeAverage()}/>
                  :<p>Income already set</p>
                  }
                  </Col>
                </Row>
              </Form.Group>
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
              <Form.Group id='debt'>
                <Row className="mb-2">
                  <Col className="border-end">Debt</Col>
                  <Col>
                    <Form.Control type='debt' ref={debtLimit} />
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
                          index = {index}
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
                    : <p>No expenses for today</p>
                  }
                </>
              }
            </>
        }

        <HabitItem />
        
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