(function ($) {
    'use strict';

    var token = localStorage.getItem('token');

    $('#create-sponser').click(function (e) {
        e.preventDefault();
        const title = $('#title').val();
        const description = $('#description').val();
        const is_active = $('input[name="is_active"]:checked').val();


        const data = { title, description, is_active }
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        for (var i = 0; i < $('#partner-image').get(0).files.length; i++) {
            formData.append('image', $('#partner-image').get(0).files[i]);
        }

        // process the form
        $.ajax({
            type: 'POST',
            url: API_URL + '/sponsors',
            data: formData,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            cache: false,
            headers: {
                'Authorization': token
            },
            success: function (data) {
                // redirect to sponsor listing page
                location.href = '/admin/partners';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

    $('#update-sponser').click(function (e) {
        e.preventDefault();
        var sponsorId = $(this).attr('data-id');
        const title = $('#title').val();
        const description = $('#description').val();
        const is_active = $('input[name="is_active"]:checked').val();


        const data = { title, description, is_active }
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        for (var i = 0; i < $('#partner-image').get(0).files.length; i++) {
            formData.append('image', $('#partner-image').get(0).files[i]);
        }

        // process the form
        $.ajax({
            type: 'PUT',
            url: API_URL + '/sponsors/' + sponsorId,
            data: formData,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            cache: false,
            headers: {
                'Authorization': token
            },
            success: function (data) {
                // redirect to sponsor listing page
                location.href = '/admin/partners';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

    $('.sponsor-delete').on('click', function (e) {
        e.preventDefault();
        var sponsorId = $(this).attr('data-id');
        if (!sponsorId) return;
        $.ajax({
            type: 'DELETE',
            url: API_URL + '/sponsors/' + sponsorId,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                // redirect to sponsor listing page
                location.href = '/admin/partners';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

})(jQuery);