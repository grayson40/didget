//  Create a class that holds a habit and tracks the habit across a user's budgeting history
//  the habit class should consist of float attributes:
//      A local rent average, tracking average rent locally
//      A local insurance average, tracking average insurance locally
//      A local academic average, tracking average academic locally
//      A local entertainment average, tracking average entertainment locally
//      A local groceries average, tracking average groceries locally
//      A local food average, tracking average food locally
//      An Overall rent average, tracking average rent expenditure over the course of the last six months
//      An Overall insurance average, tracking average insurance expenditure over the course of the last six months
//      An Overall academic average, tracking average academic expenditure over the course of the last six months
//      An Overall entertainment average, tracking average entertainment expenditure over the course of the last six months
//      An Overall groceries average, tracking average groceries expenditure over the course of the last six months
//      An Overall food average, tracking average food expenditure over the course of the last six months

import { useState, useRef, useEffect } from 'react';
import {
  collection,
  getDocs,
  query
} from 'firebase/firestore';
import { auth, db } from '../firebase';

//  Class habit
export default class Habit {
    
  constructor() {
    const d = new Date;
    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('')
    var [rentTotal, setRentTotal] = useState(0)
    var [groceryTotal, setGroceryTotal] = useState(0)
    var [foodTotal, setFoodTotal] = useState(0)
    var [insuranceTotal, setInsuranceTotal] = useState(0)
    var [academicTotal, setAcademicTotal] = useState(0)
    var [entertainmentTotal, setEntertainmentTotal] = useState(0)
    const [month, setMonth] = useState(d.getMonth() + 1);
    const [year, setYear] = useState(d.getFullYear())
    const place = useRef();
    const total = useRef();
    const category = useRef();
    const date = useRef();
    const dataFetchedRef = useRef(false);

    //  user averages
    var [Rent_Average, setRentAverage]  =                   useState(0);
    var [Insurance_Average, setInsuranceAverage] =          useState(0);
    var [Academic_Average, setAcademicAverage] =            useState(0);
    var [Entertainment_Average, setEntertainmentAverage] =  useState(0);
    var [Grocery_Average, setGroceryAverage] =              useState(0);
    var [Food_Average, setFoodAverage] =                    useState(0);
    var [Total_Average, setTotalAverage] =                  useState(0);


    //  locals: Values are junk data
    var [Local_Rent_Average, setLocal_Rent_Average] = useState(500.82);
    var [Local_Insurance_Average, setLocal_Insurance_Average] = useState(150.24);
    var [Local_Academic_Average, setLocal_Academic_Average] = useState(45.98);
    var [Local_Entertainment_Average, setLocal_Entertainment_Average] = useState(66.90);
    var [Local_Groceries_Average, setLocal_Groceries_Average] = useState(129.88);
    var [Local_Food_Average, setLocal_Food_Average] = useState(98.99);

    var [Local_Overall_Average, setLocal_Overall_Average] = useState(Local_Rent_Average + Local_Insurance_Average + Local_Academic_Average + 
    Local_Entertainment_Average + Local_Groceries_Average + Local_Food_Average);

    var isInMonth = (value) => {
      const date = value.deadline
      const arr = date.split("/")
  
      return parseInt(arr[0]) === value;
    }
    
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
    
      useEffect(() => {
        if (dataFetchedRef.current) {
          return;
        }
        fetchData();
        dataFetchedRef.current = true;
        console.log('in expense page effect')
      }, [])

      let temp = 1.1;
      let arr = { 
        Rent_Average,
        Insurance_Average, 
        Academic_Average, 
        Entertainment_Average, 
        Grocery_Average, 
        Food_Average,
        temp
      };
      
      arr = this.calcAverages(expenses, isInMonth, arr);

      setRentAverage(arr[0]);
      setInsuranceAverage(arr[1]);
      setAcademicAverage(arr[2]);
      setEntertainmentAverage(arr[3]);
      setGroceryAverage(arr[4]);
      setFoodAverage(arr[5]);
    };

        // getters for user averages
        getRentAverage() {
          return this.Rent_Average;
        }

        getGroceriesAverage() {
          return this.Groceries_Average;
        }

        getFoodAverage() {
          return this.Food_Average;
        }

        getInsuranceAverage() {
          return this.Insurance_Average;
        }

        getAcademicAverage() {
          return this.Academic_Average;
        }

        getEntertainmentAverage() {
          return this.Entertainment_Average;
        }

        // Get locals
        getLocalRent() {
          return this.Local_Rent_Average;
        }

        getLocalGroc() {
          return this.Local_Groceries_Average;
        }

        getLocalFood() {
          return this.Local_Food_Average;
        }

        getLocalInsu() {
          return this.Local_Insurance_Average;
        }

        getLocalAcad() {
          return this.Local_Academic_Average;
        }

        getLocalEnte() {
          return this.Local_Entertainment_Average;
        }

        getTotalAvg() {
          return this.Total_Average;
        }
    

  calcAverages(expenses, isInMonth, arr) {
    let cur = new Date;
    var totalR = 0, totalI = 0, totalF = 0, totalG = 0, totalE = 0, totalA = 0, totalT = 0;
    var lowestMonth = cur.getMonth();
    var curMonth = cur.getMonth();
    cur = 12 + cur.getMonth();
        expenses.filter(isInMonth).map((expense, index) => function() {
          if ((expense.deadline.split("/")[0] >= cur - 6) && (expense.deadline.split("/")[0] <= cur)) {
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
         })

         // assign averages
          arr[0] = (totalR/(Math.abs(curMonth - lowestMonth)));
          arr[1] = (totalI/(Math.abs(curMonth - lowestMonth))); 
          arr[2] = (totalA/(Math.abs(curMonth - lowestMonth)));
          arr[3] = (totalE/(Math.abs(curMonth - lowestMonth)));
          arr[4] = (totalG/(Math.abs(curMonth - lowestMonth))); 
          arr[5] = (totalF/(Math.abs(curMonth - lowestMonth)));
          arr[6] = (totalT/(Math.abs(curMonth - lowestMonth)));

          return arr;
        }
      }


