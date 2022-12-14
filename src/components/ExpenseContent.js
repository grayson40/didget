import React, { useState, useRef, useEffect } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button, Alert, DropdownButton } from 'react-bootstrap'
import Fab from '@mui/material/Fab'
import { FaPlus } from 'react-icons/fa'
import { uuidv4 } from '@firebase/util'
import { PieChart, Pie, Cell, Legend } from 'recharts'
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
import ExpenseItem from './ExpenseItem'

// Date object
const d = new Date();
const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 1);

// Budget colors
const categoryFill =
{
  rent: '#F06292',
  entertainment: '#FFF176',
  groceries: '#9575CD',
  food: '#64B5F6',
  insurance: '#4DD0E1',
  academic: '#81C784',
  debt: 'black',
}

// Color by category dictionaries
const expenseFill =
{
  'rent': '#D2B4DE',
  'entertainment': '#E59866',
  'groceries': '#F5B7B1',
  'food': '#F9E79F',
  'insurance': '#AED6F1',
  'academic': '#A2D9CE',
  'debt': '#705e5c'
}

const limitFill =
{
  'rent': '#A569BD',
  'entertainment': '#D35400',
  'groceries': '#EC7063',
  'food': '#F4D03F',
  'insurance': '#5DADE2',
  'academic': '#45B39D',
  'debt': '#473433',
}


