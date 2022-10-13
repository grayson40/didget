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
    {name: 'Walmart', value: 400},
    {name: 'Target', value: 700},
    {name: 'Publix', value: 200},
    {name: 'HomeDepot', value: 400}
  ];

  const dataEnt = [
    {name: 'Movies', value: 60},
    {name: 'Games', value: 80},
    {name: 'Music', value: 20},
    {name: 'Streaming', value: 30}
  ];

  let data = dataGroc;

  const colors = [
    'blue',
    'red',
    'green',
    'orange'
  ];

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
                        <PieChart width={440} height={250}>
                            <Pie data={data} cx="50%" cy="50%" outerRadius={70} label>
                            {
                                data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index]}/>
                                ))
                            }
                            </Pie>
                            <Legend/>
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