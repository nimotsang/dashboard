$(function () {

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
		
        $.get('http://localhost/token/api/find?q=' + '&token=' + SecurityManager.generate(), function (data) {
            var names = data.join(', ');
            window.location = "index.html";
        }).fail(function (error) {
            alert("用户名或者密码错误！");
        });
    });

    $("a.logout").click(function () {
        // Clear the token key and delete localStorage settings.
        SecurityManager.logout();
        alert('Ok, logged out!');

    });

    $("div#wrapper").each(function () {
        // Clear the token key and delete localStorage settings.
        $.get('http://localhost/token/api/find?q=' + '&token='+ SecurityManager.generate(), function (data) {
            var names = data.join(', ');
        }).fail(function (error) {
            alert("请先登录系统！");
            window.location = "login.html";
        });

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

        $.get('http://localhost/token/api/find?q=' + '&token=' + SecurityManager.generate(), function (data) {
            var names = data.join(', ');
            window.location = "index.html";
        }).fail(function (error) {
            alert("用户名或者密码错误！");
        });}**/
    });
});





