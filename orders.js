(() => {
    $(document).ready(function(){
        main();
    });
})();

function getVersion(){
    return chrome.runtime.getManifest().version;
}

function getOrderFromStorage(key, onRetrieval){
    //chrome.storage.local.get(key).then(onRetrieval);
    chrome.storage.local.get(key).then(function(result){
        console.log(JSON.stringify(result));
        if(jQuery.isEmptyObject(result))
            onRetrieval(null);
        else if(Object.values(result)[0].version != this.getVersion()){
            console.log("Here!!!");
            chrome.storage.local.remove(key);
            onRetrieval(null);
        }else{
            onRetrieval(Object.values(result)[0].order);
        }
    });
}

function setOrderInStorage(key, value){
    var toSet = {};
    toSet[key] = {};
    toSet[key]["order"] = value;
    toSet[key]["version"] = this.getVersion();
    console.log(JSON.stringify(toSet));
    chrome.storage.local.set(toSet);
}

function onOrderNotFound(id){
    OrdersManager.processOrder(id, function(order){
        if(order == false){
            this.setOrderInStorage(id, false);
        }else{
            this.setOrderInStorage(id, order);
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
    var serverOverheat = 0;
    OrdersListView.getAllRows().each(function(index, row){
        if(serverOverheat > 40)
            return;
        var id = OrdersListView.getRowId($(row));
        var key = id;
        getOrderFromStorage(key, function(result){
            console.log("Available: " + JSON.stringify(result));
            if(result === null){
                onOrderNotFound(id);
                serverOverheat++;
            }else{
                onOrderFound(id, result);
            }
        });
    });
}