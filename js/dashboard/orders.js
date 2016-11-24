$(document).ready(function() {
    var editor = new $.fn.dataTable.Editor({

      ajax: {
              "url": sysSettings.domainPath + "RaymSP_GatewayPaymentOrder",
              "type": "POST",
              "async": true,
              "crossDomain": true,
              "data": function () {
                  var param = {
                      "token": SecurityManager.generate(),
                      "username": SecurityManager.username,
                      "method": 2,
                      "storeid": Number(editor.field('store_id').val()),
                      "ordernumber": editor.field('OrderNumber').val(),
                      "MethodTypeJoin": editor.field('MethodTypeJoin').val(),
                      "statusdescription": editor.field('Status').val()
                  }
                  return param;
              }
        },


        /**
        ajax: function (method, url, data, success, error) {
            var param = [{
                "username": 'john',
                "method": 2,
                "storeid": Number(editor.field('store_id').val()),
                "ordernumber": editor.field('OrderNumber').val(),
                "paymentmethod": editor.field('PaymentMethod').val(),
                "statusdescription": editor.field('Status').val()
            }]
            $.ajax({
                url: "https://mbeta.pw/mocdbapi/RaymSP_GatewayPaymentOrder",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function (data) {
                    data = data[0].ResultSets[0]
                    success(data);

                }

            });

        },
**/
        idSrc: 'OrderNumber',
        table: '#StoreTable',
        fields: [
            {
                label: '订单状态: ', name: 'Status', type: 'select', options: [
                { label: '未支付', value: '未支付' },
                { label: '已支付', value: '已支付' },
                { label: '已退款', value: '已退款' },
                { label: '已关闭', value: '已关闭' }
                ]
            },
            { label: '门店ID: ', name: 'store_id' },
            { label: '门店名称: ', name: 'store_name' },
            { label: '订单编号: ', name: 'OrderNumber' },
            { label: '订单类型: ', name: 'OrderType' },
            { label: '订单日期: ', name: 'OrderDate' },
            { label: '订单描述: ', name: 'subject' },
            { label: '订单金额: ', name: 'TotalAmount' },
            { label: '客户姓名: ', name: 'CustomerName' },
            { label: '支付方式: ', name: 'MethodTypeJoin' }

        ],
        //自定义语言
        i18n: {
            edit: {
                button: '修改订单状态',
                title: '订单状态管理',
                submit: '提交'
            },
            "multi": {
                "title": "批量修改",
                "info": "批量修改帮助您将所选单元格中的值修改为同一值，要继续修改请单击按钮",
                "restore": "取消修改"
            }
        }
    });

    editor.disable(['store_name', 'OrderNumber', 'OrderType', 'OrderDate', 'subject', 'TotalAmount', 'CustomerName', 'MethodTypeJoin']);
    editor.hide('store_id');
    editor.on('postSubmit', function (e, json) {
        json.data = json.ResultSets[0]

    });

    editor.on('open', function () {
        $('div.modal-dialog').addClass('multi-column');
        $('div.DTE_Body').addClass('multi-column-body');
        $( 'div.DTE_Field').addClass('multi-column-feild');
    });

    editor.on('close', function () {
//        $('div.modal-dialog').removeClass('multi-column');
//        $('div.DTE_Field').removeClass('multi-column-feild');
    });

    //初始化报表
    var table=$("#StoreTable").DataTable({
        processing:false,
        dom:'Bfrtip',
        select: true,
        order: [[3, "desc"]],
        columns: [
        { "data": "store_name" },
        { "data": "OrderNumber" },
        { "data": "OrderType" },
        { "data": "OrderDate" },
        { "data": "subject" },
        { "data": "TotalAmount" },
        { "data": "CustomerName" },
        { "data": "Status" },
        { "data": "MethodTypeJoin" }
        ],
        ajax: {
            "url": sysSettings.domainPath + "RaymSP_GatewayPaymentOrder",
            "type": "POST",
            "async": true,
            "crossDomain": true,
            "data": {
                "token": SecurityManager.generate(),
                "username": SecurityManager.username
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
             { extend: 'edit', editor: editor ,text:'编辑'},
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




