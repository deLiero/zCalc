// ZCalc constructor
//TODO баг с нулями, добавить порционый расчет на случай большших чисел
function ZCalc() {

    // проверка ввода
    function checkInput(value) {
        return (/^[\d]+$/).test(value);
    }

    // необходимые вычисления
    // возвращает массив результатов
    // первый элемент массива это исходное число
    this.calculate = function (num) {

        if (!checkInput(num)) {
            throw new Error("ошибка ввода");
        }

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
    };
}

// all work here
window.onload = function () {
    var input = document.getElementById("user-input"),
        calcButton = document.getElementById("calc-btn"),
        resultElem = document.getElementById("result"),
        calc = new ZCalc();

    // CONSTANTS
    var ENTER_KEY = 13;

    //
    // MAIN BODY BLOCK
    //

    // очистка ввода
    function cls() {
        input.value = "";
    }

    // вывод ошибки
    function printError(err) {
        resultElem.innerHTML = '<span class="_error">' + err.message + '</span>';
    }

    // вывод результата
    function printResult(result) {
        if (typeof result === "undefined" || result.length == 0) {
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
    }

    // обработка клика
    function handleClick() {
        try {
            console.log(input.value);
            var result = calc.calculate(input.value);
            printResult(result);
        } catch (err) {
            printError(err);
        } finally {
            cls();
            input.focus();
        }
    }

    //
    // EVENT HANDLERS
    //

    calcButton.onclick = handleClick;

    input.onkeydown = function (e) {
        if (e.which == 13) {
            e.preventDefault(); // IE9 prevent add \n to input
            handleClick();
        }
    };

    // перевести фокус на поле ввода
    input.focus();
};