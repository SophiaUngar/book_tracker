const list = [];
const attributes = [];

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
    displayDefaultTable();
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

        
        let date_att = attributes.indexOf('date');
        if (date_att != -1) {
            for (let i=0; i<list[date_att].length; i++) {
                list[date_att][i] = new Date(list[date_att][i]);
            }
        }   
        

        displayDefaultTable();

    }
    filerder.onerror = function () {
        console.log("File reader error: ", reader.error);
    }
    
}
document.getElementById('submit_file').addEventListener('click', addFile);


const displayTable = function(table, atts) {
    
    // for every label, add to table contents
    let table_contents = '<tr>' //'<tr><th>Date</th><th>Title</th><th>Author</th></tr>';
    for (label of atts) {
        table_contents = table_contents + '<th>' + label + '</th>';
    }
    table_contents = table_contents + '</tr>';


    let date_att = atts.indexOf('date');
    // for every thing in every row add to table contents

    for (let i=0; i<table[0].length; i++) { // for every book
        table_contents += '<tr>';
        
        for (let j=0; j<table.length; j++) { // for every category
            if (j==date_att) {
                table_contents += '<td>' + table[j][i].toLocaleDateString() + '</td>';
            } else {
                table_contents += '<td>' + table[j][i] + '</td>';
            }
        }
        
        table_contents += '</tr>'; 
    }

    // put table contents in the table
    document.getElementById('books_list').innerHTML = table_contents;
}


const displayDefaultTable = function() {
    displayTable(list, attributes)
}



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
    //display_string = '<h1>Books</h1>';
    let display_string = '<button id="switch_back">Switch Back to Table View</button>';

    const special_attributes = ['title', 'author', 'review'];
    const special_attributes_indices = [];
    for (let i=0; i<special_attributes.length; i++) {
        if (attributes.includes(special_attributes[i])) {
            special_attributes_indices.push( attributes.indexOf(special_attributes[i]));
        } else {
            special_attributes_indices.push(-1);
        }
    }

    for (let b=0; b<list[0].length; b++) { // for every book
        if (special_attributes_indices[0] != -1) {
            display_string += '<h2>'+list[special_attributes_indices[0]][b]+'</h2>';

            display_string += '<h3>';
            display_string += list[special_attributes_indices[1]][b]+' ';
            for (let i=0; i<attributes.length; i++) {
                if (!(special_attributes_indices.includes(i))) {
                    display_string += list[i][b] + ' ';
                }
            }
            display_string += '</h3>';
        
            if (special_attributes_indices[2] != -1) {
                display_string += '<p>'+list[special_attributes_indices[2]][b]+'</p>';
            }

            display_string += '<br>';

        } else {
            display_string += 'hi!'
        }
    }
    document.getElementById('display').innerHTML = display_string;


    const oldView = function() {
        displayDefaultTable();
    }
    document.getElementById('switch_back').addEventListener('click', oldView)

}
document.getElementById('long-form').addEventListener('click', newView)


