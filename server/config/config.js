// ================================
//  PORT
// ================================
process.env.PORT = process.env.PORT || 3000;


// ================================
//  Entorno
// ================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ================================
//  Vencimiento del Token
// ================================
// 60 segundos
// 60 minutos
// 24 horas
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



// ================================
//  SEED de autenticacion
// ================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


// ================================
//  Base de Datos
// ================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://user-cafe:Cafe@cluster0-roxcv.mongodb.net/cafe?retryWrites=true';
}
process.env.URLDB = urlDB