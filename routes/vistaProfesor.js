var express = require('express');
var router = express.Router();
var profesor = require('../models/profesor');
var time = require("../models/time");

/* GET vista del profesor page. */
router.get('/', function(req, res, next) {
	if (!req.session.name) {
		res.render('index', { title: 'ControlFid', info: 'Debe iniciar sesión'}); 
	};
	var curr_time;
	if (req.query.time == undefined) {
		time.horaActual(function (error,data) {
			if (error) {
				throw error;
			}else{
				curr_time = data;
				console.log(curr_time);
			}//.else
		});//.time.horaActual
	}else{
		curr_time = req.query.time;
	}//.else
	profesor.buscarProfesorPorId(req.query.idProfesor, function (error,row) {
		if (error) {
			console.log("Fallo buscarProfesorPorId");
			throw error;
		}else{
			profesor.buscarLosAlumnosDeSuClaseActual(req.query.idProfesor,curr_time,function (error,presenciaArray,num_tarjetaArray,nombreArray,apellidosArray,fotoArray){
				if (error) {
					console.log("Fallo");
					throw error;
				}else{
					if (req.session.admin == 1) {
						res.render("vistaProfesor",{ 
							title:'Vista Profesor',
							name : row[0].nombre, 
							image: row[0].foto,
							correo: row[0].correo,
							num_tarjeta:num_tarjetaArray,
							presencia:presenciaArray,
							nombre: nombreArray,
							apellidos: apellidosArray,
							foto: fotoArray,
							admin:1,
						})//.res.render
					}else{
						res.render("vistaProfesor",{ 
							title:'Vista Profesor',
							name : row[0].nombre, 
							image: row[0].foto,
							correo: row[0].correo,
							num_tarjeta:num_tarjetaArray,
							presencia:presenciaArray,
							nombre: nombreArray,
							apellidos: apellidosArray,
							foto: fotoArray,
						})//.res.render
					}					
				}//else error
			});////.profesor.buscarLosAlumnosDeSuClaseActual
		}//.else
	});//profesor.buscarProfesorPorId
});//.router.get('/', function(req, res, next) {

/*
*	devuelve json horario profesor segun correo
*/
router.get('/horarioProfesor', function(req,res,next) {
	var correo = req.query.correo;
	profesor.buscarHorarioProfesorPorCorreo(correo, function(error,row) {
		if (error) {
			throw error;
		}else{
			res.send(row);
		}
	})//buscarHorarioProfesorPorCorreo
});//get /horarioProfesor

module.exports = router;