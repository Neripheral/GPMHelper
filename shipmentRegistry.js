class ShipmentRegistry{
    static registerShipment(order_id, title, inpost_id){
        const date = new Date();
        var dateString = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
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

    static performOnRegistry(toPerform){
        chrome.storage.local.get("inpost_registry", data => {
            toPerform(data["inpost_registry"]);
        });
    }

    static printRegistryToConsole(){
        this.performOnRegistry((data) => {
            console.log(JSON.stringify(data));
        });
    }

    static composePDF(data){
        var pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true
        });
        
        var date = new Date();
        var today = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
        pdf.text(today, 10, 15);
        var count = 1;
        var textArr = [];
        data.forEach(shipment => {
            var shipmentText = `${('0' + count).slice(-2)}. ${shipment.inpost_id} - ${shipment.order_id} ${shipment.title}`.replace(/[\u0100-\uFFFF]/g,'?');
            textArr = textArr.concat(pdf.splitTextToSize(shipmentText, 200));
            count++;
            if(textArr.length > 40){
                textArr.concat(["..."]);
                pdf.text(textArr, 5, 25);
                pdf.addPage();
                textArr = [];
            }
        });
        pdf.text(textArr, 5, 25);
        pdf.save('testingPdf.pdf');
    }

    static tmpData = [];

    static tryComposePDF(){
        console.log("Control: " + JSON.stringify(this.tmpData));
        var passed = true;
        this.tmpData.forEach(v => {
            if(v === false)
                passed = false;
        });
        if(passed === true)
            this.composePDF(this.tmpData);
    }

    static getAsPDF(){
        ShipmentRegistry.tmpData = [];
        var date = new Date();
        var today = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
        ShipmentRegistry.performOnRegistry((data) => {
            Object.values(data).forEach(value => {
                const [date, shipment] = Object.entries(value)[0];
                var match = date.match(/(?<date>[^\s]*)\s(?<time>[^\s]*)/);
    
                if(today !== match.groups.date)
                    return;
    
                var index = ShipmentRegistry.tmpData.length;
                ShipmentRegistry.tmpData.push(false);
                InPostManager.getShipment(shipment.inpost_id, function(response){
                    if(response.readyState == 4){
                        if(response.status >= 200 && response.status < 300){
                            var responseShipment = JSON.parse(response.responseText).items[0];
                            var toPush = {
                                inpost_id: responseShipment.tracking_number,
                                order_id: shipment.order_id,
                                title: shipment.title
                            };
                            ShipmentRegistry.tmpData[index] = toPush;
                        }
                        ShipmentRegistry.tryComposePDF();
                    }
                });
            });
        });
    }
}