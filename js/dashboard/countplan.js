$(document).ready(function () {
    //新增及修改调整
    var editor = new $.fn.dataTable.Editor({

        idSrc: 'InventSchedule_Id',
        table: '#CountPlanTable',
        fields: [
            //调整-参数设置
            { label: 'Store_Code_Id: ', name: 'Store_Code_Id', type: 'hidden' },
            { label: '计划单号: ', name: 'InventSchedule_Id', type: 'readonly' },
            {
                label: '计划日期: ', name: 'InventSchedule_Date',
                type: 'datetime',
                data: function (row) {
                    if (row.InventSchedule_Date.length !== undefined) {
                        return row.InventSchedule_Date.substring(0,10)
                    } else {
                        return new Date();
                    }
                },
                def:function(){
                    return new Date();
                },
                format: 'YYYY-MM-DD',
            },
            { label: '盘点单号: ', name: 'Session_Id', type: 'readonly' },
            {
                label: '类型: ', name: 'InventSchedule_Type',type:'select',
                data: function (row) {
                    switch (row.InventSchedule_Type) {
                        case "P": {
                            return row.InventSchedule_Type = '部分盘点';
                            break;
                        }
                        case "T": {
                            return row.InventSchedule_Type = '全部盘点';
                            break;
                        }
                        default: {
                            return row.InventSchedule_Type;
                            break;
                        }
                    }

                },
                def: function () {
                    var a = [];
                    a.push({ label: '部分盘点', value: 'P' });
                    a.push({ label: '全部盘点', value: 'T' });
                    return editor.field('InventSchedule_Type').update(a);
                }
            },
            { label: '门店: ', name: 'Store_Code', type: 'select' },
            {
                label: '状态: ', name: 'InventScheduleStatus_Code', type: 'readonly',
                data: function (row) {
                    switch (row.InventScheduleStatus_Code) {
                        case "N": {
                            return row.InventScheduleStatus_Code = '保存';
                            break;
                        }
                        case "S": {
                            return row.InventScheduleStatus_Code = '计划';
                            break;
                        }
                        case "F": {
                            return row.InventScheduleStatus_Code = '冻结';
                            break;
                        }
                        case "C": {
                            return row.InventScheduleStatus_Code = '取消';
                            break;
                        }
                        case "D": {
                            return row.InventScheduleStatus_Code = '完成';
                            break;
                        }
                        case "E": {
                            return row.InventScheduleStatus_Code = '错误';
                            break;
                        }
                        case "T": {
                            return row.InventScheduleStatus_Code = '待确认';
                            break;
                        }
                        default: {
                            return row.InventScheduleStatus_Code;
                            break;
                        }
                    }

                }
            },


            //产品查询条件
            { label: '产品代码: ', name: 'ProductCode' },
            { label: '产品名称: ', name: 'ProductName' },
            { label: '颜色组: ', name: 'ColorChart', type: 'select', placeholder: '未定义' },
            { label: '尺码组: ', name: 'SizeChart', type: 'select', placeholder: '未定义' },
            { label: '供应商: ', name: 'Supplier', type: 'select', placeholder: '未定义' },
            { label: '产品类别: ', name: 'ProductType', type: 'select', placeholder: '未定义' },
            { label: '季节: ', name: 'Season', type: 'select', placeholder: '未定义' },
            { label: '产品层级(一): ', name: 'Division', placeholder: '未定义' },
            { label: '产品层级(二): ', name: 'Department', placeholder: '未定义' },
            { label: '产品层级(三): ', name: 'SubDepartment', placeholder: '未定义' },
            { label: '产品层级(四): ', name: 'Class', placeholder: '未定义' },
            { label: '零售价: ', name: 'RetailPrice' },
            { label: '成本价: ', name: 'CostPrice' },

        ],




        //自定义语言
        i18n: {

            "create": {
                "button": '新增',
                "title": '新增调整管理',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '库存调整管理',
                "submit": '提交'
            },
            "multi": {
                "title": "批量修改",
                "info": "批量修改帮助您将所选单元格中的值修改为同一值，要继续修改请单击按钮",
                "restore": "取消修改"
            },
            "datetime": {
                "previous": '前',
                "next": '后',
                "months": ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                "weekdays": ['日', '一', '二', '三', '四', '五', '六', ]
            }
        }
    });
    //主表
    var table;
    //产品明细调整编辑器
    var pceditor;
    //产品表
    var ptable;
    //产品调整明细表
    var pctable;

    var pcval = [];

    //初始化编辑器
    editor.on('open displayOrder', function (e, mode, action) {
        if (mode === 'main' && action !== 'remove') {
            //增加HTML
            addhtml();
            //增加tab1按键
            tab1btn(e, mode, action);
            //定义Tabs规则
            addtab(e, mode, action);

            //初始化报表-产品列表
            ptable = $("#ProductTable").DataTable({
                processing: true,
                //dom: 'Bfrtip',
                lengthChange: false,
                select: true,
                order: [[0, "asc"]],
                columns: [
                { "data": "ProductCode" },
                { "data": "ProductName" },
                { "data": "Color" },
                { "data": "Size" },
                { "data": "Supplier" },
                { "data": "RetailPrice" },
                ],
                language: {
                    url: "../vendor/datatables/Chinese.json",
                    select: {
                        rows: {
                            _: "已选中 %d 行",
                            0: ""
                        }
                    }
                },

            });

            //产品明细-调整
            pceditor = new $.fn.dataTable.Editor({
                idSrc: 'Line_Id',
                table: '#ProductDetailTable',
                fields: [
                    { label: 'reason_id: ', name: 'reason_id', type: 'hidden' },
                    { label: 'Session_Id: ', name: 'Session_Id', type: 'hidden' },
                    { label: 'product_id: ', name: 'product_id', type: 'hidden' },
                    { label: 'color_id: ', name: 'color_id', type: 'hidden' },
                    { label: 'size_id: ', name: 'size_id', type: 'hidden' },
                    { label: 'bin_id: ', name: 'bin_id', type: 'hidden' },
                    { label: 'bh_uniqueid: ', name: 'bh_uniqueid', type: 'hidden' },
                    { label: 'color_uniqueid: ', name: 'color_uniqueid', type: 'hidden' },
                    { label: 'size_uniqueid: ', name: 'size_uniqueid', type: 'hidden' },
                    { label: 'product_uniqueid: ', name: 'product_uniqueid', type: 'hidden' },
                    { label: 'adjhead_uniqueid: ', name: 'adjhead_uniqueid', type: 'hidden' },
                    { label: 'store_uniqueid: ', name: 'store_uniqueid', type: 'hidden' },
                    { label: 'PurchasePrice: ', name: 'PurchasePrice', type: 'hidden' },
                    { label: 'RetailPrice: ', name: 'RetailPrice', type: 'hidden' },
                    { label: '序号: ', name: 'Line_Id' },
                    { label: '序号: ', name: 'ProductCode' },
                    { label: '序号: ', name: 'ProductName' },
                    { label: '序号: ', name: 'Supplier' },
                    { label: '序号: ', name: 'Color' },
                    { label: '序号: ', name: 'Size' },
                    { label: '序号: ', name: 'BinCode' },
                    { label: '序号: ', name: 'StockQty' },
                    { label: '序号: ', name: 'AdjQty' },
                    { label: '序号: ', name: 'NewQty' },


                ],

                ajax: function (method, url, data, success, error) {
                    // NOTE - THIS WILL WORK FOR EDIT ONLY AS IS

                    if (data.action === 'edit') {
                        success({
                            data: $.map(data.data, function (val, key) {
                                return getpcval(val, key);

                            })
                        });
                    }
                }

            });

            //初始化报表-产品调整明细
            pctable = $("#ProductDetailTable").DataTable({
                processing: true,
                //dom: 'Bfrtip',
                lengthChange: false,
                select: false,
                order: [[0, "asc"]],
                columns: [
                { "data": "Line_Id"},
                { "data": "ProductCode"},
                { "data": "ProductName" },
                { "data": "Supplier" },
                { "data": "Color"},
                { "data": "Size" },
                { "data": "BinCode" },
                { "data": "StockQty" },
                { "data": "AdjQty", "defaultContent": "编辑数量", "className": 'editable'},
                { "data": "NewQty" },

                ],

                language: {
                    url: "../vendor/datatables/Chinese.json",
                    select: {
                        rows: {
                            _: "已选中 %d 行",
                            0: ""
                        }
                    }
                },


            });

            $('#ProductDetailTable').on('click', 'tbody td.editable', function (e) {
                pceditor.inline(this, {
                    onBlur: 'submit',
                    //onComplete:'none',
                    submit: 'all',
                    //onReturn: 'none',
                    onBackground: close
                });
            });


        }


    });


    //新增数据
    editor.on('initCreate', function (e) {
        
        getproductlist(e);
        if (editor.field('InventSchedule_Type').val() === "部分盘点")
            alert('sss');

    });
    //修改数据
    editor.on('initEdit', function (e, node, data) {


        //搜索条件下拉框
        getproductlist(e, data);

        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
//        param.adjuniqueid = editor.field("UniqueId").val();
        /*$.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetADJDetail",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                data = data.ResultSets[0]
                for (var i = 0; i < data.length; i++) {
                    data[i].Line_Id = i+1;
                    data[i].NewQty = data[i].AdjQty + data[i].StockQty;
                    data[i].bh_uniqueid = data[i].BinHeader
                    data[i].color_uniqueid = data[i].ColorData;
                    data[i].PurchasePrice = data[i].landed_price;
                    data[i].RetailPrice = data[i].price_retail;
                    data[i].product_uniqueid = data[i].Product;
                    data[i].size_uniqueid = data[i].SizeData;
                }
                pctable.clear().draw();//重置产品明细列表
                data.forEach(function (node) {
                    pctable.row.add(node);
                    if (editor.field("approved").val() === "未确认") {
                        getpcval(node);
                    }
                })
                pctable.draw();

                if (editor.field("approved").val() === "未确认") {
                    editor.enable();
                    $("a#li-tab3,a#li-tab2").css("display", "block");
                } else {
                    editor.disable();
                    $("a#li-tab3,a#li-tab2").css("display", "none")
                    $('#ProductDetailTable').off('click', 'tbody td.editable');
                }

            }


        }); */

    });
    editor.dependent('Store_Code', function (val, data, callback) {
        editor.field("Store_Code_Id").val(Number(val));

    }, { event: 'change' });
    //初始化产品报表
    table = $("#CountPlanTable").DataTable({
        processing: false,
        //dom: 'Bfrtip',
        lengthChange: false,
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "Id"},
        { "data": "InventSchedule_Id" },
        {
            "data": "InventSchedule_Date", "render": function (data, type, row) {
                if (data.length > 0) {
                    return data.substring(0, 10);
                }
            }
        },
        { "data": "Session_Id" },
        { "data": "Store_Code" },
        {
            "data": "InventSchedule_Type", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case "P":{
                            return data = '部分盘点';
                            break;
                        }
                        case "T":{
                            return data = '全部盘点';
                            break;
                        }
                        default: {
                            return data = '其他';
                            break;
                        }
                    }

                }
            }
        },
        {
            "data": "InventScheduleStatus_Code", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case "N": {
                            return data = '保存';
                            break;
                        }
                        case "S": {
                            return data = '计划';
                            break;
                        }
                        case "F": {
                            return data = '冻结';
                            break;
                        }
                        case "C": {
                            return data = '取消';
                            break;
                        }
                        case "D": {
                            return data = '完成';
                            break;
                        }
                        case "E": {
                            return data = '错误';
                            break;
                        }
                        case "T": {
                            return data = '待确认';
                            break;
                        }
                        default: {
                            return data;
                            break;
                        }
                    }
                }
            }
        },
        { "data": "Qty_Scan" },
        ],

        rowId:'Id',
        language: {
            url: "../vendor/datatables/Chinese.json",
            select: {
                rows: {
                    _: "已选中 %d 行",
                    0: ""
                }
            }
        },
        //添加按键 编辑，打印及导出

        initComplete: function () {
            table.buttons().container({ className: 'default1' }).appendTo('#CountPlanTable_wrapper .col-sm-6:eq(0)');
            initialtable();
        },
        buttons: [
    { extend: 'create', editor: editor, text: '新建', calssName:'default1' },
    { extend: 'edit', editor: editor, text: '修改', calssName:'default1'},
    { extend: 'print', text: '打印', calssName: 'default1' },
    {
        extend: 'collection',
        text: '导出到..',
        calssName:'default2',
        buttons: [
            'excel',
            'csv'
        ]
    },



        ],
    });

    //定义 初始化主表数据
    function initialtable(store) {
        var param = {
            "token": SecurityManager.generate(),
            "username": SecurityManager.username,
            //"pStoreList": store,
        }
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetScheduleForStore",
            "async": true,
            "crossDomain": true,
            "type": "POST",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                data = data.ResultSets[0]
                for (var i = 0; i < data.length; i++) {
                    data[i].Id = i + 1;
                    data[i].Qty_Scan = data[i].qty_scan;
                    data[i].Store_Code = data[i].store_code;
                }
                table.clear().draw();
                data.forEach(function (node) {
                    table.row.add(node);
                })
                table.draw();
                //return data;
            }
        });

    }
    //定义 Tab1 按键
    function tab1btn(e, mode, action) {
        editor.buttons([
       {
           label: '保存', className: 'btn btn-primary', fn: function () {
               if (editor.field("InventScheduleStatus_Code").val() === ("计划" || "冻结" || "取消" || "完成")) {
                   this.blur();
               } else {
                   var param = {};
                   param.token = SecurityManager.generate();
                   param.username = SecurityManager.username;
                   param.inventschedule_id = editor.field('InventSchedule_Id').val() ? Number(editor.field('InventSchedule_Id').val()) : null,
                   param.store_code_id = editor.field('Store_Code_Id').val(),
                   param.count_number = 1,
                   param.inventschedule_date = editor.field('InventSchedule_Date').val(),
                   param.inventschedulestatus_id = 1,
                   param.inventschedule_type = editor.field('InventSchedule_Type').val()
                   $.ajax({
                       "url": sysSettings.domainPath + "RaymSp_Gatewaypayment_InventSchedule",
                       "async": true,
                       "crossDomain": true,
                       "type": "POST",
                       "dataType": "json",
                       "contentType": "application/json; charset=utf-8",
                       "data": JSON.stringify(param),
                       "success": function (data) {
                           if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                               if (editor.field('InventSchedule_Id').val() === null) {
                                   data.ResultSets[0][0].Id = table.rows()[0].length + 1;
                                   data.ResultSets[0][0].Qty_Scan = data.ResultSets[0][0].qty_scan;
                                   data.ResultSets[0][0].Store_Code = data.ResultSets[0][0].store_code;
                                   table.row.add(data.ResultSets[0][0]).draw();
                                   editor.field('InventSchedule_Id').val(data.ResultSets[0][0]["InventSchedule_Id"]);

                               }

                               if (data.ResultSets[0][0]["Session_Id"] !== null) {
                                   editor.field('Session_Id').val(data.ResultSets[0][0]["Session_Id"])
                               }
                               editor.message('保存成功').true;
                               return false;

                           }
                           }
                   })

               }

           }
       },
      { label: '取消', fn: function () { this.blur(); } }
        ])
    };
    //定义HTML Tab
    function addhtml() {
        /** 创建 产品Tabs (搜索条件，列表及产品调整明细) **/

        var html = '<div class="tabs-container">' +
                    '<ul class="nav nav-tabs">' +
                        '<li class="active"><a data-toggle="tab" id="li-tab1" href="#tab-1">参数设置</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab2" href="#tab-2">产品搜索条件</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab3" href="#tab-3">产品列表</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab4" href="#tab-4">产品明细管理</a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                        '<div id="tab-1" class="tab-pane active">' +
                            '<div class="panel-body tab-1">' +
                            '</div>' +
                        '</div>' +
                        '<div id="tab-2" class="tab-pane">' +
                            '<div class="panel-body tab-2">' +
                            '</div>' +
                       '</div>' +
                        '<div id="tab-3" class="tab-pane">' +
                            '<div class="panel-body tab-3">' +
                            '<table style="width:100%" class="table table-striped table-bordered table-hover" id="ProductTable">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>产品代码</th>' +
                            '<th>产品名称</th>' +
                            '<th>颜色</th>' +
                            '<th>尺码</th>' +
                            '<th>供应商</th>' +
                            '<th>价格</th>' +
                            '</tr>' +
                            '</thead>' +
                            '</table>' +
                            '</div>' +
                        '</div>' +
                        '<div id="tab-4" class="tab-pane">' +
                            '<div class="panel-body tab-4">' +
                            '<table style="width:100%" class="table table-striped table-bordered table-hover" id="ProductDetailTable">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>序号</th>' +
                            '<th>产品代码</th>' +
                            '<th>产品名称</th>' +
                            '<th>供应商</th>' +
                            '<th>颜色</th>' +
                            '<th>尺码</th>' +
                            '<th>货区</th>' +
                            '<th>库存数量</th>' +
                            '<th>调整数量</th>' +
                            '<th>新数量</th>' +
                            '</tr>' +
                            '</thead>' +
                            '</table>' +
                            '</div>' +
                        '</div>' +
                      '</div>' +
                     '</div>';


        //add html to dom
        $('div.DTE_Form_Content').append(html);
        $('div.modal-dialog').addClass('product-column');
        //$('div.panel-body.tab-1, div.panel-body.tab-2').addClass('product-column-body');
        $('div.DTE_Field').addClass('product-column-feild');
        $('div.DTE_Body.modal-body').css("padding", "0px");
        $("a#li-tab3,a#li-tab2").css("display", "block");
        //add editer message form(layout) to header
        $('.DTE_Form_Info').css({"float":"right","margin":"10px"});

        ////move the editor elements to respective tab
        $(editor.node(['InventSchedule_Id', 'InventSchedule_Date', 'Session_Id', 'Store_Code', 'InventScheduleStatus_Code', 'InventSchedule_Type'])).appendTo('.tab-1');
        $(editor.node(['ProductCode', 'ProductName', 'ColorChart', 'SizeChart', 'Supplier', 'ProductType', 'Season', 'Division', 'Department', 'SubDepartment', 'Class', 'RetailPrice', 'CostPrice'])).appendTo('.tab-2');

    };
    //定义Tabs规则
    function addtab(e, mode, action) {
        $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
            if ($(e.target).length > 0) {
                var activeTab = $(e.target)[0].id;
                switch (activeTab) {
                    //参数设置 Tab1
                    case 'li-tab1': {
                        tab1btn()
                        editor.message('');
                        break;
                    }
                        //产品查询条件 Tab2
                    case 'li-tab2': {
                        if (editor.field('Session_Id').val().length > 0 && editor.field('InventScheduleStatus_Code').val() === "保存") {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '确定', className: 'prodbtn', fn: function () {
                                        //提交条件
                                        var pnode = ['ProductCode', 'ProductName', 'ColorChart', 'SizeChart', 'Supplier', 'ProductType', 'Season', 'Division', 'Department', 'SubDepartment', 'Class', 'RetailPrice', 'CostPrice'];
                                        var vnode = [], condition = '', pcondition = '';
                                        pnode.forEach(function (node) {

                                            if (editor.field(node).val() && editor.field(node).val().length > 0) {
                                                vnode.push(node);
                                            }
                                        });

                                        vnode.forEach(function (node) {

                                            if (vnode.length - 1 > 0) {
                                                var i = vnode.length - 1;
                                                if (vnode[i] === node) {
                                                    condition = condition + node + '=' + "'" + editor.field(node).val() + "'"
                                                } else {
                                                    condition = condition + node + '=' + "'" + editor.field(node).val() + "'" + ' and '
                                                }

                                            } else {
                                                condition = condition + node + '=' + "'" + editor.field(node).val() + "'"
                                            }

                                        });
                                        //测试用
                                        //console.log(condition);
                                        var param = {};
                                        param.token = SecurityManager.generate();
                                        param.username = SecurityManager.username;
                                        param.tbName = 'V_Gatewaypayment_SearchProduct';
                                        param.colName = '*';
                                        param.whName = condition;
                                        $.ajax({
                                            "url": sysSettings.domainPath + "Raymsp_GatewaypaymentGetData",
                                            "type": "POST",
                                            "async": true,
                                            "crossDomain": true,
                                            "dataType": "json",
                                            "contentType": "application/json; charset=utf-8",
                                            "data": JSON.stringify(param),
                                            "success": function (data) {
                                                data = data.ResultSets[0]

                                                ptable.clear();//重置产品列表
                                                pctable.clear().draw();//重置产品明细列表
                                                data.forEach(function (node) {
                                                    ptable.row.add(node);
                                                })
                                                ptable.draw()
                                                $('a[href="#tab-3"]').tab('show');

                                            }


                                        });
                                    }
                                },
                                {   //重置产品查询条件
                                    extend: 'tabbtn', label: '重置', className: 'prodbtn', fn: function () {
                                        var pnode = ['ProductCode', 'ProductName', 'ColorChart', 'SizeChart', 'Supplier', 'ProductType', 'Season', 'Division', 'Department', 'SubDepartment', 'Class', 'RetailPrice', 'CostPrice'];
                                        pnode.forEach(function (node) {
                                            if (editor.field(node).val() && editor.field(node).val().length > 0) {
                                                editor.field(node).set(null);
                                            }
                                        })

                                    }
                                },
                        ]
                        )
                        }
                        editor.message('');
                        break;
                    }
                        //产品列表 Tab3
                    case 'li-tab3': {
                        if (editor.field("Session_Id").val().length > 0 && editor.field('approved').val() === "未确认") {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '确定', className: 'prodbtn', fn: function () {
                                        if (ptable.rows('.selected', { select: true }).data().length > 0) {
                                            var plist = ptable.rows('.selected', { select: true }).data();
                                            pctable.clear();
                                            pcval = [];
                                            for (var i = 0; i < plist.length; i++) {
                                                plist[i].Line_Id = i + 1;
                                                plist[i].ProductCode = plist[i].PurchasePrice;
                                                plist[i].StockQty = plist[i].Bin_Qty_Stocks;
                                                plist[i].AdjQty = 0;
                                                plist[i].NewQty = '';
                                                plist[i].reason_id = editor.field("reason_id").val();
                                                plist[i].Session_Id = editor.field("Session_Id").val();
                                                plist[i].product_id = plist[i].Product_ID;
                                                plist[i].color_id = plist[i].Color_ID;
                                                plist[i].size_id = plist[i].Size_ID;
                                                plist[i].color_uniqueid = plist[i].Color_UniqueId;
                                                plist[i].size_uniqueid = plist[i].Size_UniqueId;
                                                plist[i].product_uniqueid = plist[i].Product_UniqueId;
                                                plist[i].adjhead_uniqueid = editor.field("UniqueId").val();
                                                var param = {};
                                                param.token = SecurityManager.generate();
                                                param.username = SecurityManager.username;
                                                param.store_code_id = editor.field("store_code_id").val();
                                                param.product_id = plist[i].Product_ID;
                                                param.color_id = plist[i].Color_ID;
                                                param.size_id = plist[i].Size_ID;
                                                $.ajax({
                                                    "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetBinIdForTransferSend",
                                                    "type": "POST",
                                                    "async": false,
                                                    "crossDomain": true,
                                                    "dataType": "json",
                                                    "contentType": "application/json; charset=utf-8",
                                                    "data": JSON.stringify(param),
                                                    "success": function (data) {
                                                        data = data.ResultSets[0][0]
                                                        plist[i].bin_id = data.bin_id
                                                        plist[i].BinCode = data.bin_code
                                                        plist[i].bh_uniqueid = data.UniqueId
                                                    }
                                                })

                                                pctable.row.add(plist[i])
                                                getpcval(plist[i])
                                                //console.log(index);


                                            }
                                            pctable.draw();
                                            $('a[href="#tab-4"]').tab('show');

                                        }

                                    }
                                },
                                {   //重置产品查询条件
                                    extend: 'tabbtn', label: '重置', className: 'prodbtn', fn: function () {
                                        var pnode = ['ProductCode', 'ProductName', 'ColorChart', 'SizeChart', 'Supplier', 'ProductType', 'Season', 'Division', 'Department', 'SubDepartment', 'Class', 'RetailPrice', 'CostPrice'];
                                        pnode.forEach(function (node) {
                                            if (editor.field(node).val() && editor.field(node).val().length > 0) {
                                                editor.field(node).set(null);
                                            }
                                        })
                                        $('a[href="#tab-2"]').tab('show');

                                    }
                                },
                            ]
                        )
                        }
                        editor.message('');
                        break;
                    }
                        //产品明细调整 Tab 4
                    case 'li-tab4': {
                        //$('.DTE_Form_Info').appendTo('#ProductDetailTable_wrapper .col-sm-6:eq(0)');
                        if (editor.field("Session_Id").val().length > 0 && editor.field('approved').val() === "未确认") {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '保存', className: 'pcbtn', fn: function () {
                                        if (editor.field('Session_Id').val().length > 0 && editor.field('approved').val() !== "未确认") {
                                           return this.blur();
                                        }
                                        else if (pcval.length>0) {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.Session_Id = Number(editor.field("Session_Id").val());
                                            param.store_code_id = editor.field("store_code_id").val();
                                            param.PCD = pcval;
                                            $.ajax({
                                                "url": sysSettings.domainPath + "RaymSp_Gatewaypayment_ADJ_Detail",
                                                "type": "POST",
                                                "async": true,
                                                "crossDomain": true,
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        data = data.ResultSets[0];

                                                        pctable.clear();//重置产品明细列表
                                                        data.forEach(function (node) {
                                                            node.NewQty = node.AdjQty + node.StockQty;
                                                            pctable.row.add(node);
                                                        })
                                                        pctable.draw();
                                                        editor.message('保存成功').true;

                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            editor.message('没有需要保存的数据').true;

                                        }

                                    }
                                },
                                {
                                    extend: 'tabbtn', label: '批准', className: 'pcbtn', fn: function () {

                                        if (editor.field('Session_Id').val().length > 0 && editor.field('approved').val() !== "未确认") {
                                                this.blur();
                                            } else {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.Session_Id = editor.field('Session_Id').val(),
                                            param.store_code_id = editor.field('store_code_id').val(),
                                            param.season_id = -9,
                                            param.reason_id = editor.field('reason_id').val(),
                                            param.approved = 1,
                                            param.creation_date = editor.field('creation_date').val(),
                                            param.modified_date = editor.field('modified_date').val()
                                            param.ref_Session_Id = editor.field('ref_Session_Id').val(),
                                            $.ajax({
                                                "url": sysSettings.domainPath + "RaymSp_Gatewaypayment_ADJ_header",
                                                "async": true,
                                                "crossDomain": true,
                                                "type": "POST",
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        table.ajax.reload().draw();
                                                        if (data.ResultSets[0][0].approved === "Y") {
                                                            editor.field('approved').val('已确认');
                                                            editor.disable();
                                                            $("a#li-tab3,a#li-tab2").css("display", "none");
                                                            $('#ProductDetailTable').off('click', 'tbody td.editable');
                                                            $('a[href="#tab-1"]').tab('show');
                                                            editor.message('审批成功').true;
                                                            return false;

                                                        }
                                                    }
                                                }
                                            })

                                               

                                                

                                            }

                                    }
                                },
                            ])
                        }
                        editor.message('');
                        break;
                    }
                }
            }
        })
    };

    //获得产品清单
    function getproductlist(e,data) {
        var exdata = [];
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];
        var selectStore = [], selectType = [], selectReason = []
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        // Get existing options
        if (e.type === 'initEdit') {
            exdata = data
            if (exdata.InventScheduleStatus_Code !== '保存') {
                editor.disable();
            }
        } else if (e.type === 'initCreate') {
            editor.field("InventScheduleStatus_Code").val('新建')
            editor.enable();
        }
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentProduct_Get",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                data = data.ResultSets[0]
                for (var item in data) {
                    switch (data[item].table) {
                        case 'Supplier': {
                            selectSupplier.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'ColorChart': {
                            selectColorChart.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'SizeChart': {
                            selectSizeChart.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'ProductType': {
                            selectProductType.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'Season': {
                            selectSeason.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'Store': {
                            if (typeof (exdata.Store_Code_Id) !== 'undefined'/** 判断是新建还是编辑 **/) {
                                selectStore.unshift({ label: data[item].label, value: data[item].ext1 });

                            } else {
                                selectStore.push({ label: data[item].label, value: data[item].ext1 });
                            }
                            break;
                        }
                    }
                };
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("ProductType").update(selectProductType)
                editor.field("Season").update(selectSeason)
                if (typeof (exdata.InventSchedule_Type) !== 'undefined') {
                    if (exdata.InventSchedule_Type === '部分盘点') {
                        selectType.push({ label: '部分盘点', value: 'P' });
                        selectType.push({ label: '全部盘点', value: 'T' });
                    } else if (exdata.InventSchedule_Type === '全部盘点') {
                        selectType.push({ label: '全部盘点', value: 'T' });
                        selectType.push({ label: '部分盘点', value: 'P' });
                    }
                    editor.field('InventSchedule_Type').update(selectType);
                }

                //门店列表
                editor.field("Store_Code").update(selectStore)
                editor.field("Store_Code_Id").val(Number(editor.field("Store_Code").val()))
                
            }
        });

    }
    //获得PCD产品列表
    function getpcval(val, key) {
        if (typeof (key) !== 'undefined') {
            val.DT_RowId = key;
            val.NewQty = Number(val.AdjQty) + Number(val.StockQty);
        }
        var nval = {};
        nval.Session_Id = val.Session_Id;
        nval.line_id = Number(val.Line_Id);
        nval.product_id = val.product_id;
        nval.color_id = Number(val.color_id);
        nval.size_id = val.size_id;
        nval.loose_qty_onhand = Number(val.StockQty);
        nval.loose_qty_adj = Number(val.AdjQty);
        nval.landed_price = Number(val.PurchasePrice);
        nval.price_retail = Number(val.RetailPrice);
        nval.bin_id = val.bin_id;
        nval.binheader = val.bh_uniqueid;
        nval.product = val.product_uniqueid;
        nval.color = val.color_uniqueid;
        nval.size = val.size_uniqueid;

        if (pcval.length > 0) {
            for (x in pcval) {

                if (pcval[x].Session_Id !== nval.Session_Id) {
                    pcval = [];
                    pcval.push(nval);
                    break;
                }
                else if (pcval[x].product_id === nval.product_id && pcval[x].color_id === nval.color_id && pcval[x].size_id === nval.size_id) {
                    if (nval.qty !== 0) {
                        pcval.splice(x, 1, nval);
                    } else {
                        pcval.splice(x, 1);
                    }

                } else if (pcval.length - 1 > 0) {
                    continue;
                } else {
                    if (nval.Qty !== 0) {
                        pcval.push(nval);
                    }
                }
            }
        }
        else {
            if (nval.qty !== 0) {
                pcval.push(nval);
            }
        }
        console.log(pcval)
        pctable.draw();
        return val;
    }
});




