let list = [];
let attributes = [];
let bookcount = 0;

const loadBooks = function() {
    list.length = 0;
    bookcount = 0;
    // do we want global variables for these?
    
    // loads the list with all the books from local storage
    if (localStorage.getItem('list') != null) {
        const newList = JSON.parse(localStorage.getItem('list'));
        for (let i=0; i<newList.length; i++) {
            list.push(newList[i]);
        } 
    } 

    // gets the list of attributes from local storage
    attributes = [];
    if (localStorage.getItem('attributes') != null) {
        attributes = JSON.parse(localStorage.getItem('attributes'));
    }
    
    // gets the number of books from local storage
    bookcount = JSON.parse(localStorage.getItem('bookcount'));

    // turns dates into JS dates for manipulation
    if (attributes.includes('date')) {
        let date_att = attributes.indexOf('date');
        if (date_att != -1) {
            for (let i=0; i<list[date_att].length; i++) {
                list[date_att][i] = new Date(list[date_att][i]);
            }
        }   
    }
    

    if (list.length > 0) {
        displayDefaultTable();
        stat_calc();
    }

    console.log('loaded books');

}
window.addEventListener('load',loadBooks);


// add book to list
const addBook = function() {
    // date is different from other attributes so we can use date object
    const date = new Date(document.getElementById('book_date').value);
    if (!(attributes.includes('date'))) {
        attributes.push('date');

        if (bookcount>0) { // add new list to hold the dates
            list.push(new Array(bookcount));
        } else { list.push(new Array());}
    } 
    list[attributes.indexOf('date')].push(date);

    built_in_attributes = ["title", "author", "genre", "stars", "review"];

    // for every built in attribute add it
    for (i in built_in_attributes) {
        if (!(attributes.includes(built_in_attributes[i]))) { // if built-in attributes are not in the attributes list
            attributes.push(built_in_attributes[i]);

            if (bookcount>0) {
                list.push(new Array(bookcount));
            } else { list.push(new Array());}
        
        } 
        
    }

    // add the value to the right table
    for (i in built_in_attributes) {
        if (document.getElementById('book_'+built_in_attributes[i]) != null) {
            list[attributes.indexOf(built_in_attributes[i])].push(document.getElementById('book_'+built_in_attributes[i]).value);
    
            // clear value
            document.getElementById('book_'+built_in_attributes[i]).value = '';
        } else {
            console.log(built_in_attributes[i]);
            list[attributes.indexOf(built_in_attributes[i])].push(null);
        }

    }
    bookcount++;

    // show the books
    displayDefaultTable();

    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('list', list);
        localStorage.setItem('attributes', attributes);
        localStorage.setItem('bookcount', bookcount);
    } else {
        console.log('storage doesn\'t work');
    }

    console.log('added book: ' + list[attributes.indexOf('title')]);

    stat_calc();
    storeList();
}
// when addBook is clicked run above function 
const submitBook = document.getElementById('submit');
submitBook.addEventListener('click', addBook); 


// changes the date for that book to today
/*const today = function() {
    const date = new Date(Date.now());
    document.getElementById('book_date').value = date.toDateString();
}
document.getElementById('book_date_today').addEventListener('click', today);*/

const delete_row = function(row_num) {
    for (let i=0; i<attributes.length; i++) {
        list[i].splice(row_num,1);
    }
    storeList();

    bookcount --;
    stat_calc();
    
    
    displayDefaultTable();
}
// TODO: add undo

// deletes attribute from table
const delete_col = function(label_index) {
    attributes.splice(label_index,1);
    
    list.splice(label_index,1);

    displayDefaultTable();
    storeList();
}


// reset to blank book table
const reset_list = function() {
    let msg = 'Are you sure you want to delete all of your books?'

    if (confirm(msg) == true) {
        list = [];
        attributes = [];
        bookcount = 0;

        document.getElementById('books_list').innerHTML = '';
        storeList();
    }

}
document.getElementById('reset').addEventListener('click', reset_list)


// clear entries
const clear = function() {
    built_in_attributes = ["title", "author", "genre", "stars", "review", "date"];

    // for every attribute
    for (att in built_in_attributes) {
        document.getElementById('book_'+att).value = '';
    }
}
document.getElementById('clear').addEventListener('click', clear)


