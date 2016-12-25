$(document).ready(function () {
    var accounteditor = new $.fn.dataTable.Editor({

        ajax: {

            "edit": {
                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentAccount",
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
                        "UniqueID": accounteditor.field('UniqueID').val(),
                        "MerchantName": accounteditor.field('MerchantName').val(),
                        "PaymentMethod": accounteditor.field('PaymentMethod').val(),
                        "Mchid": accounteditor.field('Mchid').val(),
                        "Appid": accounteditor.field('Appid').val(),
                        "MchPublicKey": accounteditor.field('MchPublicKey').val(),
                        "MchKey": accounteditor.field('MchKey').val(),
                        "PublicKey": accounteditor.field('PublicKey').val()

                    }
                    return JSON.stringify(param);
                }
            },
            "create": {
                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentAccount",
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
                        "MerchantName": accounteditor.field('MerchantName').val(),
                        "PaymentMethod": accounteditor.field('PaymentMethod').val(),
                        "Mchid": accounteditor.field('Mchid').val(),
                        "Appid": accounteditor.field('Appid').val(),
                        "MchPublicKey": accounteditor.field('MchPublicKey').val(),
                        "MchKey": accounteditor.field('MchKey').val(),
                        "PublicKey": accounteditor.field('PublicKey').val()
                    }
                    return JSON.stringify(param);
                }
            }


        },
        idSrc: 'Mchid',
        table: '#AccountTable',
        fields: [
            { label: '商户名: ', name: 'MerchantName',type:'select' },
            { label: '支付方式: ', name: 'PaymentMethod', type: 'select' },
            { label: '商户ID: ', name: 'Mchid' },
            { label: 'APPID: ', name: 'Appid' },
            { label: '商户公钥: ', name: 'MchPublicKey',fieldInfo:'微信支付不需要提供商户公钥'},
            { label: '商户私钥: ', name: 'MchKey'},
            { label: '支付方公钥: ', name: 'PublicKey', fieldInfo: '微信支付不需要提供支付方公钥' },
            { label: 'UniqueID: ', name: 'UniqueID' }

        ],
        //自定义语言
        i18n: {
            "create": {
                "button": '新增',
                "title": '新增商户支付方式',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '商户支付方式管理',
                "submit": '提交'
            },
            "multi": {
                "title": "批量修改",
                "info": "批量修改帮助您将所选单元格中的值修改为同一值，要继续修改请单击按钮",
                "restore": "取消修改"
            }
        }
    });

    accounteditor.on('preSubmit', function (e, data, action) {
 
            var Mchid = accounteditor.field("Mchid");
            var Appid = accounteditor.field("Appid");
            var MchKey = accounteditor.field("MchKey");
            if (!Mchid.isMultiValue()) {
                if (!Mchid.val()) {
                    Mchid.error("商户ID不能为空，请重新输入");
                }
            }
            if (!Appid.isMultiValue()) {
                if (!Appid.val()) {
                    Appid.error("APPID不能为空，请重新输入")
                }
            }
            if (!MchKey.isMultiValue()) {
                if (!MchKey.val()) {
                    MchKey.error("商户私钥不能为空，请重新输入")
                }
            }
            if (this.inError()) {
                return false;
            }

    });

    accounteditor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0];

    });


    accounteditor.on('initEdit', function (e, node, data) {

        var oMerchantName, oPaymentMethod
        var selectMerchant = [], selectPaymentMethod = []

        // Get existing options
        oMerchantName = data.MerchantName
        oPaymentMethod = data.PaymentMethod
        if (oPaymentMethod === "微信支付") {
            accounteditor.disable(["MerchantName", "UniqueID", "PaymentMethod","MchPublicKey","PublicKey"]);
        } else {
            accounteditor.disable(["MerchantName", "UniqueID", "PaymentMethod"]);
        }
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
                    if (data[item].table === 'PaymentMethod') {
                        if (data[item].label === oPaymentMethod) {
                            selectPaymentMethod.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectPaymentMethod.push({ label: data[item].label, value: data[item].value });
                        }
                    }

                }
                accounteditor.field("MerchantName").update(selectMerchant)
                accounteditor.field("PaymentMethod").update(selectPaymentMethod);

            }

        })
    });
    accounteditor.on('initCreate', function (e, node, data) {

        accounteditor.enable(["MerchantName", "PaymentMethod","MchPublicKey","PublicKey"]);

        var selectMerchant = [], selectPaymentMethod = []
        var param = {};
        param.token = SecurityManager.generate();
        param.username = SecurityManager.username;

        $.ajax({
            "url": sysSettings.domainPath+"RaymSP_GatewayPaymentMerchant_Get",
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
                    if (data[item].table === 'PaymentMethod') {
 
                        selectPaymentMethod.push({ label: data[item].label, value: data[item].value });
                    }
                }
                accounteditor.field("MerchantName").update(selectMerchant)
                accounteditor.field("PaymentMethod").update(selectPaymentMethod);
            }

        })


       
    });

    accounteditor.hide("UniqueID");

    //初始化报表
    var table = $("#AccountTable").DataTable({
        processing: false,
        dom: 'Bfrtip',
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "MerchantName","width":"10%" },
        { "data": "PaymentMethod", "width": "15%" },
        { "data": "Mchid"},
        { "data": "Appid"},
        {
            "data": "MchPublicKey", "render": function (data, type, row) {
                if (data !== null && data !== '') {
                    if (data.length > 16) {
                        return data.substring(0, 15) + '...';
                    }
                } else {
                    return data;
                }
            }
        },
        {
            "data": "MchKey", "render": function (data, type, row) {
                if (data.length > 16) {
                    return data.substring(0, 15) + '...';
                }
            }
        },
        {
            "data": "PublicKey", "render": function (data, type, row) {
                if (data !== null && data !== '') {
                    if (data.length > 16) {
                        return data.substring(0, 15) + '...';
                    }
                } else {
                    return data;
                }
            }
        }
        ],
/**       "columnDefs": [
            { "width": "10%", "targets": 0 },
            { "width": "10%", "targets": 1 },
            { "width": "20%", "targets": 2 },
            { "width": "10%", "targets": 3 },
            { "width": "10%", "targets": 4 },
            { "width": "10%", "targets": 5 },
            { "width": "10%", "targets": 6 }
        ], **/
        ajax: {
            "async": true,
            "crossDomain": true,
            "type": "POST",
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentAccount",
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "data": function () {
                var param = {};
                param.token = SecurityManager.generate();
                param.username = SecurityManager.username;
                
                return (JSON.stringify(param));
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
            { extend: 'create', editor: accounteditor, text: '新建' },
            { extend: 'edit', editor: accounteditor, text: '修改' },
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




