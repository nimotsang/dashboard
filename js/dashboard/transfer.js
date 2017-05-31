$(document).ready(function () {
    //新增及修改调整
    var editor = new $.fn.dataTable.Editor({

        idSrc: 'UniqueId',
        table: '#TransferTable',
        fields: [
            //调整-参数设置
            { label: 'transfer_status: ', name: 'transfer_status', type: 'hidden' },
            { label: 'transfer_from_store_id: ', name: 'transfer_from_store_id', type: 'hidden' },
            { label: 'reason_id: ', name: 'reason_id', type: 'hidden' },
            { label: 'season_id: ', name: 'season_id', type: 'hidden' },
            { label: 'transfer_to_store_id: ', name: 'transfer_to_store_id', type: 'hidden' },
            { label: 'transfer_type_code: ', name: 'transfer_type', type: 'hidden' },
            { label: 'transfer_header_UniqueId: ', name: 'UniqueId', type: 'hidden' },
            { label: '发货单号: ', name: 'transfer_number', type:'readonly' },
            {
                label: '创建日期: ', name: 'CreationDate',
                type: 'datetime',
                def: function () { return new Date(); },
                format: 'YYYY-MM-DD',
            },
            { label: '发出门店: ', name: 'Transfer_From_Store_Description', type: 'select' },
            { label: '接收门店: ', name: 'Transfer_To_Store_Description', type: 'select' },
            { label: '状态: ', name: 'TransferStatus_Description', type: 'readonly' },
            { label: '原因: ', name: 'Reason_Code', type: 'select' },
            { label: '用户: ', name: 'UserName', type:'readonly',def:SecurityManager.username},
            { label: '备注: ', name: 'transfer_note', type: 'textarea', attr: {
                "maxlength":'200'}},

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
                "title": '新增调拨申请',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '调拨申请单管理',
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
            tab1btn();
            //定义Tabs规则
            addtab();

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
                idSrc: 'LineId',
                table: '#ProductDetailTable',
                fields: [
                    { label: 'TRANSFER_FROM_STORE_ID: ', name: 'TRANSFER_FROM_STORE_ID', type: 'hidden' },
                    { label: 'TRANSFER_TO_STORE_ID: ', name: 'TRANSFER_TO_STORE_ID', type: 'hidden' },
                    { label: 'REASON_ID: ', name: 'REASON_ID', type: 'hidden' },
                    { label: 'TRANSFER_NUMBER: ', name: 'TRANSFER_NUMBER', type: 'hidden' },
                    { label: 'PRODUCT_ID: ', name: 'PRODUCT_ID', type: 'hidden' },
                    { label: 'color_ID: ', name: 'color_ID', type: 'hidden' },
                    { label: 'size_ID: ', name: 'size_ID', type: 'hidden' },
                    { label: 'BinId: ', name: 'BinId', type: 'hidden' },
                    { label: 'bh_uniqueid: ', name: 'bh_uniqueid', type: 'hidden' },
                    { label: 'color_uniqueid: ', name: 'color_uniqueid', type: 'hidden' },
                    { label: 'size_uniqueid: ', name: 'size_uniqueid', type: 'hidden' },
                    { label: 'product_uniqueid: ', name: 'product_uniqueid', type: 'hidden' },
                    { label: 'SKU: ', name: 'short_sku', type: 'hidden' },
                    { label: '序号: ', name: 'LineId' },
                    { label: '序号: ', name: 'ProductCode' },
                    { label: '序号: ', name: 'ProductName' },
                    { label: '序号: ', name: 'Color' },
                    { label: '序号: ', name: 'Size' },
                    { label: '序号: ', name: 'BinStockQty' },
                    { label: '序号: ', name: 'BinCode' },
                    { label: '序号: ', name: 'Qty' },
                    { label: '序号: ', name: 'RetailPrice' },
                    { label: '序号: ', name: 'CostPrice' },
                    { label: '序号: ', name: 'Supplier' },
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
                { "data": "LineId"},
                { "data": "ProductCode"},
                { "data": "ProductName"},
                { "data": "Color"},
                { "data": "Size" },
                { "data": "BinStockQty" },
                { "data": "BinCode" },
                { "data": "Qty", "defaultContent": "编辑数量", "className": 'editable'},
                { "data": "RetailPrice" },
                { "data": "CostPrice" },
                { "data": "Supplier" },
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

        editor.enable();


    });
    //修改数据
    editor.on('initEdit', function (e, node, data) {
        //搜索条件下拉框
        getproductlist(e, data);

        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        param.transfer_number = editor.field("transfer_number").val();
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetTransferSendDetail",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                data = data.ResultSets[0]
                for (var i = 0; i < data.length; i++) {
                    data[i].LineId = data[i].SEQUENCE;
                    data[i].ProductCode = data[i].product_code;
                    data[i].ProductName = data[i].Short_name;
                    data[i].Color = data[i].color_code;
                    data[i].Size = data[i].size_code;
                    data[i].RetailPrice = data[i].retailprice;
                    data[i].CostPrice = data[i].costprice;
                    data[i].ShortSKU = data[i].short_sku;
                    data[i].BinCode = data[i].bin_code;
                    data[i].BinId = data[i].bin_id;
                    data[i].Supplier = data[i].SupplierName;
                    data[i].Qty = data[i].TRANSFER_QUANTITY;
                }
                pctable.clear().draw();//重置产品明细列表
                data.forEach(function (node) {
                    pctable.row.add(node);
                    if (editor.field("transfer_status").val() === "-1") {
                        getpcval(node);
                    }
                })
                pctable.draw();

                if (editor.field("transfer_status").val() === "-1") {
                    editor.enable();
                    $("a#li-tab3,a#li-tab2").css("display", "block");
                } else {
                    editor.disable();
                    $("a#li-tab3,a#li-tab2").css("display", "none")
                    $('#ProductDetailTable').off('click', 'tbody td.editable');
                }

            }


        });

    });
    editor.dependent('Transfer_To_Store_Description', function (val, data, callback) {
        if (typeof (data.values.transfer_to_store_id) !== 'undefined') {
            if (Number(val) !== data.values.transfer_to_store_id) {
                if (Number(val) === data.values.transfer_from_store_id) {
                    editor.field("Transfer_To_Store_Description").val(data.values.transfer_to_store_id);
                    /**
                    var pfield = editor.field("Transfer_To_Store_Description").input()[0];
                    for (var i = 0; i < pfield.length; i++) {
                        if (Number(pfield[i].value) === data.values.transfer_to_store_id) {
                            editor.field("Transfer_To_Store_Description").update({ label: pfield[i].text, value: pfield[i].value })
                        }
                    }
                    **/
                    editor.field("Transfer_To_Store_Description").error('发出门店和接收门店不能是同一家门店');
                    setTimeout(function () {
                        editor.field("Transfer_To_Store_Description").error('');
                    }, 1500);
                } else {
                    editor.field("transfer_to_store_id").val(Number(val));
                }

            };
        }

    }, { event: 'change' });
    editor.dependent('Reason_Code', function (val, data, callback) {
        editor.field("reason_id").val(Number(val));

    }, { event: 'change' })
    //初始化产品报表
    table = $("#TransferTable").DataTable({
        processing: false,
        //dom: 'Bfrtip',
        lengthChange: false,
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "Id"},
        { "data": "transfer_number" },
        { "data": "Transfer_From_Store_Description" },
        { "data": "Transfer_To_Store_Description" },
        {
            "data": "transfer_status", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case "-1": {
                            return data = '保存';
                            break;
                        }
                        case "3 ": {
                            return data = '已发送';
                            break;
                        }
                        case "5 ": {
                            return data = '已接收';
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
        { "data": "qty_sent" },
        {
            "data": "qty_rec", "render": function (data, type, row) {
                if (data===null) {
                    return 0;
                } else {
                    return data;
                }
            }
        },
        {
            "data": "Reason_Code", "render": function (data, type, row) {
                if (data.length > 0) {
                    return data.substring(0, 10);
                } else { return '数据未定义' }
            }
        },
        {
            "data": "transfer_date", "render": function (data, type, row) {

                    if (data && data.length > 0) {
                        return data.substring(0, 10);
                    }

            }
        },
        {
            "data": "posting_date", "render": function (data, type, row) {

                    if (data && data.length > 0) {
                        return data.substring(0, 10);
                    }else {return '数据未定义'}

            }
        }
        ],
        ajax: {
            "url": sysSettings.domainPath + "rmSP_RAMS_GetTransferSendMain",
            "async": true,
            "crossDomain": true,
            "type": "POST",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": function () {
                var param = {
                    "token": SecurityManager.generate(),
                    "username": SecurityManager.username,
                    "store_code_id": -1,
                    "Filter": "TransactionStoreGrid"+"<"+"1000014"+">"
                }
                return JSON.stringify(param);
            },
            "dataSrc": function (data) {
                data = data.ResultSets[0]
                for (var i = 0; i < data.length; i++) {
                    data[i].Id = i + 1;
                }
                return data;

            }
        },
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
            table.buttons().container().appendTo('#TransferTable_wrapper .col-sm-6:eq(0)');

        },
        buttons: [
    { extend: 'create', editor: editor, text: '新建' },
    { extend: 'edit', editor: editor, text: '修改' },
    { extend: 'print', text: '打印' },
    {
        extend: 'collection',
        text: '导出到..',
        buttons: [
            'excel',
            'csv'
        ]
    }


        ],
    });


    //定义 Tab1 按键
    function tab1btn() {
        editor.buttons([
       {
           label: '保存', className: 'btn btn-primary', fn: function () {
               if (editor.field("transfer_status").val() !== "-1") {
                   this.blur();
               } else {
                   var param = {};
                   param.token = SecurityManager.generate();
                   param.username = SecurityManager.username;
                   param.TrOutNumber = editor.field('transfer_number').val() ? Number(editor.field('transfer_number').val()) : null,
                   param.TrOutStoreId = editor.field('transfer_from_store_id').val(),
                   param.TrInStoreId = editor.field('transfer_to_store_id').val(),
                   param.Reason_id = editor.field('reason_id').val(),
                   param.Season_id = editor.field('season_id').val() ? Number(editor.field('season_id').val()) : -9,
                   param.CreationDate = editor.field('CreationDate').val()
                   param.TransferStatus = -1,
                   param.Note = editor.field('transfer_note').val(),
                   $.ajax({
                       "url": sysSettings.domainPath + "raymsp_Gatewaypayment_TROut_header",
                       "async": true,
                       "crossDomain": true,
                       "type": "POST",
                       "dataType": "json",
                       "contentType": "application/json; charset=utf-8",
                       "data": JSON.stringify(param),
                       "success": function (data) {
                           if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                               table.ajax.reload().draw();
                               editor.field('transfer_number').val(data.ResultSets[0][0]["transfer_number"]);
                               editor.field('transfer_note').val(data.ResultSets[0][0]["transfer_note"]);
                               editor.field('Transfer_From_Store_Description').val(data.ResultSets[0][0]["Transfer_From_Store_Description"]);
                               editor.field('Transfer_To_Store_Description').val(data.ResultSets[0][0]["Transfer_To_Store_Description"]),
                               editor.message('保存成功').true;
                               return false;
                               //ptable.buttons.info('Notification', 'This is a notification message!', 3000);
                               //table.row('#'+ data.ResultSets[0][0].session_number).remove();
                               //table.row.add(data.ResultSets[0][0]).draw();

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
                            '<th>颜色</th>' +
                            '<th>尺码</th>' +
                            '<th>库存数量</th>' +
                            '<th>货区</th>' +
                            '<th>调拨数量</th>' +
                            '<th>零售价</th>' +
                            '<th>成本价</th>' +
                            '<th>供应商</th>' +
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
        $(editor.node(['transfer_number', 'CreationDate', 'Transfer_From_Store_Description','Transfer_To_Store_Description',  'TransferStatus_Description', 'Reason_Code', 'UserName', 'transfer_note'])).appendTo('.tab-1');
        $(editor.node(['ProductCode', 'ProductName', 'ColorChart', 'SizeChart', 'Supplier', 'ProductType', 'Season', 'Division', 'Department', 'SubDepartment', 'Class', 'RetailPrice', 'CostPrice'])).appendTo('.tab-2');

    };
    //定义Tabs规则
    function addtab() {
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
                        if (editor.field('transfer_number').val().length > 0 && editor.field('transfer_status').val() === "-1") {
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
                        if (editor.field("transfer_number").val().length > 0 && editor.field('transfer_status').val() === "-1") {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '确定', className: 'prodbtn', fn: function () {
                                        if (ptable.rows('.selected', { select: true }).data().length > 0) {
                                            var plist = ptable.rows('.selected', { select: true }).data();
                                            pctable.clear();
                                            pcval = [];
                                            for (var i = 0; i < plist.length; i++) {
                                                plist[i].LineId = i + 1;
                                                plist[i].CostPrice = plist[i].PurchasePrice;
                                                plist[i].BinStockQty = plist[i].Bin_Qty_Stocks;
                                                plist[i].TRANSFER_FROM_STORE_ID = editor.field("transfer_from_store_id").val();
                                                plist[i].TRANSFER_NUMBER = editor.field("transfer_number").val();
                                                plist[i].color_uniqueid = plist[i].Color_UniqueId;
                                                plist[i].product_uniqueid = plist[i].Product_UniqueId;
                                                plist[i].short_sku = plist[i].Short_SKU;
                                                plist[i].size_uniqueid = plist[i].Size_UniqueId;
                                                plist[i].TRANSNUM = editor.field("transfer_number").val();
                                                plist[i].PRODUCT_ID = plist[i].Product_ID;
                                                plist[i].size_ID = plist[i].Size_ID;
                                                plist[i].color_ID = plist[i].Color_ID;
                                                plist[i].Qty = 1;
                                                var param = {};
                                                param.token = SecurityManager.generate();
                                                param.username = SecurityManager.username;
                                                param.store_code_id = editor.field("transfer_from_store_id").val();
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
                                                        plist[i].BinId = data.bin_id
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
                        if (editor.field("transfer_number").val().length > 0 && editor.field('transfer_status').val() === "-1") {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '保存', className: 'pcbtn', fn: function () {
                                        if (editor.field('transfer_number').val().length > 0 && editor.field('transfer_status').val() !== "-1") {
                                           return this.blur();
                                        }
                                        else if (pcval.length>0) {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.TrOutNumber = Number(editor.field("transfer_number").val());
                                            param.TroutStoreId = editor.field("transfer_from_store_id").val();
                                            param.ReasonId = null;
                                            param.CreationDate = editor.field("CreationDate").val();
                                            param.PCD = pcval;
                                            $.ajax({
                                                "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_TROut_detail",
                                                "type": "POST",
                                                "async": true,
                                                "crossDomain": true,
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        data = data.ResultSets[0]
                                                        for (var i = 0; i < data.length; i++) {
                                                            data[i].LineId = data[i].SEQUENCE;
                                                            data[i].ProductCode = data[i].product_code;
                                                            data[i].ProductName = data[i].Short_name;
                                                            data[i].Color = data[i].color_code;
                                                            data[i].Size = data[i].size_code;
                                                            data[i].RetailPrice = data[i].retailprice;
                                                            data[i].CostPrice = data[i].costprice;
                                                            data[i].ShortSKU = data[i].short_sku;
                                                            data[i].BinCode = data[i].bin_code;
                                                            data[i].BinId = data[i].bin_id;
                                                            data[i].Supplier = data[i].SupplierName;
                                                            data[i].Qty = data[i].TRANSFER_QUANTITY;
                                                        };
                                                        pctable.clear();//重置产品明细列表
                                                        data.forEach(function (node) {
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

                                        if (editor.field('transfer_number').val().length > 0 && editor.field('transfer_status').val() !== "-1") {
                                                this.blur();
                                            } else {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.TrOutNumber = editor.field('transfer_number').val(),
                                            param.TrOutStoreId = editor.field('transfer_from_store_id').val(),
                                            param.TrInStoreId = editor.field('transfer_to_store_id').val(),
                                            param.Reason_id = editor.field('reason_id').val(),
                                            param.Season_id = editor.field('season_id').val() ? Number(editor.field('season_id').val()) : -9,
                                            param.CreationDate = editor.field('CreationDate').val()
                                            param.TransferStatus = 3,
                                            param.Note = editor.field('transfer_note').val(),
                                            $.ajax({
                                                "url": sysSettings.domainPath + "raymsp_Gatewaypayment_TROut_header",
                                                "async": true,
                                                "crossDomain": true,
                                                "type": "POST",
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        table.ajax.reload().draw();
                                                        if (data.ResultSets[0][0].transfer_status === '3 ') {
                                                            editor.field('TransferStatus_Description').val('已发送');
                                                            editor.field('transfer_status').val("3 ");
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
        var selectStore = [], selectRecStore = [], selectReason = []
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        // Get existing options
        if (e.type === 'initEdit') {
            exdata = data
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
                            if (typeof (exdata.transfer_from_store_id) !== 'undefined'/** 判断是新建还是编辑 **/) {
                                if (exdata.transfer_from_store_id !== Number(data[item].ext1)) {
                                    selectStore.push({ label: data[item].label, value: data[item].ext1 });
                                } else {
                                    selectStore.unshift({ label: data[item].label, value: data[item].ext1 });
                                }
                                if (exdata.transfer_to_store_id !== Number(data[item].ext1)) {
                                    selectRecStore.push({ label: data[item].label, value: data[item].ext1 });
                                } else {
                                    selectRecStore.unshift({ label: data[item].label, value: data[item].ext1 });
                                }

                            } else {
                                selectStore.push({ label: data[item].label, value: data[item].ext1 });
                                selectRecStore.unshift({ label: data[item].label, value: data[item].ext1 });
                            }
                            break;
                        }
                    }
                };
                param.lbu_id = 12;
                $.ajax({
                    "url": sysSettings.domainPath + "rmSP_RAMS_GetReasonByLbu",
                    "type": "POST",
                    "async": true,
                    "crossDomain": true,
                    "dataType": "json",
                    "contentType": "application/json; charset=utf-8",
                    "data": JSON.stringify(param),
                    "success": function (data) {
                        data = data.ResultSets[0]
                        for (var item in data) {
                            if (exdata.reason_id !== data[item].reason_ID) {
                                selectReason.push({ label: data[item].Description, value: data[item].reason_ID });
                            } else {
                                selectReason.unshift({ label: data[item].Description, value: data[item].reason_ID });
                            }
                        }
                        editor.field("Reason_Code").update(selectReason)
                        editor.field("reason_id").val(Number(editor.field("Reason_Code").val()))
                    }
                })
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("ProductType").update(selectProductType)
                editor.field("Season").update(selectSeason)
                editor.field("Transfer_From_Store_Description").update(selectStore)
                editor.field("Transfer_To_Store_Description").update(selectRecStore)
                editor.field("transfer_to_store_id").val(Number(editor.field("Transfer_To_Store_Description").val()))
                editor.field("transfer_from_store_id").val(Number(editor.field("Transfer_From_Store_Description").val()))
                
            }
        });
        if (typeof (data) !== 'undefined') {
            if (data.transfer_status !== null) {
                switch (data.transfer_status) {
                    case "-1": {
                        editor.field("TransferStatus_Description").val('保存')
                        break;
                    }
                    case "3 ": {
                        editor.field("TransferStatus_Description").val('已发送')
                        break;
                    }
                    case "5 ": {
                        editor.field("TransferStatus_Description").val('已接收')
                        break;
                    }
                    default: {
                        editor.field("TransferStatus_Description").val('保存');
                        editor.field("transfer_status").val(-1);
                        break;
                    }
                }
            }
        } else if (editor.field("transfer_status").val().length === 0) {
            editor.field("TransferStatus_Description").val('新建');
            editor.field("transfer_status").val("-1");
        }
    }
    //获得PCD产品列表
    function getpcval(val, key) {
        if (typeof (key) !== 'undefined') {
            val.DT_RowId = key;
        }
        var nval = {};
        nval.STORE_CODE_ID = val.TRANSFER_FROM_STORE_ID;
        nval.TRANSNUM = Number(val.TRANSFER_NUMBER);
        nval.SEQUENCE = Number(val.LineId);
        nval.SKU = val.short_sku;
        nval.QUANTITY = Number(val.Qty);
        nval.CESSION_PRICE = Number(val.RetailPrice);
        nval.Bin_id = val.BinId;
        nval.product_id = val.PRODUCT_ID;
        nval.size_id = val.size_ID;
        nval.color_id = val.color_ID;
        nval.TROD_PriceCost = Number(val.CostPrice);
        nval.note = editor.field('transfer_note').val();
        nval.BinHeader = val.bh_uniqueid;
        nval.Color = val.color_uniqueid;
        nval.Product = val.product_uniqueid;
        nval.SizeData = val.size_uniqueid;
        if (pcval.length > 0) {
            for (x in pcval) {

                if (pcval[x].TRANSNUM !== nval.TRANSNUM) {
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




