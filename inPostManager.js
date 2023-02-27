class InPostManager{
    static companyId = PrivateData.organizationId;
    static token = PrivateData.token;
    static root = PrivateData.inpost_root;

    static tryConnect(onResponseReceived){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                onResponseReceived(this.responseText);
            } else if(this.readyState == 4 && this.status == 401){
                onResponseReceived(false);
            }
        }
        var url = this.root + "organizations/" + this.companyId;
        xhttp.open("GET", url, "true");
        xhttp.setRequestHeader("Authorization", 'Bearer ' + this.token);
        xhttp.send();
    }

    static getShipment(id = "", onResponseReceived){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            onResponseReceived(this);
        }
        var url = this.root + "organizations/" + this.companyId + "/shipments";
        console.log(id);
        if(id.localeCompare("") !== 0)
            url = url + "?id=" + id;
        xhttp.open("GET", url, "true");
        xhttp.setRequestHeader("Authorization", 'Bearer ' + PrivateData.token);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    }

    /**
     * 
     * @param {*} order Order object. It consists of:
     *              lockerId
     *              email
     *              phone          must consist of 9 digits    
     *              city      
     *              building_number
     *              street
     *              post_code
     *              size            small/medium/large
     * @param {*} onResponseReceived 
     */
    static addShipment(order, onResponseReceived){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            onResponseReceived(this);
        }
        var url = this.root + "organizations/" + this.companyId + "/shipments";
        xhttp.open("POST", url, "true");
        xhttp.setRequestHeader("Authorization", 'Bearer ' + PrivateData.token);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        console.log(JSON.stringify(order));
        var text = JSON.stringify({
            "service": "inpost_locker_standard",
            "custom_attributes": {
                "target_point": order.lockerId
            },
            "parcels":[
                {
                    "template": order.size,
                    "tracking_number": null
                }
            ],
            "receiver": {
                "email": order.email,
                "phone": order.phone,
                "address": {
                    "street": order.street,
                    "building_number": order.building_number,
                    "city": order.city,
                    "post_code": order.post_code,
                    "country_code": "PL"
                }
            }
        });
        xhttp.send(text);
    }
}