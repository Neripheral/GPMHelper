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

(() => {
    function onResponseReceived(responseText){
        const pattern = /.*Telefon<\/div>[^>]+>(?<phone>[^<]*)<[^E]*Email[^:]*:(?<email>[^"]*)[^A]*Adres dostawy(?:[^>]*>){2}(?<name>[^<]*)(?:[^>]*>){4}(?<street>[^<]*)(?:[^>]*>){2}(?<postalCode>\d\d-\d\d\d) (?<city>[^<]*)[^P]*Paczkomat(?:[^>]*>){2}\s*(?<boxId>[^<\s]*)\s*<(?:[^>]*>){2}\s*(?<boxAddress>[^<]*\S)\s*</;
        var found = responseText.match(pattern);
        console.log(found);
    }

    OrdersManager.fetchOrderHtml("https://gpm.pl/shop/admin/order-details/id/55914", onResponseReceived);
})();