// takes in file as input
const addFile = function() {
    let file = document.getElementById( 'input_file').files[0];

    let filerder = new FileReader();

    filerder.readAsText(file);
    filerder.onload = function () {
        let results = filerder.result;

        // split the results into rows
        const rows = results.split('\n'); 

        // split the rows into cells
        for (let i=0; i<rows.length; i++) {
            rows[i] = rows[i].replace('\r','').split(',');
        }

        // add attribute to labels and add array for that attribute
        for (let r=0; r<rows[0].length; r++) {
            rows[0][r] = rows[0][r].toLowerCase().trim(); // to not add the same categories
            // if the attribute isn't in the list
            if (!(attributes.includes(rows[0][r]))) {
                attributes.push(rows[0][r]);

                if (bookcount>0) {
                    list.push(new Array(bookcount));
                } else { list.push(new Array());}
            } 
        }

        // where in the new rows each attribute is
        const att_indices = [];
        for (let t=0; t<attributes.length; t++) {
            if (rows[0].includes(attributes[t])) {
                att_indices.push(rows[0].indexOf(attributes[t]));
            } else {
                att_indices.push(-1);
            }
        }

        
        // add new thing to each row
        for (let l=1; l<rows[0].length; l++) { // for each book (skip labels)
            for (let a=0; a<attributes.length; a++) { // for each attribute
                if (att_indices[attributes[a]] == -1) {
                    list[a].push([]);
                } else {
                    list[a].push(rows[l][att_indices[a]]);
                }
            }
            bookcount++;
        }

        
        let date_att = attributes.indexOf('date');
        if (date_att != -1) {
            for (let i=0; i<list[date_att].length; i++) {
                list[date_att][i] = new Date(list[date_att][i]);
            }
        }   
        

        displayDefaultTable();

        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('list', list);
            localStorage.setItem('attributes', attributes);
            localStorage.setItem('bookcount', bookcount);
        }

        stat_calc();
        storeList();

    }
    filerder.onerror = function () {
        console.log("File reader error: ", reader.error);
    }
}
document.getElementById('submit_file').addEventListener('click', addFile);

// saves new value of cell that was edited
const save_entry = function(cat_index, book_index) {
    list[cat_index][book_index] = document.getElementById('entry'+cat_index+book_index).innerText;
    storeList();

    stat_calc();
}

// first entry in a new row
/*
const save_new_book = function(cat_index, book_index) {
    save_entry(cat_index, book_index);
    
    storeList();

    // change current row to normal row
    let last_row = document.getElementById(books_list).rows[table.rows.length - 1];
    for (let i=0; i<attributes.length; i++) {
        last_row[i].removeEventListener('focusout', save_new_book);
        last_row[i].addEventListener('focusout', save_entry);
    }

    // add new row
    document.getElementById.innerHTML() += add_empty_row(attributes);

    bookcount++;
    stat_calc();

}
*/


// add an empty year
const add_empty_row = function(atts) {

    let row_contents = '<tr>';
    row_num = bookcount;
    
    // for each category
    for (let i = 0; i<atts.length; i++) {
        row_contents += '<td id=entry'+i+row_num+' contenteditable onfocusout="save_entry('+i+','+row_num+')"></td>';

    }
    row_contents += '<td><button onclick="delete_row(' + row_num + ')">🗑️</button></td>' + '</tr>';

    return row_contents;
}


// if a new book is entered
//const new_book = function() {
    // TODO

//    bookcount++;
//}
//table = document.getElementById(table);
//last_row = table.rows[ table.length - 1];
//last_row.addBook()


// displays the table
const displayTable = function(table, atts) {
    
    // for every label, add to table contents
    let table_contents = '<br><tr>'; 
    for (let index = 0; index < atts.length; index++) {
        table_contents = table_contents + '<th>' + atts[index] + '<button onclick="delete_col('+index+')">🗑️</button>'+'</th>';
    }
    table_contents = table_contents + '<th>delete</th>' + '</tr>';


    let date_att = atts.indexOf('date');
    // for every thing in every row add to table contents

    for (let i=0; i<table[0].length; i++) { // for every book
        table_contents += '<tr>';
        
        for (let j=0; j<table.length; j++) { // for every category
            if (j==date_att) {
                table_contents += '<td contenteditable>' + table[j][i].toLocaleDateString() + '</td>';
            } else {
                table_contents += '<td id=entry'+j+i+' contenteditable onfocusout="save_entry('+j+','+i+')">' + table[j][i] + '</td>';
            }
        }
        
        table_contents += '<td><button onclick="delete_row(' + i + ')">🗑️</button></td>' + '</tr>'; 

    }

    // add empty row ready to edit
    table_contents += add_empty_row( atts);
    

    // put table contents in the table
    document.getElementById('books_list').innerHTML = table_contents;
}



const displayDefaultTable = function() {
    displayTable(list, attributes);
}



