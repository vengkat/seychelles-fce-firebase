
function ValidateForm(){    
    result = true;
    $("input").each(function() {
        var id =  $(this)[0].id ;
        var input = $("#"+id);
        if(input.hasClass("required")){
            var valResult = ApplyValidation(id);
            if(!valResult){
                result = false;
            }
        }
    });
    $("select").each(function() {
        var id =  $(this)[0].id ;
        var input = $("#"+id);
        console.log("id - "+id);
        console.log("value - "+input.val());
        if(input.hasClass("required")){
            var valResult = ApplyValidation(id);
            if(!valResult){
                result = false;
            }
        }
    });
    return result;
}

function ApplyValidation(id){
    if(IsEmptyInput($("#"+id))){
        $("#"+id).addClass("requiredBox");
        $("#"+id).focus();
        $("#err"+id).css("display", "block");
        $("#err"+id).html($("#"+id).attr("name") + " is required");
    }else{
        $("#"+id).removeClass("requiredBox");
        $("#err"+id).css("display", "none");
        $("#err"+id).html("");
    }
}

function IsEmptyInput(input){
    if(input.val()){
        return false;
    }
    else{
        return true;
    }
}