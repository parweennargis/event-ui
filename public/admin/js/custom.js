(function ($) {
    'use strict';

    var token = localStorage.getItem('token');

    $(function () {
        $('#create-event').click(function (e) {
            e.preventDefault();
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            const arr = $('#createEventForm').serializeArray();
            const formData = new FormData();
            $(arr).each(function (index, obj) {
                if (obj.name === 'is_opening_soon')
                    formData.append(obj.name, obj.value === 'on' ? true : false);
                else
                    formData.append(obj.name, obj.value);
            });
            // formData.append('files', $('#files').get(0).files[0]);
            for (var i = 0; i < $('#files').get(0).files.length; i++) {
                formData.append('files', $('#files').get(0).files[i]);
            }
            console.log($('#files').get(0).files)
            console.log(formData);

            // process the form
            $.ajax({
                type: 'POST',
                url: API_URL + '/events',
                data: formData,
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                cache: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                success: function (data) {
                    // redirect to event listing page
                    location.href = '/admin/event';
                },
                error: function (error) {
                    console.log(error);
                }
            })
        });

        $('#update-event').click(function (e) {
            e.preventDefault();
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            const arr = $('#updateEventForm').serializeArray();
            const formData = new FormData();
            $(arr).each(function (index, obj) {
                if (obj.name === 'is_opening_soon')
                    formData.append(obj.name, obj.value === 'on' ? true : false);
                else
                    formData.append(obj.name, obj.value);
            });
            // formData.append('files', $('#files').get(0).files[0]);
            for (var i = 0; i < $('#files').get(0).files.length; i++) {
                formData.append('files', $('#files').get(0).files[i]);
            }
            console.log($('#files').get(0).files)
            console.log(formData);

            // process the form
            $.ajax({
                type: 'PUT',
                url: API_URL + '/events/5ea0ac2161a05d35a0aa9326',
                data: formData,
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                cache: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                success: function (data) {
                    // redirect to event listing page
                    location.href = '/admin/event';
                },
                error: function (error) {
                    console.log(error);
                }
            })
        });

        $('#admin-login').click(function (e) {
            e.preventDefault();
            var email = $('#login-email').val();
            var password = $('#login-password').val();
            //TODO: validation
            // process the form
            $.ajax({
                method: 'POST',
                url: '/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    'email': email,
                    'password': password
                }),
                success: function (response) {
                    console.log(response);
                    if (response.data) {
                        localStorage.setItem('token', 'Bearer ' + response.data.token);
                        location.href = "admin/dashboard"
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr.status);
                    console.log(xhr.responseJSON);
                }
            })
        });

        $('#admin-logout').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                method: 'GET',
                url: '/logout',
                success: function (response) {
                    localStorage.clear();
                    location.href = '/admin/login';
                },
                error: function (xhr, status, error) {
                    localStorage.clear();
                    location.href = '/';
                }
            });
        });


    });
})(jQuery);