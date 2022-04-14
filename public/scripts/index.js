$(function() {
    $( ".aceitar, .recusar" ).click(function() {
        const buttonClicked = $(this).attr('class') 
        const endpoint = buttonClicked == 'aceitar' ? 'validateUser' :  'removeUser'
        const userEmail = $(this).attr('data-email')
        const data = { email: userEmail }
        $.ajax({
            type: 'POST',
            url: `/${endpoint}`,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: () =>{
                window.location.reload(true);
            }
        });
    });
});