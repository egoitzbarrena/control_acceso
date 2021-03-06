var connection = require('../models/connection');
var falta = {};

/***********************************************************INSERT*********************************************************/

/*
* INSERTAR falta
*/
falta.agregarFalta = function (fecha,id_alumno,id_horario_grupo,observaciones,callback) {
	if(connection){							
		var falta = { fecha: fecha, id_alumno: id_alumno, id_horario_grupo: id_horario_grupo, observaciones: observaciones };
		var sqlagregarFalta = 'INSERT INTO faltas SET ?';
		connection.query(sqlagregarFalta,falta, function(error){
		  	if (error) {
				throw error;
				console.log(error);
			}else{
				callback(null,{dato:"ok"});
			}//else
		});//connection.query
	}//if
}//falta.agregarFalta

/****************************************************************************************************************************/

/***********************************************************UPDATE***********************************************************/

/*
* UPDATE falta
*/
falta.modificarFalta = function (id_faltas,fecha,id_alumno,id_horario_grupo,observaciones,callback) {
	if(connection){							
		var falta = { fecha: fecha, id_alumno: id_alumno, id_horario_grupo: id_horario_grupo, observaciones: observaciones };
		var sqlmodificarFalta = 'UPDATE faltas SET ? WHERE id_faltas ="'+id_faltas+'"';
		connection.query(sqlmodificarFalta,falta, function(error){
		  	if (error) {
				throw error;
				console.log(error);
			}else{
				callback(null,{dato:"ok"});
			}//else
		});//connection.query
	}//if
}//falta.modificarFalta

/*
* UPDATE presencia a 0 a todos los alumnos y profesores
*/
falta.modificarPresencia0ATodos = function(callback){
	if (connection) {
		var sql = 'UPDATE alumnos, profesores SET alumnos.presencia = 0, profesores.presencia = 0';
		connection.query(sql,function (error) {
			if (error) {
				console.log(error);
				throw error;
			}else{
				callback(null);
			}//else
		});//connection.query
	};//if connection
}//falta.modificarPresencia0ATodos

/****************************************************************************************************************************/

/***********************************************************DELETE***********************************************************/

/*
* DELETE falta por id_falta
*/
falta.borrarFalta = function (id_faltas,callback) {
	if(connection){							
		connection.query('DELETE FROM faltas WHERE id_faltas= "'+id_faltas+'"', function(error){
		  	if (error) {
				throw error;
				console.log(error);
			}else{
				callback(null,{dato:"ok"});
			}//else
		});//connection.query
	}//if
}//falta.borrarFalta

/*
*	DELETE tabla faltas
*/
falta.borrarTablaFaltas = function (callback) {
	if (connection) {
		var sql = 'DELETE FROM faltas';
		connection.query(sql,function (error) {
			if (error) {
				console.log(error);
				throw error;
			};//if error
		})//connection.query
	};//if connection
}//borrarTablaFaltas

/****************************************************************************************************************************/

/***********************************************************SELECT***********************************************************/

/*
*	BUSCAR todas las faltas
*/
falta.buscarTodosLosIdFalta = function (callback) {
	if(connection){							
		connection.query('SELECT id_faltas FROM faltas', function(error,row){
		  	if (error) {
				console.log(error);
				throw error;
			}else{
				var id_FaltaArray = [];
				for (var i= 0;i<row.length;i++){
					var id = row[i].id_faltas;
					id_FaltaArray.push(id);
				}//for
				function compareNumbers(a, b) {
					return a - b;
				}//compareNumbers
				id_FaltaArray.sort(compareNumbers);
				callback(null,id_FaltaArray);
			}//else
		});//connection.query
	}//if
}//falta.buscarTodosLosIdFalta

