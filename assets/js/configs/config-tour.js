/*!
 * remark v1.0.7 (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';

  $.configs.set('tour', {
    steps: [{
      element: "#toggleMenubar",
      position: "right",
      intro: "Ocultar Menu <p class='content'>Permite ocultar el menu lateral para que pueda utilizar toda la pantalla en sus modulos</p>"
    }, {
      element: "#toggleFullscreen",
      intro: "Pantalla Completa <p class='content'>Click en este botón para ver la aplicación en Pantalla Completa</p>"
    }, {
      element: "#toggleNotifications",
      position: 'left',
      intro: "Notificaciones <p class='content'>This is a sidebar dialog box for user conversations list, you can even create a quick conversation with other users</p>"
    }, {
      element: "#toggleUser",
      position: 'left',
      intro: "Menu de Usuario <p class='content'>This is a sidebar dialog box for user conversations list, you can even create a quick conversation with other users</p>"
    }, {
      element: "#contenedorMenu",
      position: 'right',
      intro: "Menu Lateral <p class='content'>This is a sidebar dialog box for user conversations list, you can even create a quick conversation with other users</p>"
    }, {
      element: "#txtModulo_Titulo",
      position: 'bottom',
      intro: "Nombre del Modulo <p class='content'>This is a sidebar dialog box for user conversations list, you can even create a quick conversation with other users</p>"
    }, {
      element: "#txtModulo_Contenido",
      position: 'bottom',
      intro: "Area de Trabajo <p class='content'>This is a sidebar dialog box for user conversations list, you can even create a quick conversation with other users</p>"
    }
    ],
    skipLabel: "<i class='wb-close'></i>",
    doneLabel: "<i class='wb-close'></i>",
    nextLabel: "Siguiente <i class='wb-chevron-right-mini'></i>",
    prevLabel: "<i class='wb-chevron-left-mini'></i>Anterior",
    showBullets: false
  });

})(window, document, $);
