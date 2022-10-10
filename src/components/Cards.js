import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Collapse } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NotesContent from './NotesContent';
import ScheduleContent from './ScheduleContent';
import TaskContent from './TaskContent';

export default function Cards() {

    const [open1, setOpen1] = useState(true)
    const [open2, setOpen2] = useState(true)
    const [open3, setOpen3] = useState(true)
    const [open4, setOpen4] = useState(true)

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
                    <Card.Link style={{textDecoration: 'none', color: 'black'}} href="/schedule">
                        <div>
                          <ScheduleContent showButton={false} />
                        </div>
                    </Card.Link>
                </Collapse>
            </Card>
            <Card className="mb-3">
                <Button
                    onClick={() => setOpen3(!open3)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open3}
                >
                    Budget
                </Button>
                <Collapse in={open3}>
                    <Card.Link style={{textDecoration: 'none', color: 'black'}} href="/budget">
                        <div>
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                    </Card.Link>
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
                    <Card.Link style={{textDecoration: 'none', color: 'black'}} href="/notes">
                        <div>
                            <NotesContent showButton={false}/>
                        </div>
                    </Card.Link>
                </Collapse>
            </Card>
        </Container>
    </div>
  );
}