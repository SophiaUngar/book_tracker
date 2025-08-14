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

// clear entries in textboxes
const clear = function() {
    built_in_attributes = ["title", "author", "genre", "stars", "review", "date"];

    // for every attribute
    for (att in built_in_attributes) {
        document.getElementById('book_'+att).value = '';
    }
}
document.getElementById('clear').addEventListener('click', clear)