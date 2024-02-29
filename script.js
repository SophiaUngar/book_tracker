const list = [];
// TODO: change where list is initialized?

// add book to list
const addBook = function() {
    // get information about the book
    const date = new Date(document.getElementById('book_date').value);
    const title = document.getElementById('book_title').value;
    const author = document.getElementById('book_author').value;

    // add to the list
    list.push([date, title, author]);

    // clears input fields after adding the data
    document.getElementById('book_date').value = '';
    document.getElementById('book_title').value = '';
    document.getElementById('book_author').value = '';

    // show the books
    displayTable(list);
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


// clear entries
const clear = function() {
    document.getElementById('book_date').value = '';
    document.getElementById('book_title').value = '';
    document.getElementById('book_author').value = '';
}
document.getElementById('clear').addEventListener('click', clear)


// takes in file as input
const addFile = function() {
    let file = document.getElementById( 'input_file').files[0];

    let filerder = new FileReader();

    filerder.readAsText(file);
    filerder.onload = function () {
        let results = filerder.result;
        const rows = results.split('\n'); // split the string into rows

        for (let i=1; i<rows.length; i++) { // ignores label row
            const words = rows[i].split(','); // split the row into columns
            words[0] = new Date(words[0]); // turns the date into date format
            
            words[words.length-1] = words[words.length-1].replace('\r',''); // necessary?
            
            list.push(words); 
        }

        displayTable(list);

    }
    filerder.onerror = function () {
        console.log("File reader error: ", reader.error);
    }
    
}
document.getElementById('submit_file').addEventListener('click', addFile);


const displayTable = function(data) {
    
    // for every label, add to table contents
    let table_contents = '<tr><th>Date</th><th>Title</th><th>Author</th></tr>';
    //for (label of data[0]) {
    //    table_contents = table_contents + '<th>' + label + '</th>';
    //}
    //table_contents = table_contents + '</tr>';


    // for every thing in every row add to table contents
    for (let i=0; i<data.length; i++) {
        table_contents = table_contents + '<tr>';

        // display date in reasonable form
        table_contents = table_contents + '<td>' + data[i][0].toDateString() + '</td>';
        for (let j=1; j<data[i].length; j++) {
            table_contents = table_contents + '<td>' + data[i][j] + '</td>';
        }
        table_contents = table_contents + '</tr>';
    }

    // put table contents in the table
    document.getElementById('books_list').innerHTML = table_contents;
}


const sortList = function(order) {
    if (order === 'newest') {
        list.sort(function(a,b){return a[0].getTime()<b[0].getTime()});
        displayTable( list);
        console.log(list);
    }
    else if (order === 'oldest') {
        list.sort(function(a,b){return b[0].getTime()<a[0].getTime()});
        displayTable( list);
        console.log(list);
    }
    else if (order=== 'alphabetical') {
        list.sort(function(a,b){ return a[1].localeCompare(b[1])});
        displayTable(list);
        console.log(list);
    } 
    // tosort would make a copy of the list
}
document.getElementById('sort_newest').addEventListener('click', function(){sortList('newest')});
document.getElementById('sort_oldest').addEventListener('click', function(){sortList('oldest')})
document.getElementById('sort_alphabetical').addEventListener('click', function(){sortList('alphabetical')})
// need function to get the type of sort in


// store list
// downloads csv file with data
const storeList = async function() {
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
document.getElementById('export').addEventListener('click', storeList)






const newView = function() {
    //document.getElementById('content').style.display = 'none';
    display_string = '';
    for (let i=0; i<list.length; i++) { // for every book
        display_string += '<h2>'+list[i][0]+'</h2><h3>';
        for (let j=1; j<list[i].length-1; j++) {
            display_string += list[i][j]; 
        }
        display_string += '</h3>';
        display_string += '<p>'+list[i][list[i].length]+'</p>';
        
    }
    document.getElementById('content').innerHTML = display_string;
}
document.getElementById('long-form').addEventListener('click', newView)
