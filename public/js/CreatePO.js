const host = "https://"+location.host;
PopulateCurrencyDropdown();
async function CreatePO(){
    let CurrencyDetails = {};
    let result = ValidateForm();
    console.log('Validation result - '+ result);
    if(result)
    {
        let FMValue = $("#txtFMTC").val();
        let currencyName = $("#txtCurrencyName").val();
        let amount = $("#txtAmount").val();
        let rate = $("#txtRate").val();
        let amtPaid = $("#txtAmountPaid").val();
        let customerName = $("#txtCustomerName").val();
        let address1 = $("#txtAddress1").val();
        let address2 = $("#txtAddress2").val();
        let address3 = $("#txtAddress3").val();
        CurrencyDetails = {
            CurrencyName : currencyName,
            FMTC : FMValue,
            Amount : amount,
            Rate : rate,
            AmountPaid : amtPaid,
            CustomerName : customerName,
            Address  :{
            AddressLine1   :  address1,
            AddressLine2   :  address2,
            AddressLine3   :  address3
            }
        };
        console.log(CurrencyDetails);
        let response = await $.post(host+"/api/Currency/CreatePO/"+JSON.stringify(CurrencyDetails));
        if (response.err) { console.log('error');}
        else { 
            console.log('update success - '+response);
            if(response === "Success"){
                $("#modalCreateOrder").modal("show");
            }
        } 
    }
}

async function PopulateCurrencyDropdown(){
    let CurrencyList = [];
    console.log("API call - "+host+"/api/Currency/GetCurrencyList");
    let response = await $.get(host+"/api/Currency/GetCurrencyList");
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
}

function RedirectToHome(){
    location.href = "/Index";
}