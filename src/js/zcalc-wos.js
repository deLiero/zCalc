// ZCalc constructor
function ZCalc() {

    // проверка ввода
    function checkInput(value) {
        return (/^[\d]+$/).test(value);
    }

    // нормализация ввода
    function normalize(num) {
        if ((/^0*$/).test(num)) {
            return "0";
        } else {
            return num.replace(/^0*/,"");
        }
    }

    // необходимые вычисления
    // возвращает массив результатов
    // первый элемент массива это исходное число
    // если передать пустышку то вернет [0]
    this.calculate = function (num) {

        if((num + "").length == 0) {
            return [0];
        }

        if (!checkInput(num)) {
            throw new Error("ошибка ввода");
        }

        num = normalize(num);

        var tempNum = 0,
            results = [];

        results.push(num);

        while (num > 9) {
            num = num + "";

            for (var n = 0; n < num.length; n++) {
                tempNum = tempNum + parseInt(num.charAt(n));
            }

            num = tempNum;
            results.push(num);
            tempNum = 0;
        }

        return results;
    };
}

// all work here
window.onload = function () {
    var input = document.getElementById("user-input"),
        shadowInput = document.getElementById("shadow-input")
        resultElem = document.getElementById("result"),
        calc = new ZCalc();

    // CONSTANTS
    var ENTER_KEY = 13,
        SPACE_KEY = 32;

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
            resultElem.innerHTML = result[max-1];
            return;
        }

        if (max == 3) {
            resultElem.innerHTML = '<span class="_small">' +
            result[max-2] +
            '</span><span class="_big">' +
            result[max-1] + "</span>";
            return;
        }

        resultElem.innerHTML = '<span class="_small">' + result[max-3] +
            '</span>' + '<span class="_small">' +
            result[max-2] +
            '</span><span class="_big">' +
            result[max-1] + "</span>";
    }

    // обработка клика
    function calculate() {
        try {
            var result = calc.calculate(input.value);
            printResult(result);
        } catch (err) {
            printError(err);
        } finally {
            input.focus();
        }
    }

    //
    // EVENT HANDLERS
    //

    window.onblur = function () {
        console.log("blur");
        input.blur();
    };

    //при фокуcе окна выделить текст инпута
    window.onfocus = function () {
        input.select();
        //input.focus();
    };

    // после ввода вычислить изменения
    input.oninput = function () {
        calculate();
    };

    // перед вводом проверить нажатую кнопку
    input.onkeydown = function (e) {
        if (e.which == ENTER_KEY) {
            e.preventDefault(); // IE9 prevent add \n to input
            calculate();
        }

        // защита от пробела
        if (e.which == SPACE_KEY) {
            e.preventDefault();
        }
    };

    // перевести фокус на поле ввода
    input.focus();
};