import React, { useState } from 'react'
import { Container, Card, Button, Collapse } from 'react-bootstrap'
import TopBar from './TopBar'
import PageBar from './PageBar'

export default function Financial() {

    const [open1, setOpen1] = useState(true)
    // const [open2, setOpen2] = useState(true)
    const [open3, setOpen3] = useState(true)
    const [open4, setOpen4] = useState(true)

    return (
        <div>
            <PageBar name="Financial"/>
            <TopBar/>
            <Container fixed="top" fluid style={{ width: '500px', marginTop: "5%" }}>
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
                            Budget Content
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
                            Expenses Content
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
                        <div>
                            Debt Content
                        </div>
                    </Collapse>
                </Card>
            </Container>
        </div>
    )
}
