(() => {
    $(document).ready(function(){
        main();
    });
})();

function main(){
    $(".gpmlist tbody tr").each(function(index, e){
        var id = $(e).attr("id").match(/so_row_(?<id>\d*)/)[1];
        if(id > 55970)
            OrdersManager.fetchOrderById(id, function(html){
                var order = OrdersManager.parseHtmlToOrder(html);
                if(order == false)
                    return false;

                OrdersManager.addInPostIcon(id, function(){
                    InPostManager.addShipment(order, function(response){
                        console.log(JSON.parse(response));
                    });
                });
                console.log(order);
            });
    });
}