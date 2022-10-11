import React, {  useState } from 'react'
import { Card, Row, Col, Form } from 'react-bootstrap'
import { updateDoc, doc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Task(props) {
  const [check, setCheck] = useState(props.task.isChecked)

  const handleCheck = async () => {
    // const pRef = document.getElementById(props.task.id)
    // if (pRef.style.textDecoration) {
    //   pRef.style.removeProperty('text-decoration');
    // } else {
    //   pRef.style.setProperty('text-decoration', 'line-through');
    // }
    const usersRef = await getDocs(
      query(
        collection(db, 'users')
        )
        );
        usersRef.forEach(async (user) => {
          if (user.data().uid === auth.currentUser.uid) {
            const docRef = doc(db, `users/${user.id}/tasks/${props.task.id}`)
            await updateDoc(docRef, { isChecked: !props.task.isChecked })
            .then(() => {
              console.log('document updated')
            })
            .catch(error => {
              console.log(error.toString())
            })
          }
        })
    setCheck(!check);
  }

  return (
    <Card className='mb-2'>
      <Card.Body>
        <Row>
          {/*Button to check off tasks*/}
          {
            check
              ? <>
                  <Col sm={1}><Form.Check defaultChecked onChange={handleCheck} aria-label="option 1" /></Col>
                  <Col sm={7}>
                    <p className="text-decoration-line-through" id={props.task.id}>{props.task.name}</p>
                  </Col>
                </>
              : <>
                  <Col sm={1}><Form.Check onChange={handleCheck} aria-label="option 1" /></Col>
                  <Col sm={7}>
                    <p id={props.task.id}>{props.task.name} {props.courseId}</p>
                  </Col>
                </>
          }
          <Col sm={4}>{props.task.deadline}</Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