/*
*	BUSCAR faltas de alumnos no convalidados
*/
falta.buscarFaltasDeAlumnosNoConvalidados = function (dia_semana,hora,callback) {
	if (connection) {
		var sql = 'SELECT a.id_alumno, h.id_horario_grupo FROM alumnos a LEFT JOIN alumno_grupos r ON (a.id_alumno = r.id_alumno) INNER JOIN horario_grupos h ON (r.id_grupo = h.id_grupo) WHERE presencia = 0 AND h.id_horario_grupo IN (SELECT id_horario_grupo FROM horario_grupos WHERE dia_semana = "'+dia_semana+'" and "'+hora+'" BETWEEN hora_inicio AND hora_final) AND a.id_alumno NOT IN (SELECT id_alumno FROM convalidadas WHERE id_asignatura IN (SELECT id_asignatura FROM horario_grupos WHERE id_horario_grupo and (dia_semana="'+dia_semana+'") and ("'+hora+'" between hora_inicio and hora_final)))';
		connection.query(sql,function (error,row) {
			if (error) {
				console.log(error);
				throw error;
			}else{
				callback(null,row);
			}
		});//connection.query
	};//if connection
}//falta.buscarFaltasDeAlumnosNoConvalidados

/*
*	Buscar datos necesarios para el envio de correo por falta de asistencia
*/
falta.buscarDatosFaltaAlumno = function (id_alumno,id_horario_grupo,callback) {
	var sql = 'SELECT a.nombre,a.apellidos, a.correo, s.clave, l.numero, g.hora_inicio, g.hora_final FROM alumnos a LEFT JOIN alumno_grupos r ON (a.id_alumno = r.id_alumno) INNER JOIN horario_grupos g ON (r.id_grupo = g.id_grupo) INNER JOIN aulas l ON (l.id_aula = g.id_aula) INNER JOIN asignaturas s ON (s.id_asignatura = g.id_asignatura) WHERE a.id_alumno = '+id_alumno+' AND g.id_horario_grupo = '+id_horario_grupo;
	connection.query(sql,function (error,row) {
		if (error) {
			console.log(error);
			throw error;
		}else{
			callback(null,row);
		}//else if connection
	})//connection.query
}//falta.buscarDatosFaltaAlumno 

/*
*	BUSCAR faltas por nombre del alumno
*/
falta.buscarFaltaPorNombreAlumno = function(nombre,callback){
	if(connection){
		var sql ='SELECT faltas.id_faltas, faltas.fecha, alumnos.nombre AS nombreAlumno, alumnos.apellidos, alumnos.foto, asignaturas.nombre AS nombreAsignatura, aulas.numero, grupos.nombre_grupo, horario_grupos.hora_inicio, horario_grupos.hora_final FROM faltas LEFT JOIN alumnos ON faltas.id_alumno = alumnos.id_alumno LEFT JOIN horario_grupos ON faltas.id_horario_grupo = horario_grupos.id_horario_grupo LEFT JOIN asignaturas ON horario_grupos.id_asignatura = asignaturas.id_asignatura LEFT JOIN aulas ON horario_grupos.id_aula = aulas.id_aula LEFT JOIN grupos ON horario_grupos.id_grupo = grupos.id_grupo WHERE alumnos.nombre LIKE ' + connection.escape(nombre+'%');
		connection.query(sql,function (error,row) {
			if (error) {
				throw error;
				console.log(error);
			}else{
				for (i=0;i<row.length;i++){
					row[i].foto = row[i].foto.toString('base64');
				}
				callback(null,row);
			}//else
		});//connection.query
	}//if
}//falta.buscarFaltaPorNombreAlumno