const newView = function() {
    // button to go back
    let display_string = '<button id="switch_back">Switch Back to Table View</button>';

    // 
    const special_attributes = ['title', 'author', 'review'];
    const special_attributes_indices = [];
    for (let i=0; i<special_attributes.length; i++) {
        if (attributes.includes(special_attributes[i])) {
            special_attributes_indices.push( attributes.indexOf(special_attributes[i]));
        } else {
            special_attributes_indices.push(-1);
        }
    }

    // for every book
    for (let b=0; b<list[0].length; b++) { 
        if (special_attributes_indices[0] != -1) { // if normal attribute
            display_string += '<h2>'+list[special_attributes_indices[0]][b]+'</h2>';

            display_string += '<h3>';
            display_string += list[special_attributes_indices[1]][b]+' ';
            for (let i=0; i<attributes.length; i++) {
                if (!(special_attributes_indices.includes(i))) {
                    display_string += list[i][b] + '\t';
                }
            }
            display_string += '</h3>';
        
            // review
            if (special_attributes_indices[2] != -1) {
                display_string += '<p>'+list[special_attributes_indices[2]][b]+'</p>';
            }

            display_string += '<br>';

        } else {
            //TODO replace with a proper error message
            display_string += 'hi!';
        }
    }
    // get rid of the old view
    document.getElementById('display1').style.display = 'none';

    // so if you told it to display none in oldView it will stop now
    document.getElementById('display2').style.display = 'initial';
    document.getElementById('display2').innerHTML = display_string;


    const oldView = function() {
        document.getElementById('display2').style.display = 'none';
        document.getElementById('display1').style.display = 'initial';
        displayDefaultTable();
    }
    document.getElementById('switch_back').addEventListener('click', oldView)

}
document.getElementById('long-form').addEventListener('click', newView)



const sortList = function(order) {
    if (order === 'newest') {
        t_list = transpose(list);
        let att = attributes.indexOf('date');
        t_list.sort(function(a,b){return a[att].getTime()<b[att].getTime()});
        t_list = transpose(t_list);
        displayTable( t_list, attributes);
    }
    else if (order === 'oldest') {
        t_list = transpose(list);
        let att = attributes.indexOf('date');
        t_list.sort(function(a,b){return a[att].getTime()>b[att].getTime()});
        t_list = transpose(t_list);
        displayTable( t_list, attributes);
    }
    else if (order=== 'alphabetical') {
        t_list = transpose(list);
        let att = attributes.indexOf('date');
        t_list.sort(function(a,b){return a[1].localeCompare(b[1])});
        t_list = transpose(t_list);
        displayTable( t_list, attributes);
    } 
    else if(order === 'original') {
        displayDefaultTable();
    }
    // tosort would make a copy of the list
}
document.getElementById('sort_newest').addEventListener('click', function(){sortList('newest')});
document.getElementById('sort_oldest').addEventListener('click', function(){sortList('oldest')})
document.getElementById('sort_alphabetical').addEventListener('click', function(){sortList('alphabetical')})
document.getElementById('sort_original').addEventListener('click', function(){sortList('original')})
// need function to get the type of sort in


const transpose = function(tlist) {
    return tlist[0].map((col, i) => tlist.map(row => row[i]));
    // from https://www.geeksforgeeks.org/transpose-a-two-dimensional-2d-array-in-javascript/
}


// store list
// downloads csv file with data
const listCSV = async function() {
    // to store values
    csvvalues = [];
    csvvalues.push("'Date','Title','Author'");

    // join data with commas and add it
    for (const row of list) {
        csvvalues.push( row.join(','));
    }
    csvvalues = csvvalues.join('\n');

    // from: https://stackoverflow.com/questions/56154046/downloading-blob-with-type-text-csv-strips-unicode-bom
    let blob = new Blob([csvvalues], {type: 'text/csv'});
    var link = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = link;
    a.download = 'books.csv';
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(a.href);
    
    
}
document.getElementById('export').addEventListener('click', listCSV)


const storeList = function() {
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('list', JSON.stringify(list));
        localStorage.setItem('attributes', JSON.stringify(attributes));
        localStorage.setItem('bookcount', JSON.stringify(bookcount));
    } //else {

        // TODO: throw error
    //}
}



const stat_calc = function() {
    // total books
    document.getElementById('total-books').innerHTML = bookcount;

    // books this year
    document.getElementById('year-books').innerHTML = 
        list[attributes.indexOf('date')].filter( // filters just the books from this year and gets the length
            function(x){return x.getFullYear() == new Date().getFullYear();} ).length;

    // books this month
    document.getElementById('month-books').innerHTML = 
        list[attributes.indexOf('date')].filter(
            function(x){return (x.getFullYear() == new Date().getFullYear()) && 
            (x.getMonth() == new Date().getMonth());}).length;
}


//module.exports = {sortList};