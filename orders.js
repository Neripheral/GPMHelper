function onResponseReceived(responseText){
    const pattern = /.*Telefon<\/div>[^>]+>(?<phone>[^<]*)<[^E]*Email[^:]*:(?<email>[^"]*)[^A]*Adres dostawy(?:[^>]*>){2}(?<name>[^<]*)(?:[^>]*>){4}(?<street>[^<]*)(?:[^>]*>){2}(?<postalCode>\d\d-\d\d\d) (?<city>[^<]*)[^P]*Paczkomat(?:[^>]*>){2}\s*(?<boxId>[^<\s]*)\s*<(?:[^>]*>){2}\s*(?<boxAddress>[^<]*\S)\s*</;
    var found = responseText.match(pattern);
    console.log(found);
}


(() => {
    //OrdersManager.fetchOrderHtml("https://gpm.pl/shop/admin/order-details/id/55914", onResponseReceived);
    $(document).ready(function(){
        var inPost = new InPostManager(PrivateData.organizationId, PrivateData.token);
        inPost.tryConnect(function(response){response == false ? console.log("401: Unauthorized!") : 
            inPost.getShipments(function(response){console.log(JSON.parse(response));});    
        });
        
        inPost.addShipment({
            lockerId: "WAW099",
            email: "justanemail@gmail.com",
            phone: "123456789",
            first_name: "Adam",
            last_name: "Sandler",
            city: "Łódź",
            building_number: "22",
            street: "Główna",
            post_code: "11-123"
        }, function(response){console.log(response);});

    });
})();