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

export default function BudgetContent({ notInCard }) {
  if (notInCard !== false) notInCard = true;
  const [open, setOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [budgets, setBudgets] = useState([]);
  var [rentTotal, setRentTotal] = useState(0)
  var [groceriesTotal, setGroceriesTotal] = useState(0)
  var [foodTotal, setFoodTotal] = useState(0)
  var [insuranceTotal, setInsuranceTotal] = useState(0)
  var [academicTotal, setAcademicTotal] = useState(0)
  var [entertainmentTotal, setEntertainmentTotal] = useState(0)
  const [budgetsSet, setBudgetsSet] = useState(false)
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
          if (budgetsRef.docs.length === 0) {
            setBudgetsSet(false);
          } else {
            setBudgetsSet(true);
            setBudgets(
              budgetsRef.docs.map((category) => ({
                id: category.id,
                category: category.data().category,
                limit: category.data().limit,
                current: category.data().current
              }))
            )
            setGraphData(
              budgetsRef.docs.map((category, index) => ({
                name: category.data().category,
                symbol: symbolsDict[category.data().category],
                value: category.data().current,
                expense: category.data().current / category.data().limit * 100,
                max: 100
              }))
            )
          }

          // Iterate through expenses and add to category total
          const expensesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/expenses/`)
            )
          );
          expensesRef.docs.forEach((expense) => {
            // console.log(expense.data().category)
            const category = expense.data().category
            switch (category) {
              case "rent":
                setRentTotal(rentTotal + parseInt(expense.data().total))
                break;
              case "groceries":
                setGroceriesTotal(groceriesTotal + parseInt(expense.data().total))
                break;
              case "food":
                setFoodTotal(foodTotal + parseInt(expense.data().total))
                break;
              case "insurance":
                setInsuranceTotal(insuranceTotal + parseInt(expense.data().total))
                break;
              case "academic":
                setAcademicTotal(academicTotal + parseInt(expense.data().total))
                break;
              case "entertainment":
                setEntertainmentTotal(entertainmentTotal + parseInt(expense.data().total))
                break;
              default:
                break;
            }
          })
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
        max: 100
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
            await updateDoc(docRef, {limit: updatedLimit})
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
    // If category budget already set, update limits
    // Else create budget
    if (budgets.length !== 0) {
      updateBudget()
    } else {
      setBudgetsSet(true);
      const newBudgets = [
        {
          category: "Rent",
          limit: parseInt(rentLimit.current.value),
          current: rentTotal
        },
        {
          category: "Groceries",
          limit: parseInt(groceriesLimit.current.value),
          current: groceriesTotal
        },
        {
          category: "Food",
          limit: parseInt(foodLimit.current.value),
          current: foodTotal
        },
        {
          category: "Insurance",
          limit: parseInt(insuranceLimit.current.value),
          current: insuranceTotal
        },
        {
          category: "Academic",
          limit: parseInt(academicLimit.current.value),
          current: academicTotal
        },
        {
          category: "Entertainment",
          limit: parseInt(entertainmentLimit.current.value),
          current: entertainmentTotal
        }
      ]
      setBudgets(newBudgets);

      setGraphData(
        newBudgets.map((category) => ({
          name: category.category,
          symbol: symbolsDict[category.category],
          value: category.current,
          expense: category.current / category.limit * 100,
          max: 100
        }))
      )

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
            const collectionRef = collection(db, `users/${user.id}/budgets/`);
            await addDoc(collectionRef, newBudget);
          }
        })
      })
    }

    handleClose()
  }

  const deleteBudgets = async () => {
    console.log('deleting budgets')
    setBudgets([])
    setBudgetsSet(false);
    setGraphData([])
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
          const docRef = doc(db, `users/${user.id}/budgets/${budget.id}`)
          await deleteDoc(docRef)
            .then(() => {
              console.log('document deleted')
            })
        })
      }
    })
  }

  return (
    <>
      <Container style={{ top: "5%", justifyContent: "flex-center", width: '530px' }}>
        {/* Create a vertically aligned bar chart containing the dataset of limits and expense totals */}
        <Container style={{ width: '600px', marginTop: '5%', marginBottom: '5%' }}>
          <BarChart data={graphData} layout="vertical" width={600} height={250} >
            <Bar dataKey="expense" fill='#FFA07A' barSize={10}>
              {
                graphData.map((entry, index) => (
                  <Cell key={'expense'} fill={bordFill[entry.name.toLowerCase()]} />
                ))
              }
            </Bar>
            <Bar dataKey="max" barSize={10}>
              {
                graphData.map((entry, index) => (
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

        {
          notInCard ?
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
        :
        <></>
        }

        {/*Cards with Name, Total, Category, and Date*/}
        {
          budgets.map((item, index) => (

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
      </Container>
      {budgetsSet ? <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={deleteBudgets}>
          <FaTrashAlt size={"30px"} />
        </Fab>
      </Container> : <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => setOpen(true)}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>
      }
    </>
  )
}