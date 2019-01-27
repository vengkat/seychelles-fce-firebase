
const host = "https://"+location.host;
let currencyId = 0;
let docId = 0;
//Show popup
function ShowPopup(Id,Name,Code,Value){
    //console.log("Getting Data");
    docId = Id;
    console.log(`Id - ${Id},Name - ${Name},Code - ${Code},Value - ${Value},`);
    //const CurrencyDetails = await GetCurrencyDetails(id);
    // console.log("ShowPopup - Name - "+ CurrencyDetails.Name);
    // console.log("ShowPopup - Value - "+ CurrencyDetails.Value);
    $("#txtCurrencyName").val(Name);
    $("#txtValue").val(Value);
    $("#txtCode").val(Code);
    //console.log("Showing popup"); 
    $("#modalUpdateCurrency").modal("show");
  }

//Hide popup

//Get Currency details list
async function GetCurrencyDetails(id){
    let CurrencyDetails = {};
    console.log("API call - /api/Currency/GetCurrencyList/"+id);
    let response = await $.get("/api/Currency/GetCurrencyList/"+id);
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
        let Name = $("#txtCurrencyName").val();
        let Code = $("#txtCode").val();
        let Value = $("#txtValue").val();
        let CurrencyDetails = {
            Id   : docId,
            Name : Name,
            Code : Code,
            Value :Value
        }; 

        $("#modalUpdateCurrency").modal("hide");
        $("#txtCurrencyName").val("");
        $("#txtCode").val("");
        $("#txtValue").val("");
        console.log("API Call - /api/Currency/UpdateCurrencyDetails/"+JSON.stringify(CurrencyDetails));
        
        $.ajax({
            url: '/api/Currency/UpdateCurrencyDetails',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({CurrencyDetails : CurrencyDetails}),
            success: function (data) {
                console.log('Success - '+data);
                $("#modalSuccess").modal("show");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('error - '+errorThrown);
                $("#modalSuccess").modal("show");
                //location.reload();
             }            
        });
        //location.reload();
        // let response = await $.post(host+"/api/Currency/UpdateCurrencyDetails/",JSON.stringify({CurrencyDetails : CurrencyDetails}));
        // if (response.err) { console.log('error');}
        // else { 
        //     console.log('update success - '+response);
        //     if(response === "Success"){
        //         location.reload();
        //     }
        // }
    }
}

function ReloadCurrencyMaster(){
    location.reload();
}