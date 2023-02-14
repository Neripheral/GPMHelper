class InPostManager{
    constructor(companyId, token){
        this.companyId = companyId;
        this.token = token + "fs";
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
        var url = this.root + "organizations/" + this.organizationId;
        xhttp.open("GET", url, "true");
        xhttp.setRequestHeader("Authorization", 'Bearer ' + this.token);
        xhttp.send();
    }
}