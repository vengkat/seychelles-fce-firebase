
const host = "https://"+location.host;
let currencyId = 0;
let docId = 0;
//Show popup
async function ShowPopup(id){
    //console.log("Getting Data");
    docId = id;
    console.log("ShowPopup - id - "+id);
    const CurrencyDetails = await GetCurrencyDetails(id);
    console.log("ShowPopup - Name - "+ CurrencyDetails.Name);
    console.log("ShowPopup - SellingMax - "+ CurrencyDetails.SellingMax);
    $("#txtCurrencyName").val(CurrencyDetails.Name);
    $("#txtBuyingMinimum").val(CurrencyDetails.BuyingMin);
    $("#txtSellingMaximum").val(CurrencyDetails.SellingMax);
    //console.log("Showing popup"); 
    $("#modalUpdateCurrency").modal("show");
  }

//Hide popup

//Get Currency details list
async function GetCurrencyDetails(id){
    let CurrencyDetails = {};
    console.log("API call - "+host+"/api/Currency/GetCurrencyList/"+id);
    let response = await $.get(host+"/api/Currency/GetCurrencyList/"+id);
    if (response.err) { console.log('error');}
    else { 
        //console.log('fetched response');
        console.log("GetCurrencyDetails :: response - "+response);
        return response;
    }
}
//Add new data



//Update Data
async function UpdateCurrencyDetails(){    
    if(docId){
        let currencyName = $("#txtCurrencyName").val();
        let buyingMinimum = $("#txtBuyingMinimum").val();
        let sellingMaximum = $("#txtSellingMaximum").val();
        let CurrencyDetails = {
            Id   : docId,
            Name : currencyName,
            BuyingMin : buyingMinimum,
            SellingMax :sellingMaximum
        }; 
        $("#modalUpdateCurrency").modal("hide");
        $("#txtCurrencyName").val("");
        $("#txtBuyingMinimum").val("");
        $("#txtSellingMaximum").val("");
        console.log("API Call - "+host+"/api/Currency/UpdateCurrencyDetails/"+JSON.stringify(CurrencyDetails));
        let response = await $.post(host+"/api/Currency/UpdateCurrencyDetails/"+JSON.stringify(CurrencyDetails));
        if (response.err) { console.log('error');}
        else { 
            console.log('update success - '+response);
            if(response === "Success"){
                location.reload();
            }
        }
    }
}