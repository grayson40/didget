
import React, { useState, useEffect } from 'react';
// import Card from 'react-bootstrap/Card';
// import { Button, Collapse } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { auth, db } from '../firebase';
import {
  collection,
  getDocs,
  query
} from 'firebase/firestore';
// import Habit from "../classes/Habit"

// let pageHabit = new Habit();

export default function HabitItem({ current, index }) {
  const [expenses, setExpenses] = useState([]);
  const [rentTotal, setRentTotal] = useState(0)
  const [groceryTotal, setGroceryTotal] = useState(0)
  const [foodTotal, setFoodTotal] = useState(0)
  const [insuranceTotal, setInsuranceTotal] = useState(0)
  const [academicTotal, setAcademicTotal] = useState(0)
  const [entertainmentTotal, setEntertainmentTotal] = useState(0)
  const [averages, setAverages] = useState([]);

  useEffect(() => {
    fetchData();
  }, [])

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
          const expensesRef = await getDocs(
            query(
              collection(db, `users/${user.id}/expenses/`)
            )
          );

          expensesRef.docs.forEach((expense) => {
            const _expense = {
              id: expense.data().id,
              category: expense.data().category,
              place: expense.data().place,
              total: expense.data().total,
              date: expense.data().date
            }
            setExpenses((current) => [...current, _expense])

            switch (_expense.category) {
              case "rent":
                setRentTotal(rentTotal + _expense.total);
                console.log("adding " + rentTotal + " rent");
                break;
              case "groceries":
                setGroceryTotal(groceryTotal + _expense.total);
                console.log("adding " + groceryTotal + " groc");
                break;
              case "food":
                setFoodTotal(foodTotal + _expense.total);
                console.log("adding " + foodTotal + " food");
                break;
              case "insurance":
                setInsuranceTotal(insuranceTotal + _expense.total);
                console.log("adding " + insuranceTotal + " insu");
                break;
              case "academic":
                setAcademicTotal(academicTotal + _expense.total);
                console.log("adding " + academicTotal + " acad");
                break;
              case "entertainment":
                setEntertainmentTotal(entertainmentTotal + _expense.total);
                console.log("adding " + entertainmentTotal + " entr");
                break;
              default:
                break;
            }
          })
        }
      })
    }
    console.log('fetching expense data')
  }


  function calcAverages() {
    let cur = new Date();
    console.log(cur)
    var totalR = 0, totalI = 0, totalF = 0, totalG = 0, totalE = 0, totalA = 0, totalT = 0;
    var lowestMonth = cur.getMonth() - 5;
    var curMonth = cur.getMonth() + 1;
    cur = 12 + cur.getMonth();
    expenses.map((expense) => {
      console.log(`${lowestMonth} ${curMonth}`)
      if ((parseInt(expense.date.split("/")[0]) >= lowestMonth) && (parseInt(expense.date.split("/")[0]) <= curMonth)) {
        switch (expense.category) {
          case "rent":
            totalR += expense.total;
            totalT += expense.total;
            if (curMonth < lowestMonth) lowestMonth = curMonth;
            break;
          case "groceries":
            totalG += expense.total;
            totalT += expense.total;
            if (curMonth < lowestMonth) lowestMonth = curMonth;
            break;
          case "food":
            totalF += expense.total;
            totalT += expense.total;
            if (curMonth < lowestMonth) lowestMonth = curMonth;
            break;
          case "insurance":
            totalI += expense.total;
            totalT += expense.total;
            if (curMonth < lowestMonth) lowestMonth = curMonth;
            break;
          case "academic":
            totalA += expense.total;
            totalT += expense.total;
            if (curMonth < lowestMonth) lowestMonth = curMonth;
            break;
          case "entertainment":
            totalE += expense.total;
            totalT += expense.total;
            if (curMonth < lowestMonth) lowestMonth = curMonth;
            break;
          default:
            break;
        }
      }
    
      return 0;})
    let arr = [];

    // assign averages
    arr[0] = (totalR / (Math.abs(curMonth - lowestMonth)));
    arr[1] = (totalI / (Math.abs(curMonth - lowestMonth)));
    arr[2] = (totalA / (Math.abs(curMonth - lowestMonth)));
    arr[3] = (totalE / (Math.abs(curMonth - lowestMonth)));
    arr[4] = (totalG / (Math.abs(curMonth - lowestMonth)));
    arr[5] = (totalF / (Math.abs(curMonth - lowestMonth)));
    arr[6] = (totalT / (Math.abs(curMonth - lowestMonth)));

    return arr;
  }

  const handleClick = () => {
    const arr = calcAverages();
    console.log('in here')
    setAverages(arr);
  }


  return (
    <Container>
    <button onClick={handleClick}>Click me</button>
    {
      averages.map((average) => (<p>{average}</p>))
    }
    </Container>
  );
}