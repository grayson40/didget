import React, { useState, useRef, useEffect } from 'react'
import { Alert, Button, Container, Card, Col, Collapse, Form, Modal, Row } from 'react-bootstrap'
import Fab from '@mui/material/Fab'
import { FaPlus } from 'react-icons/fa'
import TopBar from './TopBar'
import PageBar from './PageBar'
import BudgetContent from './BudgetContent'
import DebtItem from './DebtItem'
import Expenses from './ExpenseContent'
import { auth, db } from '../firebase';
import { uuidv4 } from '@firebase/util'
import {
    collection,
    getDocs,
    query,
    doc,
    addDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { PieChart, Pie, Cell, Legend } from 'recharts'

export default function Financial() {

    // States for Financials page
    const [error, setError] = useState('')
    const [currentUserId, setCurrentUserId] = useState()

    // Refs for Financials page
    const dataFetchedRef = useRef(false)

    // Refs for Debt Implementation
    const debtNameFormAttr = useRef()
    const debtValFormAttr = useRef()

    // States for Debt Implementation
    const [debtCollecRef, setDebtCollecRef] = useState()
    const [debtCollecDocsRef, setDebtCollecDocsRef] = useState()
    const [expensesCollecDocsRef, setExpensesCollecDocsRef] = useState()
    const [openDebtForm, setOpenDebtForm] = useState(false)
    const [debtFormError, setDebtFormError] = useState('')
    const [debts, setDebts] = useState([])
    const [paid, setPaid] = useState()
    const [left, setLeft] = useState()

    // States for Card implementations
    const [open1, setOpen1] = useState(true)
    const [open3, setOpen3] = useState(true)
    const [open4, setOpen4] = useState(true)

    /** GRAPH DATA AND FILLERS */
    // Graph Completion Fill
    const completionFill = {
        'paid': '#4cb38e',
        'left': '#eee36b'
    }

    // Category Colors
    const categoryFill = {
        paid: '#4cb38e',
        left: '#eee36b'
    }

    // Graph object
    var graphData = [
        {
            category: "paid",
            value: paid,
            fill: categoryFill.paid
        },
        {
            category: "left",
            value: left,
            fill: categoryFill.left
        }
    ]

    // Runs when the page is first loaded
    useEffect(() => {

        // If debtData has not been fetched yet
        if (dataFetchedRef.current) {
            return;
        }

        // Fetch debt data and set the dataFetchedRef to true
        fetchDebtData()
        dataFetchedRef.current = true

        console.log('Ending use effect')
    }, [])

    /**
     * Fetches Debt data from firebase and sets the debts state
     * 
     * @returns void
     */
    async function fetchDebtData() {
        console.log('Fetching Debt Data')

        // Get all the users
        if (auth.currentUser) {
            const usersRef = await getDocs(
                query(
                    collection(db, 'users')
                )
            );

            // Iterate through the user docs fetched
            usersRef.forEach(async (user) => {
                // If its the current user
                if (user.data().uid === auth.currentUser.uid) {

                    // Set the currentUserRef
                    setCurrentUserId(user.id)

                    // Fetch the Debt docs
                    const debtCollectionDocsRef = await getDocs(
                        query(
                            collection(db, `users/${user.id}/debts/`)
                        )
                    );

                    // Set debtCollecDocsRef
                    setDebtCollecDocsRef(debtCollectionDocsRef)

                    // Set debtCollecRef
                    let debtcollectionref = collection(db, `users/${user.id}/debts/`)
                    setDebtCollecRef(debtcollectionref)

                    let paidTotal = 0
                    let debtTotal = 0

                    // For each Debt document
                    debtCollectionDocsRef.docs.forEach((debt) => {
                        const _debt = {
                            id: debt.data().id,
                            debtName: debt.data().debtName,
                            debtVal: debt.data().debtVal,
                            debtPaid: debt.data().debtPaid
                        }

                        paidTotal += _debt.debtPaid
                        debtTotal += _debt.debtVal

                        // Set the Debt State
                        setDebts((current) => [...current, _debt])
                    })
                    
                    // Set the totals
                    setPaid(paidTotal)
                    setLeft(debtTotal - paidTotal) 

                    // Fetch the expenseDocs
                    const expensesCollectionDocsRef = await getDocs(
                        query(
                            collection(db, `users/${user.id}/expenses/`)
                        )
                    )

                    // Set the ref to be used later
                    setExpensesCollecDocsRef(expensesCollectionDocsRef)
                }
            })
        }
    }

    /**
     * Closes the add Debt modal.
     * 
     * @returns void
     */
    const handleClose = () => {
        console.log(graphData.map((entry) => (
            entry.value
        )))
        setOpenDebtForm(false)
        setDebtFormError('')
    }

    /**
     * Adds a Debt collection to firestore, refetches and resets all debts after the addition
     * 
     * @returns void
     */
    const addDebt = async () => {

        // Handling errors from the Debt Form
        if (debtNameFormAttr.current.value === '') {
            setDebtFormError('Error: Debt name is unspecified. Please name this instance of Debt.')
        }
        else if (debtValFormAttr.current.value === '') {
            setDebtFormError('Error: Debt value is unspecified. Please add a value for Debt in Dollar amount.')
        }

        // If no errors
        else {

            // Create a new debt collection
            const newDebt = {
                id: uuidv4(),
                debtName: debtNameFormAttr.current.value,
                debtVal: parseInt(debtValFormAttr.current.value),
                debtPaid: 0
            };

            // Iterate through the expenses and tally up any past expenditure on the debt
            expensesCollecDocsRef.docs.forEach((expense) => {
                if(expense.data().category === 'debt' && expense.data().place === newDebt.debtName) {
                    newDebt.debtPaid += expense.data().total
                }
            })

            // Create a new array with the new debt added
            const newDebts = [...debts, newDebt];

            // Set the debts as the new list
            setDebts(newDebts)

            console.log(newDebt)

            /* Add the debts to Firebase */
            await addDoc(debtCollecRef, newDebt)
                .then(() => {
                    console.log('Document Added')
                })
                .catch(error => {
                    setError(error.toString())
                })

            // Calculate debtLeft to be paid in the newDebt
            let newDebt_left = newDebt.debtVal - newDebt.debtPaid

            // Update totalPaid
            let newPaid = paid
            newPaid += newDebt.debtPaid

            // Update totalLeft
            let newLeft = left
            newLeft += newDebt_left

            // Set both totalPaid and totalLeft
            setPaid(newPaid)
            setLeft(newLeft)

            handleClose()
        }
        console.log(error)
        setError('')
    }

    /**
     * Updates the debt state and asynchronously update the debt item in firebase
     * 
     * @param {String} id 
     * @param {*} updatedDebt 
     * @returns void
     */
    const updateDebt = async (id, updatedDebtVal) => {

        // var declaration
        let debtDifference = 0

        // Iterate through each debt
        debts.forEach((debt) => {

            // If its the desired debt object
            if (debt.id === id) {

                // Calculate the difference between the old and updated debtVal
                debtDifference = updatedDebtVal - debt.debtVal

                // Update the Debt object
                debt.debtVal = updatedDebtVal
            }
        });

        // Set the new debts
        setDebts(debts)

        // Update totalLeft
        let newLeft = left
        newLeft += debtDifference
        setLeft(newLeft)

        // Iterate through the debts
        debtCollecDocsRef.docs.forEach(async (debt) => {

            // Find the appropriate debt
            if(debt.data().id === id) {

                // Get the docRef
                const debtDocRef = doc(db, `users/${currentUserId}/debts/${debt.id}`)

                // Update the doc
                await updateDoc(debtDocRef, { debtVal: updatedDebtVal} )
                    .then(() => {
                        console.log(`Debt id ${id} updated`)
                    })
                    .catch(error => {
                        setError(error.toString())
                    })
            }
        })

    }

    /**
     *  Updates the debt state and asynchronously deletes the debt item in firebase.
     * 
     * @param {uuidv4} id 
     * @returns void
     */
    const deleteDebt = async (id) => {

        // Var declarations
        let newPaid = paid
        let newLeft = left

        // Iterate through each debt
        debts.forEach((debt) => {
            
            // If its the corresponding debt
            if(debt.id === id) {
                
                // Update the newPaid and newLeft 
                newPaid -= debt.debtPaid
                newLeft -= debt.debtVal

                console.log(newPaid)
                console.log(newLeft)
            }
        })

        // Set the new debts with all the debts except the one we're attempting to delete
        const newDebts = debts.filter((debt) => debt.id !== id)
        setDebts(newDebts)

        // Set new Paid and Left
        setPaid(newPaid)
        setLeft(newLeft)

        // Iterate through the debts
        debtCollecDocsRef.docs.forEach(async (debt) => {

            // Find the appropriate debt
            if(debt.data().id === id) {

                // Get the docRef
                const debtDocRef = doc(db, `users/${currentUserId}/debts/${debt.id}`)

                console.log(debt)
                // Delete from Firebase
                await deleteDoc(debtDocRef)
                    .then(() => {
                        console.log('Document Deleted')
                    })
                    .catch(error => {
                        setError(error.toString())
                    })
            }
        })

        console.log(error)
        setError('')
    }

    return (
        <div>
            <PageBar name='Financial' />
            <TopBar />
            <Container fluid style={{ paddingTop: '6%', paddingBottom: '6%' }}>
                {/** Add Debt Form Modal */}
                <Modal show={openDebtForm} onClose={handleClose} onHide={handleClose}>
                    <Modal.Body>
                        <h2 className='text-center mb-4'>Add Debt</h2>
                        <Form>
                            {/** Specifying Debt Refs */}
                            <Form.Group id='debtName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control ref={debtNameFormAttr} />
                            </Form.Group>
                            <Form.Group id='debtVal'>
                                <Form.Label>Value</Form.Label>
                                <Form.Control ref={debtValFormAttr} />
                            </Form.Group>
                            {/** debtFormError for error handling */}
                            {debtFormError && <Alert className='mt-3' variant="danger">{debtFormError}</Alert>}
                            <Button className='w-100 mt-3' onClick={addDebt}>
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Container fixed="top" fluid style={{ width: '650px', marginTop: "5%" }}>
                    <Card className="mb-3">
                        <Button
                            onClick={() => setOpen1(!open1)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open1}
                            className="mb-2"
                        >
                            Budget
                        </Button>
                        <Collapse in={open1}>
                            <div>
                                <BudgetContent showButton={false} notInCard={false} />
                            </div>
                        </Collapse>
                    </Card>
                    <Card className="mb-3">
                        <Button
                            onClick={() => setOpen3(!open3)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open3}
                        >
                            Expenses
                        </Button>
                        <Collapse in={open3}>
                            <div>
                                <Expenses showButton={false} notInCard={false} />
                            </div>
                        </Collapse>
                    </Card>
                    <Card className="mb-3">
                        <Button
                            onClick={() => setOpen4(!open4)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open4}
                        >
                            Debt
                        </Button>
                        <Collapse in={open4}>
                            <Container>
                                <PieChart width={430} height={250}>
                                    <Pie data={graphData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} >
                                        {
                                            graphData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={completionFill[entry.category.toLowerCase()]} />
                                            ))
                                        }
                                    </Pie>
                                    <Legend payload={[
                                        { value: 'Paid', color: completionFill['paid'] },
                                        { value: 'Left', color: completionFill['left'] }
                                    ]}></Legend>
                                </PieChart>
                                <Card style={{ width: '500px', textAlign: "Center" }} className="mb-2">
                                    <Card.Header>
                                        Debt
                                    </Card.Header>
                                    <Card.Header>
                                        <Row>
                                            <Col sm={7} className="border-end">Name</Col>
                                            <Col sm={5}>Outstanding</Col>
                                        </Row>
                                    </Card.Header>
                                </Card>
                                {debts.map( (debt, index) => (
                                        <DebtItem
                                            key={index}
                                            debt={debt}
                                            onUpdate={updateDebt}
                                            onDelete={deleteDebt}
                                        />
                                ))
                                }
                            </Container>
                        </Collapse>
                    </Card>
                </Container>
                <Container style={{ width: '100px', position: "fixed", right: '15%', bottom: "3%", display: 'flex' }}>
                    <Fab size={"80px"} color="primary" onClick={(e) => setOpenDebtForm(true)}>
                        <FaPlus size={"30px"} />
                    </Fab>
                </Container>
            </Container>
        </div>
    )
}
