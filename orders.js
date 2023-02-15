(() => {
    $(document).ready(function(){
        main();
    });
})();

function onOrderNotFound(id){
    OrdersManager.processOrder(id, function(order){
        var toSet = {};
        if(order == false){
            toSet[id] = false;
            chrome.storage.local.set(toSet);
        }else{
            toSet[id] = order;
            chrome.storage.local.set(toSet);
            this.onOrderFound(id, order);
        }
    });
}

function onOrderFound(id, order){
    if(order == false)
        return false;

    OrdersManager.prepareRowInPostForId(id, function(size){
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
}

function main(){
    OrdersManager.initInpost();
    console.log("Inpost initialized");
    OrdersListView.getAllRows().each(function(index, row){
        /*if(index > 20)
            return;*/
        var id = OrdersListView.getRowId($(row));
        var key = id;
        chrome.storage.local.get(key).then(function(result){
            if(jQuery.isEmptyObject(result)){
                onOrderNotFound(id);
            }else{
                onOrderFound(id, Object.values(result)[0]);
            }
        });
    });
}