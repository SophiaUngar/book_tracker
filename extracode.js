// classes
class List extends Book {
    constructor() {
        this.books = [["date", "title", "author"]];
    }

    newBook(date, title, author) {
        this.books.push(new Book( date, title, author));
    }
}


class Book {
    constructor(day, book, person) {
        this.date = day;
        this.title = book;
        this.author = person
    }
}
// extends if you want methods from the other class