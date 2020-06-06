(function ($) {
    'use strict';

    var token = localStorage.getItem('token');

    $('#pricing-delete').click(function (e) {
        e.preventDefault();
        // get all values of form for job seeker
        const pricing_id = $('.pricing_id').val();
        if (!pricing_id) {
            return;
        }

        $.ajax({
            method: 'DELETE',
            url: API_URL + '/pricing/' + pricing_id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            data: "",
            success: function (response) {
                console.log(response);
                if (response.data) {
                    // TODO (set token in local storage, need to chnage in the API)
                    location.href = "/admin/pricing-plan";
                }
            },
            error: function (xhr, status, error) {
                // if error from the validator from backend then handle it and show in the frontend
                if (xhr.status === 400) {
                    const error = xhr.responseJSON.errors;
                    $("#message_job").text(error);
                }
            }
        })
    });


    $('#create-pricing-plan').click(function (e) {
        e.preventDefault();
        // get all values of form for job seeker
        const name = $('#name').val();
        const amount = $('#amount').val();
        const short_description = $('#short_description').val();
        const main_description_1 = $('#main_description_1').val();
        const main_description_2 = $('#main_description_2').val();
        const main_description_3 = $('#main_description_3').val();
        const main_description_4 = $('#main_description_4').val();
        const main_description_5 = $('#main_description_5').val();
        const main_description_6 = $('#main_description_6').val();
        const main_description_7 = $('#main_description_7').val();


        let dataObject = { main_description_1, short_description, amount, name };

        $("#error_msg").text("Testtest");
        let isReturn = false;
        for (const [key, value] of Object.entries(dataObject)) {
            if (value === '') {
                isReturn = true;
                // set focus on the fields, so that it can be edited
                document.getElementById(`${key}`).focus();
                $(`#${key}`).addClass('border-red');
            } else {
                $(`#${key}`).removeClass('border-red');
            }
        }
        if (isReturn) return;

        // add other information into dataObject
        dataObject.amount = parseInt(amount);
        dataObject.main_description_2 = main_description_2;
        dataObject.main_description_3 = main_description_3;
        dataObject.main_description_4 = main_description_4;
        dataObject.main_description_5 = main_description_5;
        dataObject.main_description_6 = main_description_6;
        dataObject.main_description_7 = main_description_7;

        $.ajax({
            method: 'POST',
            url: API_URL + '/pricing/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            data: JSON.stringify(dataObject),
            success: function (response) {
                console.log(response);
                if (response.data) {
                    // TODO (set token in local storage, need to chnage in the API)
                    location.href = "/admin/pricing-plan";
                }
            },
            error: function (xhr, status, error) {
                // if error from the validator from backend then handle it and show in the frontend
                if (xhr.status === 400) {
                    const error = xhr.responseJSON.errors;
                    $("#error_msg").text(error);
                }
            }
        })
    });
})(jQuery);