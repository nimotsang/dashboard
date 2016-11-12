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
loadjscssfile("../vendor/datatables-editor/css/editor.bootstrap.min.css", "css");
loadjscssfile("https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js", "js");
loadjscssfile("https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js", "js");



loadjscssfile("../vendor/jquery/jquery.min.js", "js");
loadjscssfile("../vendor/bootstrap/js/bootstrap.min.js", "js");
loadjscssfile("../vendor/metisMenu/metisMenu.min.js", "js");
loadjscssfile("../dist/js/sb-admin-2.js", "js");
loadjscssfile("../vendor/datatables/js/jquery.dataTables.min.js", "js");
loadjscssfile("../vendor/datatables-plugins/dataTables.bootstrap.min.js", "js");
loadjscssfile("../vendor/datatables-editor/js/dataTables.editor.min.js", "js");
loadjscssfile("../vendor/datatables-editor/js/editor.bootstrap.min.js", "js");
loadjscssfile("../vendor/datatables-select/js/dataTables.select.min.js", "js");
loadjscssfile("../vendor/datatables-button/js/dataTables.buttons.min.js", "js");
loadjscssfile("../vendor/datatables-button/js/buttons.bootstrap.min.js", "js");
loadjscssfile("../js/common/jszip.min.js", "js");
loadjscssfile("../vendor/datatables-button/js/buttons.html5.min.js", "js");
loadjscssfile("../vendor/datatables-button/js/buttons.print.min.js", "js");

//DMS JavaScript 
loadjscssfile("//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha256.js", "js");
loadjscssfile("//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/enc-base64.js", "js");
loadjscssfile("../js/security.js", "js");
loadjscssfile("../js/script.js", "js");

//document.writeln("<link href=\"../vendor/bootstrap/css/bootstrap.min.css\" rel=\"stylesheet\">");
//document.writeln("<link href=\"../vendor/metisMenu/metisMenu.min.css\" rel=\"stylesheet\">");
//document.writeln("<link href=\"../dist/css/sb-admin-2.css\" rel=\"stylesheet\">");
//document.writeln("<link href=\"../vendor/font-awesome/css/font-awesome.min.css\" rel=\"stylesheet\" type=\"text/css\">");
//document.writeln("<link href=\"../vendor/datatables/css/dataTables.bootstrap.min.css\" rel=\"stylesheet\">");
//document.writeln("<link href=\"../vendor/datatables-button/css/buttons.bootstrap.min.css\" rel=\"stylesheet\">");
//document.writeln("<link href=\"../vendor/datatables-select/css/select.bootstrap.min.css\" rel=\"stylesheet\">");
//document.writeln("<link href=\"../vendor/datatables-editor/css/editor.bootstrap.min.css\" rel=\"stylesheet\">");