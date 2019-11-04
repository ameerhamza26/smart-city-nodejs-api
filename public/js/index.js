$(document).ready(function(){
    $('#btn-register-step-one').click(function() {
        $.post('/check-username', 
        { userName: $('#survey-title-text').val()
        }, function(data,status) {
        });
    });
})