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
                        if(response.readyState == 4 && response.status > 200 && response.status < 300)
                            OrdersManager.markRowAsSent(id);
                        else if(response.readyState == 4 && response.status >= 400){
                            OrdersManager.markRowWithRed(id);
                            console.log(JSON.parse(response.responseText));
                        }
                    });
                });
                console.log(order);
            });
    });
}