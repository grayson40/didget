/*  Cards Componenet
 *
 *
 * 
 */



import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Collapse } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NotesContent from './NotesContent';
import ScheduleContent from './ScheduleContent';
import BudgetContent from './BudgetContent';

export default function Cards({ date }) {

    const [open1, setOpen1] = useState(true);
    // const [open2, setOpen2] = useState(true)
    const [open3, setOpen3] = useState(true);
    const [open4, setOpen4] = useState(true);

  // Render Cards
  return (
    <div>
        <Container fixed = "top" fluid style = {{ paddingTop: '6%', paddingBottom: '6%', width: '600px', marginTop: "5%"}}>
            <Card className="mb-3 dashboardCard">
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
                      <ScheduleContent showButton={false} inDate={date}/>
                    </div>
                </Collapse>
            </Card>
            <Card className="mb-3 dashboardCard">
                <Button
                    onClick={() => setOpen3(!open3)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open3}
                >
                    Financial
                </Button>
                <Collapse in={open3}>
                    <Container fluid style = {{ paddingTop: '6%', paddingBottom: '6%'}}>
                    <div class="container-fluid justify-content-center align-content-center" height={500}>
                        <BudgetContent inDate={date}/>
                    </div>
                    </Container>
                </Collapse>
            </Card>
            <Card className="mb-3 dashboardCard">
                <Button
                    onClick={() => setOpen4(!open4)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open4}
                >
                    Notes
                </Button>
                <Collapse in={open4}>
                    <div>
                        <NotesContent showButton={false} date={date}/>
                    </div>
                </Collapse>
            </Card>
        </Container>
    </div>
  );
}