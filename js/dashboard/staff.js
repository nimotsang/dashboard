$(document).ready(function () {
    var editor = new $.fn.dataTable.Editor({

        ajax: {

            "edit": {
                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentUser",
                "type": "POST",
                "async": true,
                "crossDomain": true,
                "data": function () {
                    if (openValPassWord === editor.field('PassWord').val()) {
                        var param = {
                            "token": SecurityManager.generate(),
                            "username": SecurityManager.username,
                            "method": 3,
                            "MerchantName": editor.field('MerchantName').val(),
                            "StoreName": editor.field('StoreName').val(),
                            "UserCode": editor.field('UserCode').val(),
                            "Name": editor.field('UserName').val(),
                            "PositionName": editor.field('PositionName').val()
                        }
                        return param;
                    } else {
                        var param = {
                            "token": SecurityManager.generate(),
                            "username": SecurityManager.username,
                            "method": 3,
                            "MerchantName": editor.field('MerchantName').val(),
                            "StoreName": editor.field('StoreName').val(),
                            "UserCode": editor.field('UserCode').val(),
                            "Name": editor.field('UserName').val(),
                            "PassWord": CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([editor.field('PassWord').val(), SecurityManager.salt].join(':'), SecurityManager.salt)),
                            "PositionName": editor.field('PositionName').val()
                        }
                        SecurityManager.updatepassword = editor.field('PassWord').val()
                        return param;
                    }

                }
            },
            "create": {

                "url": sysSettings.domainPath + "RaymSP_GatewayPaymentUser",
                "type": "POST",
                "data": function () {
                    var param = {
                        "token": SecurityManager.generate(),
                        "username": SecurityManager.username,
                        "method": 2,
                        "MerchantName": editor.field('MerchantName').val(),
                        "StoreName": editor.field('StoreName').val(),
                        "UserCode": editor.field('UserCode').val(),
                        "Name": editor.field('UserName').val(),
                        "PassWord": CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([editor.field('PassWord').val(), SecurityManager.salt].join(':'), SecurityManager.salt)),
                        "PositionName": editor.field('PositionName').val()
                    }
                    return param;
                }
            }


        },
        idSrc: 'UserCode',
        table: '#StaffTable',
        fields: [
            { label: '商户名: ', name: 'MerchantName',type:'select' },
            { label: '门店名: ', name: 'StoreName',type:'select' },
            { label: '用户编号: ', name: 'UserCode' },
            { label: '用户名: ', name: 'UserName' },
            { label: '密码: ', name: 'PassWord', type: "password" },
            { label: '职位: ', name: 'PositionName',type:'select' }

        ],
        //自定义语言
        i18n: {
            "create": {
                "button": '新增',
                "title": '新增用户',
                "submit": '提交'
            },
            "edit": {
                "button": '修改',
                "title": '用户管理',
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
 
            var PassWord = editor.field("PassWord");
            var UserName = editor.field("UserName");
            var UserCode = editor.field("UserCode");
            var PositionName = editor.field("PositionName");
            if (!PassWord.isMultiValue()){
                if (!PassWord.val()) {
                    PassWord.error("密码不能为空，请重新输入");
                }
            }
            if (!UserName.isMultiValue()) {
                if (!UserName.val()) {
                    UserName.error("用户名不能为空，请重新输入")
                } else if (!checkname(UserName.val())) {
                    UserName.error("用户名只能是中文、英文字母和数字，请重新输入");
                }
            }
             if (!UserCode.isMultiValue()) {
                    if (!UserCode.val()) {
                        UserCode.error("用户编号不能为空，请重新输入");
                    } else if (!checkcode(UserCode.val())) {
                        UserCode.error("用户编号只能是字母和数字，请重新输入");
                    }
                }
                if (!PositionName.isMultiValue()) {
                    if (!PositionName.val()) {
                        PositionName.error("职位不能为空，请重新输入")
                    }
                }


            if (this.inError()) {
                return false;
            }

    });

    editor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0]
        SecurityManager.generate(SecurityManager.username, SecurityManager.updatepassword)
        SecurityManager.updatepassword = null;
    });

    var openValPassWord;
    editor.on('initEdit', function (e, node, data) {
        editor.disable(["MerchantName", "StoreName", "UserCode"]);
        var oMerchantName, oStoreName, oPositionName;
        var selectMerchant = [], selectStore = [],selectPosition=[];

        // Get existing options
        oMerchantName = data.MerchantName
        oStoreName = data.StoreName
        oPositionName = data.PositionName
        openValPassWord = data.PassWord



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
                    if (data[item].table === 'Position') {
                        if (data[item].label === oPositionName) {
                            selectPosition.unshift({ label: data[item].label, value: data[item].value });
                        } else {
                            selectPosition.push({ label: data[item].label, value: data[item].value });
                        }
                    }
                }
                editor.field("MerchantName").update(selectMerchant)
                editor.field("StoreName").update(selectStore);
                editor.field("PositionName").update(selectPosition);

            }

        })
    });
    editor.on('initCreate', function () {
        editor.enable(["MerchantName", "StoreName", "UserCode"]);
        var selectMerchant = [], selectStore = [],selectPosition=[];
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
                    if (data[item].table === 'Merchant') {


                        selectMerchant.push({ label: data[item].label, value: data[item].value });
                    }
                    if (data[item].table === 'Store') {
                        selectStore.push({ label: data[item].label, value: data[item].value });
                    }
                    if (data[item].table === 'Position') {
                        selectPosition.push({ label: data[item].label, value: data[item].value });
                    }
                }
                editor.field("MerchantName").update(selectMerchant)
                editor.field("StoreName").update(selectStore)
                editor.field("PositionName").update(selectPosition);

            }

        });
    });

    //初始化报表
    var table = $("#StaffTable").DataTable({
        processing: false,
        dom: 'Bfrtip',
        select: true,
        order: [[0, "asc"]],
        columns: [
        { "data": "MerchantName" },
        { "data": "StoreName" },
        { "data": "UserCode" },
        { "data": "UserName" },
        { "data":  "PassWord"},
        { "data": "PositionName" },
        ],
/**        "columnDefs": [
            { "width": "20%", "targets": 0 }
        ], **/
        ajax: {
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentUser",
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




