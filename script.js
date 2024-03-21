const list = [];
const attributes = [];
// TODO: change where list is initialized?

// add book to list
const addBook = function() {
    // date is different to use date object
    const date = new Date(document.getElementById('book_date').value);
    if (!('date' in attributes)) {
        attributes.push(att);
        list.push([]);
    } 
    list[attributes.indexOf('date')].push(document.getElementById('date').value);

    built_in_attributes = ["title", "author", "genre", "stars", "review"];

    for (att in built_in_attributes) {
        if (!(att in attributes)) { // if built-in attributes are in the 
            attributes.push(att);
            list.push([]);
        }
        list[attributes.indexOf(att)].push(document.getElementById('book_'+att).value);
        document.getElementById('book_'+att).value = '';
    }
    
    // show the books
    console.log("addbook", list)
    displayTable();
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

        // split the results into rows
        const rows = results.split('\n'); 

        // split the rows into cells
        for (let i=0; i<rows.length; i++) {
            rows[i] = rows[i].replace('\r','').split(',');
        }

        // add attribute to labels and add array for that attribute
        for (let r=0; r<rows[0].length; r++) {
            rows[0][r] = rows[0][r].toLowerCase();
            if (!(rows[0][r].toLowerCase() in attributes)) {
                attributes.push(rows[0][r]);
                list.push([]);
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
        }

        displayTable();

    }
    filerder.onerror = function () {
        console.log("File reader error: ", reader.error);
    }
    
}
document.getElementById('submit_file').addEventListener('click', addFile);


const displayTable = function() {
    
    // for every label, add to table contents
    let table_contents = '<tr>' //'<tr><th>Date</th><th>Title</th><th>Author</th></tr>';
    for (label of attributes) {
        table_contents = table_contents + '<th>' + label + '</th>';
    }
    table_contents = table_contents + '</tr>';


    // for every thing in every row add to table contents
    for (let i=0; i<list[0].length; i++) {
        table_contents += '<tr>';

        for (let j=0; j<list.length; j++) {
            table_contents += '<td>' + list[j][i] + '</td>';
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
    display_string = '<h1>Books</h1>';

    let title_index = -1;
    if (attributes.includes('title')) {
        title_index = attributes.indexOf('title');
    }
    let review_index = -1;
    if (attributes.includes('review')) {
        review_index = attributes.indexOf('review');
    }

    for (let b=0; b<list[0].length; b++) { // for every book
        if (title_index != -1) {
            display_string += '<h2>'+list[title_index][b]+'</h2>';

            for (let i=0; i<attributes.length; i++) {
                if (!(i==title_index) || (i==review_index)) {
                    display_string += '<h3>'+list[i][b]+'</h3>';
                }
            }
        
            if (review_index != -1) {
                display_string += '<p>'+list[b][review_index]+'</p>';
            }

        } else {
            display_string += 'hi!'
        }
    }
    document.getElementById('display').innerHTML = display_string;

}
document.getElementById('long-form').addEventListener('click', newView)
