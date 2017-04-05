var servidor = function() 
{
  this.funcion = function(obj)
  {
    alert(obj);
  };

  this.cargarSectores = function(Usuario, callback)
  {
    callback = callback || function(){};
    ejecutarSQL("SELECT * FROM Zonas", [], function(rs)
    {
      callback(rs);
    })
  };

  this.cargarCircuitosPorSector = function(datos, callback)
  {
    var var1 = "";
    var tmpArr = datos.Sectores.split(", ");
    $.each(tmpArr, function(index, val) 
    {
       var1 += "?, ";
       tmpArr[index] = parseInt(val);
    });

      var1 = var1.slice(0,var1.length-2);

    ejecutarSQL("SELECT * FROM Proyectos WHERE idZona IN (" + var1 + ")", tmpArr, function(rs)
      {
        if (rs.length > 0)
        {
          callback(rs);
        } else
        {
          callback(0);
        }
      });
  };
};

$.servidor = new servidor();