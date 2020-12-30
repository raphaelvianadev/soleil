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

/* Shop */

$('#addCategory').on('submit', function (e) {
    e ? e.preventDefault() : false;

    $('.alert').hide();

    $.ajax({
        url: '/admin/loja/categorias/add',
        data: $(this).serialize(),
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            e = JSON.parse(e.responseText);
            if (e.response === 'ok') {
                $('#addCategory input').val('');
                $('.alert-success').fadeIn().html(e.message);
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    })
});

$('.editCategory').on('submit', function (e) {
    e ? e.preventDefault() : false;

    $.ajax({
        url: '/admin/loja/categorias/edit',
        data: $(this).serialize(),
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            e = JSON.parse(e.responseText);
            if (e.response === 'ok') {
                toastr["success"](e.message);
            } else {
                toastr["warning"](e.message);
            }
        }
    });
    return false;
});

$('.category-delete').on('click', function (e) {
    e ? e.preventDefault() : false;

    const id = $(this).attr('id');
    $(this).prop("disabled", true);

    $.ajax({
        url: '/admin/loja/categorias/delete',
        data: {'id': id},
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            e = JSON.parse(e.responseText);
            if (e.response === 'ok') {
                const th = "#card-table-" + id;
                $(th).fadeOut();
            }
        }
    })
});

$('#addPackage').on('submit', function (e) {
    e ? e.preventDefault() : false;
    var formData = new FormData(this);
    $('.alert').hide();
    $.ajax({
        url: '/admin/loja/produtos/add',
        type: 'post',
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'JSON',
        cache: false,
        xhr: function () {
            const myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                toastr["info"]("Fazendo upload da imagem...");
            }
            return myXhr;
        },
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                $('.alert-success').fadeIn().html(e.message);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    });
});

$('.editPackage').on('submit', function (e) {
    e ? e.preventDefault() : false;
    const formData = new FormData(this);
    $('.alert').hide();
    $.ajax({
        url: '/admin/loja/produtos/edit',
        type: 'post',
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'JSON',
        cache: false,
        xhr: function () {
            const myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                toastr["info"]("Fazendo upload da imagem...");
            }
            return myXhr;
        },
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                toastr["success"](e.message);
            } else {
                toastr["warning"](e.message);
            }
        }
    });
});

$('.package-delete').on('click', function (e) {
    e ? e.preventDefault() : false;

    const id = $(this).attr('id');
    $(this).prop("disabled", true);

    $.ajax({
        url: '/admin/loja/produtos/delete',
        data: {'id': id},
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            e = JSON.parse(e.responseText);
            if (e.response === 'ok') {
                const th = "#card-table-" + id;
                $(th).fadeOut();
            }
        }
    })
});

$("#addDiscount #type").on('click', function () {
    const value = $("option:selected", this).val();
    const cupom = $('#addDiscount #cupom');
    const server = $('#addDiscount #server');
    const use = $('#addDiscount #use');

    $('#addDiscount #expire').prop("disabled", false);

    cupom.prop("disabled", true);
    server.prop("disabled", true);
    use.prop("disabled", true);

    $('#addDiscount #percent').prop("disabled", false);

    if (value === "1") {
        cupom.prop("disabled", false);
    }
    if (value === "3") {
        server.prop("disabled", false);
    }
    if (value === "2") {
        use.prop("disabled", false);
        cupom.prop("disabled", false);
        $('#addDiscount #expire').prop("disabled", true);
    }
    return false;
});

$('#addDiscount').on('submit', function (e) {
    e ? e.preventDefault() : false;
    const formData = $(this).serialize();
    $.ajax({
        url: '/admin/loja/descontos/add',
        type: 'post',
        data: formData,
        dataType: 'JSON',
        cache: false,
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                toastr["success"](e.message);
            } else {
                toastr["warning"](e.message);
            }
        }
    });
    return false;
});

$('.discount-delete').on('click', function (e) {
    e ? e.preventDefault() : false;

    const id = $(this).attr('id');
    $(this).prop("disabled", true);

    $.ajax({
        url: '/admin/loja/descontos/delete',
        data: {'id': id},
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            e = JSON.parse(e.responseText);
            if (e.response === 'ok') {
                const th = "#card-table-" + id;
                $(th).fadeOut();
            }
        }
    })

});

