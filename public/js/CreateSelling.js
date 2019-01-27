//const host = "http://"+location.host;
const host ="http://localhost:5001/seychelles-dev-env/us-central1/app";
let CurrencyList = [];
PopulateCurrencyDropdown();
async function CreateInvoice(){
    console.log('Function called ');
    let CurrencyDetails = {};
    let result = ValidateForm();
    result = true;
    console.log('Validation result - '+ result);
    if(result)
    {
        let CurrencyFrom = $("#ddCurrencyFrom option:selected").text();
        let CurrencyTo = $("#ddCurrencyTo option:selected").text();
        let Quantity = $("#txtQuantity").val();
        let Rate = $("#txtRate").val();
        let AmountReceived = $("#txtAmountReceived").val();
        let CustomerName = $("#txtCustomerName").val();
        let PassportNumber = $("#txtPassportNumber").val();
        let Address = $("#txtAddress").val();
        let Country = $("#txtCountry").val();
        let NIN = $("#txtNIN").val();
        let PhoneNumber = $("#txtPhoneNumber").val();

        OrderDetails = {
            "OrderNo"  :  0,
            "CurrencyFrom"  : CurrencyFrom, 
            "CurrencyTo" : CurrencyTo,
            "Quantity" : Quantity,
            "Rate" : Rate,
            "AmountReceived" : AmountReceived,
            "CustomerName" : CustomerName,
            "PassportNumber":PassportNumber,
            "Address"  : Address,
            "Country":Country,
            "NIN":NIN,
            "PhoneNumber":PhoneNumber
        };
        console.log('OrderDetails - '+OrderDetails);
        $.ajax({
            url: '/api/Currency/CreateSelling',
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
    
    console.log("API call - "+host+"/api/Currency/GetCurrencyList");
    let response = await $.get("/api/Currency/GetCurrencyList");
    if (response.err) { console.log('error');}
    else { 
        //console.log('fetched response');
        console.log("GetCurrencyDetails :: response - "+response);
        CurrencyList = [];
        $.each(response, function (idx, obj) {
            var data = {"Id":obj.Id,"Code":obj.Code,"Name":obj.Name,"Value":obj.Value};
            $('#ddCurrencyFrom').append('<option value="'+obj.Id+'" data-subtext="'+obj.Code+'" attState="'+obj.Name+'">'+obj.Name+'</option>');
            //$('#ddCurrencyTo').append('<option value="'+obj.Id+'" attState="'+obj.Name+'">'+obj.Name+'</option>');
            CurrencyList.push(data);                     
         });
         
         $('#ddCurrencyFrom').selectpicker('refresh');
         //$('#ddCurrencyTo').selectpicker('refresh');
    }

    $('#ddCurrencyFrom').on('change', function(){
        $('#txtRate').val("");
        let currencyName = $("#ddCurrencyFrom option:selected").text();

        if(currencyName === "Seychellois Rupee"){       
            $('#ddCurrencyTo option').remove();
            $("#ddCurrencyTo").selectpicker("refresh");     
            $.each(CurrencyList, function(idx,obj) {
                if(obj.Name != "Seychellois Rupee"){
                    $('#ddCurrencyTo').append('<option value="'+obj.Id+'" data-subtext="'+obj.Code+'" attState="'+obj.Name+'">'+obj.Name+'</option>');
                }
              });
              $('#ddCurrencyTo').selectpicker('refresh');
        }
        else{
            let currencyTo = $("#ddCurrencyTo option:selected").text();
            if(currencyTo != "Seychellois Rupee"){
                $('#ddCurrencyTo option').remove();
                $("#ddCurrencyTo").selectpicker("refresh");
                $.each(CurrencyList, function(idx,obj) {
                    if(obj.Name === "Seychellois Rupee"){
                        $('#ddCurrencyTo').append('<option value="'+obj.Id+'" data-subtext="'+obj.Code+'" attState="'+obj.Name+'">'+obj.Name+'</option>');
                    }
                });
                $('#ddCurrencyTo').selectpicker('refresh');
            }
        }
        UpdateRate();
     });

     $('#ddCurrencyTo').on('change', function(){
        UpdateRate();
     });

     function UpdateRate(){
        let currencyFrom = $("#ddCurrencyFrom option:selected").text();
        let currencyTo = $("#ddCurrencyTo option:selected").text();
        let amount = $('#txtQuantity').val();
        let total=0;
        if(currencyFrom !="" && currencyTo !=""){
        if(currencyFrom === "Seychellois Rupee"){            
            $.each(CurrencyList, function(idx,obj) {
                if(obj.Name === currencyTo){                    
                    if(amount && !isNaN(amount))
                    {
                        total = amount * (1/obj.Value)
                    }
                    else{
                        total = (1/obj.Value);
                    }
                }
              });
            }
            else if(currencyTo === "Seychellois Rupee"){            
                $.each(CurrencyList, function(idx,obj) {
                    if(obj.Name === currencyFrom){
                        if(amount && !isNaN(amount))
                        {
                            total = amount * obj.Value;
                        }
                        else{
                            total = obj.Value
                        }
                    }
                  });
            }
            $('#txtRate').val(total);
        }
     }

     $("#txtQuantity").on("keyup",function(){
        if(!isNaN($(this).val()) && $(this).val() != 0){
            UpdateRate();
        }
        if($(this).val() == 0){
            $(this).val("");
        }
     })

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

} );