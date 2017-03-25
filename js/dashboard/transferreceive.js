$(document).ready(function () {
    //新增及修改调整

    var editor = new $.fn.dataTable.Editor({

        idSrc: 'UniqueId',
        table: '#TransferReceiveTable',
        fields: [
            //调整-参数设置
            { label: 'transfer_from_store_id: ', name: 'transfer_from_store_id', type: 'hidden' },
            { label: 'transfer_to_store_id: ', name: 'transfer_to_store_id', type: 'hidden' },
            { label: 'BinId: ', name: 'BinId', type: 'hidden' },
            { label: 'reason_id: ', name: 'reason_id', type: 'hidden' },
            { label: 'Tch_status: ', name: 'Tch_status', type: 'hidden' },
            { label: 'transfer_status: ', name: 'transfer_status', type: 'hidden' },
            { label: '发货单号: ', name: 'transfer_number', type: 'readonly' },
            { label: '收货单号: ', name: 'tch_id', type: 'readonly' },
            { label: '收货状态: ', name: 'ReceptionStatus_Description', type: 'readonly' },
            { label: '收货门店: ', name: 'Transfer_To_Store_Description', type: 'readonly'},
            {
                label: '创建日期: ', name: 'CreationDate',
                type: 'datetime',
                def: function () { return new Date(); },
                format: 'YYYY-MM-DD',
            },
            { label: '发货门店: ', name: 'Transfer_From_Store_Description', type: 'readonly' },
            { label: '发货状态: ', name: 'TransferStatus_Description', type: 'readonly' },
            { label: '原因: ', name: 'Reason_Code', type: 'readonly' },
            { label: '用户: ', name: 'UserName', type:'readonly',def:SecurityManager.username},
            { label: '发货备注: ', name: 'transfer_note', type: 'readonly'},
            {
                label: '收货备注: ', name: 'Note', type: 'textarea', attr: {
                    "maxlength": '200'
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
                "title": '新增采购申请',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '采购申请单管理',
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
                idSrc: 'Line_Id',
                table: '#ProductDetailTable',
                fields: [
                    { name: 'Rm_number', type: 'hidden' },
                    { name: 'Product_Id', type: 'hidden' },
                    { name: 'Size_Id', type: 'hidden' },
                    { name: 'Color_Id', type: 'hidden' },
                    { name: 'Line_Id' },
                    { name: 'Product_code' },
                    { name: 'Short_name' },
                    { name: 'Color_code' },
                    { name: 'Size_code' },
                    { name: 'OnHandQty' },
                    { name: 'QtyOrdered' },
                    { name: 'Loose_qty_rm' },
                    { name: 'Unit_price' },
                    { name: 'Price_retail' },
                    { name: 'TotalAmount' },
                ],



                ajax: function (method, url, data, success, error) {
                    // NOTE - THIS WILL WORK FOR EDIT ONLY AS IS
                    if (data.action === 'edit') {
                        success({
                            data: $.map(data.data, function (val, key) {
                                val.DT_RowId = key;
                                var nval = {};
                                nval.po_number = Number(editor.field('PONumber').val());
                                nval.rm_number = val.Rm_number;
                                nval.product_id = val.Product_Id;
                                nval.color_id = val.Color_Id;
                                nval.size_id = val.Size_Id;
                                nval.qty = Number(val.Loose_qty_rm);
                                if (pcval.length > 0) {
                                    for (x in pcval) {

                                        if (pcval[x].po_number !== nval.po_number) {
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

                                        } else if (pcval.length-1>0) {
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
                { "data": "Line_Id" },
                { "data": "Product_code" },
                { "data": "Short_name" },
                { "data": "Color_code" },
                { "data": "Size_code" },
                { "data": "QtySend" },
                {
                    "data": function (row, type, val, meta) {
                        if ((type === 'set' || type === 'display') && typeof (row.QtyReceived) !== "undefined") {
                            return row.QtyReceived;
                        }else{
                            //row.Loose_qty_rm = '编辑数量'
                            return row.QtyReceived;
                        }
                    }, "className": 'editable'
                },
                { "data": "Bin_Code" },
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
                if (editor.field("TransferStatus_Description").val() === '待确认') {
                    pceditor.inline(this, 'QtyReceived', {
                        onBlur: 'submit',
                        //onComplete:'none',
                        submit: 'all',
                        //onReturn: 'none',
                        onBackground: close
                    });
                } else {
                    $('#ProductDetailTable').off('click', 'tbody td.editable');
                };
            });


        }


    });

    //修改数据
    editor.on('initEdit', function (e, node, data) {

        getproductlist(e, data);

        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        param.Tran_Num = editor.field("transfer_number").val();
        param.tch_Id = editor.field("tch_id").val();
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetTransferReceives_Detail_TrinChild",
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
                    data[i].Product_code = data[i].Product_code;
                    data[i].Short_name = data[i].Short_name;
                    data[i].Color_code = data[i].Color_code;
                    data[i].Size_code = data[i].Size_code;
                    data[i].QtySend = data[i].Qty_send;
                    data[i].QtyReceived = data[i].Qty_reception;
                    data[i].Bin_Code = data[i].Bin_Code;
                }
                pctable.clear().draw();//重置产品明细列表
                data.forEach(function (node) {
                    pctable.row.add(node);
                })
                pctable.draw();
                
                if (editor.field("ReceptionStatus_Description").val() === "待确认" || "待收货") {
                    editor.enable();
                } else {
                    //禁用Editor，且不允许差异收货
                    editor.disable();
                    $("a#li-tab3,a#li-tab2").css("display", "none")
                    $('#ProductDetailTable').off('click', 'tbody td.editable');
                }

            }


        });

    });

    //初始化产品报表
    var table = $("#TransferReceiveTable").DataTable({
        processing: false,
        //dom: 'Bfrtip',
        lengthChange: false,
        select: true,
        ordering:false,
        order: [[0, "asc"]],
        columns: [
        { "data": "Id" },
        { "data": "transfer_number" },
        { "data": "tch_id" },
        {
            "data": "Tch_status", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case "Edit": {
                            return data = '待确认';
                            break;
                        }
                        case "Confirmed": {
                            return data = '已确认';
                            break;
                        }
                    }
                } else {
                    return data = '待收货';
                }
            }
        },
        { "data": "Transfer_From_Store_Description" },
        { "data": "Transfer_To_Store_Description" },
        { "data": "qty_sent" },
        {
            "data": "qty_rec", "render": function (data, type, row) {
                if (data === null) {
                    return 0;
                } else {
                    return data;
                }
            }
        },
        {
            "data": "transfer_date", "render": function (data, type, row) {
                if (data.length > 0) {
                    return data.substring(0, 10);
                }
            }
        },
        {
            "data": "Reason_Code", "render": function (data, type, row) {
                if (data.length > 0) {
                    return data.substring(0, 10);
                }
            }
        },
        {
            "data": "transfer_note", "render": function (data, type, row) {
                if (row.transfer_note !==null) {
                    return data.substring(0, 10);
                } else {
                    return row.transfer_note;
                }
            }
        }
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
            table.buttons().container().appendTo('#TransferReceiveTable_wrapper .col-sm-6:eq(0)');
            var storelist='<select multiple="multiple">'+
                           '<option>1</option>'+
                            '<option>2</option>'+
                            '</select>'
            table.buttons().container().appendTo(storelist);
            getreceivinglist('3','0');

        },
        buttons: [
    {
        text: '新建', action: function (e, dt, node, config) {
            editor.edit(table.rows('.selected', { select: true }));
        }
    },
    {
        text: '修改', action: function (e, dt, node, config) {
            editor.edit(table.rows('.selected', { select: true }));
        }
    },

    { extend: 'print', text: '打印' },
    {
        extend: 'collection',
        text: '导出到..',
        buttons: [
            'excel',
            'csv'
        ]
    },
    {
        extend: 'collection',
        text: '收货状态..',
        buttons: [
                {
                    text: '待收货确认', action: function (e, dt, node, config) {
                        getreceivinglist('3','0');
                    }
                },
                {
                    text: '待确认', action: function (e, dt, node, config) {
                        getreceivinglist('3','1');
                    }
                },
                {
                    text: '已确认', action: function (e, dt, node, config) {
                        getreceivinglist('5','2');
                    }
                },
        ]
    },

        ],
    });
    //定义按键根据记录是否能新建或者修改

    table.on('select', function (e,dt, type, indexes) {
        if (type = 'row') {
            var exdata = table.rows('.selected', { select: true }).data()[0];
            if (exdata.Tch_status === null) {
                table.button(0).enable();
                table.button(1).text('修改').disable();
                editor.enable();


            } else if (exdata.Tch_status === 'Edit') {
                table.button(0).disable();
                table.button(1).text('修改').enable();
                editor.enable();

            } else {
                table.button(0).disable();
                table.button(1).text('查看').enable();
                editor.disable();

            }

        }
    })


    //定义 Tab1 按键
    function tab1btn() {
        editor.buttons([
       {
           label: '保存', className: 'btn btn-primary', fn: function () {
               if (editor.field('tch_id').val().length > 0 && (editor.field('Tch_status').val() === 'Confirmed')) {
                   this.blur();
               } else {
                   var param = {};
                   param.token = SecurityManager.generate();
                   param.username = SecurityManager.username;
                   param.TrOutNumber = editor.field('transfer_number').val(),
                   param.TrOutStoreId = editor.field('transfer_from_store_id').val(),
                   param.TrInStoreId = editor.field('transfer_to_store_id').val(),
                   param.CreationDate = editor.field('CreationDate').val(),
                   param.BinId = editor.field('BinId').val()?Number(editor.field('BinId').val()):null,
                   param.ReceptionStatus = 'E',
                   param.TrInChNumber = editor.field('tch_id').val()?editor.field('tch_id').val():null,
                   param.Note = editor.field('Note').val(),
                   $.ajax({
                       "url": sysSettings.domainPath + "raymsp_Gatewaypayment_TRIn_header",
                       "async": true,
                       "crossDomain": true,
                       "type": "POST",
                       "dataType": "json",
                       "contentType": "application/json; charset=utf-8",
                       "data": JSON.stringify(param),
                       "success": function (data) {
                           if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                               getreceivinglist('3','0');
                               editor.field('tch_id').val(data.ResultSets[0][0]["tch_id"]);
                               editor.field('Tch_status').val(data.ResultSets[0][0]["Tch_status"]);
                               editor.field('ReceptionStatus_Description').val('待确认');
                               getproductdetail();
                               $('a[href="#tab-4"]').tab('show');
                               editor.message('保存成功').true;
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
        // 创建 产品Tabs (搜索条件，列表及产品调整明细) 

        var html = '<div class="tabs-container">' +
                    '<ul class="nav nav-tabs">' +
                        '<li class="active"><a data-toggle="tab" id="li-tab1" href="#tab-1">参数设置</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab2" href="#tab-2">产品搜索条件</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab3" href="#tab-3">产品列表</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab4" href="#tab-4">收货明细管理</a></li>' +
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
                            '<th>调拨数量</th>' +
                            '<th>收货数量</th>' +
                            '<th>收货货区</th>' +
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
        $("a#li-tab3,a#li-tab2").css("display", "none");
        //add editer message form(layout) to header
        $('.DTE_Form_Info').css({"float":"right","margin":"10px"});

        ////move the editor elements to respective tab
        $(editor.node(['transfer_number', 'tch_id', 'Transfer_From_Store_Description', 'Transfer_To_Store_Description', 'TransferStatus_Description', 'ReceptionStatus_Description', 'CreationDate', 'UserName', 'Reason_Code', 'transfer_note', 'Note'])).appendTo('.tab-1');
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
                        if (editor.field("tch_id").val().length > 0 && editor.field('Tch_status').val() !== 'Confirmed') {
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
                                        param.colName = 'Product_UniqueId, Product_ID, ProductCode, ProductName, Supplier, RetailPrice,PurchasePrice, LandedCost, Bin_Qty_Stocks, Color,Color_ID,Color_UniqueId, Size, Size_ID, Size_UniqueId';
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
                        if (editor.field("tch_id").val().length > 0 && editor.field('Tch_status').val() !== 'Confirmed') {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '确定', className: 'prodbtn', fn: function () {
                                        if (ptable.rows('.selected', { select: true }).data().length > 0) {
                                            var plist = ptable.rows('.selected', { select: true }).data();
                                            pctable.clear();
                                            for (var i = 0; i < plist.length; i++) {
                                                plist[i].LineId = i + 1;
                                                pctable.row.add(plist[i])
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
                        //$('.DTE_Form_Info').appendTo('#PriceChangeTable_wrapper .col-sm-6:eq(0)');
                        if (editor.field("tch_id").val().length > 0 && editor.field('Tch_status').val() !== 'Confirmed') {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '批准', className: 'btn btn-primary', fn: function () {

                                        if (editor.field('tch_id').val().length > 0 && editor.field('Tch_status').val() !== 'Edit') {
                                                this.blur();
                                        } else {

                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.TrOutNumber = editor.field('transfer_number').val(),
                                            param.TrOutStoreId = editor.field('transfer_from_store_id').val(),
                                            param.TrInStoreId = editor.field('transfer_to_store_id').val(),
                                            param.CreationDate = editor.field('CreationDate').val(),
                                            param.BinId = editor.field('BinId').val() ? Number(editor.field('BinId').val()) : null,
                                            param.ReceptionStatus = 'C',
                                            param.TrInChNumber = editor.field('tch_id').val(),
                                            param.Note = editor.field('Note').val(),
                                            $.ajax({
                                                "url": sysSettings.domainPath + "raymsp_Gatewaypayment_TRIn_header",
                                                "async": true,
                                                "crossDomain": true,
                                                "type": "POST",
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        getreceivinglist('5','2');
                                                        editor.field('tch_id').val(data.ResultSets[0][0]["tch_id"]);
                                                        editor.field('Tch_status').val(data.ResultSets[0][0]["Tch_status"]);
                                                        editor.field('ReceptionStatus_Description').val('已确认');
                                                        getproductdetail();
                                                        $('a[href="#tab-1"]').tab('show');
                                                        editor.message('审批成功').true;
                                                        return false;
                                                    }
                                                }
                                            })
                                            }

                                    }
                                },
                            { label: '取消', fn: function () { this.blur(); } },
                            ])
                        }
                        editor.message('');
                        break;
                    }
                }
            }
        })
    };

    function getproductdetail() {

        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        param.Tran_Num = editor.field("transfer_number").val();
        param.tch_Id = editor.field("tch_id").val();
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetTransferReceives_Detail_TrinChild",
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
                    data[i].Product_code = data[i].Product_code;
                    data[i].Short_name = data[i].Short_name;
                    data[i].Color_code = data[i].Color_code;
                    data[i].Size_code = data[i].Size_code;
                    data[i].QtySend = data[i].Qty_send;
                    data[i].QtyReceived = data[i].Qty_reception;
                    data[i].Bin_Code = data[i].Bin_Code;
                }
                pctable.clear().draw();//重置产品明细列表
                data.forEach(function (node) {
                    pctable.row.add(node);
                })
                pctable.draw();

                if (editor.field("ReceptionStatus_Description").val() === "待确认" || "待收货") {
                    editor.enable();
                } else {
                    //禁用Editor，且不允许差异收货
                    editor.disable();
                    $("a#li-tab3,a#li-tab2").css("display", "none")
                    $('#ProductDetailTable').off('click', 'tbody td.editable');
                }

            }


        });
    }
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
                        editor.field("reason_id").val(Number(editor.field("Reason_Code").val()))
                    }
                })
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("ProductType").update(selectProductType)
                editor.field("Season").update(selectSeason)

                
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
        }
        if (editor.field("Tch_status").val() === null) {
            editor.field("Tch_status").val('Edit');
            editor.field("ReceptionStatus_Description").val('新建')
        } else if (editor.field("Tch_status").val() === 'Edit') {
            editor.field("ReceptionStatus_Description").val('待确认')
        } else if (editor.field("Tch_status").val() === 'Confirmed') {
            editor.field("ReceptionStatus_Description").val('已确认')
        }
    }
    function getreceivinglist(tcstatus, trstatus) {
        var filter = "TransactionStoreGrid" + "<" + "1000014" + ">" + "," + "TransactionStatus" + "<" + tcstatus + ">" + "," + "TransactionReceiveStatus" + "<" + trstatus + ">"
        var param = {
            "token": SecurityManager.generate(),
            "username": SecurityManager.username,
            "store_code_id": -1,
            "Filter": filter
        }
        if (status === 'C') {
            table.button(1).text('查看');
            editor.disable();
        } else {
            table.button(1).text('修改');
            editor.enable();
        }
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetTRInList",
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
                }
                table.clear();
                data.forEach(function (node) {
                    table.row.add(node);
                })
                table.draw();
                //return data;
            }
        })

    }
});