$('.approve-purchase').on('click', function (e) {
    e ? e.preventDefault() : false;
    $(this).prop('disabled', true);
    $.ajax({
        url: '/admin/loja/transacoes/approve',
        type: 'POST',
        data: {id: $(this).attr('id')},
        dataType: 'JSON',
        complete: function (e) {
            const result = JSON.parse(e.responseText);
            if (result.response === 'error') {
                $(this).prop("disabled", false);
            } else {
                toastr["success"](result.message);
            }
        }
    })
});

$('#addRate').on('submit', function (e) {
    e ? e.preventDefault() : false;
    const formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/loja/capital/addrate",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.log(e.responseText);
            location.reload();
        }
    });
    return false;
});

$('#addExpenses').on('submit', function (e) {
    e ? e.preventDefault() : false;
    const formData = $(this).serialize();
    $.ajax({
        url: '/admin/loja/capital/addexpense',
        type: 'post',
        data: formData,
        dataType: 'JSON',
        cache: false,
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                location.reload();
            } else {
                toastr["warning"](e.message);
            }
        }
    });
    return false;
});

$('.setpaid-expense').on('click', function (e) {
    e ? e.preventDefault() : false;

    const id = $(this).attr('id');
    $(this).prop("disabled", true);

    $.ajax({
        url: '/admin/loja/capital/paidexpense',
        data: {'id': id},
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            e = JSON.parse(e.responseText);
            if (e.response === 'ok') {
                window.location.reload();
            }
        }
    })
});

/* Settings */

$('.habGateway').on('change', function (e) {
    var id = $(this).attr('id');
    var mode;

    if ($(this).is(':checked')) {
        mode = 1;
    } else {
        mode = 0;
    }

    $.ajax({
        url: '/admin/configuracoes/gateways/set',
        type: 'POST',
        dataType: 'JSON',
        data: {'gateway': id, 'mode': mode},
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
        }
    });
});

$('.setGateway').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.alert').fadeOut();
    $('.btn', this).prop("disabled", true);
    const formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/configuracoes/gateways/save",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
            toastr["success"]("Gateway atualizado!");
            $('.btn', this).prop("disabled", false);
            setTimeout(function () {
                location.reload();
            }, 1500);
        }
    });
    return false;
});

$('#addUser').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.alert').fadeOut();
    $('.progress').fadeIn();
    $('.btn').prop("disabled", true);
    var formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/configuracoes/usuarios/add",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
            const result = JSON.parse(e.responseText);
            const status = result.response;
            const message = result.message;
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
    return false;
});

$('.user-delete').on('click', function (e) {
    e ? e.preventDefault() : false;
    const id = $(this).attr('id');
    $(this).prop("disabled", true);
    $.ajax({
        url: '/admin/configuracoes/usuarios/delete',
        data: {'id': id},
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            setTimeout(function () {
                location.reload();
            }, 1000);
            $(this).prop("disabled", false);
        }
    })
});

$('.editPerm').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.btn', this).prop("disabled", true);
    const formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/configuracoes/usuarios/edit",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
            let result = JSON.parse(e.responseText);
            if (result.response === "ok") {
                toastr["success"](result.message);
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                toastr["error"](result.message);
                $('.btn', this).prop("disabled", false);
            }
        }
    });
    return false;
});

$('.editPass').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.btn', this).prop("disabled", true);
    const formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/configuracoes/usuarios/password",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
            let result = JSON.parse(e.responseText);
            if (result.response === "ok") {
                toastr["success"](result.message);
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                toastr["error"](result.message);
                $('.btn', this).prop("disabled", false);
            }
        }
    });
    return false;
});

$('.opentab').on('click', function (e) {
    e ? e.preventDefault() : false;

    $('#openmessage').hide();
    $('.closedtab').hide();

    var tab = $(this).attr('id');
    $("#" + tab + "-tab").fadeIn();
})

