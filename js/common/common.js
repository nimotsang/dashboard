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