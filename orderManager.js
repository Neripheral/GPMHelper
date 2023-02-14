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
        return phone;
    }

    static parseHtmlToOrder(html){
        const pattern = /.*Telefon<\/div>[^>]+>(?<phone>[^<]*)<[^E]*Email[^:]*:(?<email>[^"]*)[^A]*Adres dostawy(?:[^>]*>){2}(?<first_name>[^<\s]*)\s*(?<last_name>[^<]*)(?:[^>]*>){4}(?<street>[^<]*?)\s*(?<building_number>[\d\/]+)<(?:[^>]*>){2}(?<postalCode>\d\d-\d\d\d) (?<city>[^<\/]*)[^P]*Paczkomat(?:[^>]*>){2}\s*(?<lockerId>[^<\s]*)\s*<(?:[^>]*>){2}\s*(?<lockerAddress>[^<]*\S)\s*</;
        
        var found = html.match(pattern);
        if(found == null)
            return false;

        var order = {
            lockerId: found.groups.lockerId,
            email: found.groups.email,
            phone: this.parsePhone(found.groups.phone),
            first_name: found.groups.first_name,
            last_name: found.groups.last_name,
            city: found.groups.city,
            building_number: found.groups.building_number,
            street: found.groups.street,
            post_code: found.groups.postalCode
        }
        return order;
    }

    static getRowElementFor(id){
        return $(".gpmlist tbody #so_row_"+id);
    }

    static setElementIcon(element, url){
        element.css("background-image", "url(" + url + ")");
    }

    static addInPostIcon(id, onClick){
        var element = this.getRowElementFor(id).children('.td_operation').first();
        element.contents().filter(function(){return this.nodeType===3;}).remove();
        element.width("140px");
        element.append(
            `<a id="inpost_icon" info="InPost">InPost</a>`
        );
        this.setElementIcon(element.find("#inpost_icon"), chrome.runtime.getURL('img/inpost_logo.png'));
        element.append(
            `<select id='inpost_size'>
                <option value='A'>A</option>
                <option value='B'>B</option>
                <option value='C'>C</option>
            </select>`
        );
        element.find("#inpost_icon").click(function(){
            onClick(element.find("#inpost_size option:selected").text());
        });
    }

    static markRowWithColor(id, color){
        this.getRowElementFor(id).css("background-color", color);
    }

    static markRowAsSent(id){
        this.markRowWithColor(id, "green");
        this.setElementIcon(this.getRowElementFor(id).find("#inpost_icon"), chrome.runtime.getURL('img/success_icon.png'));
    }

    static markRowAsError(id, originalMessage){
        var message = structuredClone(originalMessage);
        this.markRowWithColor(id, "red");
        var iconElement = this.getRowElementFor(id).find("#inpost_icon");
        this.setElementIcon(iconElement, chrome.runtime.getURL('img/error_icon.png'));
        message.problem = [];
        if(Object.hasOwn(message, "custom_attributes")){
            var locker = message.custom_attributes.find(element => Object.hasOwn(element, "target_point"));
            if(locker != false){
                message.custom_attributes.splice(message.custom_attributes.indexOf(locker), 1);
                message.problem.push("Podany paczkomat nie istnieje!")
            }
            if(message.custom_attributes.length == 0)
                delete message.custom_attributes;
        }
        if(Object.hasOwn(message, "receiver")){
            var email = message.receiver.find(element => Object.hasOwn(element, "email"));
            if(email != false){
                message.receiver.splice(message.receiver.indexOf(email), 1);
                message.problem.push("Podany email jest niepoprawny!")
            }
            if(message.receiver.length == 0)
                delete message.receiver;
        }
        iconElement.prop("title", JSON.stringify(message));
    }
}