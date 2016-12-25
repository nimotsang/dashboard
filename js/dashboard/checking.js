$(document).ready(function() {
    var editor = new $.fn.dataTable.Editor({

        ajax: {
            "create":{
                "url": "https://dev.mbeta.pw/pos/payment/billdownload",
                "type": "POST",
                "async": true,
                "crossDomain": true,
                "data":function () {
                    var param =({
                        "merchant_id": Number(editor.field('merchant_id').val()),
                        "store_id": Number(editor.field('store_id').val()),
                        "bill_date": editor.field('bill_date').val(),
                        "payment_method": editor.field('payment_method').val()
                    })
                    return param;
                },
               }
                    
            },


        idSrc: 'OrderNumber',
        table: '#CheckingTable',
        fields: [
            { label: '商家编号: ', name: 'merchant_id', type: 'select' },
            { label: '门店编号: ', name: 'store_id', type: 'select' },
            { label: '账单日期: ', name: 'bill_date', type: 'datetime', def: function () { return new Date();},fieldInfo:'日期格式：YYYY-MM-DD'},
            { label: '支付方式: ', name: 'payment_method', type: 'select' }
           

        ],
        //自定义语言
        i18n: {
            
            "create": {
                "button": '下载',
                "title": '对账下载管理',
                "submit": '提交'
            },
            "datetime": {
                "previous": '前',
                "next": '后',
                "months": ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                "weekdays": ['日','一', '二', '三', '四', '五', '六',]
            }
            
        }
    });

    editor.on('preSubmit', function (e, data, action) {

        var store_id = editor.field("store_id");
        var bill_date = editor.field("bill_date");
        var merchant_id = editor.field("merchant_id");
        var payment_method = editor.field("payment_method");
        if (!merchant_id.isMultiValue()) {
            if (!merchant_id.val()) {
                merchant_id.error("商家编号不能为空，请重新输入");
            } else if (action !== 'create') {
                if (isnan(merchant_id.val())) {
                    merchant_id.error("商家编号只能是数字，请重新输入");
                }
            }
        }
        if (!store_id.isMultiValue()) {
            if (!store_id.val()) {
                store_id.error("门店编号不能为空，请重新输入");
            } else if (action !== 'create') {
                if (isnan(store_id.val())) {
                    store_id.error("门店编号只能是数字，请重新输入");
                }
            }
        }
        else if (!bill_date.isMultiValue()) {
            if (!bill_date.val()) {
                bill_date.error("账单日期不能为空，请重新输入")
            } else if (!checkdate(bill_date.val())) {
                bill_date.error("账单日期格式须为：yyyy/mm/dd");
            }
        }
        else if (!payment_method.isMultiValue()) {
            if (!payment_method.val()) {
                payment_method.error("支付方式不能为空，请重新输入")
            } else if (payment_method.val() != 'wechat' && payment_method.val() != 'alipay') {
                payment_method.error("支付方式只能请选择微信或支付宝");
            }
        }
        else if (this.inError()) {
            alert("error");
            return false;
        }
       
            editor.disable();
        
    });
    editor.on('postSubmit', function ( json,data)
        {//客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数
        if (data.return_code == "FAIL") {
            alert("错误：" + data.return_msg)
            editor.close();
            location.reload();
        }
        else if(data.return_code=="SUCCESS"){ 

            
            alert(data.return_msg + "对账数据下载成功！本次下载数据" + data.process_count + "条");
            editor.close();
            location.reload();

        }
    });
    editor.on('initCreate', function (e, node, data) {
       
        var store_id;
        var selectstore_id = [];
        var selectmerchant_id=[]
        var selectpayment_method = [{ label: '微信', value: 'wechat' }, { label: '支付宝', value: 'alipay' }];
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


                        selectmerchant_id.push({ label: data[item].label, value: data[item].ext1 });
                    }
                    if (data[item].table === 'Store') {
                        selectstore_id.push({ label: data[item].label, value: data[item].ext1 });
                    }
                }

               
                editor.field("merchant_id").update(selectmerchant_id);
                editor.field("store_id").update(selectstore_id);
                editor.field("payment_method").update(selectpayment_method);
            }
        });
    });
            
    

    //初始化报表
    var table=$("#CheckingTable").DataTable({
        processing: false,
        lengthChange: false,

        fnDraw:true,
        //dom:'Bfrtip',
        select: true,
        order: [[1, "asc"]],
        columns: [
        { "data": "TradeTime" ,"render":function (data, type, row) {
            if (data !== null && data !== '') {
                if (data.length > 16) {
                    return data.substring(5, data.length) ;
                }
            } else {
                return data;
            }
        
        }},
        {
            "data": "Source", "render": function (data, type, row) {
                return row.OrderType + '' + row.StoreName;
            }
        },
        {
            "data": "Method", "render": function (data, type, row) {
                return row.Gatewaypaymentmethod + '' + row.GatewayPaymentMethodType;
            }
        },
        {
            "data": "TradeStatus", "render": function (data, type, row) {
                if (row.TradeStatus === 'SUCCESS') {
                    return '成功';
                }else{
                    return TradeStatus;
                }

            }
        },
        { "data": "Bank" },
        { "data": "TradeNo", "class": "wordwrap" },
        { "data": "OrderNumber"},
        {
            "data": "TotalAmount", "render": function (data, type, row) {
                return Number(row.TotalAmount).formatMoney();
            }
        },
        { "data": "ProductName" },
        { "data": "Customer" },
        {
            "data": "Fee", "render": function (data, type, row) {
                return Number(row.Fee).formatMoney();
            }
        },
        { "data": "Rate" },
        ],
        "columnDefs": [
           { "width": "5%", "targets": 0},
           { "width": "5%", "targets": 1 },
           { "width": "7%", "targets": 2 },
           { "width": "7%", "targets": 3 },
           { "width": "7%", "targets": 4 },
           { "width": "14%", "targets": 5 },
           { "width": "10%", "targets": 6 },
           { "width": "10%", "targets": 7 },
           { "width": "10%", "targets": 8 },
           { "width": "7%", "targets": 9 },
           { "width": "8%", "targets": 10 }
        ],
      
        ajax:{
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentChecking",
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
             },
             buttons:{
                 copyTitle: '复制数据',
                 copySuccess: '已复制 %d 行'
    }
         },
            //添加按键 编辑，打印及导出
         buttons: [
             //{ extend: 'create', editor: editor, text: '新建' },
             //{ extend: 'edit', editor: editor, text: '修改' },
             { extend:'create',editor:editor,text:'下载对账单'},
             { extend: "print", text: '打印', autoPrint: true },
             { extend: "colvis", text: '显示/隐藏'},
             { extend: "copyHtml5", text: '复制'},
             {
                 extend: 'collection',
                 text: '导出到..',
                 buttons: [
                     'excel',
                     'csv',
                 ]
                 
             },


         ],
         initComplete: function () {
             table.buttons().container().appendTo('#CheckingTable_wrapper .col-sm-6:eq(0)');
         }
        
    });

    //table.ajax.data.clear();
    //table.ajax.reload().draw();
    //table.init();
    });




