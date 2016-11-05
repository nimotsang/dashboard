$(document).ready(function () {

    // Login click events.
    $("#submit").click(function () {
        // Login as the user and create a token key.
        var u = $("#username").val();
        var p = $("#password").val();
        if (u === "") {
            alert("账号输入为空");
            return false;
        } else if (p === "") {
            alert("密码输入为空");
            return false; }
        SecurityManager.generate(u, p);
        $.ajax({
            type: "POST",
            "async": true,
            "crossDomain": true,
            url: 'https://mbeta.pw/mocdbapi/RaymSP_GatewayPaymentLogin/',
            data: {
                "token": SecurityManager.generate(),
                "username":SecurityManager.username
            },
            dataType: "json",
            error: function (data) {
                if ((data.status && data.status === '401') || (data.responseJSON && data.responseJSON.Message == 'Authorization has been denied for this request.')) {
                    return alert("用户名或者密码错误！");
                }
            },
            success: function (data) {
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

        $("div#wrapper").each(function () {
            // Clear the token key and delete localStorage settings.
            if (!SecurityManager.username) {
                window.location = "login.html";

            };

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
            } /**else {
        SecurityManager.generate(u, p);

        $.get('http://desktop-idhm2sh/token/api/find?q=' + '&token=' + SecurityManager.generate(), function (data) {
            var names = data.join(', ');
            window.location = "index.html";
        }).fail(function (error) {
            alert("用户名或者密码错误！");
        });}**/
        });
    })



