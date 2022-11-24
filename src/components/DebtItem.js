import React, { useState } from 'react'
import { Button, Card, Col, ProgressBar, Row } from 'react-bootstrap'
import { FaTrashAlt } from 'react-icons/fa'

export default function DebtItem({ debt, onDelete, onUpdate }) {

    /**
     * Calulate what percent of debt that has been paid
     * 
     * @param {number} debtVal 
     * @param {number} paid 
     * @returns {number} percent paid
     */
    function percentPaid(debtVal, paid) {
        return (paid / debtVal) * 100
    }

    /**
     * Calculates the outstanding debt
     * 
     * @param {number} debtVal 
     * @param {number} paid 
     * @returns {number} Debt left to be paid
     */
    function amountLeft(debtVal, paid) {
        return debtVal - paid
    }

    /**
     * Inline Edit for debt values on the Debt Item cards 
     * 
     * @returns html block
     */
    const InlineEdit = () => {
        const [editingValue, setEditingValue] = useState(debt.debtVal);

        const onChange = (event) => {
            setEditingValue(event.target.value);
        }

        const onKeyDown = (event) => {
            if (event.key === "Enter" || event.key === "Escape") {
                event.target.blur();
            }
        }

        const onBlur = (event) => {
            const val = parseInt(event.target.value)
            if (event.target.value.trim() === "") {
                setEditingValue(debt.debtVal);
            } else {
                if (val !== debt.debtVal) {
                    onUpdate(debt.id, val)
                }
            }
        }

        return (
            <input
                class='inline'
                type="text"
                aria-label="Field name"
                value={editingValue}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
            />
        )
    }

    return (
        <>
            <Card style={{ color: 'black', width: '500px', textAlign: "Center" }} className="mb-2">
                <Card.Body>
                    <Row className="mb-2">
                        <Col className="border-end" sm={7}>{debt.debtName}</Col>
                        <Col sm={3}> $<InlineEdit /> </Col>
                        <Col sm={2}> <Button
                            variant='contained'
                            color='secondary'
                            size='medium'
                            onClick={(e) => onDelete(debt.id)}>
                            <FaTrashAlt color='gray' />
                        </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {/*Compares current amount to limit, turns red if over and green if under limit*/}
                            {amountLeft(debt.debtVal, debt.debtPaid) >= 0
                                ? <ProgressBar animated now={percentPaid(debt.debtVal, debt.debtPaid)} label={`$${debt.debtPaid} Paid`} />
                                : <ProgressBar animated variant="success" now={percentPaid(debt.debtVal, debt.debtPaid)} label={`$${debt.debtPaid} Paid`} />
                            }
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}