$('#setTerms').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.btn', this).prop("disabled", true);
    var formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/site/termos/template",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
            let result = JSON.parse(e.responseText);
            if (result.response === "ok") {
                toastr["success"](result.message);
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                toastr["error"](result.message);
                $('.btn', this).prop("disabled", false);
            }

        }
    });
    return false;
});

$('#updateLookbook').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.btn', this).prop("disabled", true);
    let formSerialize = $(this).serialize();
    $.ajax({
        url: "/admin/site/lookbook/update",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            console.clear();
            console.log(e.responseText);
            let result = JSON.parse(e.responseText);
            if (result.response === "ok") {
                toastr["success"](result.message);
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                toastr["error"](result.message);
                $('.btn', this).prop("disabled", false);
            }

        }
    });
    return false;
});

$('#addDrop').on('submit', function (e) {
    e ? e.preventDefault() : false;
    let formData = new FormData(this);
    $('.alert').hide();
    $.ajax({
        url: '/admin/site/drop/add',
        type: 'post',
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'JSON',
        cache: false,
        xhr: function () {
            const myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                toastr["info"]("Fazendo upload da imagem...");
            }
            return myXhr;
        },
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                $('.alert-success').fadeIn().html(e.message);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    });
});

$('#addPhotoDrop').on('submit', function (e) {
    e ? e.preventDefault() : false;
    let formData = new FormData(this);
    $('.alert').hide();
    $.ajax({
        url: '/admin/site/drop/add-photo',
        type: 'post',
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'JSON',
        cache: false,
        xhr: function () {
            const myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                toastr["info"]("Fazendo upload da imagem...");
            }
            return myXhr;
        },
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                $('.alert-success').fadeIn().html(e.message);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    });
});

$('#addPhotoPackage').on('submit', function (e) {
    e ? e.preventDefault() : false;
    let formData = new FormData(this);
    $('.alert').hide();
    $.ajax({
        url: '/admin/loja/produtos/add-photo',
        type: 'post',
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'JSON',
        cache: false,
        xhr: function () {
            const myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                toastr["info"]("Fazendo upload da imagem...");
            }
            return myXhr;
        },
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                $('.alert-success').fadeIn().html(e.message);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    });
});

$('#addStorage').on('submit', function (e) {
    e ? e.preventDefault() : false;

    $('.alert').hide();

    console.log($(this).serialize());
    $.ajax({
        url: '/admin/loja/estoque/add',
        data: $(this).serialize(),
        dataType: 'JSON',
        method: 'POST',
        complete: function (e) {
            e = JSON.parse(e.responseText);
            if (e.response === 'ok') {
                $('#addStorage input').val('');
                $('#addStorage select').val('');
                $('.alert-success').fadeIn().html(e.message);
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    })
});

$('#updateStorage').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.btn', this).prop("disabled", true);
    let formSerialize = $(this).serialize();
    console.log(formSerialize)
    $.ajax({
        url: "/admin/loja/estoque/update",
        type: "POST",
        dataType: 'JSON',
        data: formSerialize,
        complete: function (e) {
            //console.clear();
            console.log(e.responseText);
            let result = JSON.parse(e.responseText);
            if (result.response === "ok") {
                toastr["success"](result.message);
                setTimeout(function () {
                    //location.reload();
                }, 1000);
            } else {
                toastr["error"](result.message);
                $('.btn', this).prop("disabled", false);
            }

        }
    });
    return false;
});

function randomPassword() {
    $.get(
        '/admin/configuracoes/usuarios/hash',
        function (data) {
            $('#addUserPassword').val(data);
        }
    );
    return false;
}

function randomPasswordEdit() {
    $.get(
        '/admin/configuracoes/usuarios/hash',
        function (data) {
            $('#editPassword').val(data);
        }
    );
    return false;
}

/* Util */

function maskEmail(email) {
    const maskedEmail = email.replace(/([^@\.])/g, "*").split('');
    let previous = "";
    for (let i = 0; i < maskedEmail.length; i++) {
        if (i <= 1 || previous === "." || previous === "@") {
            maskedEmail[i] = email[i];
        }
        previous = email[i];
    }
    return maskedEmail.join('');
}



