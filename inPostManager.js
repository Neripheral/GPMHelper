class InPostManager{
    constructor(companyId, token){
        this.companyId = companyId;
        this.token = token;
        this.root = "https://sandbox-api-shipx-pl.easypack24.net/v1/";
        //this.root = "https://api-shipx-pl.easypack24.net/v1/";
    }

    tryConnect(onResponseReceived){
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

    getShipments(onResponseReceived){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            onResponseReceived(this.responseText);
        }
        var url = this.root + "organizations/" + this.companyId + "/shipments";
        xhttp.open("GET", url, "true");
        xhttp.setRequestHeader("Authorization", 'Bearer ' + this.token);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    }

    /**
     * 
     * @param {*} order Order object. It consists of:
     *              lockerId
     *              email
     *              phone          must consist of 9 digits
     *              first_name     
     *              last_name      
     *              city      
     *              building_number
     *              street
     *              post_code
     * @param {*} onResponseReceived 
     */
    addShipment(order, onResponseReceived){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            onResponseReceived(this.responseText);
        }
        var url = this.root + "organizations/" + this.companyId + "/shipments";
        xhttp.open("POST", url, "true");
        xhttp.setRequestHeader("Authorization", 'Bearer ' + PrivateData.token);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var text = JSON.stringify({
            "service": "inpost_locker_standard",
            "custom_attributes": {
                "target_point": order.lockerId
            },
            "parcels":[
                {
                    "template": "small",
                    "tracking_number": null
                }
            ],
            "receiver": {
                "first_name": order.first_name,
                "last_name": order.last_name,
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