// Login check for each page.
$("div#wrapper").each(function () {

    if (!SecurityManager.username) {
        window.location = "login.html";

    };

});



$(document).ready(function () {

    $("div#login").each(function () {

        if (!SecurityManager.username) {
            SecurityManager.getIp();

        };
    });
    // Login click events.
    $("#submit").click(function () {
        // Login as the user and create a token key.
        var u = $("#username").val();
        var p = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([$("#password").val(), SecurityManager.salt].join(':'), SecurityManager.salt));
        if (u === "") {
            alert("账号输入为空");
            return false;
        } else if (p === "") {
            alert("密码输入为空");
            return false; }
        SecurityManager.generate(u, p);
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        $.ajax({
            type: "POST",
            "async": true,
            "crossDomain": true,
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentLogin/",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),


            "error": function (data) {
                if ((data.status && data.status === '401') || (data.responseJSON && data.responseJSON.Message == 'Authorization has been denied for this request.')) {
                    return alert("用户名或者密码错误！");
                }
            },
            "success": function (data) {
                data = data.ResultSets[0][0]
                if (u === data.UserName) {
                    window.location = "index.html";
                }
            }

        })
    });

        $("a#logout").click(function () {
            // Clear the token key and delete localStorage settings.
            SecurityManager.logout();


        });

        $("li.hide").hide();

        // Create user click events.
        $("#submituser").click(function () {
            // Login as the user and create a token key.
            var u = $("#username").val();
            var p = $("#password").val();
            var p1 = $("#password1").val();
            var code = $("#usercode").val();
            if (code === "") {
                alert("用户编号输入为空");
                return false;
            } else if (u === "") {
                alert("用户账号输入为空");
                return false;
            } else if (p === "") {
                alert("密码输入为空");
                return false;
            } else if (p1 === "") {
                alert("重复密码输入为空");
                return false;
            } else if (p !== p1) {
                alert("两次密码输入不相同");
                return false;
            } 
        });
    })



