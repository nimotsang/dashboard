$(document).ready(function() {
    var editor = new $.fn.dataTable.Editor({

        ajax: {

            "edit": {
                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentStore",
                "async": true,
                "crossDomain": true,
                "type": "POST",
                "dataType": "json",
                "contentType": "application/json; charset=utf-8",
                "data": function () {
                    var param = {
                        "token": SecurityManager.generate(),
                        "username": SecurityManager.username,
                        "method": 3,
                        "MerchantName": editor.field('MerchantName').val(),
                        "Storeid": Number(editor.field('Storeid').val()),
                        "StoreName": editor.field('StoreName').val()
                    }
                    return JSON.stringify(param);
                }
            },
            "create": {

                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentStore",
                "async": true,
                "crossDomain": true,
                "type": "POST",
                "dataType": "json",
                "contentType": "application/json; charset=utf-8",
                "data": function () {
                    var param = {
                        "token": SecurityManager.generate(),
                        "username": SecurityManager.username,
                        "method": 2,
                        "MerchantName": editor.field('MerchantName').val(),
                        "Storeid": Number(editor.field('Storeid').val()),
                        "StoreName": editor.field('StoreName').val()
                    }
                    return JSON.stringify(param);
                }
            }


        },
        idSrc: 'Storeid',
        table: '#StoreTable',
        fields: [
            { label: '商户名称: ', name: 'MerchantName', type:'select'},
            { label: '门店编号: ', name: ('Storeid') },
            { label: '门店名称: ', name: 'StoreName' }

        ],
        //自定义语言
        i18n: {
            "create": {
                "button": '新增',
                "title": '新增门店',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '门店管理',
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

        var Storeid = editor.field("Storeid");
        var StoreName = editor.field("StoreName");
        if (!Storeid.isMultiValue()) {
            if (!Storeid.val()) {
                Storeid.error("门店编号不能为空，请重新输入");
            } else if (action !== 'edit') {
                if (isNaN(Storeid.val())) {
                    Storeid.error("门店编号只能是数字，请重新输入");
                }
            }
        }
        if (!StoreName.isMultiValue()) {
            if (!StoreName.val()) {
                StoreName.error("门店名不能为空，请重新输入")
            } else if (!checkname(StoreName.val())) {
                StoreName.error("门店名只能是中文、英文字母和数字，请重新输入");
            }
        }

        if (this.inError()) {
            return false;
        }

    });
    editor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0]

    });
    editor.on('initEdit', function (e, node, data) {
        editor.disable(["Storeid", "MerchantName"]);
        var oMerchantName;
        var selectMerchant = [];

        // Get existing options
        oMerchantName = data.MerchantName
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;

        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentMerchant_Get",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                data = data.ResultSets[0]
                for (var item in data) {
                    if (data[item].table === 'Merchant') {
                        if (data[item].label === oMerchantName) {
                            selectMerchant.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectMerchant.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                }
                editor.field("MerchantName").update(selectMerchant);
            }

        })

    });
    editor.on('initCreate', function () {
        editor.enable(["Storeid", "MerchantName"]);
        var selectMerchant = [];
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;
        $.ajax({
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentMerchant_Get",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": JSON.stringify(param),
            "success": function (data) {
                data = data.ResultSets[0]
                for (var item in data) {
                    if (data[item].table === 'Merchant') {


                        selectMerchant.push({ label: data[item].label, value: data[item].value });
                    }
                }
                editor.field("MerchantName").update(selectMerchant);



            }

        });
    });
/**
    editor.field('MerchantName').update(function () {
        $.ajax({
            "url": "https://mbeta.pw/mocdbapi/RaymSP_GatewayPaymentMerchant",
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "data": function () {
                var param = [{
                    "username": 'john',
                    "method": 1
                }]
                return JSON.stringify(param);
            },
            success: function () {
                data = data[0].ResultSets[0]
                return (data.MerchantName);
            }
        })


    });
**/

    //初始化报表
    var table=$("#StoreTable").DataTable({
        processing:false,
        dom:'Bfrtip',
        select: true,
        order: [[1, "asc"]],
        columns: [
        { "data": "MerchantName" },
        { "data": "Storeid" },
        { "data": "StoreName" }
        ],
        "columnDefs":[
            { "width": "20%", "targets": 0 },
            { "width": "20%", "targets": 1 }
        ],
        ajax: {
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentStore",
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
            "dataSrc":function (data) {
                data = data.ResultSets[0]
                return data;

            }
        },

         language: {
             url: "../vendor/datatables/Chinese.json",
             select:{
                 rows:{
                     _: "已选中 %d 行",
                     0:""
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




