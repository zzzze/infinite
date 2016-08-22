jQuery(document).ready( function($) {
    $("#selectRole").change(function(){
        //alert($(this).val());
        $.ajax({
            type: "POST",
            data: "role=" + $(this).val() + "&action=getUser_action",
            url: ajaxurl,
            beforeSend: function () {
                
                $("#spinner_selectUser").css("display","block");
                //alert('hhhh');
            },
            success: function ($data) {
                $("#spinner_selectUser").css("display","none");
                if ($data){
                    $("#selectUser").html($data);
                }else{
                }
            }
        });
    });
    
    
    $("#product_major").change(function (){
        $.ajax({
            type: "POST",
            data: "major=" + $(this).val() + "&action=getSubMajor_action",
            url: ajaxurl,
            beforeSend: function (){
                $("#spinner_major").css("display","block");
            },
            success: function ($data){
                $("#spinner_major").css("display","none");
                $("#product_subMajor").html($data)
                .css("display","inline");
            }
        });
    });
});