function instalarWebSQL()
{
  var sentencia = "";
  var datos ={};

  ejecutarSQL(crearTabla("Login"));
  
  ejecutarSQL(crearTabla("Zonas"), [], function()
    {
      ejecutarSQL("DELETE FROM Zonas", [], function()
      {
        sentencia = "INSERT INTO Zonas (idZona, Nombre) VALUES (?, ?)";
        datos = [[1, "ADMINISTRATIVA"], [2,"ZONA INTERIOR"],  [3,"ZONA OESTE"]]; 
        InsertarMasivo(sentencia, datos);
      });
    });

  
  ejecutarSQL(crearTabla("Proyectos"), [], function()
    {
      
    });

  ejecutarSQL(crearTabla("Levantamiento"), [], function()
    {
      
    });

  ejecutarSQL(crearTabla("parametros"));
}
function crearTabla(Tabla)
{
  var sentencia = "";

  switch (Tabla)
  {
    case "Login":
      sentencia = 'CREATE TABLE IF NOT EXISTS Login (id, username, password, nombre, email, empresa)';
    break
    case "Zonas":
      sentencia = 'CREATE TABLE IF NOT EXISTS Zonas (idZona, Nombre)';
    break
    case "EstadosOT":
      sentencia = 'CREATE TABLE IF NOT EXISTS EstadosOT (idEstadoOT, Nombre)';
    break
    case "Proyectos":
      sentencia = 'CREATE TABLE IF NOT EXISTS Proyectos (idProyecto, idZona, Nombre, Descripcion, Creador, idEstado, Fecha, Sincronizacion)';
    break
    case "Levantamiento":
      sentencia = 'CREATE TABLE IF NOT EXISTS Levantamiento (Prefijo, idProyecto, codPoste, coordenadas, Usuario, fecha, Sincronizacion, Datos)';
    break
    case "parametros":
      sentencia = 'CREATE TABLE IF NOT EXISTS Sincronizacion (Nombre, Valor)';
    break    
  }
  return sentencia;
}
function parametroSincrozado(parametro, valor)
{
  ejecutarSQL("SELECT * FROM Sincronizacion WHERE Nombre = ?", [parametro], function(tx)
  {
    if (tx.length > 0)
    {
      ejecutarInsert("UPDATE Sincronizacion SET Valor = ? WHERE Nombre = ?", [valor, parametro]);
    } else
    {
      ejecutarInsert("INSERT INTO Sincronizacion (Valor, Nombre) VALUES (?, ?)", [valor, parametro]);
    }
  })
}