// saves new value of cell that was edited
const save_entry = function(cat_index, book_index) {
    list[cat_index][book_index] = document.getElementById('entry'+cat_index+book_index).innerText;
    storeList();

    stat_calc();
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

