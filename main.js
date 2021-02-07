const INPUT_SOLO = document.querySelector('#number_solo');
const INPUT_PACKAGE = document.querySelector('#number_package');
const GENERATED = document.querySelector('.generated');
const RESULT = document.querySelector('.result');
const SHOW_FLAG = document.querySelector('#show_array');
let generatedArray = [];
let quickSortNumber = 0;
let mergeSortNumber = 0;
let heapSortNumber = 0;

function generateRandomArray(solo) {
    let arr = [];
    let length = solo ? INPUT_SOLO.value : INPUT_PACKAGE.value;
    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * length * 100));
    }
    generatedArray = arr;
    if (SHOW_FLAG.checked && solo) showArray(generatedArray, GENERATED);
    return arr;
}

function generateSortedArray() {
    let arr = [];
    let length = INPUT_SOLO.value;
    for (let i = 0; i < length; i++) {
        arr.push(i);
    }
    generatedArray = arr;
    if (SHOW_FLAG.checked) showArray(generatedArray, GENERATED);
    return arr;
}

function generateReverseSortedArray() {
    let arr = [];
    let length = INPUT_SOLO.value;
    for (let i = length; i > 0; i--) {
        arr.push(i);
    }
    generatedArray = arr;
    if (SHOW_FLAG.checked) showArray(generatedArray, GENERATED);
    return arr;
}

function showArray(array, place) {
    if(!array) return;
    place.textContent = "";
    for(let i = 0; i < array.length; i++){
        place.textContent = place.textContent + array[i] + '; ';
    }
}

function timeMeasure(func, solo) {
    let length = solo ? INPUT_SOLO.value : INPUT_PACKAGE.value;
    if (length < 2) return;

    let clonedArray = generatedArray.concat();

    let start = window.performance.now();
    let sortedArray = func(clonedArray);
    let end = window.performance.now();
    let time = end - start;
    let timer = document.querySelector('.timer');

    if (solo) {
        let counter = quickSortNumber || mergeSortNumber || heapSortNumber;
        timer.textContent = 'Executed time ' + time.toFixed(3) + ' milliseconds. ' +
            counter + ' operations.';
        quickSortNumber = 0;
        mergeSortNumber = 0;
        heapSortNumber = 0;
    }

    if (SHOW_FLAG.checked && solo) showArray(sortedArray, RESULT);

    return time;
}

function autoRun() {
    const SIZE = INPUT_PACKAGE.value;
    if (SIZE < 2) return;

    const iteration = 100;
    let quickSortedTime = [];
    let mergeSortedTime = [];
    let heapSortedTime = [];
    for (let i = 0; i < iteration; i++) {
        generateRandomArray();
        quickSortedTime.push(timeMeasure(quickSort, false));
        mergeSortedTime.push(timeMeasure(mergeSort, false));
        heapSortedTime.push(timeMeasure(heapSort, false));
    }

    const quickSortAverage = quickSortedTime.reduce((acc, c) => acc + c, 0) / iteration;
    const mergeSortAverage = mergeSortedTime.reduce((acc, c) => acc + c, 0) / iteration;
    const heapSortAverage = heapSortedTime.reduce((acc, c) => acc + c, 0) / iteration;

    let average = document.querySelector('.average');

    let row1 = document.createElement('tr');
    average.appendChild(row1);
    let td11 = document.createElement('td');
    td11.textContent = 'Array size ' + SIZE;
    row1.appendChild(td11);
    let td12 = document.createElement('td');
    td12.textContent = 'Quick Sort';
    row1.appendChild(td12);
    let td13 = document.createElement('td');
    td13.textContent = 'Merge Sort';
    row1.appendChild(td13);
    let td14 = document.createElement('td');
    td14.textContent = 'Heap Sort';
    row1.appendChild(td14);

    let row2 = document.createElement('tr');
    average.appendChild(row2);
    let td21 = document.createElement('td');
    td21.textContent = 'average in milliseconds';
    row2.appendChild(td21);
    let td22 = document.createElement('td');
    td22.textContent = quickSortAverage.toFixed(3);
    row2.appendChild(td22);
    let td23 = document.createElement('td');
    td23.textContent = mergeSortAverage.toFixed(3);
    row2.appendChild(td23);
    let td24 = document.createElement('td');
    td24.textContent = heapSortAverage.toFixed(3);
    row2.appendChild(td24);

    let row3 = document.createElement('tr');
    average.appendChild(row3);
    let td31 = document.createElement('td');
    td31.textContent = 'average in operations';
    row3.appendChild(td31);
    let td32 = document.createElement('td');
    td32.textContent = quickSortNumber / iteration;
    row3.appendChild(td32);
    let td33 = document.createElement('td');
    td33.textContent = mergeSortNumber / iteration;
    row3.appendChild(td33);
    let td34 = document.createElement('td');
    td34.textContent = heapSortNumber / iteration;
    row3.appendChild(td34);

    quickSortNumber = 0;
    mergeSortNumber = 0;
    heapSortNumber = 0;
}

function quickSort(arr) {
    if (arr.length < 2) return arr;
    quickSortRecursive(arr, 0, arr.length - 1);
    return arr;
}

function quickSortRecursive(arr, start, end) {
    if (start >= end) return;

    let index = partition(arr, start, end);

    quickSortRecursive(arr, start, index - 1);
    quickSortRecursive(arr, index + 1, end);
}

function partition(arr, start, end) {
    const pivotValue = arr[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        if (arr[i] < pivotValue) {
            swap(arr, pivotIndex, i);
            quickSortNumber++;
            pivotIndex++;
        }
    }

    swap(arr, pivotIndex, end);
    quickSortNumber++;
    return pivotIndex;
}

function mergeSort(arr) {
    if (arr.length < 2) return arr;
    let mid = Math.floor(arr.length / 2),
        left = mergeSort(arr.slice(0, mid)),
        right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(arr1, arr2) {
    let sorted = [];

    while (arr1.length && arr2.length) {
        mergeSortNumber++;
        if (arr1[0] < arr2[0]) sorted.push(arr1.shift());
        else sorted.push(arr2.shift());
    }

    return sorted.concat(arr1.slice().concat(arr2.slice()));
}

function buildMaxHeap(arr) {
    let i = Math.floor(arr.length / 2 - 1);
    while (i >= 0) {
        heapify(arr, i, arr.length);
        i -= 1;
    }
}

function heapify(heap, i, max) {
    let index;
    let leftChild;
    let rightChild;

    while (i < max) {
        index = i;
        leftChild = 2 * i + 1;
        rightChild = leftChild + 1;
        if (leftChild < max && heap[leftChild] > heap[index]) {
            index = leftChild;
        }
        if (rightChild < max && heap[rightChild] > heap[index]) {
            index = rightChild;
        }
        if (index === i) return;
        swap(heap, i, index);
        heapSortNumber++;
        i = index;
    }
}

function swap(arr, firstItemIndex, lastItemIndex) {
    const temp = arr[firstItemIndex];
    arr[firstItemIndex] = arr[lastItemIndex];
    arr[lastItemIndex] = temp;
}

function heapSort(arr) {
    buildMaxHeap(arr);
    let lastElement = arr.length - 1;
    while (lastElement > 0) {
        swap(arr, 0, lastElement);
        heapSortNumber++;
        heapify(arr, 0, lastElement);
        lastElement -= 1;
    }
    return arr;
}
