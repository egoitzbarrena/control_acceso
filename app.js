var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var md5 = require('blueimp-md5');

var routes = require('./routes/index');
var configFalta = require('./routes/configFalta');
var configAlumno = require('./routes/configAlumno');
var configAsignatura = require('./routes/configAsignatura');
var configAula = require('./routes/configAula');
var configGrupo = require('./routes/configGrupo');
var configProfesor = require('./routes/configProfesor');
var configHorarioGrupo = require('./routes/configHorarioGrupo');
var configHorarioProfesor = require('./routes/configHorarioProfesor');

var config = require('./routes/config');
var vistaProfesor = require('./routes/vistaProfesor');
var presencia = require('./routes/presencia');

var api = require('./routes/API/api');
var api_alumno = require('./routes/API/api_alumno');
var api_alumno_grupos = require('./routes/API/api_alumno_grupos');
var api_asignatura = require('./routes/API/api_asignatura');
var api_aula = require('./routes/API/api_aula');
var api_convalidadas = require('./routes/API/api_convalidadas');
var api_dispositivo = require('./routes/API/api_dispositivo');
var api_falta = require('./routes/API/api_falta');
var api_grupo =require('./routes/API/api_grupo');
var api_horario_grupo =require('./routes/API/api_horario_grupo');
var api_horario_profesor =require('./routes/API/api_horario_profesor');
var api_profesor =require('./routes/API/api_profesor');
var api_profesores_asignaturas =require('./routes/API/api_profesores_asignaturas');

var app = express();

app.use(session({ secret: '1234567890qwerty',resave: true, saveUninitialized: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/configAlumno', configAlumno);
app.use('/configAsignatura', configAsignatura);
app.use('/configAula', configAula);
app.use('/configGrupo', configGrupo);
app.use('/configProfesor', configProfesor);
app.use('/configHorarioGrupo', configHorarioGrupo);
app.use('/configHorarioProfesor', configHorarioProfesor);
app.use('/configFalta', configFalta);

app.use('/config',config);
app.use('/vistaProfesor',vistaProfesor);
app.use('/presencia', presencia);

app.use('/API', api);
app.use('/API', api_alumno);
app.use('/API', api_alumno_grupos);
app.use('/API', api_asignatura);
app.use('/API', api_aula);
app.use('/API', api_convalidadas);
app.use('/API', api_dispositivo);
app.use('/API', api_falta);
app.use('/API', api_grupo);
app.use('/API', api_horario_grupo);
app.use('/API', api_horario_profesor);
app.use('/API', api_profesor);
app.use('/API', api_profesores_asignaturas);

//*******************socket.io***********************************


//require (attach server on www.js)
app.io = require('socket.io')();

//importar alumno
var alumno = require('./models/alumno');
//configurar variable global io
app.set('io',app.io);
//escucha servidor io 2
app.io.on('connection', function(socket){
  console.log("conectado");
  //al escuchar cambiaCliente desde el cliente
  socket.on('cambiaCliente', function(msg){
    //update presencia alumno
    alumno.modificarPresenciaDelAlumno(msg, function (error) {
      if (error) {
        throw error;
      }else{
        //emitir cambiaServidor al cliente para cambiar color presencia alumno
        app.io.emit('cambiaServidor',msg);
      }
    })
  });
});
//*******************socket.io*fin*******************************
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
