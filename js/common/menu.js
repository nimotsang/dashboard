// Menu file loading
var post = document.querySelector("link[rel = 'import']").import;
var con = post.querySelector("#navi");
var node = document.querySelector("#page-wrapper");
document.querySelector("#wrapper").insertBefore(con, node);
