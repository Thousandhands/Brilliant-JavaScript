/**
 *  冒泡排序
 */

const mockData = [5, 7, 9, 4, 10, 21, 3, 6];


const swap = (arr, from, to) => {
    let temp = arr[from];
    arr[from] = arr[to];
    arr[to] = temp;
}

const sort = arr => {
    for (let i = mockData.length; i > 0; i--) {
        for (let j = 0; j < i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
            }
        }
    }
    return arr;
}


const res = sort(mockData);

console.log(res);