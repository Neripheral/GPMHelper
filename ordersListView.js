class OrdersListView{
    static HTML_ICON_CLASS = "inpost_icon";
    static HTML_SIZE_SELECT_CLASS = "inpost_size";
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
}