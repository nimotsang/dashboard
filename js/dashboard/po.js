$(document).ready(function () {
    //新增及修改调整
    var editor = new $.fn.dataTable.Editor({

        idSrc: 'ORHUniqueId',
        table: '#POTable',
        fields: [
            //调整-参数设置
            { label: 'ORHUniqueId: ', name: 'ORHUniqueId', type: 'hidden' },
            { label: 'ORTUniqueId: ', name: 'ORTUniqueId', type: 'hidden' },
            { label: 'ORSUniqueId: ', name: 'ORSUniqueId', type: 'hidden' },
            { label: 'StoreUniqueId: ', name: 'StoreUniqueId', type: 'hidden' },
            { label: 'RecStoreUniqueId: ', name: 'RecStoreUniqueId', type: 'hidden' },
            { label: 'SeasonUniqueId: ', name: 'SeasonUniqueId', type: 'hidden' },
            { label: 'PTUniqueId: ', name: 'PTUniqueId', type: 'hidden' },
            { label: 'SUUniqueId: ', name: 'SUUniqueId', type: 'hidden' },
            { label: 'STUniqueId: ', name: 'STUniqueId', type: 'hidden' },
            { label: '代码: ', name: 'Code', type:'readonly' },
            { label: '描述: ', name: 'Description' },
            {
                label: '创建日期: ', name: 'CreationDate',
                type: 'datetime',
                def: function () { return new Date(); },
                format: 'YYYY-MM-DD',
            },
            {
                label: '申请日期: ', name: 'RequestDate',
                type: 'datetime',
                def: function () { return new Date(); },
                format: 'YYYY-MM-DD',
            },
            { label: '门店: ', name: 'Store', type: 'select' },
            { label: '收货门店: ', name: 'RecStore', type: 'select' },
            { label: '状态: ', name: 'ORSCode', type: 'readonly' },
            { label: 'PO类型: ', name: 'PTName', type: 'select' },
            { label: '供应商: ', name: 'SUName', type: 'select' },
            { label: '季节: ', name: 'SEName', type: 'select' },
            { label: '用户: ', name: 'UserName', type:'readonly',def:SecurityManager.username},
            { label: '备注: ', name: 'PO_Reference', type: 'textarea', attr: {
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
                idSrc: 'LineId',
                table: '#ProductDetailTable',
                fields: [
                    { label: 'Color_UniqueId: ', name: 'Color_UniqueId', type: 'hidden' },
                    { label: 'Product_UniqueId: ', name: 'Product_UniqueId', type: 'hidden' },
                    { label: 'Size_UniqueId: ', name: 'Size_UniqueId', type: 'hidden' },
                    { label: '序号: ', name: 'LineId' },
                    { label: '序号: ', name: 'ProductCode' },
                    { label: '序号: ', name: 'ProductName' },
                    { label: '序号: ', name: 'Color' },
                    { label: '序号: ', name: 'Size' },
                    { label: '序号: ', name: 'Qty' },
                    { label: '序号: ', name: 'PurchasePrice' },
                    { label: '序号: ', name: 'RetailPrice' },
                    { label: '序号: ', name: 'TotalAmount' },
                    { label: '序号: ', name: 'ORSCode' },
                    { label: '序号: ', name: 'PoNumber' },
                ],



                ajax: function (method, url, data, success, error) {
                    // NOTE - THIS WILL WORK FOR EDIT ONLY AS IS
                    if (data.action === 'edit') {
                        success({
                            data: $.map(data.data, function (val, key) {
                                val.DT_RowId = key;
                                var nval = {};
                                nval.OrderRequestHeader = editor.field('ORHUniqueId').val();
                                nval.Store = editor.field('Store').val();
                                nval.RecStore = editor.field('RecStore').val();
                                nval.Product = val.Product_UniqueId;
                                nval.Color = val.Color_UniqueId;
                                nval.Size = val.Size_UniqueId;
                                nval.Qty = Number(val.Qty);
                                nval.LineId = Number(val.LineId);
                                nval.PurchasePrice = Number(val.PurchasePrice);
                                nval.RetailPrice = Number(val.RetailPrice);
                                nval.TotalAmount = Number(nval.Qty*nval.PurchasePrice);
                                nval.OrderRequestStatus = editor.field('ORSUniqueId').val();
                                nval.OrderRequestType = editor.field('ORTUniqueId').val();

                                if (pcval.length > 0) {
                                    for (x in pcval) {
                                        if (pcval[x].Product === nval.Product && pcval[x].Color === nval.Color && pcval[x].Size === nval.Size) {
                                            if (nval.Qty !== 0) {
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
                                    if (nval.Qty !== 0) {
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
                { "data": "LineId"},
                { "data": "ProductCode"},
                { "data": "ProductName"},
                { "data": "Color"},
                { "data": "Size"},
                { "data": "Qty", "defaultContent": "编辑数量", "className": 'editable'},
                { "data": "PurchasePrice"},
                { "data": "RetailPrice"},
                {
                    "data": function (row, type, val, meta) {
                        if ((type === 'set' || type === 'display') && typeof (row.Qty) !== "undefined") {
                            row.TotalAmount = row.Qty * row.PurchasePrice;
                            return row.TotalAmount;
                        }else {
                            return '';
                        }
                    }
                },
                {
                    "data": function (row, type, val, meta) {
                        if ((type === 'set' || type === 'display') && typeof (row.ORSCode) !== "undefined") {
                            switch (row.ORSCode) {
                                case 'L': {
                                    return row.ORSCode = '已关闭'
                                    break;
                                }
                                case 'C': {
                                    return row.ORSCode = '已确认';
                                    break;
                                }
                                case 'O': {
                                    return row.ORSCode = '待确认';
                                    break;
                                }
                                case 'CA': {
                                    return row.ORSCode = '已取消';
                                    break;
                                }
                                default: {

                                    return row.ORSCode;
                                    break;
                                }
                            }
                        } else {
                            row.ORSCode = '待确认'
                            return row.ORSCode;
                        }
                    }
                },
                {
                    "data": function (row, type, val, meta) {
                        if ((type === 'set' || type === 'display') && typeof (row.PoNumber) !== "undefined") {
                            return row.PoNumber;
                        }else {
                            return '';
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
    editor.on('initCreate', function (e, node, data) {
        //搜索条件下拉框
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];
        var selectStore = [], selectPCGrid = [], selectDivision = [], selectDepartment = [], selectSubDepartment = [], selectClass = [];
        var selectORType = [], selectORStatus = [], selectStore = [], selectPO_Types = [];
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
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
                        case 'ORType': {
                            selectORType.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'ORStatus': {
                            if (data[item].label === 'O') {
                                selectORStatus.unshift({ label: data[item].label, value: data[item].value })

                            } else {
                                selectORStatus.push({ label: data[item].label, value: data[item].value });
                            }
                            break;
                        }
                        case 'Store': {
                            selectStore.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'PO_Types': {
                            if (data[item].label === 'Suggested') {
                                selectPO_Types.unshift({ label: data[item].label, value: data[item].value });
                            } else {
                                selectPO_Types.push({ label: data[item].label, value: data[item].value });
                            }
                            break;
                        }
                    }
                };
                //editor.field("OrderRequestStatus").update(selectORStatus)
                editor.field("PTName").update(selectPO_Types)
                editor.field("Store").update(selectStore)
                editor.field("RecStore").update(selectStore)
                editor.field("SUName").update(selectSupplier)
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("ProductType").update(selectProductType)
                editor.field("SEName").update(selectSeason)
                editor.field("Season").update(selectSeason)
                editor.field("ORSUniqueId").val(selectORStatus[0].value)
                editor.field("ORSCode").val('待确认')
            }

        });

        editor.enable();


    });
    //修改数据
    editor.on('initEdit', function (e, node, data) {
        //搜索条件下拉框
        var exdata = [];
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];
        var selectStore = [], selectPOType = [], selectRecStore = [], selectSeason1 = [], selectSupplier1 = [];
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        // Get existing options
        exdata = data
        if (exdata.ORTCode !== null) {
            switch (exdata.ORTCode) {
                case 'U': {
                    exdata.ORTCode = '紧急';
                    break;
                }
                case 'M': {
                    exdata.ORTCode = '手工';
                    break;
                }
                case 'G': {
                    exdata.ORTCode = '全局';
                    break;
                }
                case 'N': {
                    exdata.ORTCode = '正常';
                    break;
                }
                default: {
                    exdata.ORTCode;
                    break;
                }
            }
        }
        if (exdata.ORSCode !== null) {
            switch (exdata.ORSCode) {
                case 'L': {
                    exdata.ORSCode = '已关闭';
                    editor.disable();
                    break;
                }
                case 'C': {
                    exdata.ORSCode = '已确认';
                    editor.disable();
                    break;
                }
                case 'O': {
                    exdata.ORSCode = '待确认';
                    editor.enable();
                    break;
                }
                case 'CA': {
                    exdata.ORSCode = '已取消';
                    editor.disable();
                    break;
                }
                default: {
                    exdata.ORSCode;
                    break;
                }
            }
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


        param.orhuniqueid = editor.field("ORHUniqueId").val();

        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentPORDetail_Get",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                data = data.ResultSets[0]
                pctable.clear().draw();//重置产品明细列表
                data.forEach(function (node) {
                    pctable.row.add(node);
                })
                pctable.draw();

                if (editor.field("ORSCode").val() === "O" || editor.field("ORSCode").val() === "待确认") {
                    editor.enable();
                    $("a#li-tab3,a#li-tab2").css("display", "block");
                } else {
                    editor.disable();
                    $("a#li-tab3,a#li-tab2").css("display", "none")
                    $('#PriceChangeTable').off('click', 'tbody td.editable');
                }

            }


        });

    });

    //初始化产品报表
    table = $("#POTable").DataTable({
        processing: false,
        //dom: 'Bfrtip',
        lengthChange: false,
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "Id"},
        { "data": "Code" },
        { "data": "Description" },
        {
            "data": "ORTCode", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case 'U': {
                            return data = '紧急';
                            break;
                        }
                        case 'M': {
                            return data = '手工';
                            break;
                        }
                        case 'G': {
                            return data = '全局';
                            break;
                        }
                        case 'N': {
                            return data = '正常';
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
        {
            "data": "ORSCode", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case 'L': {
                            return data = '已关闭';
                            break;
                        }
                        case 'C':{
                            return data = '已确认';
                            break;
                        }
                        case 'O':{
                            return data = '待确认';
                            break;
                        }
                        case 'CA':{
                            return data = '已取消';
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
        {
            "data": "RequestDate", "render": function (data, type, row) {
                if (data.length > 0) {
                    return data.substring(0, 10);
                }
            }
        },
        { "data": "SUName" },
        { "data": "PoNumber" },
        { "data": "Qty" },
        { "data": "TotalAmount" },
        { "data": "UserName" }
        ],
        ajax: {
            "url": sysSettings.domainPath + "RaymSP_GatewaypaymentPORequestGet",
            "async": true,
            "crossDomain": true,
            "type": "POST",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": function () {
                var param = {
                    "token": SecurityManager.generate(),
                    "username": SecurityManager.username,
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
            table.buttons().container().appendTo('#POTable_wrapper .col-sm-6:eq(0)');

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
               if (editor.field('Code').val().length > 0 && editor.field('ORSCode').val() !== '待确认') {
                   this.blur();
               } else {
                   var param = {};
                   param.token = SecurityManager.generate();
                   param.username = SecurityManager.username;
                   param.code= editor.field('Code').val()? editor.field('Code').val(): null,
                   param.description= editor.field('Description').val(),
                   param.or_status= editor.field('ORSUniqueId').val(),
                   param.requestdate= editor.field('RequestDate').val(),
                   param.creationdate= editor.field('CreationDate').val(),
                   param.store = editor.field('Store').val()
                   param.recstore= editor.field('RecStore').val(),
                   param.supplier= editor.field('SUName').val(),
                   param.season= editor.field('SEName').val(),
                   param.po_types = editor.field('PTName').val(),
                   param.po_reference = editor.field('PO_Reference').val()
                   $.ajax({
                       "url": sysSettings.domainPath + "Gatewaypayment_PORequest_header",
                       "async": true,
                       "crossDomain": true,
                       "type": "POST",
                       "dataType": "json",
                       "contentType": "application/json; charset=utf-8",
                       "data": JSON.stringify(param),
                       "success": function (data) {
                           if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                               table.draw();
                               editor.field('Code').val(data.ResultSets[0][0]["Code"]);
                               editor.field('ORHUniqueId').val(data.ResultSets[0][0]["ORHUniqueId"]);
                               editor.field('ORSUniqueId').val(data.ResultSets[0][0]["ORSUniqueId"]);
                               editor.field('ORTUniqueId').val(data.ResultSets[0][0]["ORTUniqueId"]);
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
                            '<th>数量</th>' +
                            '<th>采购价</th>' +
                            '<th>零售价</th>' +
                            '<th>总采购价</th>' +
                            '<th>状态</th>' +
                            '<th>PO单号</th>' +
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
        $(editor.node(['Code', 'Description', 'RequestDate','CreationDate',  'Store', 'RecStore', 'ORSCode', 'PTName', 'SUName', 'SEName', 'UserName', 'PO_Reference'])).appendTo('.tab-1');
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
                        if (editor.field("Code").val().length > 0 && editor.field('ORSCode').val() === '待确认') {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '保存', className: 'pcbtn', fn: function () {
                                        if (editor.field('Code').val().length > 0 && editor.field('ORSCode').val() !== '待确认') {
                                           return this.blur();
                                        }
                                        else if (pcval.length>0) {
                                            var param = {};
                                            param.token = SecurityManager.generate();
                                            param.username = SecurityManager.username;
                                            param.PCD = pcval;
                                            $.ajax({
                                                "url": sysSettings.domainPath + "RaymSP_Gatewaypayment_PORequest_detail",
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
                                            editor.message('没有需要保存的数据').true;

                                        }

                                    }
                                },
                                {
                                    extend: 'tabbtn', label: '批准', className: 'pcbtn', fn: function () {

                                        if (editor.field('Code').val().length > 0 && editor.field('ORSCode').val() !== '待确认') {
                                                this.blur();
                                            } else {
                                                var param = {};
                                                param.token = SecurityManager.generate();
                                                param.username = SecurityManager.username;
                                                param.tbName = 'RAMS_OrderRequestStatus '
                                                param.whName = 'Code=' + '\'' + 'C' + '\'';
                                                param.colName = 'UniqueId';

                                                //获取OrderRequestStatus 状态为Confirm的UniqueId 
                                                $.ajax({
                                                    "url": sysSettings.domainPath + "Raymsp_GatewaypaymentGetData",
                                                    "async": true,
                                                    "crossDomain": true,
                                                    "type": "POST",
                                                    "dataType": "json",
                                                    "contentType": "application/json; charset=utf-8",
                                                    "data": JSON.stringify(param),
                                                    "success": function (data) {
                                                        if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                            //删除table对象
                                                            delete param.tbName
                                                            delete param.whName
                                                            delete param.colName;
                                                            //添加Confirm状态的ORS UniqueId
                                                            param.or_status = data.ResultSets[0][0].UniqueId
                                                            param.code = editor.field('Code').val()
                                                            param.description = editor.field('Description').val()
                                                            param.requestdate = editor.field('RequestDate').val()
                                                            param.creationdate = editor.field('CreationDate').val()
                                                            param.store = editor.field('Store').val()
                                                            param.recstore = editor.field('RecStore').val()
                                                            param.supplier = editor.field('SUName').val()
                                                            param.season = editor.field('SEName').val()
                                                            param.po_types = editor.field('PTName').val()
                                                            param.po_reference = editor.field('PO_Reference').val();

                                                            $.ajax({
                                                                "url": sysSettings.domainPath + "Gatewaypayment_PORequest_header",
                                                                "async": true,
                                                                "crossDomain": true,
                                                                "type": "POST",
                                                                "dataType": "json",
                                                                "contentType": "application/json; charset=utf-8",
                                                                "data": JSON.stringify(param),
                                                                "success": function (data) {
                                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                                        editor.field('ORSCode').val('已关闭');

                                                                        editor.disable();
                                                                        $("a#li-tab3,a#li-tab2").css("display", "none")
                                                                        $('#PriceChangeTable').off('click', 'tbody td.editable');
                                                                        table.ajax.reload();
                                                                        table.draw();
                                                                        //pctable.ajax.reload();
                                                                        //pctable.draw();
                                                                        $('a[href="#tab-1"]').tab('show');
                                                                        editor.message('审批成功').true;
                                                                        return false;
                                                                        //ptable.buttons.info('Notification', 'This is a notification message!', 3000);
                                                                        //table.row('#'+ data.ResultSets[0][0].session_number).remove();
                                                                        //table.row.add(data.ResultSets[0][0]).draw();

                                                                    }
                                                                }
                                                            })
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


});




