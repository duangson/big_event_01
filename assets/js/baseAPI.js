// 1.开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net';
// 2.测试环境服务器地址
// var baseURL = 'http://api-breakingnews-web.itheima.net';
// 3.生产环境服务器地址
// var baseURL = 'http://api-breakingnews-web.itheima.net';

//拦所所有Ajax请求:get/post/Ajax
//处理参数
$.ajaxPrefilter(function (params) {
    //拼接对应环境服务器地址
    params.url = baseURL + params.url;
})