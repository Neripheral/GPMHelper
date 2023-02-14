(() => {
    $(document).ready(function(){
        main();
    });
})();

function onResponseReceived(responseText){
    const pattern = /.*Telefon<\/div>[^>]+>(?<phone>[^<]*)<[^E]*Email[^:]*:(?<email>[^"]*)[^A]*Adres dostawy(?:[^>]*>){2}(?<name>[^<]*)(?:[^>]*>){4}(?<street>[^<]*)(?:[^>]*>){2}(?<postalCode>\d\d-\d\d\d) (?<city>[^<]*)[^P]*Paczkomat(?:[^>]*>){2}\s*(?<boxId>[^<\s]*)\s*<(?:[^>]*>){2}\s*(?<boxAddress>[^<]*\S)\s*</;
    var found = responseText.match(pattern);
    console.log(found);
}

function main(){

}