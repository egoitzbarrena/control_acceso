$(document).ready(function() {
	
	//Buscar alumnos al escribir
	$('#nombre').keyup(function(event) {
		buscarAsignaturas();
	});

	//Buscar alumnos al clicar Buscar
	$('#form').submit(function(event) {
		event.preventDefault();
		buscarAsignaturas();
	});

	//Crear formulario para modificar o borrar alumno al clicar en la celda
	$('#resultado').on("click",".celda",function () {
		var datos = $(this).contents();
		buscarAsignaturaId(datos[0].id)
		.done(function(result) {
    		var formulario = "<form class='form-group' action='/updateAsignatura' id='formUpdate' name='formUpdate' method='post'>";
    		formulario += "id_asignatura: <input type='text' id='id_asignatura' name='id_asignatura' class='form-control' value='"+result[0].id_asignatura+"'>";
    		formulario += "Nombre: <input type='text' id='nombre' name='nombre' class='form-control' value='"+result[0].nombre+"'>";
    		formulario += "Clave: <input type='text' id='clave' name='clave' class='form-control' value='"+result[0].clave+"'>";
    		formulario += "Obligatoria: <input type='text' id='obligatoria' name='obligatoria' class='form-control' value='"+result[0].obligatoria+"'>";
    		formulario += "tipo: <input type='text' id='tipo' name='tipo' class='form-control' value='"+result[0].tipo+"'></br>";
			formulario += "<input type='submit' id='btnModificar' class='btn btn-warning' value='Modificar'>";
    		formulario += "&nbsp;<button id='btnBorrar' class='btn btn-danger'>Borrar</button>";
    		formulario += "&nbsp;<button id='btnVolver' class='btn btn-primary'>Volver</button>";
    		formulario += "</form>";
    		$('#resultado').html(formulario);
		})
		.fail(function() {
    		console.log("error crear formulario");
		});
	});//Formulario modificar y borrar
	
	//Funcion con ajax para recoger datos alumnos y crear tabla
	function buscarAsignaturas () {
		var formData = $('#form').serializeArray();
		$.ajax({
			url: '/buscarAsignaturaNombre',
			type: 'post',
			dataType: 'json',
			data: formData,
			success:function (data) {
				var resp = "";
				for (var i = 0; i < data.length; i++) {
					resp += "<table class='table'><tr><td class='celda'>";
					resp += "<h3 id='"+data[i].id_asignatura+"'>"+data[i].id_asignatura+" "+data[i].nombre+"</h3>";
					resp += "</td></tr></table>";
				};
				$('#resultado').html(resp);
			}
		})//ajax
		.done(function() {
			console.log("success");
		})//done
		.fail(function() {
			console.log("error");
		})//fail
	}//function buscarAsignaturas

	//funcion para buscar alumnos por id
	function buscarAsignaturaId (id) { 
		return	$.ajax({
					url: '/buscarAsignaturaPorId',
					type: 'post',
					dataType: 'json',
					data:{ id_asignatura:id },
					success:function (data) {
					}
				})//ajax
				.done(function() {
					console.log("success");
				})//done
				.fail(function() {
					console.log("error");
				})//fail
	}//function buscarProfesores
	
			//Al clicar en borrar el alumno
	$('#resultado').on("click","#btnBorrar",function(event) {
		event.preventDefault();
		console.log($('#resultado #id_asignatura').val());
		if(confirm("Estas seguro de borrar la asignatura?")) {
			$.ajax({
				url: '/borrarAsignatura',
				type: 'post',
				dataType: 'html',
				data: {'id_asignatura':$('#resultado #id_asignatura').val()},
				success:function(data){
				}//success
			})//ajax
			.done(function() {
				console.log("success borrar");
			})//done
			.fail(function() {
				console.log("error borrar");
			})//fail
		}//if confirm
	});//click borrar formulario asiganura
	
});//ready

