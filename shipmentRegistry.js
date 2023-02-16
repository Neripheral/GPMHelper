class ShipmentRegistry{
    static registerShipment(order_id, title, inpost_id){
        const date = new Date();
        var dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        var toSet = {};
        toSet[dateString] = {};
        toSet[dateString]["order_id"] = order_id;
        toSet[dateString]["title"] = title;
        toSet[dateString]["inpost_id"] = inpost_id;
        console.log("Adding shipment to registry: " + JSON.stringify(toSet));
        chrome.storage.local.get("inpost_registry", data => {
            chrome.storage.local.set({
                "inpost_registry": [
                    ...data.inpost_registry || [],
                    toSet
                ]
            });
        });
    }

    static printRegistryToConsole(){
        chrome.storage.local.get("inpost_registry", data => {
            console.log(JSON.stringify(data));
        });
    }
}