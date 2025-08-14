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



// TODO: do I use this?
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


// add an empty book
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