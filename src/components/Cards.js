/*  Cards Componenet
 *
 *
 * 
 */



import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Collapse, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NotesContent from './NotesContent';
import ScheduleContent from './ScheduleContent';
import { ReferenceLine, PieChart, Pie, Cell, Legend, BarChart, Bar, YAxis, XAxis } from 'recharts';

export default function Cards() {

    const [open1, setOpen1] = useState(true);
    // const [open2, setOpen2] = useState(true)
    const [open3, setOpen3] = useState(true);
    const [open4, setOpen4] = useState(true);

  //    Use sample data for the different categories of bar graph
  const data = [
    {name: 'Rent',          expense: 100, limit: 100},
    {name: 'Groceries',     expense: 40, limit: 100},
    {name: 'Food',          expense: 60, limit: 100},
    {name: 'Insurance',     expense: 100,   limit: 100},
    {name: 'Academic',      expense: 25, limit: 100},
    {name: 'Entertainment', expense: 75, limit: 100}
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



  // Render Cards
  return (
    <div>
        <Container fixed = "top" fluid style = {{ width: '550px', marginTop: "5%"}}>
            <Card className="mb-3">
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
                      <ScheduleContent showButton={false} />
                    </div>
                </Collapse>
            </Card>
            <Card className="mb-3">
                <Button
                    onClick={() => setOpen3(!open3)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open3}
                >
                    Financial
                </Button>
                <Collapse in={open3}>
                    <div class="container-fluid justify-content-center align-content-center" height={500}>
                        {/* Create a pie chart to hold the data of each individual category */}
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
                        {/* Create a vertically aligned bar chart containing the dataset of limits and expense totals */}
                        <BarChart data={data} layout="vertical" width={400} height={250} >
                            <Bar dataKey="expense" fill='#FFA07A' barSize={10}>
                            {
                                data.map((entry, index) => (
                                <Cell key={'expense'} fill={expenseColors[index]}/>
                                ))
                            }
                            </Bar>
                            <Bar dataKey="limit" barSize={10}>{
                                data.map((entry, index) => (
                                <Cell key={'limit'} fill={limitColors[index]}/>
                                ))}
                            </Bar>
                            <XAxis type="number" hide />
                            <YAxis type="category" width={150} padding={{ left: 20 }} dataKey="name"/>
                            <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
                        </BarChart>
                        <Card style={{ width: '100%', textAlign: "Center" }} className="mb-2">
                            <Card.Body>
                                <Row>
                                    <Col sm={4} className="border-end">Name</Col>
                                    <Col sm={4} className="border-end">Total</Col>
                                    <Col sm={4}>Date</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '100%', textAlign: "Center" }} className="mb-2">
                            <Card.Body>
                                <Row>
                                    <Col sm={4} className="border-end">Name</Col>
                                    <Col sm={4} className="border-end">Total</Col>
                                    <Col sm={4}>Date</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '100%', textAlign: "Center" }} className="mb-2">
                            <Card.Body>
                                <Row>
                                    <Col sm={4} className="border-end">Name</Col>
                                    <Col sm={4} className="border-end">Total</Col>
                                    <Col sm={4}>Date</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>
            </Card>
            <Card className="mb-3">
                <Button
                    onClick={() => setOpen4(!open4)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open4}
                >
                    Notes
                </Button>
                <Collapse in={open4}>
                    <div>
                        <NotesContent showButton={false}/>
                    </div>
                </Collapse>
            </Card>
        </Container>
    </div>
  );
}