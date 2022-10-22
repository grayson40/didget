//  Create a class that holds a budget and title called category
//  the category class should consist of
//      A string title
//      A number limit which holds the numeric limit for expenses in a category

class Category{
    //  make a constructor for the category class
    constructor(title, limit) {
        this.title = title;
        this.limit = limit;
    }

    //  Use getters and setters for manipulating the data of a single category
    setTitle(title){
        this.title = title;
    }

    setLimit(limit){
        this.limit = limit;
    }

    getTitle(){
        return this.title;
    }

    getLimit(){
        return this.limit;
    }
}
