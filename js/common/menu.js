if (document.querySelector("link[rel = 'import']").import) {
    // 支持
    try {
        var post = document.querySelector("link[rel = 'import']").import;
        var con = post.querySelector("#navi");
        var node = document.querySelector("#page-wrapper");
        document.querySelector("#wrapper").insertBefore(con, node);
    }
    catch (ex)
    { alert("menu.js_if " + ex); }
} else {
    // 不支持
    try {

        function loadjscssfile(filename, filetype) {
            if (filetype == "js") { //if filename is a external JavaScript file 
                var fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", filename);
            }
            else if (filetype == "css") { //if filename is an external CSS file 
                var fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
            }
            if (typeof fileref != "undefined")
                document.getElementsByTagName("head")[0].appendChild(fileref);
        }
        loadjscssfile("../vendor/bootstrap/css/bootstrap.min.css", "css");
        loadjscssfile("../vendor/metisMenu/metisMenu.min.css", "css");
        loadjscssfile("../dist/css/sb-admin-2.css", "css");
        loadjscssfile("../vendor/font-awesome/css/font-awesome.min.css", "css");
        loadjscssfile("../vendor/datatables/css/dataTables.bootstrap.min.css", "css");
        loadjscssfile("../vendor/datatables-button/css/buttons.bootstrap.min.css", "css");
        loadjscssfile("../vendor/datatables-select/css/select.bootstrap.min.css", "css");
        loadjscssfile("../vendor/datatables-editor/css/editor.bootstrap.css", "css");
        loadjscssfile("../dist/css/main.css", "css");

        document.writeln("  <div id=\'navi\'>");
        document.writeln("        <nav class=\'navbar navbar-default navbar-static-top\' role=\'navigation\' style=\'margin-bottom: 0\'>");
        document.writeln("            <div class=\'navbar-header\'>");
        document.writeln("                <button type=\'button\' class=\'navbar-toggle\' data-toggle=\'collapse\' data-target=\'.navbar-collapse\'>");
        document.writeln("                    <span class=\'sr-only\'>Toggle navigation</span>");
        document.writeln("                    <span class=\'icon-bar\'></span>");
        document.writeln("                    <span class=\'icon-bar\'></span>");
        document.writeln("                    <span class=\'icon-bar\'></span>");
        document.writeln("                </button>");
        document.writeln("                <a class=\'navbar-brand\' href=\'index.html\'>支付网关管理系统后台beta</a>");
        document.writeln("            </div>");
        document.writeln("            <ul class=\'nav navbar-top-links navbar-right\'>");
        document.writeln("                <li class=\'dropdown\'>");
        document.writeln("                    <a class=\'dropdown-toggle\' data-toggle=\'dropdown\' href=\'#\'>");
        document.writeln("                        <i class=\'fa fa-user fa-fw\'></i> <i class=\'fa fa-caret-down\'></i>");
        document.writeln("                    </a>");
        document.writeln("                    <ul class=\'dropdown-menu dropdown-user\'>");
        document.writeln("                        <li>");
        document.writeln("                            <a href=\'staff.html\'><i class=\'fa fa-user fa-fw\'></i> 登录账号</a>");
        document.writeln("                        </li>");
        document.writeln("                        <li>");
        document.writeln("                            <a href=\'settings.html\'><i class=\'fa fa-gear fa-fw\'></i> 系统设置</a>");
        document.writeln("                        </li>");
        document.writeln("                        <li class=\'divider\'></li>");
        document.writeln("                        <li id=\'logout\'>");
        document.writeln("                            <a id=\'logout\' href=\'login.html\' ><i class=\'fa fa-sign-out fa-fw\'></i> 注销登录</a>");
        document.writeln("                        </li>");
        document.writeln("                    </ul>");
        document.writeln("                </li>");
        document.writeln("            </ul>");
        document.writeln("            <div class=\'navbar-default sidebar\' role=\'navigation\'>");
        document.writeln("                <div class=\'sidebar-nav navbar-collapse\'>");
        document.writeln("                    <ul class=\'nav\' id=\'side-menu\'>");
        document.writeln("                        <li class=\'sidebar-search\'>");
        document.writeln("                            <div class=\'input-group custom-search-form\'>");
        document.writeln("                                <input type=\'text\' class=\'form-control\' placeholder=\'查找...\'>");
        document.writeln("                                <span class=\'input-group-btn\'>");
        document.writeln("                                    <button class=\'btn btn-default\' type=\'button\'>");
        document.writeln("                                        <i class=\'fa fa-search\'></i>");
        document.writeln("                                    </button>");
        document.writeln("                                </span>");
        document.writeln("                            </div>");
        document.writeln("                        </li>");
        document.writeln("                        <li>");
        document.writeln("                            <a href=\'index.html\'><i class=\'fa fa-dashboard fa-fw\'></i> 仪表盘</a>");
        document.writeln("                        </li>");
        document.writeln("                    </ul>");
        document.writeln("                </div>");
        document.writeln("            </div>");
        document.writeln("        </nav>");
        document.writeln("        </div>");


        function creat_New(tag, type, val) {
            var element = document.createElement(tag);
            element.setAttribute(type, val);
            return element;
        }
        //two level menu
        function addnav_fa(name, icon, n) {
            var sidemenu = document.getElementById("side-menu");
            var li = document.createElement('li');
            var lli = sidemenu.appendChild(li)
            var a = creat_New('a', 'href', '#');
            var i = creat_New('i', 'class', 'fa ' + icon + ' fa-fw');
            var span = creat_New('span', 'class', 'fa arrow');
            var text = document.createTextNode(name);
            var aa = lli.appendChild(a)
            aa.appendChild(i);
            aa.appendChild(text);
            aa.appendChild(span);


            var ul = creat_New('ul', 'class', 'nav nav-second-level');
            ul.setAttribute('id', 'li_fa' + n);
            lli.appendChild(ul);
        }

        function addnav_sec(name, n, url) {
            var navfa = document.getElementById("li_fa" + n);
            var li = document.createElement('li');
            var a = creat_New('a', 'href', url);
            a.innerText = name;
            navfa.appendChild(li).appendChild(a);

        }
        addnav_fa('商户管理', 'fa-users', '1');
        addnav_sec('商户信息', '1', 'merchant.html');
        addnav_sec('门店信息', '1', 'store.html');
        addnav_sec('用户信息', '1', 'staff.html');
        addnav_fa('商品管理', 'fa-tags', '2');
        addnav_sec('产品管理', '2', 'product.html');
        addnav_sec('供应商管理', '2', 'vendor.html');
        addnav_sec('产品层级管理', '2', 'hierarchy.html');
        addnav_fa('支付管理', 'fa-money', '3');
        addnav_sec('支付账号管理', '3', 'account.html');
        addnav_sec('支付方式管理', '3', 'storeaccount.html');
        addnav_fa('订单管理', 'fa-bank', '4');
        addnav_sec('订单状态管理', '4', 'orders.html');
        addnav_fa('对账管理', 'fa-eye', '5');
        addnav_sec('对账记录管理', '5', 'checking.html');
        addnav_fa('结算管理', 'fa-check-circle', '6');
        addnav_sec('结算查询', '6', 'settlement.html');

  //    loadjscssfile("https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js", "js");
  //    loadjscssfile("https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js", "js");

        loadjscssfile("../vendor/jquery/jquery.min.js", "js");
        loadjscssfile("../vendor/bootstrap/js/bootstrap.min.js", "js");
        loadjscssfile("../vendor/metisMenu/metisMenu.min.js", "js");
        loadjscssfile("../dist/js/sb-admin-2.js", "js");
        loadjscssfile("../vendor/datatables/js/jquery.dataTables.min.js", "js");
        loadjscssfile("../vendor/datatables/js/dataTables.bootstrap.min.js", "js");
        loadjscssfile("../vendor/datatables-editor/js/dataTables.editor.min.js", "js");
        loadjscssfile("../vendor/datatables-editor/js/editor.bootstrap.min.js", "js");
        loadjscssfile("../vendor/datatables-select/js/dataTables.select.min.js", "js");
        loadjscssfile("../vendor/datatables-button/js/dataTables.buttons.min.js", "js");
        loadjscssfile("../vendor/datatables-button/js/buttons.bootstrap.min.js", "js");
        loadjscssfile("../js/common/jszip.min.js", "js");
        loadjscssfile("../vendor/datatables-button/js/buttons.html5.min.js", "js");
        loadjscssfile("../vendor/datatables-button/js/buttons.print.min.js", "js");

        //DMS JavaScript 
        loadjscssfile("../js/common/hmac-sha256.js", "js");
        loadjscssfile("../js/common/enc-base64.js", "js");
        loadjscssfile("../js/security.js", "js");
        loadjscssfile("../js/script.js", "js");
    }
    catch (ex)
    { alert('menu.js_writeln' + ex); }
}

