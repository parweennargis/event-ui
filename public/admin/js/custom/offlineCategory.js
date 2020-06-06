(function ($) {
    'use strict';

    var token = localStorage.getItem('token');

    $('#offline-create-category').click(function (e) {
        e.preventDefault();

        const name = $('#name').val();
        let is_active = $('.is_active').val();
        console.log(is_active);
        is_active = 'on' ? true : false;

        const dataObject = { name, is_active };

        // process the form
        $.ajax({
            type: 'POST',
            url: API_URL + '/offline-categories',
            data: JSON.stringify(dataObject),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            success: function (data) {
                // redirect to event listing page
                location.href = '/admin/offline-all-categories';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });


    $('#offline-update-category').click(function (e) {
        e.preventDefault();
        var categoryId = $(this).attr('data-event');

        const name = $('#name').val();
        let is_active = $('.is_active').val();
        is_active = 'on' ? true : false;

        const dataObject = { name, is_active }
        // process the form
        $.ajax({
            type: 'PUT',
            url: API_URL + '/offline-categories/' + categoryId,
            data: JSON.stringify(dataObject),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            success: function (data) {
                // redirect to event listing page
                location.href = '/admin/offline-all-categories';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

    $('.offline-category-delete').on('click', function (e) {
        e.preventDefault();
        var categoryId = $(this).attr('data-event');
        if (!categoryId) return;
        $.ajax({
            type: 'DELETE',
            url: API_URL + '/offline-categories/' + categoryId,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                // redirect to event listing page
                location.href = '/admin/offline-all-categories';
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

})(jQuery);