import React, { useState, useRef, useEffect } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button, Alert } from 'react-bootstrap'
import Fab from '@mui/material/Fab'
import { FaPlus } from 'react-icons/fa'
import TopBar from './TopBar'
import PageBar from './PageBar'
import { uuidv4 } from '@firebase/util'
import { PieChart, Pie, Legend, ResponsiveContainer } from 'recharts'
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

const d = new Date();

const categoryFill =
{
  rent: '#F06292',
  entertainment: '#FFF176',
  groceries: '#9575CD',
  food: '#64B5F6',
  insurance: '#4DD0E1',
  academic: '#81C784',
}

export default function Expenses(props) {
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([])
  const [error, setError] = useState('')
  const [rentTotal, setRentTotal] = useState(0)
  const [groceryTotal, setGroceryTotal] = useState(0)
  const [foodTotal, setFoodTotal] = useState(0)
  const [insuranceTotal, setInsuranceTotal] = useState(0)
  const [academicTotal, setAcademicTotal] = useState(0)
  const [entertainmentTotal, setEntertainmentTotal] = useState(0)
  const place = useRef();
  const total = useRef();
  const category = useRef();
  const date = useRef();
  const dataFetchedRef = useRef(false);

  const graphData = [
    {
      category: "Rent",
      spent: rentTotal,
      fill: categoryFill.rent
    },
    {
      category: "Groceries",
      spent: groceryTotal,
      fill: categoryFill.groceries
    },
    {
      category: "Food",
      spent: foodTotal,
      fill: categoryFill.food
    },
    {
      category: "Insurance",
      spent: insuranceTotal,
      fill: categoryFill.insurance
    },
    {
      category: "Academic",
      spent: academicTotal,
      fill: categoryFill.academic
    },
    {
      category: "Entertainment",
      spent: entertainmentTotal,
      fill: categoryFill.entertainment
    }
  ]

  // Modal close
  const handleClose = () => {
    setOpen(false);
    setError('')
  };

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
          const categoriesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/categories`)
            )
          );
          categoriesRef.docs.map(async (category) => {
            const expensesRef = await getDocs(
              query(
                collection(db, `users/${user.id}/categories/${category.id}/expenses`)
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
            })
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

      console.log(newExpense.category)

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
      userRef.docs.map(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          // add to total in categories and add to expense sub collection
          const categoriesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/categories/`)
            )
          );
          categoriesRef.docs.map(async (category) => {
            if (newExpense.category.toLowerCase() === category.data().category.toLowerCase()) {
              const docRef = doc(db, `users/${user.id}/categories/${category.id}`)
              const updatedCurrent = parseInt(category.data().current) + newExpense.total;
              await updateDoc(docRef, { current: updatedCurrent })
                .then(console.log(`${category.data().category} current updated`))
              const expensesRef = collection(db, `users/${user.id}/categories/${category.id}/expenses/`);
              await addDoc(expensesRef, newExpense)
                .then(console.log('expense added'))
                .catch((error) => console.log(error))
            }
          })
        }
      })

      handleClose()
    }
  };

  const deleteExpense = async (id) => {
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
        const categoriesRef = await getDocs(
          query(
            collection(db, `users/${user.id}/categories`)
          )
        );
        categoriesRef.docs.map(async (category) => {
          const expensesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/categories/${category.id}/expenses`)
            )
          );
          expensesRef.docs.map(async (expense) => {
            if (expense.data().id === id) {
              const categoryRef = doc(db, `users/${user.id}/categories/${category.id}`)
              const updatedCurrent = parseInt(category.data().current) - expense.data().total;
              await updateDoc(categoryRef, { current: updatedCurrent })
                .then(console.log(`${category.data().category} current updated`))
              const docRef = doc(db, `users/${user.id}/categories/${category.id}/expenses/${expense.id}`)
              await deleteDoc(docRef)
                .then(() => {
                  console.log('document deleted')
                })
                .catch(error => {
                  setError(error.toString())
                })
            }
          })
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
        {/*GRAPH PLACEHOLDER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
        {/* TODO: link pie chart to fetched data */}
        <ResponsiveContainer>
          <PieChart width={730} height={250}>
            <Pie data={graphData} dataKey="spent" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
            <Legend></Legend>
          </PieChart>
        </ResponsiveContainer>

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

        {
          expenses.map((expense, index) => (
            <Expense key={index} expense={expense} onDelete={deleteExpense}></Expense>
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
