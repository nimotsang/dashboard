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
                        "sku": editor.field('product_code').val(),
                        "Short_name": editor.field('Short_name').val(),
                        "price": editor.field('price').val(),
                        "Long_name": editor.field('Long_name').val()
                    }
                    return JSON.stringify(param);
                },
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
                },
            }
        },
        idSrc: 'product_code',
        table: '#ProductTable',
        fields: [
            { label: '产品条码(SKU): ', name: 'product_code' },
            { label: '产品名称: ', name: 'Short_name' },
            { label: '价格: ', name: 'price' },
            { label: '产品描述: ', name: 'Long_name' }

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


    editor.on('preSubmit', function (e, data, action) {
 
        var product_code = editor.field("product_code");
        var Short_name = editor.field("Short_name");
        var price = editor.field("price");
        var Long_name = editor.field("Long_name");
        if (!product_code.isMultiValue()) {
            if (!product_code.val()) {
                product_code.error("产品条码(SKU)不能为空，请重新输入");
                }
            }
        if (!Short_name.isMultiValue()) {
            if (!Short_name.val()) {
                Short_name.error("产品名称不能为空，请重新输入")
            } else if (!checkname(Short_name.val())) {
                Short_name.error("产品名称只能是中文、英文字母和数字，请重新输入");
                }
            }
        if (!price.isMultiValue()) {
            if (!price.val()) {
                price.error("价格不能为空，请重新输入");
            } else if (!checkprice(price.val())) {
                price.error("价格格式不正确，请重新输入");
                    }
                }
        if (!Long_name.isMultiValue()) {
             if (!Long_name.val()) {
                 Long_name.error("产品描述不能为空，请重新输入")
              } else if (!checkname(Long_name.val())) {
                  Long_name.error("产品描述只能是中文、英文字母和数字，请重新输入");
                }
            }

            if (this.inError()) {
                return false;
            }

    });

    editor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0];
    });


    editor.on('initEdit', function () {
        editor.disable(["product_code"]);
    });
    editor.on('initCreate', function () {
        editor.enable(["product_code"]);
       
    });

    //初始化报表
    var table = $("#ProductTable").DataTable({
        processing: false,
        dom: 'Bfrtip',
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "Product_id" },
        { "data": "Short_name" },
        { "data": "product_code" },
        { "data": "price" },
        { "data":  "Long_name"},
        ],
/**        "columnDefs": [
            { "width": "20%", "targets": 0 }
        ], **/
        ajax: {
            "url": sysSettings.domainPath + "Raymsp_GatewaypaymentProduct_Query",
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




