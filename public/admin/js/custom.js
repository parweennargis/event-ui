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
                else if (obj.name === 'is_active')
                    formData.append(obj.name, obj.value === 'on' ? true : false);
                else
                    formData.append(obj.name, obj.value);
            });

            for (var i = 0; i < $('#images').get(0).files.length; i++) {
                formData.append('images', $('#images').get(0).files[i]);
            }
            for (var i = 0; i < $('#banner').get(0).files.length; i++) {
                formData.append('banner', $('#banner').get(0).files[i]);
            }
            for (var i = 0; i < $('#floor_plan').get(0).files.length; i++) {
                formData.append('floor_plan', $('#floor_plan').get(0).files[i]);
            }
            for (var i = 0; i < $('#past_event_images').get(0).files.length; i++) {
                formData.append('past_event_images', $('#past_event_images').get(0).files[i]);
            }
            for (var i = 0; i < $('#past_event_banner_image').get(0).files.length; i++) {
                formData.append('past_event_banner_image', $('#past_event_banner_image').get(0).files[i]);
            }
            formData.append('event_type', 'ONLINE');

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
            var eventId = $(this).attr('data-event');
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            const arr = $('#updateEventForm').serializeArray();
            const formData = new FormData();
            $(arr).each(function (index, obj) {
                if (obj.name === 'is_opening_soon')
                    formData.append(obj.name, obj.value === 'on' ? true : false);
                else if (obj.name === 'is_active')
                    formData.append(obj.name, obj.value === 'on' ? true : false);
                else
                    formData.append(obj.name, obj.value);
            });
            // formData.append('files', $('#files').get(0).files[0]);
            for (var i = 0; i < $('#images').get(0).files.length; i++) {
                formData.append('images', $('#images').get(0).files[i]);
            }
            for (var i = 0; i < $('#banner').get(0).files.length; i++) {
                formData.append('banner', $('#banner').get(0).files[i]);
            }
            for (var i = 0; i < $('#floor_plan').get(0).files.length; i++) {
                formData.append('floor_plan', $('#floor_plan').get(0).files[i]);
            }
            for (var i = 0; i < $('#past_event_images').get(0).files.length; i++) {
                formData.append('past_event_images', $('#past_event_images').get(0).files[i]);
            }
            for (var i = 0; i < $('#past_event_banner_image').get(0).files.length; i++) {
                formData.append('past_event_banner_image', $('#past_event_banner_image').get(0).files[i]);
            }
            formData.append('event_type', 'ONLINE');
            // console.log($('#files').get(0).files);
            // console.log(formData);

            // process the form
            $.ajax({
                type: 'PUT',
                url: API_URL + '/events/' + eventId,
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
                        location.href = "/admin/dashboard"
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

        // add row
        $("#addRow").click(function () {
            var html = '';
            html += '<div id="inputFormRow">';
            html += '<div class="input-group mb-3">';
            html += '<input type="text" name="past_event_video[]" class="form-control m-input" placeholder="Video Link" autocomplete="off">';
            html += '<div class="input-group-append">';
            html += '<button id="removeRow" type="button" class="btn btn-danger">Remove</button>';
            html += '</div>';
            html += '</div>';

            $('#newRow').append(html);
        });

        // remove row
        $(document).on('click', '#removeRow', function () {
            $(this).closest('#inputFormRow').remove();
        });
        
        $('#images').change(function(e) {
            previewImages($(this)[0].files, 'images');    
        });

        $('#banner').change(function(e) {
            previewImages($(this)[0].files, 'banner');    
        });

        $('#past_event_images').change(function(e) {
            previewImages($(this)[0].files, 'past_event_images');    
        });

        $('#past_event_banner_image').change(function(e) {
            previewImages($(this)[0].files, 'past_event_banner_image');    
        });


        // $('#imageUrl').change(function(e) {
        //     // console.log($(this));
        //     console.log($(this).attr('data-image'));
        //     readURL($(this)[0].files, $(this).attr('data-index'));    
        // });

        // function readURL(files, index=0) {
        //     for (let file of files) {
        //         imageUrls.push(file);
        //         var reader = new FileReader();
        //         reader.onload = function (e) {
        //             var img = '<div class="image-width col-md-3"><img src="' + e.target.result + '"/><button type="button" class="close" aria-label="Close" data-index="' + index + '"><span aria-hidden="true">&times;</span></button></div>';
        //             $('.preview').append(img);
        //             index++;
        //             $('#imageUrl').attr('data-index',index);
        //         };
        //         reader.readAsDataURL(file);
        //     }
        // }

        $(document).on('click', '.close', function(e) {
            e.preventDefault();
            
            imageUrls.splice($(this).attr('data-index'), 1);
            $('.preview').html('');
            readURL(imageUrls);
        });

        function previewImages(files, id) {
            $('.' + id + '-preview').html('');
            for (let file of files) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = '<div class="image-width col-md-3"><img src="' + e.target.result + '"/></div>';
                    $('.' + id + '-preview').append(img);
                };
                reader.readAsDataURL(file);
            }
        }
    });
})(jQuery);