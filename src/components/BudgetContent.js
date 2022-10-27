import React, { useState, useRef, useEffect } from 'react'
import { Container, Card, Row, Col, Modal, Form, Button } from 'react-bootstrap'
import Fab from '@mui/material/Fab';
import { FaPlus } from 'react-icons/fa'
import { ReferenceLine, BarChart, Bar, Cell, XAxis, YAxis } from 'recharts';
import {
  collection,
  getDocs,
  query,
  addDoc,
  // doc,
  // updateDoc,
  // deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import BudgetItem from './BudgetItem';

export default function BudgetContent() {
  const [open, setOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const rentLimit = useRef();
  const groceriesLimit = useRef();
  const foodLimit = useRef();
  const insuranceLimit = useRef();
  const academicLimit = useRef();
  const entertainmentLimit = useRef();

  //    Use sample data for the different categories of bar graph
  const data = [
    { name: 'Rent', symbol: '🏠', value: 600.00, expense: 100, limit: 600, max: 100 },
    { name: 'Groceries', symbol: '🛒', value: 138.25, expense: 40, limit: 200, max: 100 },
    { name: 'Food', symbol: '🍔', value: 45.65, expense: 60, limit: 100, max: 100 },
    { name: 'Insurance', symbol: '📋', value: 200.00, expense: 100, limit: 200, max: 100 },
    { name: 'Academic', symbol: '📚', value: 18.99, expense: 25, limit: 60, max: 100 },
    { name: 'Entertainment', symbol: '🍿', value: 75.00, expense: 75, limit: 100, max: 100 }
  ];

  //    Use constants to hold colors for categories
  const expenseColors = [
    '#AED6F1',
    '#A2D9CE',
    '#F9E79F',
    '#E59866',
    '#F5B7B1',
    '#D2B4DE'
  ];

  const limitColors = [
    '#5DADE2',
    '#45B39D',
    '#F4D03F',
    '#D35400',
    '#EC7063',
    '#A569BD'
  ];

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
          setBudgets(
            categoriesRef.docs.map((category) => ({
              id: category.id,
              category: category.data().category,
              limit: category.data().limit,
              current: category.data().current
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

  const handleClose = () => {
    setOpen(false);
  }

  const updateBudget = () => {
    // Update budget on screen
    let updatedLimit = 0;
    budgets.forEach((category) => {
      switch (category.category) {
        case "Rent":
          updatedLimit = parseInt(rentLimit.current.value)
          if (rentLimit.current.value !== '' && updatedLimit !== category.limit) {
            category.limit = updatedLimit;
          }
          break;
        case "Groceries":
          updatedLimit = parseInt(groceriesLimit.current.value)
          if (groceriesLimit.current.value !== '' && updatedLimit !== category.limit) {
            category.limit = updatedLimit;
          }
          break;
        case "Food":
          updatedLimit = parseInt(foodLimit.current.value)
          if (foodLimit.current.value !== '' && updatedLimit !== category.limit) {
            category.limit = updatedLimit;
          }
          break;
        case "Insurance":
          updatedLimit = parseInt(insuranceLimit.current.value)
          if (insuranceLimit.current.value !== '' && updatedLimit !== category.limit) {
            category.limit = updatedLimit;
          }
          break;
        case "Academic":
          updatedLimit = parseInt(academicLimit.current.value)
          if (academicLimit.current.value !== '' && updatedLimit !== category.limit) {
            category.limit = updatedLimit;
          }
          break;
        case "Entertainment":
          updatedLimit = parseInt(entertainmentLimit.current.value)
          if (groceriesLimit.current.value !== '' && updatedLimit !== category.limit) {
            category.limit = updatedLimit;
          }
          break;
        default:
          break;
      }
    })

    // TODO: update budget in db
  }

  const createBudget = () => {
    // If category budget already set, update limits
    // Else create budget
    if (budgets.length !== 0) {
      updateBudget()
    } else {
      // Add budgets to screen
      const newBudgets = [
        {
          category: "Rent",
          limit: parseInt(rentLimit.current.value),
          current: 0
        },
        {
          category: "Groceries",
          limit: parseInt(groceriesLimit.current.value),
          current: 0
        },
        {
          category: "Food",
          limit: parseInt(foodLimit.current.value),
          current: 0
        },
        {
          category: "Insurance",
          limit: parseInt(insuranceLimit.current.value),
          current: 0
        },
        {
          category: "Academic",
          limit: parseInt(academicLimit.current.value),
          current: 0
        },
        {
          category: "Entertainment",
          limit: parseInt(entertainmentLimit.current.value),
          current: 0
        }
      ]
      setBudgets(newBudgets);

      // Add budgets to db
      newBudgets.forEach(async (category) => {
        const newBudget = {
          category: category.category,
          limit: category.limit,
          current: category.current
        }
        const userRef = await getDocs(
          query(
            collection(db, "users")
          )
        );
        userRef.docs.map(async (user) => {
          if (user.data().uid === auth.currentUser.uid) {
            const collectionRef = collection(db, `users/${user.id}/categories/`);
            await addDoc(collectionRef, newBudget);
          }
        })
      })
    }


    handleClose()
  }

  return (
    <>
      <Container style={{ top: "5%", justifyContent: "flex-center", width: '530px' }}>
        {/* Create a vertically aligned bar chart containing the dataset of limits and expense totals */}
        {/* TODO: link bar chart to fetched data */}
        <Container style={{ width: '600px', marginTop: '5%', marginBottom: '5%' }}>
          <BarChart data={data} layout="vertical" width={600} height={250} >
            <Bar dataKey="expense" fill='#FFA07A' barSize={10}>
              {
                data.map((entry, index) => (
                  <Cell key={'expense'} fill={expenseColors[index]} />
                ))
              }
            </Bar>
            <Bar dataKey="max" barSize={10}>
              {
                data.map((entry, index) => (
                  <Cell key={'limit'} fill={limitColors[index]} />
                ))
              }
            </Bar>
            <XAxis type="number" reversed />
            <YAxis type="category" width={150} padding={{ left: 20 }} orientation={"right"} dataKey="symbol" />
            <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
          </BarChart>
        </Container>

        {/* popup add window */}
        <Modal show={open} onClose={handleClose} onHide={handleClose}>
          <Modal.Body>
            <h2 className='text-center mb-4'>Create Budget</h2>
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
            <Form>
              {/* TODO: add budget category and limit fields */}
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

        <Card style={{ width: '500px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            Budget
          </Card.Header>
        </Card>
        <Card style={{ width: '500px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            <Row>
              <Col className="border-end">Category</Col>
              <Col>Limit</Col>
            </Row>
          </Card.Header>
        </Card>

        {/*Cards with Name, Total, Category, and Date*/}
        {
          budgets.map((item, index) => (
            <>
              <BudgetItem key={index} item={item}></BudgetItem>
            </>
          ))
        }
      </Container>

      <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>
    </>
  )
}
