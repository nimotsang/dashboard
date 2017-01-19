$(document).ready(function () {
    //新增及修改调整

    var editor = new $.fn.dataTable.Editor({

        idSrc: 'POUniqueId',
        table: '#POTable',
        fields: [
            //调整-参数设置
            { label: 'POUniqueId: ', name: 'POUniqueId', type: 'hidden' },
            { label: 'POTUniqueId: ', name: 'POTUniqueId', type: 'hidden' },
            { label: 'SUUniqueId: ', name: 'SUUniqueId', type: 'hidden' },
            { label: 'RecStoreUniqueId: ', name: 'RecStoreUniqueId', type: 'hidden' },
            { label: 'STUniqueId: ', name: 'STUniqueId', type: 'hidden' },
            { label: 'PO单号: ', name: 'PONumber', type: 'readonly' },
            { label: '收货单号: ', name: 'RMNumber', type: 'readonly' },
            { label: '参考收货单号: ', name: 'RefRMNumber', type: 'readonly' },
            { label: '收货门店: ', name: 'RecStore', type: 'readonly'},
            {
                label: '创建日期: ', name: 'RMCreationDate',
                type: 'datetime',
                def: function () { return new Date(); },
                format: 'YYYY-MM-DD',
            },
            {
                label: '修改日期: ', name: 'RMModifiedDate',
                type: 'datetime',
                def: function () { return new Date(); },
                format: 'YYYY-MM-DD',
            },
            { label: 'PO类型: ', name: 'POTypeDesc', type: 'readonly' },
            { label: '收货状态: ', name: 'ReceptionStatus', type: 'readonly' },
            { label: '供应商: ', name: 'SUName', type: 'readonly' },
            { label: '用户: ', name: 'UserName', type:'readonly',def:SecurityManager.username},
            { label: 'PO备注: ', name: 'POReference', type: 'readonly'},
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
                { "data": "OnHandQty" },
                { "data": "QtyOrdered" },
                {
                    "data": function (row, type, val, meta) {
                        if ((type === 'set' || type === 'display') && typeof (row.Loose_qty_rm) !== "undefined") {
                            return row.Loose_qty_rm;
                        }else{
                            //row.Loose_qty_rm = '编辑数量'
                            return row.Loose_qty_rm;
                        }
                    }, "className": 'editable'
                },
                { "data": "Unit_price" },
                { "data": "Price_retail"},
                {
                    "data": function (row, type, val, meta) {
                        if (type === 'set' || type === 'display') {
                            row.TotalAmount = row.Loose_qty_rm * row.Unit_price;
                            return row.TotalAmount;
                        } else {
                            row.TotalAmount = ''
                            return row.TotalAmount;
                        }
                    }
                },
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
                if (editor.field("ReceptionStatus").val() === '待确认') {
                    pceditor.inline(this, 'Loose_qty_rm', {
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

    //新增数据
    editor.on('initCreate', function (e, node, data) {
        //搜索条件下拉框
        var exdata = [];
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];
        var selectStore = [], selectPCGrid = [], selectDivision = [], selectDepartment = [], selectSubDepartment = [], selectClass = [];
        //var selectORType = [], selectORStatus = [], selectStore = [], selectPO_Types = [];
        // Get existing options
        if (table.rows('.selected', { select: true }).data().length > 0) {
            var exdata = table.rows('.selected', { select: true }).data()[0];
            //pctable.clear();
            //for (var i = 0; i < plist.length; i++) {
            //    plist[i].LineId = i + 1;
            //    pctable.row.add(plist[i])
                //console.log(index);
            //}
            //pctable.draw();
            //$('a[href="#tab-4"]').tab('show');

        }

        editor.field("POUniqueId").val(exdata.POUniqueId)
        editor.field("POTUniqueId").val(exdata.POTUniqueId)
        editor.field("SUUniqueId").val(exdata.SUUniqueId)
        editor.field("RecStoreUniqueId").val(exdata.RecStoreUniqueId)
        editor.field("STUniqueId").val(exdata.STUniqueId)

        editor.field("PONumber").val(exdata.PONumber)
        editor.field("RecStore").val(exdata.RecStore)
        editor.field("POTypeDesc").val(exdata.POTypeDesc)
        editor.field("ReceptionStatus").val(exdata.ReceptionStatus)
        editor.field("SUName").val(exdata.SUName)
        editor.field("UserName").val(exdata.UserName)
        editor.field("Supplier").update(selectSupplier)
        editor.field("ColorChart").update(selectColorChart)
        editor.field("SizeChart").update(selectSizeChart)
        editor.field("ProductType").update(selectProductType)
        editor.field("Season").update(selectSeason)
        editor.enable();

    });
    //修改数据
    editor.on('initEdit', function (e, node, data) {
        //搜索条件下拉框
        var exdata = [];
        var detaildata = [];
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];
        var selectStore = [], selectPOType = [], selectRecStore = [], selectSeason1 = [], selectSupplier1 = [];

        // Get existing options
        exdata = data
        
        if (exdata.POTypeDesc !== null) {
            switch (exdata.POTypeDesc) {
                case 'U': {
                    exdata.POTypeDesc = '紧急';
                    break;
                }
                case 'M': {
                    exdata.POTypeDesc = '手工';
                    break;
                }
                case 'G': {
                    exdata.POTypeDesc = '全局';
                    break;
                }
                case 'N': {
                    exdata.POTypeDesc = '正常';
                    break;
                }
                default: {
                    exdata.POTypeDesc;
                    break;
                }
            }
        }
        if (exdata.ReceptionStatus !== null) {
            switch (exdata.ReceptionStatus) {
                case 'L': {
                    exdata.ReceptionStatus = '已关闭';
                    editor.disable();
                    break;
                }
                case 'C': {
                    exdata.ReceptionStatus = '已确认';
                    editor.disable();
                    break;
                }
                case 'O': {
                    exdata.ReceptionStatus = '待确认';
                    editor.enable();
                    break;
                }
                case 'CA': {
                    exdata.ReceptionStatus = '已取消';
                    editor.disable();
                    break;
                }
                default: {
                    exdata.ReceptionStatus;
                    break;
                }
            }
        }
        editor.field("PONumber").val(exdata.PONumber)
        editor.field("RecStore").val(exdata.RecStore)
        editor.field("POTypeDesc").val(exdata.POTypeDesc)
        editor.field("ReceptionStatus").val(exdata.ReceptionStatus)
        editor.field("SUName").val(exdata.SUName)
        editor.field("UserName").val(exdata.UserName)
        editor.field("Supplier").update(selectSupplier)
        editor.field("ColorChart").update(selectColorChart)
        editor.field("SizeChart").update(selectSizeChart)
        editor.field("ProductType").update(selectProductType)
        editor.field("Season").update(selectSeason)
        /**
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
                            if (exdata.SUName !== data[item].label) {
                                selectSupplier1.push({ label: data[item].label, value: data[item].value });
                            } else {
                                selectSupplier1.unshift({ label: exdata.SUName, value: exdata.SUUniqueId });
                            }
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
                            if (exdata.Season !== data[item].label) {
                                selectSeason1.push({ label: data[item].label, value: data[item].value });
                            } else {
                                selectSeason1.unshift({ label: exdata.Season, value: exdata.SeasonUniqueId });
                            }
                            break;
                        }
                        case 'Store': {
                            if (exdata.Store !== data[item].label) {
                                selectStore.push({ label: data[item].label, value: data[item].value });
                            } else {
                                selectStore.unshift({ label: exdata.Store, value: exdata.StoreUniqueId });
                            }
                            if (exdata.RecStore !== data[item].label) {
                                selectRecStore.push({ label: data[item].label, value: data[item].value });
                            } else {
                                selectRecStore.unshift({ label: exdata.RecStore, value: exdata.RecStoreUniqueId });
                            }
                            break;
                        }
                        case 'PO_Types': {
                            if (exdata.PTName !== data[item].label) {
                                selectPOType.push({ label: data[item].label, value: data[item].value });
                            } else {
                                selectPOType.unshift({ label: exdata.PTName, value: exdata.PTUniqueId });
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
                editor.field("SEName").update(selectSeason1)
                editor.field("SUName").update(selectSupplier1)
                editor.field("PTName").update(selectPOType)
                editor.field("Store").update(selectStore)
                editor.field("RecStore").update(selectRecStore)
                editor.field("ORSCode").val(exdata.ORSCode)
            }
        });
        **/

        getproductdetail();

    });

    //初始化产品报表
    var table = $("#POTable").DataTable({
        processing: false,
        //dom: 'Bfrtip',
        lengthChange: false,
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "Id"},
        { "data": "PONumber" },
        { "data": "POTypeDesc" },
        { "data": "SUName" },
        {
            "data": "POCreationDate", "render": function (data, type, row) {
                if (data.length > 0) {
                    return data.substring(0, 10);
                }
            }
        },
        { "data": "RecStore" },
        { "data": "TotalQuantity" },
        { "data": "TotalAmount" },
        { "data": "POStatus" },
        { "data": "ReceptionStatus" },
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
            table.buttons().container().appendTo('#POTable_wrapper .col-sm-6:eq(0)');
            getpolist('O');

        },
        buttons: [
    {
        text: '新建', action: function (e, dt, node, config) {
            editor.create();
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
                    text: '已确认', action: function (e, dt, node, config) {
                        getpolist('C');
                    }
                },
                {
                    text: '待确认', action: function (e, dt, node, config) {
                        getpolist('O');
                    }
                }
        ]
    },

        ],
    });
    //定义按键根据记录是否能新建或者修改

    table.on('select', function (e,dt, type, indexes) {
        if (type = 'row') {
            var exdata = table.rows('.selected', { select: true }).data()[0];
            if (exdata.ReceptionStatus === '待收货') {
                table.button(0).enable();
                table.button(1).text('修改').disable();
            } else if (exdata.ReceptionStatus === '待确认') {
                table.button(0).disable();
                table.button(1).text('修改').enable();
            } else {
                table.button(0).disable();
                table.button(1).text('查看').enable();

            }

        }
    })


    //定义 Tab1 按键
    function tab1btn() {
        editor.buttons([
       {
           label: '保存', className: 'btn btn-primary', fn: function () {
               if (editor.field('PONumber').val().length > 0 && (editor.field('ReceptionStatus').val() !== '待确认' && editor.field('ReceptionStatus').val() !== '待收货')) {
                   this.blur();
               } else {
                   var param = {};
                   param.token = SecurityManager.generate();
                   param.username = SecurityManager.username;
                   param.POUniqueId= editor.field('POUniqueId').val(),
                   param.PONumber= editor.field('PONumber').val(),
                   param.RMNumber= editor.field('RMNumber').val()? editor.field('RMNumber').val(): null,
                   param.RecStoreUniqueId= editor.field('RecStoreUniqueId').val(),
                   param.CreationDate= editor.field('RMCreationDate').val(),
                   param.ModifiedDate = editor.field('RMModifiedDate').val()
                   param.Note= editor.field('Note').val(),
                   $.ajax({
                       "url": sysSettings.domainPath + "raymsp_Gatewaypayment_RM_header",
                       "async": true,
                       "crossDomain": true,
                       "type": "POST",
                       "dataType": "json",
                       "contentType": "application/json; charset=utf-8",
                       "data": JSON.stringify(param),
                       "success": function (data) {
                           if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                               getpolist('O');
                               getproductdetail();
                               editor.field('RMNumber').val(data.ResultSets[0][0]["RMNumber"]);
                               editor.field('RefRMNumber').val(data.ResultSets[0][0]["RefRMNumber"]);
                               editor.field('ReceptionStatus').val('待确认');
                               editor.message('保存成功').true;
                               //return false;
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
                            '<th>当前库存</th>' +
                            '<th>订单数量</th>' +
                            '<th>收货数量</th>' +
                            '<th>成本价</th>' +
                            '<th>零售价</th>' +
                            '<th>总成本</th>' +
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
        $(editor.node(['PONumber', 'RMNumber', 'RefRMNumber', 'RecStore', 'RMCreationDate', 'POTypeDesc', 'RMModifiedDate', 'ReceptionStatus', 'SUName', 'UserName', 'POReference', 'Note'])).appendTo('.tab-1');
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
                        if (editor.field('Code').val().length > 0) {
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
                        if (editor.field("Code").val().length > 0) {
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
                        if (editor.field("RMNumber").val().length > 0 && editor.field('ReceptionStatus').val() === '待确认') {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '保存', className: 'pcbtn', fn: function () {
                                        if (editor.field('RMNumber').val().length > 0 && editor.field('ReceptionStatus').val() !== '待确认') {
                                           return this.blur();
                                        }
                                        else if (pcval.length>0) {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.PCD = pcval;
                                            $.ajax({
                                                "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_RM_detail",
                                                "type": "POST",
                                                "async": true,
                                                "crossDomain": true,
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        data = data.ResultSets[0]
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
                                            editor.message('没有修改的数据需要保存').true;

                                        }

                                    }
                                },
                                {
                                    extend: 'tabbtn', label: '批准', className: 'pcbtn', fn: function () {

                                        if (editor.field('RMNumber').val().length > 0 && editor.field('ReceptionStatus').val() !== '待确认') {
                                                this.blur();
                                            } else {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.POUniqueId = editor.field('POUniqueId').val(),
                                            param.PONumber = editor.field('PONumber').val(),
                                            param.RMNumber = editor.field('RMNumber').val(),
                                            param.RecStoreUniqueId = editor.field('RecStoreUniqueId').val(),
                                            param.CreationDate = editor.field('RMCreationDate').val(),
                                            param.ModifiedDate = editor.field('RMModifiedDate').val(),
                                            param.ReceptionStatus='C',//确认收货
                                            $.ajax({
                                                "url": sysSettings.domainPath + "raymsp_Gatewaypayment_RM_header",
                                                "async": true,
                                                "crossDomain": true,
                                                "type": "POST",
                                                "dataType": "json",
                                                "contentType": "application/json; charset=utf-8",
                                                "data": JSON.stringify(param),
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[1][0]) !== 'undefined') {
                                                        if(data.ResultSets[1][0].ReceptionStatus==='C'){
                                                            editor.field('ReceptionStatus').val('已确认');
                                                            editor.disable();
                                                            $('#ProductDetailTable').off('click', 'tbody td.editable');
                                                            getpolist('O');
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

    function getproductdetail() {

        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        param.ponumber = editor.field("PONumber").val();

        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetRmListByAdvancedSearch",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                detaildata = data.ResultSets[0]

                /**
                for (var i = 0; i < detaildata.length; i++) {
                    param.Product_Id = detaildata[i].Product_Id
                    param.Color_Id = Number(detaildata[i].Color_Id)
                    param.Size_Id = Number(detaildata[i].Size_Id)
                    param.Store_Code_Id = 0
                    param.Store_Grid_Id = 0
                    param.Period_Date = 'LIFE'
                    $.ajax({
                        "url": sysSettings.domainPath + "rmSP_RAMS_GetProductSellThruByProduct",
                        "type": "POST",
                        "async": false,
                        "crossDomain": true,
                        "dataType": "json",
                        "contentType": "application/json; charset=utf-8",
                        "data": JSON.stringify(param),
                        "success": function (data) {
                            detaildata[i].OnHandQty = data.ResultSets[0][0].OnHandQty
                            detaildata[i].Qty = data.ResultSets[0][0].QtyOrdered

                        }

                    });

                }
                **/
                pctable.clear().draw();//重置产品明细列表
                detaildata.forEach(function (node) {
                    pctable.row.add(node);
                })
                pctable.draw();

                //if (editor.field("ORSCode").val() === "O" || editor.field("ORSCode").val() === "待确认") {
                //    editor.enable();
                //    $("a#li-tab3,a#li-tab2").css("display", "block");
                //} else {
                //    editor.disable();
                //    $("a#li-tab3,a#li-tab2").css("display", "none")
                //    $('#PriceChangeTable').off('click', 'tbody td.editable');
                //}

            }


        });
    }
    function getpolist(status) {
        var param = {
            "token": SecurityManager.generate(),
            "username": SecurityManager.username,
            "status":status,                
        }
        if (status === 'C') {
            table.button(1).text('查看');
            editor.disable();
        } else {
            table.button(1).text('修改');
            editor.enable();
        }
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_GetPOList",
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
                    switch (data[i].ReceptionStatus) {
                        case 'N':{
                            data[i].ReceptionStatus='待确认'
                            break;
                        }
                        case 'C': {
                            data[i].ReceptionStatus = '已确认'
                            break;
                        }
                        case null: {
                            data[i].ReceptionStatus = '待收货'
                            break;
                        }
                    }

                    switch (data[i].POStatus) {
                        case 'N': {
                            data[i].POStatus = '待确认'
                            break;
                        }
                        case 'Confirmed': {
                            data[i].POStatus = '已确认'
                            break;
                        }
                        case 'Closed': {
                            data[i].POStatus = '已关闭'
                            break;
                        }
                    }
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




