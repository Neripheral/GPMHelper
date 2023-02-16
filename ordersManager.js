class OrdersManager{
    static fetchOrderHtml(url, onResponseReceived){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                onResponseReceived(this.responseText);
            }
        }
        xhttp.open("GET", url, "true");
        xhttp.send();
    }

    static fetchOrderById(id, onResponseReceived){
        var url = PrivateData.url_order_root + id;
        this.fetchOrderHtml(url, onResponseReceived);
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

    static parsePhone(phone){
        phone = phone.replace(/[^\d]/g, "");
        if(phone.length == 11 && phone.slice(0, 2) === "48")
            return phone.slice(2);
        if(phone.length == 10 && phone.slice(0, 1) === "0")
            return phone.slice(1);
        return phone;
    }

    static parseHtmlToOrder(html){
        const pattern = /.*Telefon<\/div>[^>]+>(?<phone>[^<]*)<[^E]*Email[^:]*:(?<email>[^"]*)[^A]*Adres dostawy(?:[^>]*>){2}(?<name>[^<]*)(?:[^>]*>){4}(?<street>[^<]*?)\s*(?<building_number>[\d\w\/]+)<(?:[^>]*>){2}(?<postalCode>\d\d-\d\d\d) (?<city>[^<\/]*)[^P]*Paczkomat(?:[^>]*>){2}\s*(?<lockerId>[^<\s]*)\s*<(?:[^>]*>){2}\s*(?<lockerAddress>[^<]*\S)\s*</;
        
        var found = html.match(pattern);
        if(found == null)
            return false;

        var order = {
            lockerId: found.groups.lockerId,
            email: found.groups.email,
            phone: this.parsePhone(found.groups.phone),
            name: found.groups.name,
            city: found.groups.city,
            building_number: found.groups.building_number,
            street: found.groups.street,
            post_code: found.groups.postalCode
        }
        return order;
    }

    static processOrder(id, onOrderReceived){
        this.fetchOrderById(id, function(html){
            onOrderReceived(OrdersManager.parseHtmlToOrder(html));
        });
    }

    static initRowInPostForId(id, onClick){
        OrdersListView.initRowForInPost(id, onClick);
    }

    static markRowAsSent(id){
        var iconImage = chrome.runtime.getURL('img/success_icon.png');
        OrdersListView.setRowIcon(id, iconImage);
        OrdersListView.markRowWithColor(id, "green");
    }

    static #getReadableErrorMessage(rawError){
        var error = structuredClone(rawError);
        error.problem = [];
        if(Object.hasOwn(error, "custom_attributes")){
            var locker = error.custom_attributes.find(element => Object.hasOwn(element, "target_point"));
            if(locker != false){
                error.custom_attributes.splice(error.custom_attributes.indexOf(locker), 1);
                error.problem.push("Podany paczkomat nie istnieje!")
            }
            if(error.custom_attributes.length == 0)
                delete error.custom_attributes;
        }
        if(Object.hasOwn(error, "receiver")){
            var email = error.receiver.find(element => Object.hasOwn(element, "email"));
            if(email != false){
                error.receiver.splice(error.receiver.indexOf(email), 1);
                error.problem.push("Podany email jest niepoprawny!")
            }
            var phone = error.receiver.find(element => Object.hasOwn(element, "phone"));
            if(phone != false){
                error.receiver.splice(error.receiver.indexOf(phone), 1);
                error.problem.push("Podany telefon jest niepoprawny!")
            }
            if(error.receiver.length == 0)
                delete error.receiver;
        }
        return JSON.stringify(error);
    }

    static markRowAsError(id, error){
        var iconImage = chrome.runtime.getURL('img/error_icon.png');
        OrdersListView.setRowIcon(id, iconImage);
        OrdersListView.markRowWithColor(id, "red");
        OrdersListView.getInPostIconForId(id).prop("title", this.#getReadableErrorMessage(error));
    }

    static #addInPostIconOnClickForId(id, onClick){
        var selectionElement = OrdersListView.getInPostSizeSelectForId(id);
        OrdersListView.getInPostIconForId(id).click(function(){
            onClick(selectionElement.find("option:selected").text());
        });
    }

    static prepareRowInPostForId(id, onClick){
        OrdersListView.getEveryInPostElementForId(id).show();
        this.#addInPostIconOnClickForId(id, onClick);
    }

    static initInpost(){
        OrdersListView.getAllRows().each(function(index, row){
            var id = OrdersListView.getRowId($(row));
            OrdersListView.initRowForInPost(id);
        });
    }

    static addDownloadRegistryButton(onClick){
        OrdersListView.addPDFButton(chrome.runtime.getURL('img/inpost_logo.png')).click(onClick);
    }
}