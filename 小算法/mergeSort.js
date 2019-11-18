function merge(left, right) {
    let result = [];
    while (left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    return result.concat(left).concat(right);
}


function mergeSort(arr) {
    if (arr.length == 1) {
        return arr;
    }

    let middle = Math.floor(arr.length / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle)

    return merge(mergeSort(left), mergeSort(right))
}

console.log(mergeSort([7, 4, 5, 7, 3, 9, 2, 9]));