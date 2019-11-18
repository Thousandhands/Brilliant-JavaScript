/**
 *  选择排序
 */

const mockData = [5, 7, 9, 4, 10, 21, 3, 6];


const sort = arr => {
    let sortedArr = [];
    for (let i = 0, len = arr.length; i < len; i++) {
        let maxValue = -Infinity;
        let maxIndex = 0;
        for (let j = 0, len = arr.length; j < len; j++) {
            if (maxValue < arr[j]) {
                maxValue = arr[j]
                maxIndex = j;
            }
        }
        sortedArr.push(maxValue);
        arr[maxIndex] = -Infinity;
    }

    return sortedArr;
}


const res = sort(mockData);

console.log(res);