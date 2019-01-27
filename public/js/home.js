
const host = "https://"+location.host;
let currencyId = 0;
//Show popup
async function ShowPopup(id){
    //console.log("Getting Data");
    currencyId = id;
    const CurrencyDetails = await GetCurrencyDetails(id);
    $("#txtCurrencyName").val(CurrencyDetails.Name);
    $("#txtCurrencyVal").val(CurrencyDetails.Value);
    //console.log("Showing popup"); 
    $("#modalUpdateCurrency").modal("show");
    console.log(CurrencyDetails);
  }

  function RedirectToViewInvoice(orderNo){
      location.href="/ViewSelling/"+orderNo;
      console.log("/ViewSelling/"+orderNo);
  }
  function RedirectToViewPO(orderNo){
    location.href="/ViewBuying/"+orderNo;
}
//Hide popup

//Get Currency details list
async function GetCurrencyDetails(id){
    let CurrencyDetails = {};
    let response = await $.get(host+"/api/Currency/GetCurrencyList/"+id);
    if (response.err) { console.log('error');}
    else { 
        console.log('fetched response');
        console.log(response);
        return response;
    }
}
//Add new data



//Update Data
async function UpdateCurrencyDetails(){    
    if(currencyId){
        let cName = $("#txtCurrencyName").val();
        let cValue = $("#txtCurrencyVal").val();
        let CurrencyDetails = {
            Id   : currencyId,
            Name : cName,
            Value: cValue
        }; 
        $("#modalUpdateCurrency").modal("hide");
        $("#txtCurrencyName").val("");
        $("#txtCurrencyVal").val("");
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

$(document).ready(function() {
    // $('#tblInvoiceOrder').DataTable();
    // $('#tblPurchaseOrder').DataTable();    
} );