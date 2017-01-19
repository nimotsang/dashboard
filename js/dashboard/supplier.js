$(document).ready(function () {
    var editor = new $.fn.dataTable.Editor({

        ajax: {

            "edit": {
                "url": sysSettings.domainPath + "Raymsp_GatewayPaymentProduct_Generate",
                "async": true,
                "crossDomain": true,
                "type": "POST",
                "dataType": "json",
                "contentType": "application/json; charset=utf-8",
                "data": function () {                  
                        var param = {
                            "token": SecurityManager.generate(),
                            "username": SecurityManager.username,
                            "Supplier_Code": editor.field('Supplier_Code').val(),
                            "Name": editor.field('Name').val(),
                            "Address": editor.field('Address').val(),
                            "City": editor.field('City').val(),
                            "Province": editor.field('Province').val(),
                            "ZipCode": editor.field('ZipCode').val(),
                            "Telephone": editor.field('Telephone').val(),
                            "Fax": editor.field('Fax').val(),
                            "Email": editor.field('Email').val(),
                            "Contact": editor.field('Contact').val(),
                            "Notes": editor.field('Notes').val()
                        }
                        return JSON.stringify(param);
                    } 
            },
            "create": {

                "url": sysSettings.domainPath + "Raymsp_GatewayPaymentProduct_Generate",
                "async": true,
                "crossDomain": true,
                "type": "POST",
                "dataType": "json",
                "contentType": "application/json; charset=utf-8",
                "data": function () {
                    var param = {
                        "token": SecurityManager.generate(),
                        "username": SecurityManager.username,
                        "sku": editor.field('product_code').val(),
                        "Short_name": editor.field('Short_name').val(),
                        "price": editor.field('price').val(),
                        "Long_name": editor.field('Long_name').val()
                    }
                    return JSON.stringify(param);
                }
            }
        },
        idSrc: 'Supplier_ID',
        table: '#SupplierTable',
        fields: [
            { label: '编号: ', name: 'Supplier_ID' },
            { label: '代码: ', name: 'Supplier_Code' },
            { label: '名称: ', name: 'Name' },
            { label: '地址: ', name: 'Address' },
            { label: '城市: ', name: 'City' },
            { label: '省市: ', name: 'Province' },
            { label: '电话: ', name: 'Telephone' },
            { label: '传真: ', name: 'Fax' },
            { label: '邮件: ', name: 'Email' },
            { label: '联系人: ', name: 'Contact' },
            { label: '备注: ', name: 'Notes' },
        ],
        //自定义语言
        i18n: {
            "create": {
                "button": '新增',
                "title": '新增供应商',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '供应商管理',
                "submit": '提交'
            },
            "multi": {
                "title": "批量修改",
                "info": "批量修改帮助您将所选单元格中的值修改为同一值，要继续修改请单击按钮",
                "restore": "取消修改"
            }
        }
    });


    editor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0];
    });


    editor.on('initEdit', function () {
        editor.disable(["Supplier_ID"]);
    });


    //初始化报表
    var table = $("#SupplierTable").DataTable({
        processing: false,
        dom: 'Bfrtip',
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "Supplier_ID" },
        { "data": "Supplier_Code" },
        { "data": "Name" },
        { "data": "Status" },
        ],
/**        "columnDefs": [
            { "width": "20%", "targets": 0 }
        ],
        
        **/
        ajax: {
            "url": sysSettings.domainPath + "Raymsp_GatewaypaymentGetData",
            "async": true,
            "crossDomain": true,
            "type": "POST",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": function () {
                var param = {
                    "token": SecurityManager.generate(),
                    "username": SecurityManager.username,
                    "colName": 'Supplier_ID,Supplier_Code, Name, Status ,Address, City, Province, ZipCode, Telephone, Fax, Email, Contact, Notes',
                    "tbName": 'Supplier'
                }
                return JSON.stringify(param);
            },
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




