//  Create a class that holds multiple different variables called Expenditure
//  Expenditure Class should consist of
//      value: Number total monetary value of expenditure
//      place: String name of the location of expenditure
//      category: String name of category the expense pertains to
//      creation: String date of the expenditure
//      needs getters and setters

class Expenditure{
    //  make a single constructor, all values are essential and are required
    constructor(value, place, category, created){
        this.value = value;
        this.place = place;
        this.category = category;
        this.created = created;
    }

    //  getters for each value
    getValue(){
        return this.value;
    }

    getPlace(){
        return this.place;
    }

    getCategory(){
        return this.category;
    }

    getCreated(){
        return this.created
    }

    //  setters for each value
    setValue(value){
        this.value = value;
    }

    setPlace(place){
        this.place = place;
    }

    setCategory(category){
        this.category = category;
    }

    setCreated(created){
        this.created = created;
    }
}


//  Create a class called Budget for tracking budget limit
//  Budget Class should consist of
//      category: String name of category of the budget: not editable
//      limit: Number amount set by user to indicate the highest amount to set for a category
//      created: String time of creation

class Budget{
    // Make a single constructor
    constructor(category, limit, created){
        this.category = category;
        this.limit = limit;
        this.created = created;
    }

    // getters for each value
    getCategory(){
        return this.category;
    }

    getLimit(){
        return this.limit;
    }

    getCreated(){
        return this.created;
    }

    //  setter for limit
    setLimit(limit){
        this.limit = limit;
    }
}

