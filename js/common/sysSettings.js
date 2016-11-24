// DB Web API Server 
var sysSettings ={
    //"domainPath": "http://desktop-idhm2sh/mocdbapi/"
    "domainPath": "https://dev.mbeta.pw/mocdbapi/"
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

function checkdate(value) {
    var Regx = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
    if (Regx.test(value)) {
        return true;
    }
    else {
        return false;
    }
};