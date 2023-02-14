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
}