// ZCalc constructor
function ZCalc(conf) {

    // проверка ввода
    function checkInput(value) {
        return (/^[\d]+$/).test(value);
    }

    // необходимые вычисления
    // возвращает массив результатов
    // первый элемент массива это исходноечисло
    this.calculate = function (num) {

        if (!checkInput(num)) {
            throw new Error("ошибка ввода");
        }

        console.log("after error");

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

// add some additional functionality to HTMLElement

HTMLElement.prototype.normalizeClassName = function () {
    this.className = this.className.replace(/\s{2,}/g, " ");
};

HTMLElement.prototype.addClass = function (value) {
    if (this.className.indexOf(value) == -1) {
        this.className = this.className + " " + value;
        this.normalizeClassName();
        this.className = this.className.trim();
    }
};

HTMLElement.prototype.removeClass = function (value) {
    if (this.className.indexOf(value) != -1) {
        this.className = this.className.replace(value, "");
        this.normalizeClassName();
        this.className = this.className.trim();
    }
};

HTMLElement.prototype.hasClass = function (value) {
    return this.className.indexOf(value) !== -1;
};

HTMLElement.prototype.toggleClass = function (value) {
    if (this.hasClass(value)) {
        this.removeClass(value);
    } else {
        this.addClass(value);
    }
};

// all work here
window.onload = function () {
    var input = document.getElementById("user-input"),
        calcButton = document.getElementById("calc-btn"),
        resultElem = document.getElementById("result"),
        confLink = document.getElementById("prop"),
        confBlock = document.getElementById("settings"),
        confButton = document.getElementById("cong-btn"),
        selectElem = document.getElementById("select"),
        calc = new ZCalc();

    // CONSTANTS
    var ENTER_KEY = 13;

    // перевести фокус на поле ввода
    input.focus();

    calcButton.onclick = handleClick;

    document.onkeydown = function (e) {
        if (e.which == 13) {
            handleClick();
        }
    };

    confLink.onclick = function (e) {
        e.preventDefault();
        confBlock.toggleClass("-shown");
    };

    confButton.onclick = function () {
        confBlock.removeClass("-shown");
        alert(selectElem.value);
    };

    // очистка ввода
    function cls() {
        input.value = "";
    }

    // обработка клика
    function handleClick() {
        try {
            var result = calc.calculate(input.value);
            cls();
            printResult(result);
        } catch (err) {
            cls();
            printError(err);
        } finally {
            input.focus();
        }

    }

    // вывод ошибки
    function printError(err) {
        resultElem.innerHTML = '<span class="_error">' + err.message + '</span>';
    }

    // вывод результата
    (function (){
        this.printResult = function (result) {
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
        };
    })();
};