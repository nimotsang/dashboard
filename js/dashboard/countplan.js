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

    var selectdata;
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
                select: true,
                order: [[0, "asc"]],
                columns: [
                { "data": "Line_Id"},
                { "data": "ProductCode"},
                { "data": "ProductName" },
                { "data": "Supplier" },
                { "data": "Color"},
                { "data": "Size" },
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
        $(":button.btn.btn-default.Freezer").hide()
        //$(":button.btn.btn-default.Freezer").attr("disabled", true)

    });
    //修改数据
    editor.on('initEdit', function (e, node, data) {
        //搜索条件下拉框
        getproductlist(e, data);

        var param = {},condition = '';
        condition = 'v.Product_ID=x.Product_Id and v.Color_ID =x.Color_Id and v.Size_ID=x.Size_Id and x.InventSchedule_Id= ' + editor.field('InventSchedule_Id').val()
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        param.tbName = 'V_GatewayPayment_SearchProduct v inner join XGPC_InventSchedule_Detail x on v.Product_ID=x.Product_Id';
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
                
                for (var i = 0; i < data.length; i++) {
                    data[i].Line_Id = i + 1;
                    data[i].inventschedule_id = data[i].InventSchedule_Id;
                    data[i].product_id = data[i].Product_ID;
                    data[i].color_id = Number(data[i].Color_ID);
                    data[i].size_id = data[i].Size_ID;

                }
                //pctable.clear().draw();//重置产品明细列表
                //getpcval(data);
                pctable.rows.add(data).draw();
                getpcval(pctable.rows().data());

                if (table.row('.selected').data().InventSchedule_Type === "部分盘点") {
                    if (table.row('.selected').data().InventScheduleStatus_Code === "保存") {
                        editor.enable();
                        $(":button.btn.btn-default.Freezer").show()
                        $(":button.btn.btn-default.Freezer").attr("disabled", false)
                        $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "block");
                    } else if (table.row('.selected').data().InventScheduleStatus_Code === "冻结") {
                        editor.disable();
                        $(":button.btn.btn-default.Freezer").show()
                        $(":button.btn.btn-default.Freezer").attr("disabled", false)
                        $("a#li-tab3,a#li-tab2").css("display", "none")
                    } else if (table.row('.selected').data().InventScheduleStatus_Code === "取消") {
                        editor.disable();
                        $(":button.btn.btn-default.Freezer").hide()
                        $(":button.btn.btn-default.Freezer").attr("disabled", true)
                        $("a#li-tab3,a#li-tab2").css("display", "none")
                    } else {
                        editor.disable();
                        $(":button.btn.btn-default.Freezer").hide()
                        $("a#li-tab3,a#li-tab2").css("display", "none")
                    }
                    //editor.enable();
                    //$("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "block");
                } else if (table.row('.selected').data().InventSchedule_Type === "全部盘点") {
                    if (table.row('.selected').data().InventScheduleStatus_Code === "保存") {
                        editor.enable();
                        $(":button.btn.btn-default.Freezer").show()
                        $(":button.btn.btn-default.Freezer").attr("disabled", false)
                        $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "none");
                    } else if (table.row('.selected').data().InventScheduleStatus_Code === "冻结") {
                        editor.disable();
                        $(":button.btn.btn-default.Freezer").show()
                        $(":button.btn.btn-default.Freezer").attr("disabled", false)
                        $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "none");
                    } else if (table.row('.selected').data().InventScheduleStatus_Code === "取消") {
                        editor.disable();
                        $(":button.btn.btn-default.Freezer").hide()
                        $(":button.btn.btn-default.Freezer").attr("disabled", true)
                        $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "none");
                    } else {
                        $(":button.btn.btn-default.Freezer").hide()
                        $(":button.btn.btn-default.Freezer").attr("disabled", true)
                        editor.disable();
                        $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "none");
                    }


                }
            }


        });

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

    //获取编辑的行号
    table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            selectdata = table.rows(indexes).data();
            selectdata.index = indexes;
            selectdata.page = selectdata.page();
        }

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
           label: function () {
               if (editor.field("InventScheduleStatus_Code").val() === "保存") {
                   //this.remove();
                   return '冻结库存 '
               } else if (editor.field("InventScheduleStatus_Code").val() === "冻结") {
                   return '取消冻结 '
               }
           }, fn: function () {
               var vstatus = ["计划", "保存", "取消", "完成"]
               if (editor.field("InventScheduleStatus_Code").val() === "保存") {
                   var param = {};
                   param.token = SecurityManager.generate();
                   param.username = SecurityManager.username;
                   param.inventschedule_id = editor.field('InventSchedule_Id').val(),
                   param.store_code_id = editor.field('Store_Code_Id').val(),
                   param.count_number = 1,
                   param.inventschedule_date = editor.field('InventSchedule_Date').val(),
                   param.inventschedulestatus_id = 3,
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
                           if (Number(editor.field('InventSchedule_Id').val()) === data.ResultSets[0][0].InventSchedule_Id) {
                               data.ResultSets[0][0].Id = selectdata[0].Id;
                               data.ResultSets[0][0].Qty_Scan = data.ResultSets[0][0].qty_scan;
                               data.ResultSets[0][0].Store_Code = data.ResultSets[0][0].store_code;
                               table.row(selectdata.index).data(data.ResultSets[0][0]);
                               table.page(selectdata.page).draw('page');
                               editor.field('Session_Id').val(data.ResultSets[0][0].Session_Id);
                               editor.field('InventScheduleStatus_Code').val('冻结');
                               editor.message('库存冻结成功').true;
                           }
                       }
                   })
               } else if (editor.field("InventScheduleStatus_Code").val() === "冻结") {
                   var param = {};
                   param.token = SecurityManager.generate();
                   param.username = SecurityManager.username;
                   param.inventschedule_id = editor.field('InventSchedule_Id').val(),
                   param.store_code_id = editor.field('Store_Code_Id').val(),
                   param.count_number = 1,
                   param.inventschedule_date = editor.field('InventSchedule_Date').val(),
                   param.inventschedulestatus_id = 4,
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
                               if (Number(editor.field('InventSchedule_Id').val()) === data.ResultSets[0][0].InventSchedule_Id) {
                                   data.ResultSets[0][0].Id = selectdata[0].Id;
                                   data.ResultSets[0][0].Qty_Scan = data.ResultSets[0][0].qty_scan;
                                   data.ResultSets[0][0].Store_Code = data.ResultSets[0][0].store_code;
                                   table.row(selectdata.index).data(data.ResultSets[0][0]);
                                   table.page(selectdata.page).draw('page');
                                   editor.field('InventScheduleStatus_Code').val('取消');
                                   editor.message('冻结已取消').true;
                           }
                       }
                   })

               }
           }, className: "Freezer"
       },
       {
           label: '保存', className: 'btn btn-primary', fn: function () {
               var vstatus=["计划", "冻结", "取消", "完成"]
               if (vstatus.indexOf(editor.field("InventScheduleStatus_Code").val())!==-1) {
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
                           if (editor.field('InventSchedule_Id').val() === '') {
                                   data.ResultSets[0][0].Id = table.rows()[0].length + 1;
                                   data.ResultSets[0][0].Qty_Scan = data.ResultSets[0][0].qty_scan;
                                   data.ResultSets[0][0].Store_Code = data.ResultSets[0][0].store_code;
                                   table.row.add(data.ResultSets[0][0]).draw();
                                   table.rows().deselect().page('last').draw('page');
                                   table.page('last').draw('page');
                                   table.row(':eq(-1)', { page: 'current' }).select();
                                   editor.field('InventSchedule_Id').val(data.ResultSets[0][0]["InventSchedule_Id"]);
                                   editor.field('InventScheduleStatus_Code').val('保存');

                               if (data.ResultSets[0][0]["Session_Id"] !== null) {
                                   editor.field('Session_Id').val(data.ResultSets[0][0]["Session_Id"]);
                               }
                               if (data.ResultSets[0][0]["InventSchedule_Type"] === "T") {
                                   $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "none");
                               }
                               editor.message('保存成功').true;
                               return false;

                           } else {
                               if (Number(editor.field('InventSchedule_Id').val()) === data.ResultSets[0][0].InventSchedule_Id) {
                                   data.ResultSets[0][0].Id = selectdata[0].Id;
                                   data.ResultSets[0][0].Qty_Scan = data.ResultSets[0][0].qty_scan;
                                   data.ResultSets[0][0].Store_Code = data.ResultSets[0][0].store_code;
                                   table.row(selectdata.index).data(data.ResultSets[0][0]);
                                   table.page(selectdata.page).draw('page');
                                   if (data.ResultSets[0][0]["InventSchedule_Type"] === "T") {
                                       $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "none");
                                   } else {
                                       $("a#li-tab4,a#li-tab3,a#li-tab2").css("display", "block");
                                   }
                                   editor.message('更新成功').true;
                               } else {

                               }
                           }
                           }
                   })

               }

           }, tabIndex:2
       },
      { label: '取消', fn: function () { this.blur(); }, tabIndex: 3 }
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
                        tab1btn(e,mode,action)
                        editor.message('');
                        break;
                    }
                        //产品查询条件 Tab2
                    case 'li-tab2': {
                        if (editor.field('InventSchedule_Type').val()==="P" && editor.field('InventScheduleStatus_Code').val() === "保存") {
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
                                                    condition = condition + node + ' like' + "'" + editor.field(node).val() + '\%' +"'"
                                                } else {
                                                    condition = condition + node + ' like' + "'" + editor.field(node).val() + '\%' + "'" + ' and '
                                                }

                                            } else {
                                                condition = condition + node + ' like' + "'" + editor.field(node).val() + '\%' + "'"
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
                        if (editor.field('InventSchedule_Type').val() === "P" && editor.field('InventScheduleStatus_Code').val() === "保存") {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '确定', className: 'prodbtn', fn: function () {
                                        if (ptable.rows('.selected', { select: true }).data().length > 0) {
                                            var plist = ptable.rows('.selected', { select: true }).data();
                                            var pclist = pctable.rows().data();
                                            //pctable.clear();
                                            pcval = [];
                                            for (var i = 0; i < plist.length; i++) {
                                                if (pclist.length) {
                                                    for (var x = 0; x < pclist.length; x++) {
                                                        if (plist[i].Product_UniqueId === pclist[x].Product_UniqueId) {
                                                            plist.splice(i, 1);
                                                            i=i-1;
                                                            break;
                                                        } else if (pclist.length-x>1) {
                                                            continue;

                                                        }else {
                                                            plist[i].Line_Id = pctable.rows()[0].length + i+1;
                                                            plist[i].line_id = plist[i].Line_Id;
                                                            plist[i].inventschedule_id = Number(editor.field("InventSchedule_Id").val());
                                                            plist[i].product_id = plist[i].Product_ID;
                                                            plist[i].color_id = plist[i].Color_ID;
                                                            plist[i].size_id = plist[i].Size_ID;
                                                            plist[i].store_code_id = editor.field("Store_Code_Id").val();

                                                        }
                                                    };
                                                } else {
                                                    plist[i].Line_Id = i + 1;
                                                    plist[i].line_id = plist[i].Line_Id;
                                                    plist[i].inventschedule_id = Number(editor.field("InventSchedule_Id").val());
                                                    plist[i].product_id = plist[i].Product_ID;
                                                    plist[i].color_id = plist[i].Color_ID;
                                                    plist[i].size_id = plist[i].Size_ID;
                                                    plist[i].store_code_id = editor.field("Store_Code_Id").val();
                                                }

                                                //getpcval(plist[i]);
                                                //console.log(index);


                                            }
                                            pctable.rows.add(plist).draw();
                                            getpcval(pclist);
                                            //pctable.draw();
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
                        if (editor.field('InventSchedule_Type').val() === "P" && editor.field('InventScheduleStatus_Code').val() === "保存") {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '删除产品', className: 'pcbtn', fn: function () {
                                        pctable.rows('.selected').remove()
                                        var loop = pctable.rows().data().length;
                                        var pclist = pctable.rows().data();
                                        for (i = 0; i < loop; i++) {
                                            pclist[i].Line_Id = i + 1;
                                            pclist[i].line_id = pclist[i].Line_Id;
                                        }
                                        pctable.clear();
                                        pctable.rows.add(pclist).draw();
                                        getpcval(pclist);
                                    }
                                },
                                {
                                    extend: 'tabbtn', label: '保存', className: 'pcbtn', fn: function () {
                                        if (editor.field('InventSchedule_Type').val() === "P" && editor.field('InventScheduleStatus_Code').val() !== "保存") {
                                           return this.blur();
                                        }
                                        else if (pcval.length > 0) {

                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.store_code_id = Number(editor.field("Store_Code_Id").val());
                                            param.PCD = pcval;
                                            $.ajax({
                                                "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_InventSchedule_Detail",
                                                "type": "POST",
                                                "async": true,
                                                "crossDomain": true,
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        //data = data.ResultSets[0];

                                                        //pctable.clear();//重置产品明细列表
                                                        //data.forEach(function (node) {
                                                            //node.NewQty = node.AdjQty + node.StockQty;
                                                            //pctable.row.add(node);
                                                        //})
                                                        //pctable.draw();
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

                                        if (editor.field('InventSchedule_Type').val() === "P" && editor.field('InventScheduleStatus_Code').val() !== "保存") {
                                                this.blur();
                                            } else {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.inventschedule_id = editor.field('InventSchedule_Id').val(),
                                            param.store_code_id = editor.field('Store_Code_Id').val(),
                                            param.count_number = 1,
                                            param.inventschedule_date = editor.field('InventSchedule_Date').val(),
                                            param.inventschedulestatus_id = 3,
                                            param.inventschedule_type = editor.field('InventSchedule_Type').val(),
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

                                                        if (data.ResultSets[0][0].InventScheduleStatus_Code === "F") {
                                                            editor.field('Session_Id').val(data.ResultSets[0][0].Session_Id);
                                                            editor.field('InventScheduleStatus_Code').val('冻结');
                                                            data.ResultSets[0][0].Id = selectdata[0].Id;
                                                            data.ResultSets[0][0].Qty_Scan = data.ResultSets[0][0].qty_scan;
                                                            data.ResultSets[0][0].Store_Code = data.ResultSets[0][0].store_code;
                                                            table.row(selectdata.index).data(data.ResultSets[0][0]);
                                                            table.page(selectdata.page).draw('page');
                                                            editor.disable();
                                                            $("a#li-tab3,a#li-tab2").css("display", "none");
                                                            $('a[href="#tab-1"]').tab('show');
                                                            editor.message('冻结成功').true;
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
            if (exdata.InventScheduleStatus_Id !== 1) {
                editor.disable();
            } else {
                editor.enable();
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
                                if (exdata.Store_Code_Id === Number(data[item].ext1)) {
                                    selectStore.unshift({ label: data[item].label, value: data[item].ext1 });
                                } else {
                                    selectStore.push({ label: data[item].label, value: data[item].ext1 });
                                }
                                break;
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
        }
        var nval = {};
        pcval = [];
        for (i = 0;i<val.data().length; i++){
            nval.inventschedule_id = val.data()[i].inventschedule_id;
            nval.line_id = Number(val.data()[i].Line_Id);
            nval.product_id = val.data()[i].product_id;
            nval.color_id = Number(val.data()[i].color_id);
            nval.size_id = val.data()[i].size_id;
            pcval.push(nval);
            nval = {};
        }


    }
});




