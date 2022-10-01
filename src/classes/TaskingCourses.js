// PSEUDOCODE TIME!!!!

//  Create a class that holds multiple different variables called Courses
//  Courses Class should consist of
//      Schedule: A list of class dates:times during week
//          needs getter, instantiated by constructor
//      Course Name: A string containing full course name: Does not need to follow
//      strict naming conventions
//          needs getter, instantiated by constructor
//      Professor's Name: A string of the professor's name
//          needs getter, instantiated by constructor
//      Tasks: A basic to do list of items, will be of class task
//          needs getter, adder, with course creation, tasks is empty and gets filled up
//          via an adder function, and shrinks due to a remove function

class Courses {
    constructor(courseName, professorName, weekSchedule) {
        // In constructor, assign all params to their own functions
        this.courseName = courseName;
        this.professorName = professorName;
        this.weekSchedule = weekSchedule;
    }

    //  Need functionality to add tasks to the list
    addTask(task) {
        tasks.push(task);
    }

    //  Each value above needs a getter
    getCourseName() {
        return this.courseName;
    }

    getProfessorName() {
        return this.professorName;
    }

    getWeeklySchedule() {
        return this.weekSchedule;
    }

    getTasks() {
        return this.tasks;
    }
}


// Create a class that stores values essential to a task
//  Task class should consist of
//      Course: A course object that represents the task's course
//          needs a getter, instantiated in constructor
//      Title: A string of a short title
//          needs a getter and setter, is instantiated in constructor
//      Description: A string of a description of task details
//          needs a getter and setter, is instantiated in constructor
//      Deadline: A date:time that the assignment is due by
//          needs a getter and setter, is instantiated in constructor

class Task {
    //  Make constructors with each case of requirements met
    //  Constructor should take all
    constructor(course, title, description, deadline){
        this.course = course;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
    }

    // Constructor should only take course and title
    constructor(course, title) {
        this.course = course;
        this.title = title;
        //  Create empty description and deadline
        this.description = new String();
        this.deadline = new Date();
    }

    //  Constructor should take all but deadline
    constructor(course, title, description) {
        this.course = course;
        this.title = title;
        this.description = description;
        // Ceate empty deadline
        this.deadline = new Date();
    }

    // Constructor should take all but description
    constructor(course, title, deadline) {
        this.course = course;
        this.title = title;
        this.deadline = deadline;
        //  Create empty description
        this.description = new String();
    }

    //  getters for each class variable
    getCourse() {
        return this.course;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getDeadline() {
        return this.deadline;
    }


    //  setters for each class variable, except course which should not be changeable
    setTitle(title) {
        this.title = title;
    }

    setDescription(description) {
        this.description = description;
    }

    setDeadline(deadline) {
        this.deadline = deadline;
    }
}