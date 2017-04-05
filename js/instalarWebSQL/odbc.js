var db;

function abrirWebSQL()
{
  db = openDatabase("orion1_2", "1.0", "Base de datos de Orion", 5*1024*1024);
}
function InsertarMasivo(sentencia, datos, callback)
{
    if (callback === undefined)
        {callback = function(){};}

  $.each(datos, function(index, val) 
  {
     ejecutarInsert(sentencia, val);
  });
  callback();
}
function ejecutarInsert(sentencia, datos, callback, siError)
{
  if (siError === undefined)
        {siError = errorCB;}

  if (callback === undefined)
        {callback = function(){};}

  db.transaction(function(tx) 
  {
    tx.executeSql(sentencia, datos, callback, siError);
  });
}
function ejecutarSQL(sentencia, parametro, callback, siError)
{
  if (siError === undefined)
        {siError = errorCB;}

  if (callback === undefined)
        {callback = function(){};}

  db.transaction(function(tx) 
  {
    tx.executeSql(sentencia, parametro, 
      function(tx, rs)
      {
        var data = [];
        var maximo = rs.rows.length;
              var idx = 0;
              for (idx = 0; idx < maximo; idx++) 
              {
                data.push(rs.rows.item(idx));
              };
        callback(data);
      }
      , siError);
  });
}
function errorCB(tx, error)
{
  console.log(error.message)
}
function comprobarWebSQL()
{
  ejecutarSQL("SELECT * FROM Login", [], function(tx, rs)
        {}, function(tx, rs)
        {
          instalarWebSQL();
        });
        
}