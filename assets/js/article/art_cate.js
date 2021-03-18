$(function () {
    //1.渲染文章分类列表（后面添加、删除、修改还要用）
    var layer = layui.layer;
    initArtCateList();

    //函数封装
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                //console.log(res);
                //状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //获取不用弹窗，直接展示
                //传递的是对象，遍历的对象上面的属性
                let str = template('tpl-art-cate', { data: res.data });
                $('tbody').html(str);
            }
        })
    }

    //2.显示添加文章分类列表
    var layer = layui.layer;
    $('.btnAdd').on('click', function () {
        //console.log(1);
        //利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })

    //3.提交文章分类添加（事件委托）
    var indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('恭喜您，文章类别添加成功！');
                layer.close(indexAdd);
            }
        })
    })

    //4.修改：展示表单
    var form = layui.form;
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        //console.log(1);
        //利用框架代码，显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        //4.2获取Id，发送ajax获取数据，渲染到页面
        var Id = $(this).attr('data-id');
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + Id,

            success: (res) => {
                //console.log(res);
                form.val('form-edit', res.data);
            }
        })

        //5.修改提交
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: (res) => {
                    //console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg('恭喜您，文章类别更新成功！');
                    layer.close(indexEdit);
                }
            })
        })

    })


    //5.删除
    $('tbody').on('click', '.btn-delete', function () {
        //console.log(1);
        var Id = $(this).attr('data-id');
        //利用框架代码，显示提示添加文章类别区域
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + Id,

                success: (res) => {
                    //console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    initArtCateList();
                    layer.msg('恭喜您，文章类别删除成功！');
                    layer.close(index);
                }
            })
        });

    })
})
