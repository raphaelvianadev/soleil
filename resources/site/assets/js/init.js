$('.dropdown').on('show.bs.dropdown', function (e) {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
});

$('.dropdown').on('hide.bs.dropdown', function (e) {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
});

$('#registerAccount').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.alert').fadeOut();

    $.ajax({
        url: '/perfil/registrar/run',
        type: 'POST',
        data: $(this).serialize(),
        dataType: 'JSON',
        complete: function (result) {
            console.log(result.responseText);
            const e = JSON.parse(result.responseText);
            if (e.response === 'ok') {
                $('.alert-success').fadeIn().html(e.message);
                setTimeout(function () {
                    location.href = "/perfil/login";
                }, 1500);
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    });
    return false;
});

$('#loginAccount').on('submit', function (e) {
    e ? e.preventDefault() : false;
    $('.alert').fadeOut();

    console.log();

    $.ajax({
        url: '/perfil/login/auth',
        type: 'POST',
        data: $(this).serialize(),
        dataType: 'JSON',
        complete: function (result) {
            console.log(result.responseText);
            var e = JSON.parse(result.responseText);

            if (e.response === 'ok') {
                $('.alert-success').fadeIn().html(e.message);
                location.reload();
            } else {
                $('.alert-danger').fadeIn().html(e.message);
            }
        }
    });
    return false;
});

$('#cupomApply').on('click', function (e) {
    e ? e.preventDefault() : false;

    const hash = $('#cupom').val();

    $.ajax({
        url: "/loja/carrinho/cupom",
        type: "POST",
        data: {'hash': hash},
        complete: function (result) {
            $('#cupomResult').html(result.responseText);
            $('.alert-danger').fadeIn().html("Cupom inválido ou inexistente");
        }
    });
    return false;
});

$('.add-to-cart').on('click', function (e) {
    e ? e.preventDefault() : false;

    const id = $(this).attr('id');
    const size = $('#size');

    if (!size.val()) {
        $('.alert-danger').removeAttr('hidden').fadeIn().html("Escolha o tamanho do produto");
        return size.focus();
    }

    $.ajax({
        url: "/loja/carrinho/add",
        type: "POST",
        dataType: 'JSON',
        data: {'id': id, size: size.val()},
        complete: function (result) {
            const r = JSON.parse(result.responseText);
            if (r.response === "ok") {
                window.location.href = "/loja/carrinho";
            }
        }
    });
    return false;
});

$('.att-cart').on('click', function (e) {
    e ? e.preventDefault() : false;

    var id = $(this).attr('id');
    var p = id.split('-');
    var s = '.quantia-' + p[1];
    var get = $(s).val();

    $.ajax({
        url: "/loja/carrinho/att",
        type: "POST",
        data: {'id': p[0], 'qnt': get},
        complete: function (result) {
            window.location.reload();
        }
    });
    return false;
});

$('.remove-from-cart').on('click', function (e) {
    e ? e.preventDefault() : false;
    $.ajax({
        url: "/loja/carrinho/remove",
        type: "POST",
        data: {'id': $(this).attr('id')},
        complete: function () {
            window.location.reload();
        }
    });
    return false;
});

function goTo(str, boolean) {
    if (boolean) {
        return window.open(str, "_blank");
    }
    window.location.href = str;
}

function formatNumber(number) {
    number = number.toFixed(2) + '';
    x = number.split('.');
    x1 = x[0];
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1;
}

$('#checkout').click(function () {
    const cupom = $('#cupom');
    const gateway = $('.gateway');
    const termos = $("#termos");
    const frete = $('#shipValue');
    if (!gateway.is(':checked')) {
        $('.alert-danger').fadeIn().html("Nenhum gateway foi selecionado");
        return gateway.focus();
    }
    if (!termos.is(':checked')) {
        $('.alert-danger').fadeIn().html("Os termos e condições não foram aceitos");
        return termos.focus();
    }
    if (!frete.val()) {
        $('.alert-danger').fadeIn().html("O frete não foi calculado");
        return $('#shipResult').focus();
    }
    cupom.prop('disabled', true);
    $(this).prop('disabled', true);
    $.ajax({
        url: "/loja/checkout",
        type: "POST",
        dataType: 'JSON',
        data: {gateway: gateway.val(), cupom: cupom.val(), ip: $('#ip').val(), ship: frete.val().replace(',', '.')},
        complete: function (result) {
            console.log(result.responseText);
            const r = JSON.parse(result.responseText);
            console.log(result.responseText);
            if (r.response === "ok") {
                //console.log("[Checkout Successful] Url -> " + r.url);
                location.href = r.url;
            } else {
                cupom.prop('disabled', false);
                $(this).prop('disabled', false);
            }
        }
    });
});

$('#calculateShip').on('click', function (e) {
    e ? e.preventDefault() : false;
    let selectedService = $('#ship-service').val()
    let formSerialize = $('#shipCalcForm').serialize();

    if (!selectedService) {
        $('.alert-danger').fadeIn().html("Selecione um serviço de frete");
        return $('#ship-service').focus();
    }
    $.ajax({
        url: '/loja/carrinho/calcular',
        type: 'POST',
        data: formSerialize,
        dataType: 'JSON',
        beforeSend: function () {
            $('#ship-info').html(`Calculando...`).removeAttr('hidden');
        },
        complete: function (result) {
            //console.log(result.responseText);
            let e = JSON.parse(result.responseText);
            let valorFrete = e.preco;
            let prazoEntrega = e.prazo;
            let totalAmount = (parseFloat($('#cupomResult').html().replace('R$ ', '').replace(',', '.')) + parseFloat(valorFrete.replace(',', '.')));

            $('#ship-info').html(`Frete: <b>R$ ${valorFrete.toLocaleString('pt-BR')}</b> / <b>${prazoEntrega} dias úteis</b>.`).removeAttr('hidden');
            $('#shipResult').html(`R$ ${valorFrete.toLocaleString('pt-BR')}`);
            $('#cupomTotal').html(`R$ ${totalAmount.toLocaleString('pt-BR')}`);
            $('#shipValue').val(valorFrete);
        }
    });
});
