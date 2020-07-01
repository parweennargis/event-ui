(function ($) {
    'use strict';

    var token = localStorage.getItem('token');

    $('#create-sponser').click(function (e) {
        e.preventDefault();
        alert('fsfsdfsdf');
        const title = $('#title').val();
        const description = $('#description').val();
        let is_active = 'on' ? true : false;


        const data = { title, description, is_active }
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        for (var i = 0; i < $('#image').get(0).files.length; i++) {
            formData.append('image', $('#image').get(0).files[i]);
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
                // redirect to event listing page
                location.href = '/admin/partners';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });


    $('#online-update-event').click(function (e) {
        e.preventDefault();
        var eventId = $(this).attr('data-event');

        const title = $('#title').val();
        const event_category = $('#event_category').val();
        const start_date = $('#start_date').val();
        const end_date = $('#end_date').val();
        const start_time = $('#start_time').val();
        const end_time = $('#end_time').val();
        const description = $('#description').val();
        let is_active = $('.is_active').val();
        const event_type = 'VIRTUAL';
        const zoom_link = $('#zoom_link').val();

        const link = {
            facebook: $('#link_facebook').val(),
            twitter: $('#link_twitter').val(),
            youtube: $('#link_youtube').val(),
            linkedln: $('#link_linkedln').val(),
            instagram: $('#link_instagram').val()
        }
        const organizer = {
            contact_no: $('#organizer_contact_no').val(),
            email: $('#organizer_email').val()
        }
        is_active = 'on' ? true : false;

        var past_event_video = [];
        $($('#inputFormRow input') || []).each(function (index, obj) {
            if ($(obj).val().trim() !== '') {
                past_event_video.push($(obj).val().trim());
            }
        })

        const data = { zoom_link, event_type, is_active, description, end_time, start_time, end_date, start_date, title }
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        event_category.forEach((category, index) => {
            formData.append("event_category[" + index + "]", category);
        });
        past_event_video.forEach((val, index) => {
            formData.append("past_event_video[" + index + "]", val);
        });
        formData.append("link[facebook]", link.facebook);
        formData.append("link[twitter]", link.twitter);
        formData.append("link[youtube]", link.youtube);
        formData.append("link[linkedln]", link.linkedln);
        formData.append("link[instagram]", link.instagram);
        formData.append("organizer[contact_no]", organizer.contact_no);
        formData.append("organizer[email]", organizer.email);

        for (var i = 0; i < $('#banner').get(0).files.length; i++) {
            formData.append('banner', $('#banner').get(0).files[i]);
        }
        for (var i = 0; i < $('#past_event_images').get(0).files.length; i++) {
            formData.append('past_event_images', $('#past_event_images').get(0).files[i]);
        }
        for (var i = 0; i < $('#past_event_banner_image').get(0).files.length; i++) {
            formData.append('past_event_banner_image', $('#past_event_banner_image').get(0).files[i]);
        }

        // console.log($('#banner').get(0).files);
        // console.log(formData);

        // process the form
        $.ajax({
            type: 'PUT',
            url: API_URL + '/offline-event/' + eventId,
            data: formData,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            cache: false,
            headers: {
                'Authorization': token
            },
            success: function (data) {
                // redirect to event listing page
                location.href = '/admin/offline-all-events';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

    $('.offline-delete').on('click', function (e) {
        e.preventDefault();
        var eventId = $(this).attr('data-event');
        if (!eventId) return;
        $.ajax({
            type: 'DELETE',
            url: API_URL + '/offline-event/' + eventId,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                // redirect to event listing page
                location.href = '/admin/offline-all-events';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

})(jQuery);