import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Course from './Course'
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ScheduleContent() {
  const [courses, setCourses] = useState([])

  // Fetch courses from database
  async function fetchData() {
    if (auth.currentUser) {
      const usersRef = await getDocs(
        query(
          collection(db, 'users')
        )
      );
      // Iterate through the documents fetched
      usersRef.forEach(async (user) => {
        if (user.data().uid === auth.currentUser.uid) {
          const coursesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/courses`)
            )
          );
          setCourses(
            coursesRef.docs.map((course) => ({
              id: course.id,
              name: course.data().name,
              meetTime: course.data().meetTime,
              meetDay: course.data().meetDay,
              professor: course.data().professor
            }))
          )
        }
      })
    }
  }

  // Used to fetch users notes from firestore
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Container>
      {/* Map over list of courses */}
      {courses.map((course) => (
        <Course key={course.name} course={course} />
      ))}
    </Container>

  )
}