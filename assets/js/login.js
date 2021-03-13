//入口函数
$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //需求2:自定义layui校验规则
    let form = layui.form;
    form.verify({
        //密码规则
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须6到16位，且不能出现空格'
        ],
        //重复密码校验规则
        repwd: function (value) {
            // console.log(value);
            // console.log($());
            var pwd = $('.reg-box input[name=password]').val();
            //比较
            if (value !== pwd) {
                return '两次输入密码不一致'
            }
        }
    });

    //需求3:注册用户
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: function (res) {
                //console.log(res);
                if (res.status != 0) {
                    return layer.msg('注册失败', { icon: 5 });
                }
                //
                layer.msg('注册成功,请登录!', { icon: 6 });
                //手动切换到登录表单
                $('#link_login').click();
                //重置form表单
                $('#form_reg')[0].reset();
            }
        });
    })

    //需求4:用户登录
    $('#form_login').on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                //console.log(res);
                if (res.status != 0) {
                    return layer.msg('用户名或者密码错误', { icon: 5 });

                }
                //提示信息,保存token,跳转页面
                layer.msg('恭喜您,登录成功!');
                //保存token,未来的接口要使用token
                localStorage.setItem('token', res.token);
                //跳转
                location.href = '/index.html'
            }
        });
    })
})