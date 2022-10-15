import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { DropdownButton, Button, Collapse } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NotesContent from './NotesContent';
import ScheduleContent from './ScheduleContent';
import { PieChart, Pie, Cell, Legend } from 'recharts';

export default function Cards() {

    const [open1, setOpen1] = useState(true)
    // const [open2, setOpen2] = useState(true)
    const [open3, setOpen3] = useState(true)
    const [open4, setOpen4] = useState(true)

    // Sample data
const dataGroc = [
    {name: 'Travel', value: 400},
    {name: 'Insurance', value: 700},
    {name: 'Entertainment', value: 200},
    {name: 'Food', value: 400}
  ];

  let data = dataGroc;

  const colors = [
    '#FFA07A',
    '#93DB70',
    '#CC99CC',
    '#79CDCD'
  ];

  // Render Cards
  return (
    <div>
        <Container fixed = "top" fluid style = {{ width: '450px', marginTop: "5%"}}>
            <Card>
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
                        <DropdownButton class="dropdown-toggle" id="dropdown-basic-button" title="Budget"className='topBarDropdown'>
                            
                        </DropdownButton>
                        {/* Create a pie chart to hold the data of each individual category */}
                        <PieChart width={400} height={250}>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} label>
                            {
                                data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index]}/>
                                ))
                            }
                            </Pie>
                            <Legend layout='vertical' verticalAlign='middle' align='right'/>
                        </PieChart>
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