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

    static getAsPDF(){
        this.performOnRegistry((data) => {
            var pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true
            });

            var date = new Date();
            var today = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
            pdf.text(today, 10, 15);

            var textArr = [];
            Object.values(data).forEach(value => {
                const [date, shipment] = Object.entries(value)[0];
                var match = date.match(/(?<date>[^\s]*)\s(?<time>[^\s]*)/);
                console.log(today);
                console.log(JSON.stringify(match));

                if(today !== match.groups.date)
                    return;

                console.log(date);
                console.log(shipment);
                var shipmentText = `${match.groups.time} InPost: ${shipment.inpost_id} - nr ${shipment.order_id} od ${shipment.title}`;
                textArr = textArr.concat(pdf.splitTextToSize(shipmentText, 180));
            });
            pdf.text(textArr, 2, 25);
            pdf.save('testingPdf.pdf');
        });
    }
}