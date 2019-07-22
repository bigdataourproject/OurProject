/*******************************************************************************
* Authors : Alexey and Shir
* Date : 04.2019
* Version : 1.0
********************************************************************************/
// this function that accepts as a parameter a serial number and
// returns the author's name and title
var GetBook = function(serialnum){
  if (serialnum < 1 || serialnum > books.length)
      return "Not found";
  else{
      var book = books[serialnum - 1];                         //parseInt("10");
      return "Author: "+book.author+", Title: "+book.title;
  }
};
// this function that accepts as a book title parameter and
// returns the author's name and serial number
var GetAuthor = function(title){
  for (var i = 0; i < books.length; i++) {
    if (books[i].title == title)
      return "Serial number: "+(i+1)+", Author: "+books[i].author;
  }
  return "Not found";
};
// this function that accepts as a parameter the serial number and title and
// returns the cover image of the book
var GetCover = function GetCover(option, serialORtitle){
  if (option == "first"){
    for (var i = 0; i < books.length; i++) {
      if (books[i].title == serialORtitle)
        return books[i].pathimg;
    }
    return "Not found";
  }else{
    return books[serialORtitle-1].pathimg;
  }
};


// class Book; author - author of book, title - title of book, pathimg - path to image
class Book {
  constructor(author, title, pathimg) {
    this.author = author;
    this.title = title;
    this.pathimg = pathimg;
  }
};

// array of books
var books = [new Book("Dr.Seuss's", "ABC", "/images/ABC.jpg"),
             new Book("Dan Gookin", "Beginning Programming with C for DUMMLES", "/images/c_for_dummles.jpg"),
             new Book("J.R.R. Tolkien", "The Hobbit", "/images/the_hobbit.jpg"),
             new Book("Erich Maria Remarque", "The night in Lisbon", "/images/the_night_in_lisbon.jpg"),
             new Book("Leo Tolstoy", "War and Peace", "/images/war_and_peace.jpg")];
// exports
module.exports = {
  getBook : GetBook,
  getAuthor : GetAuthor,
  getCover : GetCover
};
