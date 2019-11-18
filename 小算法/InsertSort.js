/**
 *  插入排序
 */

const mockData = [5, 7, 9, 4, 10, 21, 3, 6];


const append = (arr, to, from) => {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
}

const sort = arr => {
    for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[i] < arr[j]) {
                append(arr, j, i);
            }
        }
    }
    return arr;
}


const res = sort(mockData);

console.log(res);