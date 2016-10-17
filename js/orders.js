$(document).ready(function() {
    var editor = new $.fn.dataTable.Editor({
        ajax: {
            url: "http://localhost/sql/RaymSP_GatewayPaymentOrder",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: function () {
                var d = [{
                    "username": 'john',
                    "method": 2,
                    "storeid": Number(editor.field('store_id').val()),
                    "ordernumber": editor.field('OrderNumber').val(),
                    "paymentmethod": editor.field('PaymentMethod').val(),
                    "statusdescription": editor.field('Status').val()
                }]
                return JSON.stringify(d);
            },
            dataSrc: function (data) {
                data = data.ReturnValue
                return data;
            }
        },
        idSrc: 'OrderNumber',
        table: '#StoreTable',
        fields: [
            {
                label: '订单状态', name: 'Status', type: 'select', options: [
                { label: '未支付', value: '未支付' },
                { label: '已支付', value: '已支付' },
                { label: '已退款', value: '已退款' },
                { label: '已关闭', value: '已关闭' }
                ]
            },
            { label: '门店ID', name: 'store_id' },
            { label: '门店名称', name: 'store_name' },
            { label: '订单编号', name: 'OrderNumber' },
            { label: '订单类型', name: 'OrderType' },
            { label: '订单日期', name: 'OrderDate' },
            { label: '订单描述', name: 'subject' },
            { label: '订单金额', name: 'TotalAmount' },
            { label: '客户姓名', name: 'CustomerName' },
            {label:'支付方式',name:'PaymentMethod'}

        ],
        //自定义语言
        i18n: {
            edit: {
                button: '修改订单状态',
                title: '订单状态管理',
                submit: '提交'
            }
        }
    });

    editor.disable(['store_name', 'OrderNumber', 'OrderType', 'OrderDate', 'subject', 'TotalAmount', 'CustomerName', 'PaymentMethod']);
    editor.hide('store_id');


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
        { "data": "PaymentMethod" }
        ],
        ajax:{
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost/sql/RaymSP_GatewayPaymentOrder",
            data: function () { return JSON.stringify([{ "username": 'john', "method": 1 }]); },
            dataType: "json",
            dataSrc:function (data) {
                data = data[0].ResultSets[0]
                return data;

            }
        },

         language: {
             url: "//cdn.datatables.net/plug-ins/1.10.12/i18n/Chinese.json"
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
    table.ajax.reload(null, false);
    });




