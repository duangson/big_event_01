$(function () {
    //1.初始化分类
    var form = layui.form;  //导入form
    var layer = layui.layer;
    initCate(); //调用函数
    //封装
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',

            success: (res) => {
                //console.log(res);
                //校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //赋值，渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    //2.初始化文本编辑器
    initEditor()

    // 3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    //4.点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    //5.选择文件，同步修改图片预览区
    $('#coverFile').on('change', function (e) {
        //拿到用户选择的文件
        var file = e.target.files[0]
        //非空校验！
        if (file == undefined) {
            return;
        }

        //根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //6.参数状态值处理
    let state = '已发布';
    // $('#btnSave1').on('click', function () {
    //     state = '草稿',
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })


    //7.发布文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //发布文章是文件上传操作，要使用FromData类型的数据
        let fd = new FormData(this);
        //已有3个，再添加一个
        fd.append('state', state);
        //还剩最后一个属性
        $image.cropper('getCroppedCanvas', {
            //创建一个canvas画布
            width: 400,
            height: 280
        })
            //将canvas画布上的内容，转换成文件对象
            .toBlob(function (blob) {
                //得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                //！！发送！！ajax， 要在toBlob（）函数里面
                console.log(...fd);

                //封装发布文章的ajax
                publishArticle(fd);
            });

    });

    //封装
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            processData: false,
            contentType: false,
            success: (res) => {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，发布文章成功！');
                // 跳转
                // location.href = '/article/art_list.html'

                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 500)
            }
        })
    }


})