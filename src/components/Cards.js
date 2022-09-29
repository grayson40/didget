import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Collapse } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

// change 1
export default function Cards() {

    const [open1, setOpen1] = useState(true)
    const [open2, setOpen2] = useState(true)
    const [open3, setOpen3] = useState(true)

  return (
    <div>
        <Container fluid style = {{ height: '600px'}}>
            <Card>
                <Button
                    onClick={() => setOpen1(!open1)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open1}
                >
                    Schedule
                </Button>
                <Collapse in={open1}>
                    <a href="/schedule">
                        <div id="example-collapse-text">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                    </a>
                    
                </Collapse>
            </Card>
            <Card>
                <Button
                    onClick={() => setOpen2(!open2)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open2}
                >
                    Budget
                </Button>
                <Collapse in={open2}>
                    <a href="/budget">
                        <div id="example-collapse-text">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                    </a>
                </Collapse>
            </Card>
            <Card>
                <Button
                    onClick={() => setOpen3(!open3)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open3}
                >
                    Notes
                </Button>
                <Collapse in={open3}>
                    <a href="/notes">
                        <div id="example-collapse-text">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                    </a>
                </Collapse>
            </Card>
        </Container>
    </div>
  );
}