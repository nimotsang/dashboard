$(document).ready(function () {
    var editor = new $.fn.dataTable.Editor({

        ajax: {

            "edit": {
                "url": sysSettings.domainPath + "Raymsp_GatewayPaymentProduct_Generate",
                "type": "POST",
                "async": true,
                "crossDomain": true,
                "data": function () {                  
                        var param = {
                            "token": SecurityManager.generate(),
                            "username": SecurityManager.username,
                            "sku": editor.field('ProductCode').val(),
                            "Short_name": editor.field('ProductCode').val(),
                            "price": editor.field('ProductCode').val(),
                            "Long_name": editor.field('ProductCode').val()
                        }
                        return param;
                    } 
            },
            "create": {

                "url": sysSettings.domainPath + "Raymsp_GatewayPaymentProduct_Generate",
                "type": "POST",
                "data": function () {
                    var param = {
                        "token": SecurityManager.generate(),
                        "username": SecurityManager.username,
                        "sku": editor.field('ProductCode').val(),
                        "Short_name": editor.field('ProductCode').val(),
                        "price": editor.field('ProductCode').val(),
                        "Long_name": editor.field('ProductCode').val()
                    }
                    return param;
                }
            }
        },
        idSrc: 'ProductCode',
        table: '#Product2Table',
        fields: [
            { label: '产品代码: ', name: 'ProductCode' },
            { label: '产品名称: ', name: 'ProductName' },
            { label: '颜色组: ', name: 'ColorChart', type:'select' },
            { label: '尺码组: ', name: 'SizeChart', type: 'select' },
            { label: '周期: ', name: 'LifeCycle', type: 'select' },
            { label: '供应商: ', name: 'Supplier', type: 'select' },
            { label: '产品类别: ', name: 'ProductType', type: 'select' },
            { label: '季节: ', name: 'Season', type: 'select' },
            { label: '产品层级(一): ', name: 'Division' },
            { label: '产品层级(二): ', name: 'Department' },
            { label: '产品层级(三): ', name: 'SubDepartment' },
            { label: '产品层级(四): ', name: 'Class' },
            { label: '附加属性: ', name: 'KnowHow', type: 'select' },
            { label: '零售价: ', name: 'RetailPrice' },
            { label: '成本价: ', name: 'CostPrice' },
            { label: 'ProductUniqueId: ', name: 'ProductUniqueId' }
        ],
        //自定义语言
        i18n: {
            "create": {
                "button": '新增',
                "title": '新增产品',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '产品管理',
                "submit": '提交'
            },
            "multi": {
                "title": "批量修改",
                "info": "批量修改帮助您将所选单元格中的值修改为同一值，要继续修改请单击按钮",
                "restore": "取消修改"
            }
        }
    });

    editor.on('open displayOrder', function (e, mode, action) {
        if (mode === 'main' && action !== 'remove') {
            //add customized CSS and style
            $('div.modal-dialog').addClass('product-column');
            $('div.DTE_Body').addClass('product-column-body');
            $('div.DTE_Field').addClass('product-column-feild');
            $('div.DTE_Header.modal-header').css("border-bottom", "0px");
        }

    })
    editor.hide('ProductUniqueId');

    // Format data 
    editor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0];

    });

    editor.on('initEdit', function (e, node, data) {
        editor.disable(["ProductCode"]);
        var exdata=[];
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];

        // Get existing options
        exdata = data

        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentProduct_Get",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "data": {
                "token": SecurityManager.generate(),
                "username": SecurityManager.username
            },
            "success": function (data) {
                data = data.ResultSets[0]
                for (var item in data) {
                    if (data[item].table === 'Supplier') {
                        if (data[item].label === exdata.Supplier) {
                            selectSupplier.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectSupplier.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                    if (data[item].table === 'ColorChart') {
                        if (data[item].label === exdata.ColorChart) {
                            selectColorChart.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectColorChart.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                    if (data[item].table === 'SizeChart') {
                        if (data[item].label === exdata.SizeChart) {
                            selectSizeChart.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectSizeChart.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                    if (data[item].table === 'LifeCycle') {
                        if (data[item].label === exdata.LifeCycle) {
                            selectLiftCycle.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectLiftCycle.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                    if (data[item].table === 'ProductType') {
                        if (data[item].label === exdata.ProductType) {
                            selectProductType.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectProductType.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                    if (data[item].table === 'Season') {
                        if (data[item].label === exdata.Season) {
                            selectSeason.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectSeason.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                    if (data[item].table === 'KnowHow') {
                        if (data[item].label === exdata.KnowHow) {
                            selectKnowHow.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectKnowHow.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                }
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("LifeCycle").update(selectLiftCycle)
                editor.field("ProductType").update(selectProductType)
                editor.field("Season").update(selectSeason)
                editor.field("KnowHow").update(selectKnowHow);


            }

        })
    });

    editor.on('initCreate', function (e, node, data){
        editor.enable(["ProductCode"]);
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];


        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentProduct_Get",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "data": {
                "token": SecurityManager.generate(),
                "username": SecurityManager.username
            },
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
                        case 'LifeCycle': {
                            selectLiftCycle.push({ label: data[item].label, value: data[item].value });
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
                        case 'KnowHow': {
                            selectKnowHow.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                    }
                };
                /**
                                for (var item in data) {
                                    if (data[item].table === 'Supplier') {
                                        selectSupplier.push({ label: data[item].label, value: data[item].value });
                                    }
                                    if (data[item].table === 'ColorChart') {
                                        selectColorChart.push({ label: data[item].label, value: data[item].value });
                                    }
                                    if (data[item].table === 'SizeChart') {
                                        selectSizeChart.push({ label: data[item].label, value: data[item].value });
                                    }
                                    if (data[item].table === 'LifeCycle') {
                                        selectLiftCycle.push({ label: data[item].label, value: data[item].value });
                                    }
                                    if (data[item].table === 'ProductType') {
                                        selectProductType.push({ label: data[item].label, value: data[item].value });
                                    }
                                    if (data[item].table === 'Season') {
                                        selectSeason.push({ label: data[item].label, value: data[item].value });
                                    }
                                    if (data[item].table === 'KnowHow') {
                                        selectKnowHow.push({ label: data[item].label, value: data[item].value });
                                    }
                                }
                **/
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("LifeCycle").update(selectLiftCycle)
                editor.field("ProductType").update(selectProductType)
                editor.field("Season").update(selectSeason)
                editor.field("KnowHow").update(selectKnowHow);
            }

        });

        editor.field('ProductCode').input().on('blur', function () {
            var ProductCode = editor.field('ProductCode');
            if (ProductCode.val()) {
                var whName = 'Product_Code =' + '"'+ ProductCode.val() + '"';
                $.ajax({
                    "url": sysSettings.domainPath + "Raymsp_GatewaypaymentGetData",
                    "type": "POST",
                    "async": true,
                    "crossDomain": true,
                    "data": {
                        "token": SecurityManager.generate(),
                        "username": SecurityManager.username,
                        "colName": 'Product_Code',
                        "tbName": 'Product',
                        "whName": whName
                    },
                    "success": function (data) {
                        if (data.ResultSets[0][0]) {
                            editor.field('ProductCode').focus()
                            editor.error('ProductCode', '产品代码已经存在，请重新输入');    
                        } else {
                            if (editor.field('ProductCode').inError()) {
                                editor.field('ProductCode').error('');
                            }
                        }
                    }
                });
            }
        })
        if (this.inError()) {
            return false;
        }

    });

    //初始化报表
    var table = $("#Product2Table").DataTable({
        processing: false,
        dom: 'Bfrtip',
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "ProductCode" },
        { "data": "ProductName" },
        { "data": "ColorChart" },
        { "data": "SizeChart" },
        { "data": "RetailPrice" },
        { "data": "CostPrice" },
        { "data": "Season" },
        { "data": "Supplier" },
        ],
        "columnDefs": [
            { "width": "10%", "targets": 0 },
            { "width": "25%", "targets": 1 },
            { "width": "10%", "targets": 2 },
            { "width": "10%", "targets": 3 },
            { "width": "10%", "targets": 4 },
            { "width": "10%", "targets": 5 },
            { "width": "10%", "targets": 6 }
        ], 
        ajax: {
            "url": sysSettings.domainPath + "Raymsp_GatewaypaymentGetData",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "data": {
                "token": SecurityManager.generate(),
                "username": SecurityManager.username,
                "colName": 'ProductUniqueId, ProductCode, ProductName, ColorChart,SizeChart,RetailPrice, CostPrice, Season, Supplier',
                "tbName": 'V_RAMS_SearchProductByKeyword'

            },
            "dataType": "json",
            "dataSrc": function (data) {
                data = data.ResultSets[0]
                return data;

            }
        },

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


        ]
    });
});




