let quickSort = (arr) => {
    if (arr.length <= 1) return arr;

    let pivot = Math.floor((arr.length - 1) / 2);
    let val = arr[pivot], less = [], more = [];
    arr.splice(pivot, 1);
    arr.forEach((e) => {
        e < val ? less.push(e) : more.push(e)
    });

    return (quickSort(less)).concat([val], quickSort(more));
}

console.log(quickSort([2, 3, 5, 1, 6, 3, 44, 46, 6]));