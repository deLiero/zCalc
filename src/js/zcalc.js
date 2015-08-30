var input = document.getElementById("user-input"),
    calcButton = document.getElementById("calc-btn"),
    resultElem = document.getElementById("result");

calcButton.onclick = handleClick;

// проверка ввода
function checkInput(value) {
    return (/^[\d]+$/).test(value);
}

// очистка ввода
function cls() {
    input.value = "";
}

// обработка клика
function handleClick() {
    var num = input.value;

    // проверка ввода
    if (!checkInput(num)) {
        cls();
        printError(new Error("ошибка ввода"));
        return;
    }

    var result = calculate(num);
    cls();
    printResult(result);
}

// вывод ошибки
function printError(err) {
    resultElem.innerHTML = '<span class="_error">' + err.message + '</span>';
}

// вывод результата
(function (){
    this.printResult = function (result) {
        if (typeof result === "undefined" && result.length == 0) {
            return;
        }

        var max = result.length;

        if (max == 1) {
            resultElem.innerHTML = result[0];
            return;
        }

        if (max == 2) {
            resultElem.innerHTML = result[1];
            return;
        }

        resultElem.innerHTML = '<span class="_small">' +
            result[max-2] +
            '</span><span class="_big">' +
            result[max-1] + "</span>";
    };
})();

// необходимые вычисления
// возвращает массив результатов
// первый элемент массива это исходноечисло
function calculate(num) {

    var tempNum = 0,
        results = [],
        iterationLimit = 100,
        currentIteration = 0;
    results.push(num);

    while (num > 9 && currentIteration <= iterationLimit) {
        num = num + "";
        for (var n = 0; n < num.length; n++) {
            tempNum = tempNum + parseInt(num.charAt(n));
        }

        num = tempNum;
        results.push(num);
        tempNum = 0;
        currentIteration++;
    }

    return results;
}