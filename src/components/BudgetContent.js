import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Fab from '@mui/material/Fab';
import { FaPlus } from 'react-icons/fa'
import { Legend, ReferenceLine, BarChart, Bar, Cell, XAxis, YAxis } from 'recharts';
import { limit } from 'firebase/firestore';

export default function BudgetContent() {
   //    Use sample data for the different categories of bar graph
   const data = [
    {name: 'Rent',          value: 600.00,  expense: 100, limit: 600, max: 100},
    {name: 'Groceries',     value: 138.25,   expense: 40,  limit: 200, max: 100},
    {name: 'Food',          value: 45.65,   expense: 60,  limit: 100, max: 100},
    {name: 'Insurance',     value: 200.00,  expense: 100, limit: 200, max: 100},
    {name: 'Academic',      value: 18.99,   expense: 25,  limit: 60, max: 100},
    {name: 'Entertainment', value: 75.00,   expense: 75,  limit: 100, max: 100}
  ];

  //  Use an array to hold the amount left, which is just the limit - value of a piece of data
  var amountLeft = [
    (data[0].limit-data[0].value).toFixed(2),
    (data[1].limit-data[1].value).toFixed(2),
    (data[2].limit-data[2].value).toFixed(2),
    (data[3].limit-data[3].value).toFixed(2),
    (data[4].limit-data[4].value).toFixed(2),
    (data[5].limit-data[5].value).toFixed(2)
  ]

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


  return (
    <>
      <Container style={{ width: '400px'}}>
        {/* Create a vertically aligned bar chart containing the dataset of limits and expense totals */}
        <Container style={{  width: '400px', marginTop: '5%', marginBottom: '5%'}}>
          <BarChart data={data} layout="vertical" width={570} height={250} >
            <Bar dataKey="expense" fill='#FFA07A' barSize={10}>
              {
                data.map((entry, index) => (
                  <Cell key={'expense'} fill={expenseColors[index]}/>
                ))
              }
            </Bar>
            <Bar dataKey="max" barSize={10}>
              {
                data.map((entry, index) => (
                  <Cell key={'limit'} fill={limitColors[index]}/>
                ))
              }
            </Bar>
            <XAxis type="number" reversed/>
            <YAxis type="category" width={150} padding={{ left: 20 }} orientation={"right"} dataKey="name"/>
            <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
          </BarChart>
        </Container>
        

        <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            Budget
          </Card.Header>
        </Card>
        <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
          <Card.Header>
            <Row>
              <Col className="border-end">Category</Col>
              <Col className="border-end">Amount</Col>
              <Col>Percentage</Col>
            </Row>
          </Card.Header>
        </Card>

        {/*Cards with Name, Total, Category, and Date*/}
        {
          data.map((item, index) => (
            <>
              <Card style={{ width: '450px', textAlign: "Center" }} className="mb-2">
                <Card.Body>
                  <Row>
                    {/* Create a column for each category's title, value, and percent */}
                    <Col className="border-end">{item.name}</Col>
                    <Col className="border-end">${item.value}</Col>
                    <Col>{item.expense}%</Col>
                  </Row>
                  {/* Create a progress bar that tracks the percentage */}
                  <progress value ={item.expense} max="100" style={{ width: '400px' }}/>
                  <label>amount left: ${amountLeft[index]}</label>
                </Card.Body>
              </Card>
            </>
          ))
        }
      </Container>

      <Container style={{ position: "fixed", bottom: "20px", justifyContent: 'flex-end', display: 'flex' }}>
        <Fab size={"80px"} color="primary" onClick={(e) => console.log('click')}>
          <FaPlus size={"30px"} />
        </Fab>
      </Container>
    </>
  )
}