/*
*	BUSCAR faltas por nombre del alumno sin foto
*/
falta.buscarFaltaPorNombreAlumnoSinFoto = function(nombre,callback){
	if(connection){
		var sql ='SELECT faltas.id_faltas, faltas.fecha, alumnos.nombre AS nombreAlumno, alumnos.apellidos, asignaturas.nombre AS nombreAsignatura, aulas.numero, grupos.nombre_grupo, horario_grupos.hora_inicio, horario_grupos.hora_final FROM faltas LEFT JOIN alumnos ON faltas.id_alumno = alumnos.id_alumno LEFT JOIN horario_grupos ON faltas.id_horario_grupo = horario_grupos.id_horario_grupo LEFT JOIN asignaturas ON horario_grupos.id_asignatura = asignaturas.id_asignatura LEFT JOIN aulas ON horario_grupos.id_aula = aulas.id_aula LEFT JOIN grupos ON horario_grupos.id_grupo = grupos.id_grupo WHERE alumnos.nombre LIKE ' + connection.escape(nombre+'%');
		connection.query(sql,function (error,row) {
			if (error) {
				throw error;
				console.log(error);
			}else{
				callback(null,row);
			}//else
		});//connection.query
	}//if
}//falta.buscarFaltaPorNombreAlumno

/*
* BUSCAR falta por id_falta
*/
falta.buscarFaltaPorId = function (id_faltas,callback) {							
	if(connection){	
		var sql = 'SELECT id_faltas,fecha,id_alumno,id_horario_grupo,observaciones FROM faltas WHERE id_faltas = ' + connection.escape(id_faltas);
		connection.query(sql, function (error, row){
			if (error) {
				throw error;
				console.log(error);
			}else{
				callback(null,row);
			}//else
		});//connection.query
	}//if
}//horario_grupo.buscarHorarioGrupoPorId

/*
*	BUSCAR una falta por id_alumno, id_horario_grupo y observaciones
*/
falta.buscarFaltaExistente = function(id_alumno,id_horario_grupo,observaciones,callback){
	if(connection){
		var sql = 'SELECT id_faltas,fecha,id_alumno,id_horario_grupo FROM faltas WHERE id_alumno ="'+id_alumno+'" AND id_horario_grupo ="'+id_horario_grupo+'" AND observaciones ="'+observaciones+'"';
		connection.query(sql,function (error,row) {
			if (error) {
				console.log(error);
				throw error;
			}else{
				callback(null,row);
			}//else
		});//connection.query
	}//if
}//falta.buscarFaltaExistente

/*
*	BUSCAR una falta por id_alumno e id_horario_grupo
*/
falta.buscarFaltaPorIdAlumnoYIdHorarioGrupo = function(id_alumno,id_horario_grupo,callback){
	if(connection){
		var sql = 'SELECT id_faltas,fecha,id_alumno,id_horario_grupo FROM faltas WHERE id_alumno ="'+id_alumno+'" AND id_horario_grupo ="'+id_horario_grupo+'"';
		connection.query(sql,function (error,row) {
			if (error) {
				throw error;
				console.log(error);
			}else{
				callback(null,row);
			}//else
		});//connection.query
	}//if
}//falta.buscarFaltaExistente

/*
*	BUSCAR datos de las faltas del dia
*/
falta.buscarDatosDeLasFaltasDelDia = function (callback) {
	if (connection) {
		var sql = 'SELECT DISTINCT(f.id_faltas),f.fecha,a.nombre,a.apellidos,l.numero,g.hora_inicio,g.hora_final,s.clave FROM faltas f INNER JOIN alumnos a ON (a.id_alumno = f.id_alumno) INNER JOIN alumno_grupos r ON (a.id_alumno = r.id_alumno) INNER JOIN horario_grupos g ON (r.id_grupo = g.id_grupo) INNER JOIN aulas l ON (g.id_aula = l.id_aula) INNER JOIN asignaturas s ON (s.id_asignatura = g.id_asignatura) GROUP BY f.id_faltas';
		connection.query(sql,function (error,row) {
			if (error) {
				console.log(error);
				throw error;
			}else{
				callback(null,row);
			}//else if error
		})//connection.query
	};//if connection
}//buscarDatosDeLasFaltasDelDia

/****************************************************************************************************************************/



module.exports = falta;

