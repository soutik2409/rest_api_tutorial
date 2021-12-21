$(document).ready( () => {
    $('#Studentdetails').click( () => {
        console.log("kli");
        $.getJSON("../api/students/"+$('#roll').val(), (result,status) => {
            console.log(result);
        });
    });
});