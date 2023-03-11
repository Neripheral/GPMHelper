class OrdersListView{
    static HTML_ICON_CLASS = "inpost_icon";
    static HTML_SIZE_SELECT_CLASS = "inpost_size";
    static HTML_ONOFFSWITCH_ID = "inpost_onoff_switch";
    static HTML_VALID_INPOST_CLASS = "inpost_valid_row";
    static HTML_INPOST_CLASS = "inpost_stuff";

    static getAllRows(){
        return $(".gpmlist tbody tr");
    }

    static getRowForId(id){
        return $(".gpmlist tbody #so_row_"+id);
    }

    static getOperationsBoxForId(id){
        return this.getRowForId(id).children('.td_operation').first();
    }

    static getEveryInPostElementForId(id){
        return this.getRowForId(id).find("." + this.HTML_INPOST_CLASS);
    }

    static getInPostIconForId(id){
        return this.getRowForId(id).find("." + this.HTML_ICON_CLASS);
    }

    static getInPostSizeSelectForId(id){
        return this.getRowForId(id).find("." + this.HTML_SIZE_SELECT_CLASS)
    }

    static getRowId(row){
        return row.attr("id").match(/so_row_(?<id>\d*)/)[1];
    }

    static initRowForInPost(id){
        var element = this.getOperationsBoxForId(id);
        
        //remove all gibberish like whitespaces from the element
        element.contents().filter(function(){return this.nodeType===3;}).remove();
        
        element.width("140px");
        this.#addInPostControlsForId(id);
        this.getEveryInPostElementForId(id).hide();
    }

    static #setElementIcon(element, url){
        element.css("background-image", "url(" + url + ")");
    }

    static #addInPostControlsForId(id){
        var element = this.getOperationsBoxForId(id);
        element.append(
            `<a class="` + this.HTML_INPOST_CLASS + " " + this.HTML_ICON_CLASS + `" info="InPost">InPost</a>`
        );
        
        var iconElement = this.getInPostIconForId(id);
        var iconImage = chrome.runtime.getURL('img/inpost_logo.png');
        this.#setElementIcon(iconElement, iconImage);

        element.append(
            `<select class='` + this.HTML_INPOST_CLASS + " " + this.HTML_SIZE_SELECT_CLASS + `'>
                <option value='A'>A</option>
                <option value='B'>B</option>
                <option value='C'>C</option>
            </select>`
        );
    }

    static setRowIcon(id, url){
        this.#setElementIcon(this.getInPostIconForId(id), url);
    }    

    static markRowWithColor(id, color){
        this.getRowForId(id).css("background-color", color);
    }

    static getPDFHolder(){
        return $(".adminListBox form.search-form");
    }

    static addPDFButton(iconURL){
        this.getPDFHolder().find(".clear").remove();
        this.getPDFHolder().append(`<button type='button' id='inpost_registry_button' style='margin-left: 10px;'><img id="inpost_registry_button_icon" style="height: 21px; width: 24px;"><b style="margin-left: 5px;">InPost PDF</b></button>`);
        this.#setElementIcon(this.getPDFHolder().find("#inpost_registry_button_icon"), iconURL);
        return this.getPDFHolder().find("#inpost_registry_button");
    }

    static getOnOffSwitchHolder(){
        return this.getPDFHolder();
    }

    static addOnOffSwitch(){
        this.getOnOffSwitchHolder().append(`<label style="padding: 4px;"><b style="font-size: 20px;">Operacje InPost:</b> <input id="` + this.HTML_ONOFFSWITCH_ID + `" type="checkbox"></label>`);
        return this.getOnOffSwitchHolder().find('#' + this.HTML_ONOFFSWITCH_ID);
    }

    static markRowAsValid(id){
        this.getEveryInPostElementForId(id).addClass(this.HTML_VALID_INPOST_CLASS);
    }

    static getAllValidFields(){
        return $("." + this.HTML_VALID_INPOST_CLASS);
    }
}