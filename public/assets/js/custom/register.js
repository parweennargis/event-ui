(function ($) {
    $('#register-job-seeker').click(function (e) {
        e.preventDefault();
        // get all values of form for job seeker
        const first_name = $('#first_name_job').val();
        const last_name = $('#last_name_job').val();
        const email = $('#email_job').val();
        const phone_no = $('#phone_no_job').val();
        const password = $('#password_job').val();
        const confirm_password = $('#confirm_password_job').val();
        const address = $('#address_job').val();
        const postal_code = $('#postal_code_job').val();
        const role_type = 'JOBSEEKER';
        const total_experience = $('#total_experience_job').val();
        const occupation = $('#occupation_job').val();
        const heard_about = $('#heard_about_job').val();
        const occupation_looking_for = $('#occupation_looking_for_job').val();
        const license_number = $('#license_number').val();
        const license_type = $('#license_type').val();
        const license_date_of_expiry = $('#license_date_of_expiry').val();
        const driving_record_rating = $('#driving_record_rating').val();

        const dataObject = { heard_about, occupation_looking_for, total_experience, occupation, postal_code, address, confirm_password, password, phone_no, email, last_name, first_name };

        $("#message_job").text("");
        let isReturn = false;
        for (const [key, value] of Object.entries(dataObject)) {
            const newKey = key + '_job';
            if (value === '') {
                isReturn = true;
                // set focus on the fields, so that it can be edited
                document.getElementById(`${newKey}`).focus();
                $(`#${newKey}`).addClass('border-red');
            } else {
                $(`#${newKey}`).removeClass('border-red');
            }
        }
        if (isReturn) return;

        // validation on the password and confirm password values
        if (password !== confirm_password) {
            // set alert msg
            $("#message_job").text("Confirm Password should match with Password");
            // set focus on the confirm password field, so that it can be edited
            document.getElementById("confirm_password_job").focus();
            // set the border color to red for both fields
            $('.password').addClass('border-red');
            $('.confirm_password').addClass('border-red');
            return;
        }

        // delete the confirm_password key from the dataObject
        delete dataObject.confirm_password;
        // add role_type in the object
        dataObject.role_type = role_type;
        dataObject.license_number = license_number;
        dataObject.license_type = license_type;
        dataObject.license_date_of_expiry = license_date_of_expiry;
        dataObject.driving_record_rating = driving_record_rating;

        $.ajax({
            method: 'POST',
            url: '/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(dataObject),
            success: function (response) {
                console.log(response);
                if (response.data) {
                    // TODO (set token in local storage, need to chnage in the API)
                    location.href = "/";
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

    // Exhibitor Form
    $('#register-exhibitor').click(function (e) {
        e.preventDefault();
        // get all values of form for job seeker
        const first_name = $('#first_name_exhibitor').val();
        const last_name = $('#last_name_exhibitor').val();
        const email = $('#email_exhibitor').val();
        const phone_no = $('#phone_no_exhibitor').val();
        const password = $('#password_exhibitor').val();
        const confirm_password = $('#confirm_password_exhibitor').val();
        const address = $('#address_exhibitor').val();
        const postal_code = $('#postal_code_exhibitor').val();
        const company_website = $('#company_website_exhibitor').val();
        const company_name = $('#company_name_exhibitor').val();
        const role_type = 'EXHIBITOR';
        const heard_about = $('#heard_about_exhibitor').val();
        const current_position = $('#current_position_exhibitor').val();

        const dataObject = { heard_about, current_position, company_name, postal_code, address, confirm_password, password, phone_no, email, last_name, first_name };

        $("#message_exhibitor").text("");
        let isReturn = false;
        for (const [key, value] of Object.entries(dataObject)) {
            const newKey = key + '_exhibitor';
            if (value === '') {
                isReturn = true;
                // set focus on the fields, so that it can be edited
                document.getElementById(`${newKey}`).focus();
                $(`#${newKey}`).addClass('border-red');
            } else {
                $(`#${newKey}`).removeClass('border-red');
            }
        }
        if (isReturn) return;

        // validation on the password and confirm password values
        if (password !== confirm_password) {
            // set alert msg
            $("#message_exhibitor").text("Confirm Password should match with Password");
            // set focus on the confirm password field, so that it can be edited
            document.getElementById("confirm_password_exhibitor").focus();
            // set the border color to red for both fields
            $('.password').addClass('border-red');
            $('.confirm_password').addClass('border-red');
            return;
        }

        // delete the confirm_password key from the dataObject
        delete dataObject.confirm_password;
        // add role_type in the object
        dataObject.role_type = role_type;
        dataObject.company_website = company_website;

        $.ajax({
            method: 'POST',
            url: '/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(dataObject),
            success: function (response) {
                console.log(response);
                if (response.data) {
                    // TODO (set token in local storage, need to chnage in the API)
                    location.href = "/";
                }
            },
            error: function (xhr, status, error) {
                // if error from the validator from backend then handle it and show in the frontend
                $('#message_exhibitor').html(xhr.responseJSON.data.errors);
            }
        })
    });

})(jQuery);