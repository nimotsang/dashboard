if (document.querySelector("link[rel = 'import']").import) {
    // 支持
    var post = document.querySelector("link[rel = 'import']").import;
    var con = post.querySelector("#navi");
    var node = document.querySelector("#page-wrapper");
    document.querySelector("#wrapper").insertBefore(con, node);
} else {
    // 不支持

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
    // document.getElementsByClassName('collapse in').parentNode.getElementsByTagName('ul')[0].setAttribute('class','collapse in')


    ////function add_sidebar()
    ////{
    ////     var nav = document.getElementsByTagName('nav')[0];
    ////     var div0 = creat_New('div', 'class', 'navbar-default sidebar');
    ////     div0.setAttribute('rloe', 'navigation');
    ////     var div1 = creat_New('div', 'class', 'sidebar-nav navbar-collapse');
    ////     var ul = creat_New('ul', 'class', 'nav');
    ////     ul.setAttribute('id', 'side-menu');
    ////     nav.appendChild(div0).appendChild(div1).appendChild(ul);
    ////}


    ////function add_search()
    ////{
    ////    var sidemenu = document.getElementById("side-menu");
    ////    var li = creat_New('li', 'class', 'sidebar-search');
    ////    var div = creat_New('div', 'class', 'input-group custom-search-form');
    ////    ddiv=sidemenu.appendChild(li).appendChild(div);
    ////    var input = creat_New('input', 'type','text');
    ////    input.setAttribute('class', 'form-control');
    ////    input.setAttribute('placeholder', '查找...');
    ////    var span = creat_New('span', 'class', 'input-group-btn');
    ////    ddiv.appendChild(input);
    ////    var button = creat_New('button', 'class', 'btn btn-default');
    ////    button.setAttribute('type', 'button');
    ////    var i = creat_New('i', 'class', 'fa fa-search')
    ////    ddiv.appendChild(span).appendChild(button).appendChild(i);

    ////}
    //////one level menu
    ////function addnav_index(name,icon,url) {
    ////    var sidemenu = document.getElementById("side-menu");
    ////    var li0fa = creat_New('li', 'id', 'li_fa0');
    ////    var a = creat_New('a', 'href', url);
    ////    var i = creat_New('i', 'class', 'fa ' + icon + ' fa-fw');
    ////    var text = document.createTextNode(name);
    ////    var aa = sidemenu.appendChild(li0fa).appendChild(a);
    ////    aa.appendChild(i);
    ////    aa.appendChild(text);
    ////}

    ////add_sidebar();
    ////add_search();
    ////addnav_index('仪表盘', 'fa-dashboard', 'index.html');
}