export default function Expenses({ notInCard, showButton, inFinancial }) {
  if (notInCard !== false) notInCard = true;
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('')
  const [userId, setUserId] = useState()
  var [rentTotal, setRentTotal] = useState(0)
  var [groceryTotal, setGroceryTotal] = useState(0)
  var [foodTotal, setFoodTotal] = useState(0)
  var [insuranceTotal, setInsuranceTotal] = useState(0)
  var [academicTotal, setAcademicTotal] = useState(0)
  var [entertainmentTotal, setEntertainmentTotal] = useState(0)
  var [debtTotal, setDebtTotal] = useState(0)
  const [startDate, setStartDate] = useState(new Date(firstDay))
  const [endDate, setEndDate] = useState(new Date(lastDay))
  const place = useRef();
  const total = useRef();
  const category = useRef();
  const date = useRef();
  const dataFetchedRef = useRef(false);

  // List to store graph data objects
  var graphData = [
    {
      category: "rent",
      spent: rentTotal,
      fill: categoryFill.rent
    },
    {
      category: "groceries",
      spent: groceryTotal,
      fill: categoryFill.groceries
    },
    {
      category: "food",
      spent: foodTotal,
      fill: categoryFill.food
    },
    {
      category: "insurance",
      spent: insuranceTotal,
      fill: categoryFill.insurance
    },
    {
      category: "academic",
      spent: academicTotal,
      fill: categoryFill.academic
    },
    {
      category: "entertainment",
      spent: entertainmentTotal,
      fill: categoryFill.entertainment
    },
    {
      category: "debt",
      spent: debtTotal,
      fill: categoryFill.debt
    }
  ]

  /**
   * Closes the add budget modal.
   */
  const handleClose = () => {
    setOpen(false);
    setError('')
  };

  /**
   * Fetches expense data from firebase. Sets expense and graph state arrays.
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

          setUserId(user.id)

          const expensesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/expenses/`)
            )
          );

          expensesRef.docs.forEach((expense) => {
            const _expense = {
              id: expense.data().id,
              category: expense.data().category,
              place: expense.data().place,
              total: expense.data().total,
              date: expense.data().date
            }
            setExpenses((current) => [...current, _expense])

            switch (_expense.category) {
              case "rent":
                setRentTotal(rentTotal + _expense.total);
                console.log("adding " + rentTotal + " rent");
                break;
              case "groceries":
                setGroceryTotal(groceryTotal + _expense.total);
                console.log("adding " + groceryTotal + " groc");
                break;
              case "food":
                setFoodTotal(foodTotal + _expense.total);
                console.log("adding " + foodTotal + " food");
                break;
              case "insurance":
                setInsuranceTotal(insuranceTotal + _expense.total);
                console.log("adding " + insuranceTotal + " insu");
                break;
              case "academic":
                setAcademicTotal(academicTotal + _expense.total);
                console.log("adding " + academicTotal + " acad");
                break;
              case "entertainment":
                setEntertainmentTotal(entertainmentTotal + _expense.total);
                console.log("adding " + entertainmentTotal + " entr");
                break;
              case "debt":
                setDebtTotal(debtTotal + _expense.total)
                console.log("adding " + debtTotal + " debt")
                break
              default:
                break;
            }
          })
        }
      })
    }
    console.log('fetching expense data')
  }

  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    fetchData();
    dataFetchedRef.current = true;
    console.log('in expense page effect')
  }, [])

  /**
   * Appends to expense state array and asynchronously adds the expense item in firebase.
   * @returns void
   */
  const addExpense = async () => {
    // Add expense to screen
    if (category.current.value === '') {
      setError('Error: Category cannot be empty')
    } else if (place.current.value === '') {
      setError('Error: Place cannot be empty')
    } else if (total.current.value === '') {
      setError('Error: Total cannot be empty')
    } else if (category.current.value === 'Select Category ...') {
      setError('Error: Category cannot be empty')
    } else {
      const newExpense = {
        id: uuidv4(),
        category: category.current.value,
        place: place.current.value,
        total: parseInt(total.current.value),
        date: date.current.value === '' ? d.toLocaleDateString() : date.current.value
      };
      const newExpenses = [...expenses, newExpense];
      setExpenses(newExpenses);

      switch (newExpense.category) {
        case "rent":
          setRentTotal(rentTotal + newExpense.total);
          break;
        case "groceries":
          setGroceryTotal(groceryTotal + newExpense.total);
          break;
        case "food":
          setFoodTotal(foodTotal + newExpense.total);
          break;
        case "insurance":
          setInsuranceTotal(insuranceTotal + newExpense.total);
          break;
        case "academic":
          setAcademicTotal(academicTotal + newExpense.total);
          break;
        case "entertainment":
          setEntertainmentTotal(entertainmentTotal + newExpense.total);
          break;
        case "debt":
          setDebtTotal(debtTotal + newExpense.total)

          // Get the debtCollectionRef and get its docs
          const debtsRef = await getDocs(
            query(
              collection(db, `users/${userId}/debts/`)
            )
          )

          // Get all the debts and set their debtPaid values to 0
          debtsRef.docs.forEach(async (debt) => {

            // Create a new debt
            const _debt = {
              id: debt.data().id,
              debtName: debt.data().debtName,
              debtVal: debt.data().debtVal,
              debtPaid: debt.data().debtPaid
            }

            // If there's a corresponding debt to the newExpense, update its debtPaid attr
            if (_debt.debtName.toLowerCase() === newExpense.place.toLowerCase()) {
              _debt.debtPaid += newExpense.total

              console.log(_debt)

              // Get the docRef
              const debtDocRef = doc(db, `users/${userId}/debts/${debt.id}`)

              // Update the doc
              await updateDoc(debtDocRef, { debtPaid: _debt.debtPaid })
                .then(() => {
                  console.log(`Debt id ${_debt.id} updated`)
                })
                .catch(error => {
                  setError(error.toString())
                })
            }
          })
          break
        default:
          break;
      }

      // Add expense to db
      const userRef = await getDocs(
        query(
          collection(db, "users")
        )
      );
      userRef.docs.forEach(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          const userRef = await getDocs(
            query(
              collection(db, "users")
            )
          );
          userRef.docs.map(async (user) => {
            if (user.data().uid === auth.currentUser.uid) {
              // Add expense to expenses collection
              const expensesRef = collection(db, `users/${user.id}/expenses/`);
              await addDoc(expensesRef, newExpense);

              // Update current for budget category
              const budgetsRef = await getDocs(
                query(
                  collection(db, `users/${user.id}/budgets/`)
                )
              );
              let arr = newExpense.date.split('/')
              let expenseMonth = parseInt(arr[0])
              budgetsRef.docs.forEach(async (budget) => {
                if (budget.data().category.toLowerCase() === newExpense.category.toLowerCase() && budget.data().month === expenseMonth) {
                  const docRef = doc(db, `users/${user.id}/budgets/${budget.id}`)
                  const updatedCurrent = parseInt(budget.data().current) + newExpense.total;
                  await updateDoc(docRef, { current: updatedCurrent })
                    .then(console.log(`${budget.data().category} current for month ${budget.data().month} updated`))
                }
              })
            }
          })
        }
      })

      handleClose()
    }
  };

  /**
   * Updates the expense state and asynchronously updates the expense item in firebase.
   * @param {*} updatedExpense The updated expense item.
   * @param {*} id The id of the expense item.
   * @returns void
   */
  const updateExpense = async (id, updatedExpense) => {

    // Update on screen
    let totalDifference = 0;
    console.log(`updating ${id}`)
    expenses.forEach((expense) => {
      if (expense.id === id) {
        // calculate total difference for budget current
        if (expense.total !== updatedExpense.total) {
          totalDifference = updatedExpense.total - expense.total;
        }

        // Update expense
        expense.id = updatedExpense.id;
        expense.category = updatedExpense.category;
        expense.place = updatedExpense.place;
        expense.total = updatedExpense.total;
        expense.date = updatedExpense.date;
      }
    });
    setExpenses(expenses);

    switch (updatedExpense.category.toLowerCase()) {
      case "rent":
        setRentTotal(rentTotal + totalDifference);
        break;
      case "groceries":
        setGroceryTotal(groceryTotal + totalDifference);
        break;
      case "food":
        setFoodTotal(foodTotal + totalDifference);
        break;
      case "insurance":
        setInsuranceTotal(insuranceTotal + totalDifference);
        break;
      case "academic":
        setAcademicTotal(academicTotal + totalDifference);
        break;
      case "entertainment":
        setEntertainmentTotal(entertainmentTotal + totalDifference);
        break;
      case "debt":
        setDebtTotal(debtTotal + totalDifference)

        // Get the debtCollectionRef and get its docs
        const debtsRef = await getDocs(
          query(
            collection(db, `users/${userId}/debts/`)
          )
        )

        // Get all the debts and set their debtPaid values to 0
        debtsRef.docs.forEach(async (debt) => {

          // Create a new debt
          const _debt = {
            id: debt.data().id,
            debtName: debt.data().debtName,
            debtVal: debt.data().debtVal,
            debtPaid: debt.data().debtPaid
          }

          // If there's a corresponding debt to the newExpense, update its debtPaid attr
          if (_debt.debtName.toLowerCase() === updatedExpense.place.toLowerCase()) {
            _debt.debtPaid += totalDifference

            console.log(_debt)

            // Get the docRef
            const debtDocRef = doc(db, `users/${userId}/debts/${debt.id}`)

            // Update the doc
            await updateDoc(debtDocRef, { debtPaid: _debt.debtPaid })
              .then(() => {
                console.log(`Debt id ${_debt.id} updated`)
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })
        break
      default:
        break;
    }

    // Update in firebase
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    // Iterate through the documents fetched
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        // Update expense
        const expensesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/expenses/`)
          )
        );
        expensesRef.docs.forEach(async (expense) => {
          if (expense.data().id === id) {
            // Update expense
            const docRef = doc(db, `users/${user.id}/expenses/${expense.id}`)
            await updateDoc(docRef, updatedExpense)
              .then(() => {
                console.log('document updated')
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })

        // Update budget category current
        const budgetsRef = await getDocs(
          query(
            collection(db, `users/${user.id}/budgets/`)
          )
        );
        let arr = updatedExpense.date.split('/')
        let expenseMonth = parseInt(arr[0])
        budgetsRef.docs.forEach(async (budget) => {
          if (budget.data().category.toLowerCase() === updatedExpense.category && budget.data().month === expenseMonth) {
            const updatedCurrent = budget.data().current + totalDifference;
            const budgetRef = doc(db, `users/${user.id}/budgets/${budget.id}`);
            // Update budget current
            await updateDoc(budgetRef, { current: updatedCurrent })
              .then(() => {
                console.log(`${budget.data().category} current of month ${budget.data().month} updated`)
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })
      }
    })
  }

  /**
   * Updates the expense state and asynchronously deletes the expense item in firebase.
   * @param {*} id The id of the expense item.
   * @returns void
   */
  const deleteExpense = async (id) => {

    let deletedExpensePlace = null
    let deletedExpenseCategory = null
    let deletedExpenseTotal = null
    let deletedExpenseDate = null
    console.log(`deleting ${id}`)
    const newExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(newExpenses);

    const usersRef = await getDocs(
      query(
        collection(db, 'users')
      )
    );
    // Iterate through the documents fetched
    usersRef.forEach(async (user) => {
      if (user.data().uid === auth.currentUser.uid) {
        // Delete expense from db
        const expensesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/expenses/`)
          )
        );
        expensesRef.docs.forEach(async (expense) => {
          if (expense.data().id === id) {
            // Update expense
            const docRef = doc(db, `users/${user.id}/expenses/${expense.id}`)
            deletedExpensePlace = expense.data().place
            deletedExpenseCategory = expense.data().category
            deletedExpenseTotal = expense.data().total
            deletedExpenseDate = expense.data().date
            await deleteDoc(docRef)
              .then(() => {
                console.log('document deleted')
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })

        switch (deletedExpenseCategory.toLowerCase()) {
          case "rent":
            setRentTotal(rentTotal - deletedExpenseTotal);
            break;
          case "groceries":
            setGroceryTotal(groceryTotal - deletedExpenseTotal);
            break;
          case "food":
            setFoodTotal(foodTotal - deletedExpenseTotal);
            break;
          case "insurance":
            setInsuranceTotal(insuranceTotal - deletedExpenseTotal);
            break;
          case "academic":
            setAcademicTotal(academicTotal - deletedExpenseTotal);
            break;
          case "entertainment":
            setEntertainmentTotal(entertainmentTotal - deletedExpenseTotal);
            break;
          case "debt":
            setDebtTotal(debtTotal - deletedExpenseTotal)

            // Get the debtCollectionRef and get its docs
            const debtsRef = await getDocs(
              query(
                collection(db, `users/${userId}/debts/`)
              )
            )

            // Get all the debts and set their debtPaid values to 0
            debtsRef.docs.forEach(async (debt) => {

              // Create a new debt
              const _debt = {
                id: debt.data().id,
                debtName: debt.data().debtName,
                debtVal: debt.data().debtVal,
                debtPaid: debt.data().debtPaid
              }

              console.log(`wanting to delete ${deletedExpensePlace}`)

              // If there's a corresponding debt to the newExpense, update its debtPaid attr
              if (_debt.debtName.toLowerCase() === deletedExpensePlace.toLowerCase()) {
                _debt.debtPaid -= deletedExpenseTotal

                console.log(_debt)

                // Get the docRef
                const debtDocRef = doc(db, `users/${userId}/debts/${debt.id}`)

                // Update the doc
                await updateDoc(debtDocRef, { debtPaid: _debt.debtPaid })
                  .then(() => {
                    console.log(`Debt id ${_debt.id} updated`)
                  })
                  .catch(error => {
                    setError(error.toString())
                  })
              }
            })
            break
          default:
            break;
        }

        // Update budget category current
        const budgetsRef = await getDocs(
          query(
            collection(db, `users/${user.id}/budgets/`)
          )
        );
        let arr = deletedExpenseDate.split('/')
        let expenseMonth = parseInt(arr[0])
        budgetsRef.docs.forEach(async (budget) => {
          if (budget.data().category.toLowerCase() === deletedExpenseCategory.toLowerCase() && budget.data().month === expenseMonth) {
            const updatedCurrent = parseInt(budget.data().current) - deletedExpenseTotal;
            const budgetRef = doc(db, `users/${user.id}/budgets/${budget.id}`);
            // Update budget current
            await updateDoc(budgetRef, { current: updatedCurrent })
              .then(() => {
                console.log(`${budget.data().category} current of month ${budget.data().month} updated`)
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })
      }
    })
  }

  const handleStartDateChange = (e) => {
    e.preventDefault()
    const arr = e.target.value.split('-')
    const dateString = `${arr[1]}/${arr[2]}/${arr[0]}`
    setStartDate(new Date(dateString))
  }

  const handleEndDateChange = (e) => {
    e.preventDefault()
    const arr = e.target.value.split('-')
    const dateString = `${arr[1]}/${arr[2]}/${arr[0]}`
    setEndDate(new Date(dateString))
  }

  const isInDateRange = (expense) => {
    const expenseDate = new Date(expense.date)

    return expenseDate >= startDate && expenseDate <= endDate
  }

  const isInMonth = (expense) => {
    const d = new Date();
    const month = d.getMonth() + 1;
    const arr = expense.date.split('/');
    const expMonth = parseInt(arr[0]);

    return month === expMonth;
  }

  return (
    <Container fluid style={{ paddingTop: '6%', paddingBottom: '6%' }}>
      {/* popup add window */}
      <Modal show={open} onClose={handleClose} onHide={handleClose}>
        <Modal.Body>
          <h2 className='text-center mb-4'>Add Expense</h2>
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
          <Form>
            <Form.Group id='name'>
              <Form.Label>Place</Form.Label>
              <Form.Control ref={place} />
            </Form.Group>
            <Form.Group id='total'>
              <Form.Label>Total</Form.Label>
              <Form.Control ref={total} />
            </Form.Group>
            <Form.Group id='category'>
              <Form.Label>Category</Form.Label>
              <select className="form-control" name="city" ref={category}>
                <option disabled selected>Select Category ...</option>
                <option value="academic">Academic</option>
                <option value="entertainment">Entertainment</option>
                <option value="groceries">Groceries</option>
                <option value="insurance">Insurance</option>
                <option value="rent">Rent</option>
                <option value="food">Food</option>
                <option value="debt">Debt</option>
              </select>
            </Form.Group>
            <Form.Group id='date'>
              <Form.Label>Date</Form.Label>
              <Form.Control placeholder={d.toLocaleDateString()} ref={date} />
            </Form.Group>
            {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
            <Button className='w-100 mt-3' onClick={addExpense}>
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Container fixed="top" fluid style={{ width: '500px', marginTop: "5%" }}>
        {inFinancial ?
          <>
            <Container height="260px">
              <PieChart width={430} height={250}>
                <Pie data={graphData} dataKey="spent" cx="50%" cy="50%" innerRadius={45} outerRadius={70} >
                  {
                    graphData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={limitFill[entry.category.toLowerCase()]} />
                    ))
                  }
                </Pie>
                <Legend payload={[
                  { value: 'Rent', color: limitFill['rent'] },
                  { value: 'Groc', color: limitFill['groceries'] },
                  { value: 'Food', color: limitFill['food'] },
                  { value: 'Insu', color: limitFill['insurance'] },
                  { value: 'Acad', color: limitFill['academic'] },
                  { value: 'Ente', color: limitFill['entertainment'] },
                  { value: 'Debt', color: limitFill['debt'] }
                ]}></Legend>
              </PieChart>
            </Container>
            {
              expenses.filter(isInMonth).sort(function (a, b) {
                const d1 = new Date(a.date);
                const d2 = new Date(b.date);
                return d2 - d1;
              }).map((expense, index) => {
                if (index <= 2) {
                  return (
                    <ExpenseItem
                      key={index}
                      expense={expense}
                      onDelete={deleteExpense}
                      onUpdate={updateExpense}
                      backColor={expenseFill[expense.category.toLowerCase()]}
                      bordColor={limitFill[expense.category.toLowerCase()]}
                      notInCard={notInCard}
                    />
                  )
                }
                return null;
              })
            }
          </>
          :
          <>
            <Container height="260px">
              <PieChart width={430} height={250}>
                <Pie data={graphData} dataKey="spent" cx="50%" cy="50%" innerRadius={45} outerRadius={70} >
                  {
                    graphData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={limitFill[entry.category.toLowerCase()]} />
                    ))
                  }
                </Pie>
                <Legend payload={[
                  { value: 'Rent', color: limitFill['rent'] },
                  { value: 'Groc', color: limitFill['groceries'] },
                  { value: 'Food', color: limitFill['food'] },
                  { value: 'Insu', color: limitFill['insurance'] },
                  { value: 'Acad', color: limitFill['academic'] },
                  { value: 'Ente', color: limitFill['entertainment'] },
                  { value: 'Debt', color: limitFill['debt'] }
                ]}></Legend>
              </PieChart>
            </Container>
            <br></br>
            <Row >
              {/* Dropdown for start date */}
              <Col sm={4}>
                <DropdownButton title={startDate.toLocaleDateString()} id="dropdown-basic-button" style={{ background: 'gold', borderRadius: '5px' }}>
                  <Form.Group controlId="start">
                    <Form.Control type="date" onChange={handleStartDateChange} />
                  </Form.Group>
                </DropdownButton>
              </Col>
              <Col style={{ fontSize: '30px', textAlign: 'center', maxWidth: '140px' }}>-</Col>
              {/* Dropdown for end date */}
              <Col sm={4}>
                <DropdownButton title={endDate.toLocaleDateString()} id="dropdown-basic-button" style={{ background: 'gold', borderRadius: '5px'}}>
                  <Form.Group controlId="end">
                    <Form.Control type="date" onChange={handleEndDateChange} />
                  </Form.Group>
                </DropdownButton>
              </Col>
            </Row>
            <br></br>
            {
              notInCard ?
                <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                  <Card.Header>
                    Expenses
                  </Card.Header>
                  <Card.Header>
                    <Row>
                      <Col sm={4} className="border-end">Place</Col>
                      <Col sm={4} className="border-end">Total</Col>
                      <Col sm={4}>Date</Col>
                    </Row>
                  </Card.Header>
                </Card>
                :
                <></>
            }
            {expenses.filter(isInDateRange).map((expense, index) => (
              <ExpenseItem
                key={index}
                expense={expense}
                onDelete={deleteExpense}
                onUpdate={updateExpense}
                backColor={expenseFill[expense.category.toLowerCase()]}
                bordColor={limitFill[expense.category.toLowerCase()]}
                notInCard={notInCard}
              />
            ))
            }
          </>
        }
      </Container>
      {showButton ? <Container style={{ width: '100px', position: "fixed", right: '15%', bottom: "3%", display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>
        : null
      }
    </Container>
  )
}
