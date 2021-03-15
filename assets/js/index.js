//入口函数
$(function () {
    //1.获取用户信息
    getUserInfo();

    //2.退出
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        //框架提供的询问框
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function (index) {
            //do something

            //1.清空本地token
            localStorage.removeItem('token');
            //2.页面跳转
            location.href = '/login.html';
            //3.关闭询问框
            layer.close(index);
        });
    })
});

//获取用户信息(封装到入口函数的外面了)
//  原因:后面其他的页面要调用
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // Headers: {
        //     //重新登录,
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            //console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },

        //无论请求成功还是失败，都会执行complete
        complete: function (res) {
            console.log(res.responseJSON);
            //判断：如果状态码是1，错误信息是身份认证失败
            var obj = res.responseJSON;
            if (obj.status == 1 && obj.message == '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html';
            }
        }
    });
}

function renderAvatar(user) {
    //1.渲染名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}