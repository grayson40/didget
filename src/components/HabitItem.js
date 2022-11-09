
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Collapse } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NotesContent from './NotesContent';
import ScheduleContent from './ScheduleContent';
import BudgetContent from './BudgetContent';
import {  PieChart, Pie, Cell, Legend } from 'recharts';
import { auth, db } from '../firebase';
import {
    collection,
    getDocs,
    query
  } from 'firebase/firestore';
import Habit from "../classes/Habit"


let pageHabit = new Habit();

export default function HabitItem() {

    return (
    <Container>
        <label> { pageHabit.getTotalAvg() } </label>
    </Container>
    );
}