// DB Web API Server 
var sysSettings ={
    //"domainPath": "http://desktop-idhm2sh/mocdbapi/"
    "domainPath": "https://localhost:44395/"
};

function checkname(value) {
    var Regx = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
    if (Regx.test(value)) {
        return true;
    }
    else {
        return false;
    }
};
function checkcode(value) {
    var Regx = /^[A-Za-z0-9]*$/;
    if (Regx.test(value)) {
        return true;
    }
    else {
        return false;
    }
};

function checkprice(value) {
    var Regx = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (Regx.test(value)) {
        return true;
    }
    else {
        return false;
    }
};