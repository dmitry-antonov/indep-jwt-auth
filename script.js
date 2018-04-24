(function() {
    var makeCorsCall = function(url, params, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.responseType = "json";
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
                callback({status: xmlhttp.status, value: xmlhttp.response});
            }
        };

        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
    };

    var logoutUser = function() {
        localStorage.removeItem("token");
        clearForm();
        showLinks();
    };

    var clearForm = function() {
        document.getElementById("auth").innerHTML = "";
    };

    var showRegisterForm = function() {
        var inputLogin = document.createElement("input");
        inputLogin.type = "text";
        inputLogin.placeholder = "login";
        inputLogin.class = "login";

        var inputName = document.createElement("input");
        inputName.type = "text";
        inputName.placeholder = "name";
        inputName.class = "name";

        var inputPassword = document.createElement("input");
        inputPassword.type = "password";
        inputPassword.placeholder = "password";
        inputPassword.class = "password";

        var inputButton = document.createElement("input");
        inputButton.type = "submit";
        inputButton.class = "password";

        var authEl = document.getElementById("auth");
        authEl.appendChild(inputLogin);
        authEl.appendChild(inputName);
        authEl.appendChild(inputPassword);
        authEl.appendChild(inputButton);

        inputButton.addEventListener("click", function(e) {
            var params = "login=" + inputLogin.value + "&password=" + inputPassword.value + "&name=" + inputName.value;
            makeCorsCall("http://auth.local/index.php?r=user/register", params, function(data) {
                if (data.status == 200) {
                    clearForm();
                    var authEl = document.getElementById("auth");
                    authEl.appendChild(document.createTextNode("User successfully registered."));
                    authEl.appendChild(document.createElement("br"));
                    showAuthForm();
                } else {
                    alert("Something went wrong. Check login and password");
                }
            });
            e.stopPropagation();
        });
    };

    var showAuthForm = function() {
        var inputLogin = document.createElement("input");
        inputLogin.type = "text";
        inputLogin.placeholder = "login";
        inputLogin.class = "login";

        var inputPassword = document.createElement("input");
        inputPassword.type = "password";
        inputPassword.placeholder = "password";
        inputPassword.class = "password";

        var inputButton = document.createElement("input");
        inputButton.type = "submit";
        inputButton.class = "password";

        var authEl = document.getElementById("auth");
        authEl.appendChild(inputLogin);
        authEl.appendChild(inputPassword);
        authEl.appendChild(inputButton);

        inputButton.addEventListener("click", function(e) {
            var params = "login=" + inputLogin.value + "&password=" + inputPassword.value;
            makeCorsCall("http://auth.local/index.php?r=user/auth", params, function(data) {
                if (data.status == 200) {
                    localStorage.token = data.value.token;
                    clearForm();
                    showHello(data.value.name);
                } else if(data.status == 403) {
                    alert("Wrong login or password");
                }
                console.log(data);
            });

            e.stopPropagation();
        });
    };

    var showLinks = function showLinks() {
        var authEl = document.getElementById("auth");

        var linkRegister = document.createElement("a");
        linkRegister.href = "#";
        linkRegister.innerHTML = "sign up";

        var textNode = document.createTextNode(" / ");

        var linkLogin = document.createElement("a");
        linkLogin.href = "#";
        linkLogin.innerHTML = "sign-in";

        authEl.appendChild(document.createElement("br"));
        authEl.appendChild(linkRegister);
        authEl.appendChild(textNode);
        authEl.appendChild(linkLogin);

        linkRegister.addEventListener("click", function(e) {
            clearForm();
            showRegisterForm();
            showLinks();
            e.stopPropagation();
        });

        linkLogin.addEventListener("click", function(e) {
            clearForm();
            showAuthForm();
            showLinks();
            e.stopPropagation();
        });
    };

    var showHello = function (name) {
        var authEl = document.getElementById("auth");
        authEl.appendChild(document.createTextNode("Hello, " + name + "! "));

        var logoutLink = document.createElement("a");
        logoutLink.text = "(logout)";
        logoutLink.href = "#";

        logoutLink.addEventListener("click", function(e) {
            logoutUser();
            e.stopPropagation();
        });

        authEl.appendChild(logoutLink);
    };

    if (typeof(Storage) !== "undefined" && typeof localStorage.token === "undefined") {
        showLinks();
    } else {
        var params = "token=" + localStorage.token;
        makeCorsCall("http://auth.local/index.php?r=token/check", params, function(data) {
            if (data.status == "200") {
                clearForm();
                showHello(data.value.name);
            } else {
                logoutUser();
            }
        });
    }
}).call(typeof window !== 'undefined' ? window : this);