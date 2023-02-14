class OrdersManager{
    static fetchOrderHtml = function(url, onResponseReceived){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                onResponseReceived(this.responseText);
            }
        }
        xhttp.open("GET", url, "true");
        xhttp.send();
    }

    static getExampleOrder(){
        return {
            lockerId: "WAW099",
            email: "example@gmail.com",
            phone: "123456789",
            first_name: "Adam",
            last_name: "Sandler",
            city: "Łódź",
            building_number: "22",
            street: "Główna",
            post_code: "11-123"
        }
    }
}