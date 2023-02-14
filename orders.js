(() => {
    $(document).ready(function(){
        main();
    });
})();

function loadFrom(index){
    console.log(".gpmlist tbody tr:nth-child(" + index + ")");
    var e = $(".gpmlist tbody tr:nth-child(" + index + ")");
        if(e == null)
            return;
    var id = $(e).attr("id").match(/so_row_(?<id>\d*)/)[1];
    if(index < 80)
        OrdersManager.fetchOrderById(id, function(html){
            var order = OrdersManager.parseHtmlToOrder(html);
            loadFrom(index+1);
            if(order == false)
                return false;

            OrdersManager.addInPostIcon(id, function(size){
                if(size == "A")
                    order.size = "small";
                else if(size == "B")
                    order.size = "medium";
                else if(size == "C")
                    order.size = "large";

                InPostManager.addShipment(order, function(response){
                    if(response.readyState == 4 && response.status > 200 && response.status < 300)
                        OrdersManager.markRowAsSent(id);
                    else if(response.readyState == 4 && response.status >= 400){
                        var responseText = JSON.parse(response.responseText);
                        OrdersManager.markRowAsError(id, responseText.details);
                        console.log(responseText);
                    }
                });
            });
            console.log(order);
        });
}

function main(){
    loadFrom(1);
}