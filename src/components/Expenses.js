import React, { useState, useRef, useEffect } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button, Alert } from 'react-bootstrap'
import Fab from '@mui/material/Fab'
import { FaPlus } from 'react-icons/fa'
import TopBar from './TopBar'
import PageBar from './PageBar'
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
import Expense from './Expense'

// Date object
const d = new Date();

// Budget colors
const categoryFill =
{
  rent: '#F06292',
  entertainment: '#FFF176',
  groceries: '#9575CD',
  food: '#64B5F6',
  insurance: '#4DD0E1',
  academic: '#81C784',
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
}

const limitFill =
{
  'rent': '#A569BD',
  'entertainment': '#D35400',
  'groceries': '#EC7063',
  'food': '#F4D03F',
  'insurance': '#5DADE2',
  'academic': '#45B39D',
}

export default function Expenses({ notInCard }) {
  if (notInCard !== false) notInCard = true;
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('')
  var [rentTotal, setRentTotal] = useState(0)
  var [groceryTotal, setGroceryTotal] = useState(0)
  var [foodTotal, setFoodTotal] = useState(0)
  var [insuranceTotal, setInsuranceTotal] = useState(0)
  var [academicTotal, setAcademicTotal] = useState(0)
  var [entertainmentTotal, setEntertainmentTotal] = useState(0)
  const place = useRef();
  const total = useRef();
  const category = useRef();
  const date = useRef();
  const dataFetchedRef = useRef(false);

  console.log(notInCard);

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

              budgetsRef.docs.forEach(async (budget) => {
                if (budget.data().category.toLowerCase() === newExpense.category.toLowerCase()) {
                  console.log(budget.id)
                  const docRef = doc(db, `users/${user.id}/budgets/${budget.id}`)
                  const updatedCurrent = parseInt(budget.data().current) + newExpense.total;
                  await updateDoc(docRef, { current: updatedCurrent })
                    .then(console.log(`${budget.data().category} current updated`))
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
        budgetsRef.docs.forEach(async (budget) => {
          if (budget.data().category.toLowerCase() === updatedExpense.category) {
            const updatedCurrent = budget.data().current + totalDifference;
            const budgetRef = doc(db, `users/${user.id}/budgets/${budget.id}`);
            // Update budget current
            await updateDoc(budgetRef, { current: updatedCurrent })
              .then(() => {
                console.log(`${budget.data().category} current updated`)
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
    let deletedExpenseCategory = null
    let deletedExpenseTotal = null
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
            deletedExpenseCategory = expense.data().category
            deletedExpenseTotal = expense.data().total
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
          default:
            break;
        }

        // Update budget category current
        const budgetsRef = await getDocs(
          query(
            collection(db, `users/${user.id}/budgets/`)
          )
        );
        budgetsRef.docs.forEach(async (budget) => {
          if (budget.data().category.toLowerCase() === deletedExpenseCategory.toLowerCase()) {
            const updatedCurrent = parseInt(budget.data().current) - deletedExpenseTotal;
            const budgetRef = doc(db, `users/${user.id}/budgets/${budget.id}`);
            // Update budget current
            await updateDoc(budgetRef, { current: updatedCurrent })
              .then(() => {
                console.log(`${budget.data().category} current updated`)
              })
              .catch(error => {
                setError(error.toString())
              })
          }
        })
      }
    })
  }

  return (
    <Container>
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
        <PageBar name='Expenses' />
        <TopBar />
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
              { value: 'Ente', color: limitFill['entertainment'] }
            ]}></Legend>
          </PieChart>
        </Container>

        {
        console.log(notInCard)}{
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
        
        {
          expenses.map((expense, index) => (
            <Expense
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
      </Container>
      <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>
    </Container>
  )
}
