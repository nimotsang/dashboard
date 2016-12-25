$(document).ready(function () {
    //新增及修改价格调整
    var editor = new $.fn.dataTable.Editor({

        idSrc: 'session_number',
        table: '#PriceTable',
        fields: [
            //价格调整-参数设置
            { label: '序号: ', name: 'session_number' },
            { label: '描述: ', name: 'description' },
            {
                label: '类型: ', name: 'session_type', type: 'select', placeholder: '未定义', options: [
                  { label: '调低价格', value: 0 },
                  { label: '折扣', value: 1 },
                  { label: '调高价格', value: 2 },
                  { label: '初始化', value: 3 }
                ],
            },
            {
                label: '状态: ', name: 'session_status', type: 'select', placeholder: '未定义', options: [
                    { label: '编辑中', value: 0 },
                    { label: '已取消', value: 1 },
                    { label: '已审核', value: 2 }
                ],
            },
            {
                label: '开始日期: ', name: 'start_date',
                type: 'datetime',
                def: function () { return new Date(); },
                format: 'YYYY-MM-DD hh:mm:ss a',
            },
            {
                label: '结束日期: ', name: 'end_date',
                type: 'datetime',
                format: 'YYYY-MM-DD hh:mm:ss a',
            },
            { label: '门店名称: ', name: 'store_name', type:'select'},
            { label: '级别名称: ', name: 'grid_name',type:'select' },


            //价格调整-产品查询条件
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
                "title": '新增价格调整',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '价格调整管理',
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
    //价格调整主表
    var table;
    //产品明细调整编辑器
    var pceditor;
    //产品表
    var ptable;
    //价格调整明细表
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

            //产品明细-价格调整
            pceditor = new $.fn.dataTable.Editor({
                idSrc: 'ProductCode',
                table: '#PriceChangeTable',
                fields: [
                    { label: '序号: ', name: 'Sequence_number' },
                    { label: '序号: ', name: 'Product_ID' },
                    { label: '序号: ', name: 'ProductCode' },
                    { label: '描述: ', name: 'ProductName' },
                    { label: '类型: ', name: 'Color' },
                    { label: '类型: ', name: 'Color_ID' },
                    { label: '状态: ', name: 'Size' },
                    { label: '类型: ', name: 'Size_ID' },
                    { label: '状态: ', name: 'NewPrice' },
                    { label: '状态: ', name: 'OldPrice' },
                    { label: '状态: ', name: 'LandedCost' },
                    { label: '价格编辑条件: ', name: 'PriceEditCondition' },

                ],

                ajax: function (method, url, data, success, error) {
                    // NOTE - THIS WILL WORK FOR EDIT ONLY AS IS
                    if (data.action === 'edit') {
                        var pcval = $.map(data.data, function (val, key) {
                            val.DT_RowId = key;
                            var nval = {};
                            //nval.token = SecurityManager.generate();
                            nval.username = SecurityManager.username;
                            nval.session_number = editor.field('session_number').val();
                            nval.sequence_number = val.Sequence_number;
                            nval.product_id = val.Product_ID;
                            nval.color_id = val.Color_ID;
                            nval.size_id = val.Size_ID;
                            nval.old_price = val.OldPrice;
                            nval.new_price = val.NewPrice;
                            nval.store_code_id = editor.field('store_name').val();
                            nval.Store_Grid_Id = editor.field('grid_name').val();
                            nval.Ledger = 'N';
                            nval.ExchangeRate = 0;
                            nval.AvailableQuantity = null;
                            return (nval);
                        });
                        $.ajax({
                            "url": sysSettings.domainPath + "Gatewaypayment_Price_change_detail1",
                            "type": "POST",
                            "async": true,
                            "crossDomain": true,
                            "dataType": "json",
                            "Content-Type": "application/json",
                            "data": pcval[0], 
                            "success":function(json){

                                json.data = json.ResultSets[0];
                                success(json)
                            }
                        })
                    }
                }
            });

            editor.on('postSubmit', function (e, json) {
                json.data = json.ResultSets[0];
            });
                        /**    
                        success({
                            data: $.map(data.data, function (val, key) {
                                val.DT_RowId = key;
                                var nval = {};
                                nval.session_number = editor.field('session_number').val();
                                nval.sequence_number = val.Sequence_number;
                                nval.product_id = val.Product_ID;
                                nval.color_id = val.Color_ID;
                                nval.size_id = val.Size_ID;
                                nval.old_price = val.OldPrice;
                                nval.new_price = val.NewPrice;
                                nval.store_code_id = editor.field('store_name').val();
                                nval.Store_Grid_Id = editor.field('grid_name').val();
                                nval.Ledger = 'N';
                                nval.ExchangeRate = 0;
                                nval.AvailableQuantity = null;

                                //nval.token = SecurityManager.generate();
                                //nval.username = SecurityManager.username;
                                if (pcval.length > 0) {
                                    for (x in pcval) {
                                        if (pcval[x].product_id === nval.product_id && pcval[x].color_id === nval.color_id && pcval[x].size_id === nval.size_id) {
                                            pcval.splice(x, 1, nval);
                                        } else if (pcval.length - 1 > 0) {
                                            continue;
                                        } else {
                                            pcval.push(nval);
                                        }
                                    }
                                }
                                else {
                                    pcval.push(nval);
                                }
                                console.log(pcval)
                                pctable.draw();
                                return val;
                            })
                        });
                    }
                }


            });
            **/
            //初始化报表-价格调整明细
            pctable = $("#PriceChangeTable").DataTable({
                processing: true,
                //dom: 'Bfrtip',
                lengthChange: false,
                select: false,
                order: [[0, "asc"]],
                columns: [
                { "data": "Sequence_number" },
                { "data": "ProductCode" },
                { "data": "ProductName" },
                { "data": "Color" },
                { "data": "Size" },
                { "data": "NewPrice", "defaultContent": "编辑价格", "className": 'editable' },
                { "data": "OldPrice" }
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

            $('#PriceChangeTable').on('click', 'tbody td.editable', function (e) {
                pceditor.inline(this, {
                    onBlur: 'submit',
                    //onComplete:'none',
                    submit: 'all',
                    //onReturn: 'none',
                    //onBackground: close
                });
            });


        }


    });

    //新增数据
    editor.on('initCreate', function (e, node, data) {
        //搜索条件下拉框
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];
        var selectStore = [], selectPCGrid = [], selectDivision = [], selectDepartment = [], selectSubDepartment = [], selectClass = [];
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
                        case 'ProductType': {
                            selectProductType.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                        case 'Season': {
                            selectSeason.push({ label: data[item].label, value: data[item].value });
                            break;
                        }
                    }
                };
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("ProductType").update(selectProductType)
                editor.field("Season").update(selectSeason)

            }

        });

        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentMerchant_Get",
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
                        case 'Store': {
                            selectStore.push({ label: data[item].label, value: data[item].ext1 });
                            break;
                        }
                        case 'PCGrid': {
                            selectPCGrid.push({ label: data[item].label, value: data[item].ext1 });
                            break;
                        }
                    }
                };
                //默认门店为空
                selectStore.unshift({ label: '', value: '' });
                editor.field("store_name").update(selectStore)
                editor.field("grid_name").update(selectPCGrid)
                editor.enable();
                editor.disable(["session_number", "session_status"]);
            }

        });
    });
    //修改数据
    editor.on('initEdit', function (e, node, data) {
        //搜索条件下拉框
        var exdata = [];
        var selectColorChart = [], selectSizeChart = [], selectLiftCycle = [], selectSupplier = [], selectProductType = [], selectSeason = [], selectDevision = [], selectDepartment = [], selectClass = [], selectKnowHow = [];
        var selectStore = [], selectPCGrid = [], selectDivision = [], selectDepartment = [], selectSubDepartment = [], selectClass = [];
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
                    }
                };
                editor.field("Supplier").update(selectSupplier)
                editor.field("ColorChart").update(selectColorChart)
                editor.field("SizeChart").update(selectSizeChart)
                editor.field("ProductType").update(selectProductType)
                editor.field("Season").update(selectSeason)

            }

        });

        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentMerchant_Get",
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
                        case 'Store': {
                            if (data[item].label === exdata.store_name) {
                                selectStore.unshift({ label: data[item].label, value: data[item].value });
                                break;
                            } else{
                                selectStore.push({ label: data[item].label, value: data[item].value });
                                break;
                            }
                        }
                        case 'PCGrid': {
                            if (data[item].label === exdata.grid_name) {
                                selectPCGrid.unshift({ label: data[item].label, value: data[item].ext1 });
                                break;
                            } else {
                                selectPCGrid.push({ label: data[item].label, value: data[item].ext1 });
                                break;
                            }
                        }
                    }
                };

                if (exdata.store_name.length === 0) {
                    selectStore.unshift({ label: exdata.store_name, value: '' });
                    editor.field("store_name").update(selectStore)
                } else {
                    editor.field("store_name").update(selectStore)
                };

                editor.field("grid_name").update(selectPCGrid)
                //Session_Type
                for (var i = 0; i < editor.field("session_type").input()[0].length; i++) {
                    if (editor.field("session_type").input()[0][i].text === exdata.session_type) {
                        editor.field("session_type").val(editor.field("session_type").input()[0][i].value)
                    }
                }
                //Session_Status
                for (var i = 0; i < editor.field("session_status").input()[0].length; i++) {
                    if (editor.field("session_status").input()[0][i].text === exdata.session_status) {
                        editor.field("session_status").val(editor.field("session_status").input()[0][i].value)
                    }
                }
                editor.field("start_date").val(exdata.start_date)
                if (editor.field("session_status").val() === 2) {
                    editor.disable();
                    $("a#li-tab3,a#li-tab2").css("display", "none")
                    $('#PriceChangeTable').off('click', 'tbody td.editable');
                } else {
                    editor.enable();
                    editor.disable(["session_number", "session_status"]);
                    $("a#li-tab3,a#li-tab2").css("display", "block");
                }
            }
            
        });
        var tbName = 'price_change_detail pcd ' +
        'INNER JOIN [dbo].Price_Cost_Detail pcosd on pcd.product_id=pcosd.Product_id ' +
        'INNER JOIN [dbo].product as prod on pcd.product_id=prod.Product_id ' +
        'INNER JOIN [dbo].PRODUCT_NAME pron on pcd.product_id=pron.Product_ID ' +
        'LEFT JOIN [dbo].color_sequence colse on pcd.Color_id=colse.color_id ' +
        'LEFT JOIN [dbo].color col on colse.color_id= col.color_id ' +
        'LEFT JOIN [dbo].size_sequence sizse on pcd.Size_id=sizse.size_id ' +
        'LEFT JOIN [dbo].size siz on sizse.size_id=siz.size_id';
        var condition = 'session_number=' + exdata.session_number;
        $.ajax({
            "url": sysSettings.domainPath + "Raymsp_GatewaypaymentGetData",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "data": {
                "token": SecurityManager.generate(),
                "username": SecurityManager.username,
                "colName": 'Session_number, pcd.sequence_number as Sequence_number, prod.product_code as ProductCode, pcd.product_id as Product_ID, pcd.color_id as Color_ID, pcd.size_id as Size_ID, pron.Short_name as ProductName,col.description as Color, siz.description as Size, new_price as NewPrice, old_price as OldPrice, pcosd.Landed_Cost as LandedCost',
                "tbName": tbName,
                "whName": condition

            },
            "dataType": "json",
            "success": function (data) {
                data = data.ResultSets[0]
                pctable.clear().draw();//重置产品明细列表
                data.forEach(function (node) {
                    pctable.row.add(node);
                })
                pctable.draw();

            }


        });
    });

    //初始化价格报表
    table = $("#PriceTable").DataTable({
        processing: false,
        //dom: 'Bfrtip',
        lengthChange: false,
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "session_number" },
        { "data": "description" },
        {
            "data": "session_type", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case 0:{
                            return data = '调低价格';
                            break;
                        }
                        case 1:{
                            return data = '折扣';
                            break;
                        }
                        case 2:{
                            return data = '调高价格';
                            break;
                        }
                        case 3:{
                            return data = '初始化';
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
            "data": "session_status", "render": function (data, type, row) {
                if (data !== null) {
                    switch (data) {
                        case 0: {
                            return data = '编辑中';
                            break;
                        }
                        case 1: {
                            return data = '已取消';
                            break;
                        }
                        case 2: {
                            return data = '已审核';
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
        { "data": "start_date" },
        { "data": "end_date" },
        { "data": "store_name" },
        { "data": "grid_name" },
        ],
        ajax: {
            "url": sysSettings.domainPath + "RaymSP_GatewaypaymentPriceGet",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "data": {
                "token": SecurityManager.generate(),
                "username": SecurityManager.username
            },
            "dataType": "json",
            "dataSrc": function (data) {
                data = data.ResultSets[0]
                return data;

            }
        },
        rowId:'session_number',
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
            table.buttons().container().appendTo('#PriceTable_wrapper .col-sm-6:eq(0)');

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
               if (editor.field('session_number').val().length > 0 && editor.field('session_status').val() === 2) {
                   this.blur();
               } else {
                   $.ajax({
                       "url": sysSettings.domainPath + "Gatewaypayment_Price_change_header",
                       "type": "POST",
                       "async": true,
                       "crossDomain": true,
                       "data": {
                           "token": SecurityManager.generate(),
                           "username": SecurityManager.username,
                           "session_number": editor.field('session_number').val(),
                           "description": editor.field('description').val(),
                           "session_type": editor.field('session_type').val(),
                           "session_status": editor.field('session_status').val(),
                           "start_date": editor.field('start_date').val(),
                           "end_date": editor.field('end_date').val(),
                           "store_name": editor.field('store_name').val(),
                           "grid_name": editor.field('grid_name').val()

                       },
                       "success": function (data) {
                           if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                               table.draw();
                               editor.message('保存成功').true;
                               
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
        /** 创建 产品Tabs (搜索条件，列表及价格调整) **/
        var html = '<div class="tabs-container">' +
                    '<ul class="nav nav-tabs">' +
                        '<li class="active"><a data-toggle="tab" id="li-tab1" href="#tab-1">参数设置</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab2" href="#tab-2">产品搜索条件</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab3" href="#tab-3">产品列表</a></li>' +
                        '<li class=""><a data-toggle="tab" id="li-tab4" href="#tab-4">产品价格调整</a></li>' +
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
                            '<table style="width:100%" class="table table-striped table-bordered table-hover" id="PriceChangeTable">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>序号</th>' +
                            '<th>产品代码</th>' +
                            '<th>产品名称</th>' +
                            '<th>颜色代码</th>' +
                            '<th>尺码代码</th>' +
                            '<th>新价格</th>' +
                            '<th>当前价格</th>' +
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
        ////move the editor elements to respective tab
        $(editor.node(['session_number', 'description', 'session_type', 'session_status', 'start_date', 'end_date', 'store_name', 'grid_name'])).appendTo('.tab-1');
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
                        break;
                    }
                        //产品查询条件 Tab2
                    case 'li-tab2': {
                        if (editor.field('session_number').val().length > 0) {
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

                                        $.ajax({
                                            "url": sysSettings.domainPath + "Raymsp_GatewaypaymentGetData",
                                            "type": "POST",
                                            "async": true,
                                            "crossDomain": true,
                                            "data": {
                                                "token": SecurityManager.generate(),
                                                "username": SecurityManager.username,
                                                "colName": 'UniqueId, Product_ID, ProductCode, ProductName, Supplier, RetailPrice, RetailPrice as NewPrice, LandedCost, Bin_Qty_Stocks, Color,Color_ID, Size, Size_ID',
                                                "tbName": 'V_Gatewaypayment_SearchProduct',
                                                "whName": condition

                                            },
                                            "dataType": "json",
                                            "success": function (data) {
                                                data = data.ResultSets[0]

                                                ptable.clear();//重置产品列表
                                                pctable.clear().draw();//重置产品明细列表
                                                data.forEach(function (node) {
                                                    ptable.row.add(node);
                                                })
                                                ptable.draw()
                                                $(pceditor.node('PriceEditCondition')).appendTo('#ProductTable_wrapper .col-sm-6:eq(0)');
                                                $(pceditor.node('PriceEditCondition')).css("padding-top","0")
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

                        break;
                    }
                        //产品列表 Tab3
                    case 'li-tab3': {
                        if (editor.field("session_number").val().length > 0) {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '确定', className: 'prodbtn', fn: function () {
                                        if (ptable.rows('.selected', { select: true }).data().length > 0) {
                                            var plist = ptable.rows('.selected', { select: true }).data();
                                            pctable.clear();
                                            for (var i = 0; i < plist.length; i++) {
                                                plist[i].Sequence_number = i + 1;
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

                        break;
                    }
                        //产品价格调整 Tab 4
                    case 'li-tab4': {
                        if (editor.field("session_number").val().length>0 && editor.field("session_status").val() !== 2) {
                            editor.buttons([
                                {
                                    extend: 'tabbtn', label: '保存', className: 'pcbtn', fn: function () {
                                        if (editor.field('session_number').val().length > 0 && editor.field('session_status').val() === 2) {
                                            this.blur();
                                        }
                                        else {
                                            //pcval.token = SecurityManager.generate();
                                            //pcval.username = SecurityManager.username;
                                            //pcval=JSON.stringify(pcval)

                                            var request = {
                                                //token: SecurityManager.generate(),
                                                "username": SecurityManager.username,
                                                "PCD": pcval
                                            };

                                        };

                                            $.ajax({
                                                "url": sysSettings.domainPath + "Gatewaypayment_Price_change_detail1",
                                                "type": "POST",
                                                "async": true,
                                                "crossDomain": true,
                                                "dataType": "json",
                                                "Content-Type": "application/json",
                                                "data": JSON.stringify(request),

                                                    /**{
                                                    "token": SecurityManager.generate(),
                                                    "username":SecurityManager.username,
                                                    pcval: pcval

                                                },**/
                                                //"tranditional":true,
                                                "success": function (data) {
                                                    if (typeof (data.ResultSets[0][0]) !== 'undefined') {
                                                        table.draw();
                                                        editor.message('保存成功').true;

                                                        //ptable.buttons.info('Notification', 'This is a notification message!', 3000);
                                                        //table.row('#'+ data.ResultSets[0][0].session_number).remove();
                                                        //table.row.add(data.ResultSets[0][0]).draw();

                                                    }
                                                }
                                            })

                                        }

                                    },
                                { extend: 'tabbtn', label: '批准', className: 'pcbtn', fn: function () { document.getElementById("DTE_Field").reset(); } },
                            ])
                        }
                        break;
                    }
                }
            }
        })
    };
});




