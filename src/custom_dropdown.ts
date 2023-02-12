


function populate_dropdown(_country_id_selected: string, _url: string) {

    let dropdown: HTMLSelectElement = <HTMLSelectElement>document.getElementById("country-dropdown")!;

    let defaultOption: HTMLOptionElement = document.createElement("option");
    defaultOption.text = "Choose a country";
    defaultOption.disabled = true;
    dropdown.add(defaultOption);
    
    const request = new XMLHttpRequest();
    request.open("GET", _url, true);
    
    request.onload = function() {
        if (request.status === 200) {
            const data = JSON.parse(request.responseText)[0]["data"];
            let option;
            for (let i = 0; i < data.length; i++) {
    
                let country_name = data[i].country_name;
                let country_id = data[i].country_id;
                option = document.createElement("option");
                option.text = country_name;
                option.value = country_id;
                if (country_id == _country_id_selected) {
                    option.selected = true;
                }
                dropdown.add(option);
            }
        } else {
            // Reached the server, but it returned an error
        }   
    }
    
    request.onerror = function() {
        console.error("An error occurred fetching the JSON from " + _url);
    };
    
    request.send();

}

export { populate_dropdown };