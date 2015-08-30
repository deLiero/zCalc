// ZCalc constructor
function ZCalc(conf) {

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
        autoclearElement = document.getElementById("autoclear"),
        calc = new ZCalc();

    // CONSTANTS
    var ENTER_KEY = 13;

    var DEFAULT_CONFIG = {
        "cls": true,
        "res_count": 2
    };

    var cur_config = {};

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

        if (cur_config["res_count"] == 1) {
            resultElem.innerHTML = '</span><span class="_big">' +
            result[max-1] + "</span>";
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
            var result = calc.calculate(input.value);
            printResult(result);
        } catch (err) {
            printError(err);
        } finally {
            if (cur_config["cls"]) {
                cls();
            }
            input.focus();
        }
    }

    //
    // CONFIGURATION BLOCK
    //

    // загрузка конфигурации
    function loadConfiguration() {
        var conf = localStorage.getItem("conf");

        if(conf) {
            conf = JSON.parse(conf);
            cur_config["cls"] = conf["cls"];
            cur_config["res_count"] = conf["res_count"];
            console.log("Config load successful");
        } else {
            cur_config["cls"] = DEFAULT_CONFIG["cls"];
            cur_config["res_count"] = DEFAULT_CONFIG["res_count"];
            console.log("Config set to default");
        }
    }

    // настроить блок с настройками согласно текущей конфигурации
    function setUpConfigurationBlock() {
        autoclearElement.checked = cur_config["cls"];
        selectElem.value = cur_config["res_count"];
    }

    // сохранить текущую конфигурацию
    function saveConfiguration() {
        var conf = {};
        conf["cls"] = autoclearElement.checked;
        conf["res_count"] = selectElem.value;

        cur_config = conf;
        localStorage.setItem("conf", JSON.stringify(conf));
        console.log("Config save successful");
    }

    //
    // EVENT HANDLERS
    //

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
        saveConfiguration();
    };

    // загрузить конфигурацию и отобразить в настройках
    loadConfiguration();
    setUpConfigurationBlock();

    // перевести фокус на поле ввода
    input.focus();

};