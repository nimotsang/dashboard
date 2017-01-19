$(document).ready(function() {
    var storeaccounteditor = new $.fn.dataTable.Editor({

        ajax: {

            "edit": {
                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentStorePaymentMethod",
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
                "data": function () {
                    var param = {
                        "token": SecurityManager.generate(),
                        "username": SecurityManager.username,
                        "method": 3,
                        "MerchantName": storeaccounteditor.field("MerchantName").input().find('option:selected').text(),
                        "StoreName": storeaccounteditor.field("StoreName").input().find('option:selected').text(),
                        "methodtypejoinuniqueid": storeaccounteditor.field('MethodTypeJoin').val(),
                        "PaymentMethodDefault": storeaccounteditor.field('PaymentMethodDefault').val(),
                        "Uniqueid": storeaccounteditor.field("Uniqueid").val()
                    }
                    return JSON.stringify(param);
                }
            },
            "create": {
                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentStorePaymentMethod",
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
                        "MerchantName": storeaccounteditor.field("MerchantName").input().find('option:selected').text(),
                        "StoreName": storeaccounteditor.field("StoreName").input().find('option:selected').text(),
                        "methodtypejoinuniqueid": storeaccounteditor.field('MethodTypeJoin').val(),
                        "PaymentMethodDefault": storeaccounteditor.field('PaymentMethodDefault').val(),
                    }
                    return JSON.stringify(param);
                }
            }


        },
        idSrc: 'Uniqueid',
        table: '#StoreAccountTable',
        fields: [
            { label: '商户名称: ', name: 'MerchantName', type:'select'},
            { label: '门店名称: ', name: 'StoreName',type:'select' },
            { label: '支付方式: ', name: 'MethodTypeJoin', type: 'select' },
            {
                label: '默认支付方式:', name: 'PaymentMethodDefault', type: 'radio',
                options: [
                    { label: "否", value: false },
                    { label: "是", value: true }
                ],
                def:false

            },
            { label: 'Uniqueid', name: 'Uniqueid' },

        

        ],
        //自定义语言
        i18n: {
            "create": {
                "button": '新增',
                "title": '新增门店支付方式',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '门店支付方式管理',
                "submit": '提交'
            },
            "multi": {
                "title": "批量修改",
                "info": "批量修改帮助您将所选单元格中的值修改为同一值，要继续修改请单击按钮",
                "restore": "取消修改"
            }
        }
    });


    storeaccounteditor.on('preSubmit', function (e, data, action) {

        var MerchantName = storeaccounteditor.field("MerchantName"), StoreName = storeaccounteditor.field("StoreName");
        var MethodTypeJoin = storeaccounteditor.field("MethodTypeJoin");
        var PaymentMethodDefault = storeaccounteditor.field("PaymentMethodDefault");
        var result;
        if (action === "edit" && PaymentMethodDefault.val()) {
            var param = {};
            param.token = SecurityManager.generate();
            param.username = SecurityManager.username;
            param.StoreUniqueid = this.field("StoreName").val();
           $.ajax({
               "url": sysSettings.domainPath + "RaymSP_GatewayPaymentDefaultMethodCheck",
                "type": "POST",
                "async": false,
                "crossDomain": true,
                "dataType": "json",
                "contentType": "application/json; charset=utf-8",
                "data": JSON.stringify(param),
                "success": function (data) {
                    if (data.ResultSets[0]) {
                        data = data.ResultSets[0]
                            if (data[1]) {
                                if (data[1].MethodTypeJoinUniqueid !== data[0].MethodTypeJoinUniqueid) {
                                    result = data[1].MethodTypeJoin
                                    PaymentMethodDefault.val(false)
                                }
                            } else if (MethodTypeJoin.val() !== data[0].MethodTypeJoinUniqueid) {
                                result = data[0].MethodTypeJoin
                                PaymentMethodDefault.val(false)
                            }

                    }
                }

            });

        }
        if (!MerchantName.isMultiValue()) {
            if (!MerchantName.val()) {
                MerchantName.error("商户不能为空，请重新输入");
            }
        }
        if (!StoreName.isMultiValue()) {
            if (!StoreName.val()) {
                StoreName.error("门店不能为空，请重新输入")
            }
        }
        if (!MethodTypeJoin.isMultiValue()) {
            if (!MethodTypeJoin.val()) {
                MethodTypeJoin.error("支付方式不能为空，请重新输入");
            } else if (result !== undefined) {
                 MethodTypeJoin.error("门店已设置默认支付方式为 "+ result +"，请重新设置");

            }
        }
        if (this.inError()) {
            return false;
        }

    });

    storeaccounteditor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0];

    });
    storeaccounteditor.on('initEdit', function (e, node, data) {
        storeaccounteditor.disable(["StoreName", "MerchantName", "MethodTypeJoin"]);
        var oMerchantName, oStoreName, oMethodTypeJoin;
        var selectMerchant = [], selectStore = [], selectMethodTypeJoin = [];

        // Get existing options
        oMerchantName = data.MerchantName
        oStoreName = data.StoreName
        oMethodTypeJoin = data.MethodTypeJoin
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
                        if (data[item].table === 'Store') {
                            if (data[item].label === oStoreName) {
                                selectStore.unshift({ label: data[item].label, value: data[item].value });
                            } else {
                                selectStore.push({ label: data[item].label, value: data[item].value });
                            }
                        }
                        if (data[item].table === 'MethodTypeJoin') {
                            if (data[item].label === oMethodTypeJoin) {
                                selectMethodTypeJoin.unshift({ label: data[item].label, value: data[item].value });
                            } else {
                                selectMethodTypeJoin.push({ label: data[item].label, value: data[item].value });
                            }
                        }
                    }
                    storeaccounteditor.field("MerchantName").update(selectMerchant)
                    storeaccounteditor.field("StoreName").update(selectStore)
                    storeaccounteditor.field("MethodTypeJoin").update(selectMethodTypeJoin);


                }

            })
    });
    storeaccounteditor.on('initCreate', function () {
        var selectMerchant = [], selectStore = [], selectMethodTypeJoin = [];
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
                    if (data[item].table === 'Store') {
                        selectStore.push({ label: data[item].label, value: data[item].value });
                    }
                    if (data[item].table === 'MethodTypeJoin') {
                        selectMethodTypeJoin.push({ label: data[item].label, value: data[item].value });
                    }
                }
                storeaccounteditor.field("MerchantName").update(selectMerchant);
                storeaccounteditor.field("StoreName").update(selectStore);
                storeaccounteditor.field("MethodTypeJoin").update(selectMethodTypeJoin);


            }

        });
        storeaccounteditor.enable(["StoreName", "MerchantName", "MethodTypeJoin"]);

    });
    storeaccounteditor.hide("Uniqueid");
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
    var storeaccounttable=$("#StoreAccountTable").DataTable({
        processing:false,
        dom:'Bfrtip',
        select: true,
        order: [[1, "asc"]],
        columns: [
        { "data": "MerchantName" },
        { "data": "StoreName" },
        { "data": "MethodTypeJoin" },
        {
            "data": "PaymentMethodDefault", "render": function (data, type, row) {
                if (data !== null && data !== '') {
                    if (data === false) {
                        return data = '否';
                    } else {
                        return data = '是';
                    }
                }

            }
        }
        ],
        "columnDefs":[
            { "width": "20%", "targets": 0 },
            { "width": "20%", "targets": 1 }
        ],
        ajax: {
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentStorePaymentMethod",
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
             { extend: 'create', editor: storeaccounteditor, text: '新建' },
             { extend: 'edit', editor: storeaccounteditor, text: '修改' },
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




