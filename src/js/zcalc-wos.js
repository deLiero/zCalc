// ZCalc constructor
function ZCalc() {

    // проверка ввода
    function checkInput(value) {
        return (/^[\d]+$/).test(value);
    }

    // нормализация ввода
    function normalize(num) {
        return num.replace(/[^1-9]/g, "");
    }

    // необходимые вычисления
    // возвращает массив результатов
    // первый элемент массива это исходное число
    // если передать пустышку то вернет [0]
    this.calculate = function (num) {

        // нормализуем введенные данные
        num = normalize(num);

        // если пустышка, то вернуть [0]
        if((num + "").length == 0) {
            return [0];
        }

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
    var input = document.getElementById("user-input"), // поле ввода
        resultElem = document.getElementById("result"), // вывод результата
        logContainerElem = document.getElementById("log-container"), // контейнер логов
        calc = new ZCalc();

    // CONSTANTS
    var ENTER_KEY = 13;

    //
    // MAIN BODY BLOCK
    //

    // обработка вычисления
    function calculate(before, value) {
        try {
            var result = calc.calculate(value); // получить результаты
            var printedResultArray = printResult(result); // вывести результаты
            log(before, input.value, printedResultArray); // отобразить лог
        } catch (err) {
            printError(err);
        } finally {
            input.focus();
        }
    }

    // Логирование вычислений
    function log(before, after, result) {
        var _result = "";
        for (var i = 0; i < result.length; i++) {
            if (i == 0) {
                _result = _result + result[i];
            } else {
                _result = _result + " " + result[i];
            }
        }
        logContainerElem.innerHTML = "<div class='log'><div><b>input: </b>" + before + "</div>" +
        "<div><b>normalized: </b>" + after + "</div>" +
        "<div><b>output: </b>" + _result + "</div></div>";
    }

    // вывод ошибки
    function printError(err) {
        logContainerElem.innerHTML = "<div class='log'><div><b>error: </b>" + err.message + "</div></div>";
    }

    // вывод результата
    // возвращает массив с выведеными результати
    function printResult(result) {
        if (typeof result === "undefined" || result.length == 0) {
            return;
        }

        var max = result.length;

        if (max == 1) {
            resultElem.innerHTML = result[0];
            return [result[0]];
        }

        if (max == 2) {
            resultElem.innerHTML = result[max-1];
            return[result[max-1]];
        }

        if (max == 3) {
            resultElem.innerHTML = '<span class="_small">' +
            result[max-2] +
            '</span><span class="_big">' +
            result[max-1] + "</span>";
            return [result[max-2], result[max-1]];
        }

        resultElem.innerHTML = '<span class="_small">' + result[max-3] +
            '</span>' + '<span class="_small">' +
            result[max-2] +
            '</span><span class="_big">' +
            result[max-1] + "</span>";
        return [result[max-3], result[max-2], result[max-1]];
    }

    //
    // EVENT HANDLERS
    //

    window.onblur = function () {
        input.blur();
    };

    //при фокуcе окна выделить текст инпута
    window.onfocus = function () {
        input.select();
    };

    // после ввода вычислить изменения
    input.oninput = function () {
        var before = input.value;
        input.value = input.value.replace(/[^1-9]/g,"");
        calculate(before, input.value);
    };

    // перед вводом проверить нажатую кнопку
    input.onkeydown = function (e) {
        if (e.which == ENTER_KEY) {
            e.preventDefault(); // IE9 prevent add \n to input
            calculate();
        }
    };

    // перевести фокус на поле ввода
    input.focus();
};