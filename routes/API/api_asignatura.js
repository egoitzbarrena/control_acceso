var express = require('express');
var router = express.Router();
var time = require('../../models/time');
var alumno = require('../../models/alumno');
var alumno_grupos = require('../../models/alumno_grupos');
var asignatura = require('../../models/asignatura');
var aula = require('../../models/aula');
var convalidadas = require('../../models/convalidadas');
var falta = require('../../models/falta');
var grupo = require('../../models/grupo');
var horario_grupo = require('../../models/horario_grupo');
var horario_profesor = require('../../models/horario_profesor');
var profesor = require('../../models/profesor');
var profesores_asignaturas = require('../../models/profesores_asignaturas');

/***********************************************************INSERT*********************************************************/

/*
* INSERTAR asignatura OK
*/
router.post('/agregarAsignatura', function(req, res, next) {
  	asignatura.buscarAsignaturaPorClave(req.query.clave, function (error,row) {
	  	if (error) {
	    	res.send('error conectando con la base de datos');
	    	throw error;
	  	}else{
	    	if(row.length>0){
	    		res.send('esa asignatura ya existe');
	    	}else{
	    		asignatura.agregarAsignatura(req.query.nombre,req.query.clave,req.query.obligatoria,req.query.tipo, function (error,row) {
	        		if (error) {
	        			res.send('error agregando la asignatura');
	          			throw error;
	        		}else{
	        			res.send('asignatura agregada correctamente');
	        		}//else
	      		});//asignatura.agregarAsignatura
	    	}//else
	    }//else
	});//asignatura.buscarAsignaturaPorClave
});//router.post('/agregarAsignatura

/****************************************************************************************************************************/

/***********************************************************UPDATE***********************************************************/

/*
* UPDATE asignatura OK

*/
router.post('/modificarAsignatura', function(req, res, next) {
    
    var clave_antigua;

    asignatura.buscarAsignaturaPorId(req.query.id_asignatura, function(error,row) {
        if (error) {
            res.send('error conectando con la base de datos');
            throw error;
        }else{
            clave_antigua = row[0].clave;
            console.log(clave_antigua);
        }//else
    })//asignatura.buscarAsignaturaPorId

    asignatura.buscarAsignaturaPorClave(req.query.clave, function(error,row) {
        if (error) {
            res.send('error conectando con la base de datos');
            throw error;
        }else{
            if((row.length>0)&&(req.query.clave!=clave_antigua)){
                res.send('esa clave ya existe');
            }else {
            	asignatura.modificarAsigntura(req.query.id_asignatura,req.query.nombre,req.query.clave,req.query.obligatoria,req.query.tipo, function(error,row){
                	if (error) {
                		res.send('error conectando con la base de datos');
                		throw error;
                	}else {
                		res.send('asignatura modificada correctamente');
                	}//else
            	})//asignatura.modificarAsigntura
        	}//else
        }//else
    })//asignatura.buscarAsignaturaPorClave                                                         
});//router.post('/modificarAsignatura

/****************************************************************************************************************************/

/***********************************************************DELETE***********************************************************/

/*
* DELETE asignatura por id_asignatura OK
*/
router.post('/borrarAsignatura', function(req, res, next) {
    asignatura.buscarAsignaturaPorId(req.query.id_asignatura, function(error,row) {
        if (error) {
            res.send('error conectando con la base de datos');
            throw error;
        }else{
            if(row.length==0){
                res.send('Ese id no existe');
            }else{
                asignatura.borrarAsignatura(req.query.id_asignatura, function(error,row) {
                    if (error) {
                        throw error;
                        res.send('error borrando asignatura');
                    }else{
                        res.send('asignatura borrada correctamente');
                    }//else
                })//asignatura.borrarAsignatura
            }//else
        }//else
    })//asignatura.buscarAsignaturaPorId
});//router.post('/borrarAsignatura


/****************************************************************************************************************************/

/***********************************************************SELECT***********************************************************/

/*
* BUSCAR todas las asignaturas OK
*/
router.post('/buscarTodasLasAsignaturas', function(req,res,next) {
    asignatura.buscarTodasLasAsignaturas(function(error,row) {
        if (error) {
            throw error;
        }else{
            res.send(row);
        }//else
    })//asignatura.buscarTodasLasAsignaturas
});//router.post('/buscarTodasLasAsignaturas

module.exports = router;