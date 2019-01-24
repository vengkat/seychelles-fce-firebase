//const host = "http://"+location.host;
const host ="http://localhost:5001/seychelles-dev-env/us-central1/app";
PopulateCurrencyDropdown();
async function CreateInvoice(){
    console.log('Function called ');
    let CurrencyDetails = {};
    let result = ValidateForm();
    result = true;
    console.log('Validation result - '+ result);
    if(result)
    {
        let FMValue = $("#txtFMTC").val();
        let currencyId = $("#ddCurrency").val();
        let currencyName = $("#ddCurrency option:selected").text();
        let amount = $("#txtAmount").val();
        let rate = $("#txtRate").val();
        let amtReceived = $("#txtAmountReceived").val();
        let customerName = $("#txtCustomerName").val();
        let address1 = $("#txtAddress1").val();
        let address2 = $("#txtAddress2").val();
        let address3 = $("#txtAddress3").val();
        OrderDetails = {
            "OrderNo"  :  0,
            "CurrencyId"  : currencyId, 
            "CurrencyName" : currencyName,
            "FM" : FMValue,
            "Amount" : amount,
            "Rate" : rate,
            "AmountReceived" : amtReceived,
            "CustomerName" : customerName,
            "Address"  :{
            "AddressLine1"   :  address1,
            "AddressLine2"   :  address2,
            "AddressLine3"   :  address3
            }
        };
        
        $.ajax({
            url: '/api/Currency/CreateInvoice',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(OrderDetails),
            success: function (data) {
                console.log(data);
                $("#modalCreateOrder").modal("show");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('error - '+errorThrown);
                $("#modalCreateOrder").modal("show");
             }            
        });
        // let response = await $.post(host+"/api/Currency/CreateInvoice/",+JSON.stringify(OrderDetails));
        // if (response.err) { console.log('error');}
        // else { 
        //     console.log('Success - '+response);
        //     if(response === "Success"){
        //         $("#modalCreateOrder").modal("show");
        //     }
        // }    
    }
}

// async function PopulateCurrencyDropdown(){
//     let CurrencyList = [];
//     console.log("API call - "+host+"/api/Currency/GetCurrencyList");
//     let response = await $.get(host+"/api/Currency/GetCurrencyList");
//     if (response.err) { console.log('error');}
//     else { 
//         //console.log('fetched response');
//         console.log("GetCurrencyDetails :: response - "+response);
//         $.each(response, function (idx, obj) {
//             var data = {"id":obj.Id,"value":obj.Name};
//             $('#ddCurrency').append('<option value="'+obj.Id+'" attState="'+obj.Name+'">'+obj.Name+'</option>');
//             CurrencyList.push(data);                     
//          });
//          console.log(CurrencyList);  
//          $('#ddCurrency').selectpicker('refresh');
//     }
// }

async function PopulateCurrencyDropdown(){
    let CurrencyList = [];
    console.log("API call - "+host+"/api/Currency/GetCurrencyList");
    let response = await $.get("/api/Currency/GetCurrencyList");
    if (response.err) { console.log('error');}
    else { 
        //console.log('fetched response');
        console.log("GetCurrencyDetails :: response - "+response);
        $.each(response, function (idx, obj) {
            var data = {"id":obj.Id,"value":obj.Name};
            $('#ddCurrency').append('<option value="'+obj.Id+'" attState="'+obj.Name+'">'+obj.Name+'</option>');
            CurrencyList.push(data);                     
         });
         console.log(CurrencyList);  
         $('#ddCurrency').selectpicker('refresh');
    }

    // $.ajax({
    //     url: host+"/api/Currency/GetCurrencyList",
    //     type: 'GET',
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     success: function (response) {
    //         console.log("GetCurrencyDetails :: response - "+data);
    //         $.each(response, function (idx, obj) {
    //             var data = {"id":obj.Id,"value":obj.Name};
    //             $('#ddCurrency').append('<option value="'+obj.Id+'" attState="'+obj.Name+'">'+obj.Name+'</option>');
    //             CurrencyList.push(data);                     
    //         });
    //         console.log(CurrencyList);  
    //      $('#ddCurrency').selectpicker('refresh');
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown) {
    //         console.log('error - '+textStatus);
    //      }            
    // });
}

function RedirectToHome(){
    location.href = "/Home";
}


$(document).ready(function() {
// var options = [{"id":"1","value":"aa"},{"id":"2","value":"bb"}];
// var jsonData = JSON.stringify(options);

     //PopulateCurrencyDropdown();
} );