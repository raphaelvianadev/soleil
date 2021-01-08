$(function () {
    //console.clear();

    if ($('.summernote').length) {
        $('.summernote').summernote({
            height: 300,
            toolbar: [
                ["style", ["style"]],
                ["font", ["bold", "underline", "clear"]],
                ["fontname", ["fontname"]],
                ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]],
                ["table", ["table"]],
                ["insert", ["link", "picture"]],
                ["view", ["fullscreen", "codeview", "help"]]
            ]
        });
    }
});

const $imgPicker = $('.imagePicker');

if ($imgPicker.length) {
    $imgPicker.on('change', function (evt) {
        const tgt = evt.target || window.event.srcElement,
            files = tgt.files;

        if (FileReader && files && files.length) {
            const fr = new FileReader();
            fr.onload = function () {
                $('.changeImage').prop('src', fr.result);
            };
            fr.readAsDataURL(files[0]);
        }
    });
}

/* Auth */

$('#authenticate').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.alert').fadeOut();
    $('.progress').fadeIn();
    $('.btn').prop("disabled", true);
    const formSerialize = $(this).serialize();
    setTimeout(function () {
        $.ajax({
            url: "/admin/home/login/auth",
            type: "POST",
            dataType: 'JSON',
            data: formSerialize,
            complete: function (e) {
                console.clear();
                console.log(e.responseText);
                const result = JSON.parse(e.responseText);
                const status = result.response;
                const message = result.message;
                console.log(status);
                if (status === "ok") {
                    $('.progress').hide();
                    $('.alert-success').fadeIn().html(message);
                    location.reload();
                } else {
                    $('.progress').hide();
                    $('.alert-danger').fadeIn().html(message);
                }
                $('.btn').prop("disabled", false);
            }
        });
    }, 2000);
    return false;
});

$('#addMessage').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.btn', this).prop("disabled", true);
    const formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/site/mensagens/add",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
            try {
                let result = JSON.parse(e.responseText);
                if (result.status === "ok") {
                    toastr["success"](result.message);
                    $(':input', '#addMessage')
                        .removeAttr('checked')
                        .removeAttr('selected')
                        .not(':button, :submit, :reset, :hidden, :radio, :checkbox')
                        .val('');

                    $('#topic').summernote("code", "");
                    setTimeout(function () {
                        location.reload();
                    }, 1500);
                } else {
                    toastr["error"](result.message);
                    $('.btn', this).prop("disabled", false);
                    setTimeout(function () {
                        location.reload();
                    }, 1500);
                }
            } catch (err) {
                console.log(err);
            }

        }
    });
    return false;
});




