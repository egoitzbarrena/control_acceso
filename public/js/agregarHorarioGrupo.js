$(document).ready(function() {

     $.validator.addMethod("valueNotEquals", function(value, element, arg){
      return arg != value;
     }, "Value must not equal arg.");

	//reglas
	var reglas = {
		dia:{required:true,valueNotEquals: "default" },
        hora_inicio:{required:true},
		hora_final:{required:true},
		id_grupo:{required:true,valueNotEquals: "default" },
        id_asignatura:{required:true,valueNotEquals: "default" },
        id_aula:{required:true,valueNotEquals: "default" },
	};
	//mensajes
	var mensajes = {
		dia:{required:"",valueNotEquals: "" },
        hora_inicio:{required:""},
		hora_final:{required:""},
		id_grupo:{required:"",valueNotEquals: "" },
        id_asignatura:{required:"",valueNotEquals: "" },
        id_aula:{required:"",valueNotEquals: "" },
	};

	//Validate
	$("#agregarHorarioGrupoForm").validate({
        rules:reglas,
        messages:mensajes,
        highlight: function(element) {
                var id_attr = "#" + $( element ).attr("id") + "1";
                $(element).closest('.form-inline').removeClass('has-success').addClass('has-error');
                $(id_attr).removeClass('glyphicon-ok').addClass('glyphicon-remove'); 
        },
        unhighlight: function(element) {
                var id_attr = "#" + $( element ).attr("id") + "1";
                $(element).closest('.form-inline').removeClass('has-error').addClass('has-success');
                $(id_attr).removeClass('glyphicon-remove').addClass('glyphicon-ok');         
        },
        errorPlacement: function(error,element){
        },
        submitHandler: function (form) {
            event.preventDefault();
            var data = $("#agregarHorarioGrupoForm").serializeArray();
            $.ajax({
                url: '/configHorarioGrupo/agregarHorarioGrupo',
                type: 'post',
                dataType: 'json',
                data: data,
                success: function (data) {

                }
            })
            .done(function(data) {
                console.log(data);
                if (data.err=="existe"){
                showAlert("#enlace","error","HorarioGrupo ya existente");
                }else if (data.dato=="ok"){
                showAlertRedirect("#enlace","ok","HorarioGrupo añadida correctamente",'/config');
                }
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            /*
            *   Form Submit Fin
            */
        }//submitHandler
    });//Validate
});//ready


function showAlertValidate(lugar,texto) {
    $('#mensaje').attr('class','alert alert-warning fade in');
    $('#mensaje span').html(texto);
    $('#mensaje').insertAfter(lugar);
    $('#mensaje').fadeTo(2000, 500).slideUp(1000, function(){
                });
    }


function showAlert(lugar,tipo,texto) {

    if (tipo=="error"){
        $('#mensaje').attr('class','alert alert-danger fade in');
    }else {
        $('#mensaje').attr('class','alert alert-success fade in');
    }
    $('#mensaje span').html(texto);
    $('#mensaje').insertAfter(lugar);
    $('#mensaje').fadeTo(2000, 500).slideUp(1000, function(){
                });

    }

function showAlertRedirect(lugar,tipo,texto,url) {

    if (tipo=="error"){
        $('#mensaje').attr('class','alert alert-danger fade in');
    }else {
        $('#mensaje').attr('class','alert alert-success fade in');
    }
    $('#mensaje span').html(texto);
    $('#mensaje').insertAfter(lugar);
    $('#mensaje').fadeTo(2000, 500).slideUp(1000, function(){
      window.location.replace(url);
                });

    }