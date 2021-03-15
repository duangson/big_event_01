$(function () {
    //1.自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6位之间!';
            }
        }
    });

    //2.展示用户信息(后面这个功能还要用,所以封装成函数)
    //导出layer
    var layer = layui.layer;

    initUserinfo();

    function initUserinfo() {
        //发送ajax
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('formUserInfo', res.data);
            }
        })
    }

    //3.重置
    $('#btnReset').on('click', function (e) {
        e.preventDefalut();
        //用上面的渲染方法实现
        initUserinfo();
    })

    //4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!')
                }
                layer.msg('恭喜您,用户信息修改成功!')
                window.parent.getUserInfo();
            }
        })
    })
})