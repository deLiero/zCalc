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
var calc = (function () {
    var input = document.getElementById("user-input"), // поле ввода
        resultElem = document.getElementById("result"), // вывод результата
        logContainerElem = document.getElementById("log-container"), // контейнер логов
        savedLogsElem = document.getElementById("saved-logs"), // контейнер для сохраненных логов
        curLog = null, // текущий лог
        deleteAllLogsElem = document.getElementById("delete-all-logs"), // удаляет все логи
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
            curLog = log(before, input.value, printedResultArray);
        } catch (err) {
            console.error(err.message);
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
        logContainerElem.innerHTML = "<div class='log'><div class='save-log' onclick='calc.saveAndAnimate()'>сохранить</div><div><b>input: </b>" + before + "</div>" +
        "<div><b>normalized: </b>" + after + "</div>" +
        "<div><b>output: </b>" + _result + "</div></div>";
        return {
            before: before,
            after: after,
            result: result
        }
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

    // LOGGING

    function showDeleteAllLogButton() {
        deleteAllLogsElem.style.display = "block";
    }

    function hideDeleteAllLogButton() {
        deleteAllLogsElem.style.display = "none";
    }

    function isEmpty() {
        return savedLogsElem.innerHTML.trim() == "";
    }

    // удаление лога
    function removeLog(child) {
        if (!child) {
            return;
        }
        savedLogsElem.removeChild(child);
        if (isEmpty()) {
            hideDeleteAllLogButton();
        }
    }

    function deleteAllLogs() {
        savedLogsElem.innerHTML = "";
        hideDeleteAllLogButton();

    }

    // сохраняет лог в контейнере
    function saveLog(htmlLog) {
        if (!htmlLog) {
            return false;
        }
        console.log(isEmpty());
        if (isEmpty()) {
            showDeleteAllLogButton();
        }
        savedLogsElem.insertBefore(htmlLog, savedLogsElem.firstChild);
        return true;
    }

    function saveAndAnimate() {
        var log = logToHtmlElement(curLog);
        if(log !== null) {
            curLog = null;
            var oldLog = logContainerElem.getElementsByClassName("log")[0];
            oldLog.style.marginLeft = "-120%"; // убрать лог из виду
            saveLog(log);
            setTimeout(function () { // через 100ms показать лог с анимацией
                log.style.marginLeft = "0";
            }, 100);
        }
    }

    function htmlClickSaveAndAnimate() {
        saveAndAnimate();
        input.select();
    }

    // если лог удачно конвертирован в html
    // вернет сам лог либо null
    function logToHtmlElement(log) {
        if (!log) {
            return null;
        }
        var resultToString = "";
        for (var i = 0; i < log.result.length; i++) {
            if (i == 0) {
                resultToString = resultToString + log.result[i];
            } else {
                resultToString = resultToString + " " + log.result[i];
            }
        }
        var innerHTML = "<div class='remove-log'>удалить</div>" +
            "<div><b>input: </b>" + log.before + "</div>" +
            "<div><b>normalized: </b>" + log.after + "</div>" +
            "<div><b>output: </b>" + resultToString + "</div>";
        var div = document.createElement("div");
        div.className = "log";
        div.innerHTML = innerHTML;
        return div;
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

    // при нажатии Enter сохранить лог
    input.onkeydown = function (e) {
        if (e.which == ENTER_KEY) {
            e.preventDefault(); // IE9 prevent add \n to input
            saveAndAnimate();
        }
    };

    // после нажатия выделить текст в input
    input.onkeyup = function (e) {
        if (e.which === ENTER_KEY) {
            //input.focus();
            input.select();
        }
    };

    // обработчик с делегированием
    // отвечает за удаление сохраненных логов
    savedLogsElem.onclick = function (e) {
        var target = e.target;
        if(target.className === "remove-log") {
            var parent = target.parentNode;
            if (parent.className === "log") {
                removeLog(parent);
            }
        }
    };

    // удаление всех логов
    deleteAllLogsElem.onclick = deleteAllLogs;

    // перевести фокус на поле ввода
    input.focus();

    return {
        saveAndAnimate: htmlClickSaveAndAnimate
    }
})();