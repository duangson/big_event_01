$(function () {
    //为art-template定义时间过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth())
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    //在个位数的左侧填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,   //   是	int	    页码值
        pagesize: 2,	//   是	int	    每页显示多少条数据
        cate_id: '',   //   否	string	文章分类的 Id
        state: '',     //   否	string	文章的状态，可选值有：已发布、草稿
    }

    //2.初始化文章列表
    var layer = layui.layer;
    initTable();
    //封装初始化文章列表数据
    function initTable() {
        //发送ajax获取文章列表数据
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //获取成功，渲染数据
                var htmlStr = template('tpl-table', res);
                //console.log(htmlStr);
                $('tbody').html(htmlStr);
                //调用分页
                renderPage(res.total);
            }
        })
    }

    //3.初始化分类
    var form = layui.form;  //导入form
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

    //4.筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        //获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();

        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })

    //5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行应该laypage实例
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,

            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //页面切换触发方法
            jump: function (obj, first) {
                if (!first) {
                    //alert(obj.curr);
                    q.pagenum = obj.curr;
                    //重新渲染画面
                    initTable();
                }
            }
        });
    }

    //6.删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        //!!!4.1先获取Id,进入到函数中this代指就改变了
        var Id = $(this).attr('data-id');
        //4.1 显示对话框
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + Id,

                success: (res) => {
                    //console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('恭喜您，文章删除成功！');
                    //页面汇总删除按钮个数等于1，页码大于1；
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})