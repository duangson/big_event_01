// 1.开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net';
// 2.测试环境服务器地址
// var baseURL = 'http://api-breakingnews-web.itheima.net';
// 3.生产环境服务器地址
// var baseURL = 'http://api-breakingnews-web.itheima.net';

//拦所所有Ajax请求:get/post/Ajax
//处理参数
$.ajaxPrefilter(function (options) {
    //拼接对应环境服务器地址
    //1.添加根路径
    options.url = baseURL + options.url;

    //2.身份认证
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
})