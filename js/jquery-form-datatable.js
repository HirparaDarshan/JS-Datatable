$(document).ready(function() {
    let table = $('#DataTable').DataTable({
        "order": [],
        "columnDefs": [{ "targets": 0 , "orderable": false}, 
                        {"targets": [2,6],  render: function(data, type, row) {
                        if (type === 'display' && data.length > 10) {
                        return '<span title="' + data + '">' + data.substr(0, 10) + '...</span>';
                        }
                        return data;
                    }
        }]
    });
    let index=null;
    table.on('draw.dt', function() {
        let i = 1;
        table.cells(null, 0).every(function (cell) {
            this.data(i++);
        });
    });

 $("#datatable-form").validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        fname:{
            required: true,
            noDigits: true
        },
        optradio:{
            required: true
        },
        country:{
            required: true,
        },
        hobbies : {
            required: true,
        }
    },
    messages: {
        email: {
            required: "Please enter your email address.",
            email: "Please enter a valid email address."
        },
        fname:{
            required:"Name cannot be empty",
            noDigits: "Name cannot have a number or special character."
        },
        optradio:{
            required: "Please select a Gender"
        },
        country:{
            required: "Please select a country"
        },
        hobbies:{
            required: "Please select at least one sport"
        }
    },
    errorPlacement: function(error, element) {
            if (element.attr("name")=="email"){
                error.appendTo("#email-message"); 
            } else if (element.attr("name")=="fname"){
                error.appendTo("#name-msg");
            } else if (element.is(":radio")){
                error.appendTo("#malefemale-msg");
            } else if (element.attr("name")=="country"){
                error.appendTo("#country-msg");
            } else if (element.attr("name")=="hobbies"){
                error.appendTo("#hobbies-msg");
            }
        },

    submitHandler: function (form) {
        let email = $('#email').val();
        let name = $('#fname').val();
        let gender = $('input[name="optradio"]:checked').val();
        let country = $('#country').val();
        let selectedInterests = [];
        $('input[name="hobbies"]:checked').each(function() {
            selectedInterests.push($(this).val());
        });
        let hobbies = selectedInterests.join(', ');
        let about = $('#about').val();

        if(index===null){ 
        table.row.add(["", email, name, gender, country, hobbies, about,
        '<button class= "btn btn-warning editbtn">Edit</button> <button class= "btn btn-danger delbtn">Delet</button>']).draw();
        }else { 
            table.row(index).data(["", email, name, gender, country, hobbies, about,
        '<button class= "btn btn-warning editbtn">Edit</button> <button class= "btn btn-danger delbtn">Delet</button>']).draw();
            index=null;
            $("#register").text("Submit");
        }
        form.reset();
    }
    });


$.validator.addMethod("strongPassword", function(value, element) {
    return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/.test(value);
});


$.validator.addMethod("noDigits", function(value, element) {
    return this.optional(element) || /^[A-Za-z]+$/.test(value);
}); 
    
    // edit button
         $('#DataTable').on('click','.editbtn',function(){
            let row = $(this).parents('tr'); 
            index = table.row(row);
            let data= index.data();
            $("#email").val(data[1]);
            $("#fname").val(data[2]);
            $('input[name="optradio"][value="' + data[3] + '"]').prop('checked', true);
            $("#country").val(data[4]);
                let hobbies = data[5].split(',');
                $.each(hobbies, function(i, hobby) {
                    $('input[name="hobbies"][value="' + $.trim(hobby) + '"]').prop('checked', true);
                });
            $("#about").val(data[6]);
            $("#register").text("Update");
        });
    // delet button 
        $("#DataTable tbody").on("click",".delbtn",function(){
        let row = $(this).parents("tr");
        table.row(row).remove().draw();
        });            
});