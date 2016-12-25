$(document).ready(function() {
    var editor = new $.fn.dataTable.Editor({

        ajax: {

            "edit": {
                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentMerchant",
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
                        "MerchantCode": editor.field('MerchantCode').val(),
                        "MerchantName": editor.field('MerchantName').val()
                    }
                    return JSON.stringify(param);
                }
            },
            "create": {

                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentMerchant",
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
                        "MerchantCode": editor.field('MerchantCode').val(),
                        "MerchantName": editor.field('MerchantName').val()
                    }
                    return JSON.stringify(param);
                }
            }


        },
        idSrc: 'MerchantCode',
        table: '#MerchantTable',
        fields: [
            { label: '商户编号: ', name: 'MerchantCode' },
            { label: '商户名称: ', name: 'MerchantName' }

        ],
        //自定义语言
        i18n: {
            "create": {
                "button": '新增',
                "title": '新增商户',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '商户管理',
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
        json.data = json.ResultSets[0]

    });
    editor.on('initEdit', function () {
        editor.disable("MerchantCode");
    });
    editor.on('initCreate', function () {
        editor.enable("MerchantCode");
    });

    //初始化报表
    var table=$("#MerchantTable").DataTable({
        processing:false,
        dom:'Bfrtip',
        select: true,
        order: [[1, "asc"]],
        columns: [
        { "data": "MerchantCode" },
        { "data": "MerchantName" }
        ],
        "columnDefs":[
            {"width":"20%","targets":0}
        ],
        ajax:{
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentMerchant",
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
            "dataType": "json",
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
//    table.ajax.reload(null, false);
    });




