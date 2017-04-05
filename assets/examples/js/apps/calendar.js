/*!
 * remark v1.0.7 (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(document, window, $) {
  'use strict';

  window.AppCalendar = App.extend({
    handleFullcalendar: function() {
      var my_events = [{
        title: 'PR_2014_PG_PROYECTO VILLA ESTRELLA',
        start: '2016-05-06',
        end: '2016-05-09'
      }, {
        title: 'PR_2014_PG_PROYECTO VILLA ESTRELLA',
        start: '2016-05-12',
        end: '2016-05-17'
      }];
      var my_options = {
        header: {
          left: null,
          center: 'prev,title,next',
          right: 'month,agendaWeek,agendaDay'
        },
        selectable: true,
        selectHelper: true,
        select: function() {
          //$('#addNewEvent').modal('show');
        },
        editable: false,
        eventLimit: false,
        windowResize: function(view) {
          var width = $(window).outerWidth();
          var options = $.extend({}, my_options);
          options.events = view.calendar.getEventCache();
          options.aspectRatio = width < 667 ? 0.5 : 1.35;

          $('#calendar').fullCalendar('destroy');
          $('#calendar').fullCalendar(options);
        },
        eventClick: function(event) {
        },
        eventDragStart: function() {
          $.site.actionBtn.expand();
        },
        eventDragStop: function() {
          $.site.actionBtn.shrink();
        },
        events: my_events,
        droppable: true
      };

      var _options;
      var my_options_mobile = $.extend({}, my_options);

      my_options_mobile.aspectRatio = 0.5;
      _options = $(window).outerWidth() < 667 ? my_options_mobile : my_options;

      $('#calendar').fullCalendar(_options);
    },

    handleSelective: function() {
      
    },

    handleAction: function() {
      var actionBtn = $('.site-action').actionBtn().data('actionBtn');
    },

    handleEventList: function() {

      $('.calendar-list .calendar-event').each(function() {
        var $this = $(this),
          color = $this.data('color').split('-');
        $this.data('event', {
          title: $this.data('title'),
          stick: $this.data('stick'),
          backgroundColor: $.colors(color[0], color[1]),
          borderColor: $.colors(color[0], color[1])
        });
        $this.draggable({
          zIndex: 999,
          revert: true,
          revertDuration: 0,
          helper: function() {
            return '<a class="fc-day-grid-event fc-event fc-start fc-end" style="background-color:' + $.colors(color[0], color[1]) + ';border-color:' + $.colors(color[0], color[1]) + '">' +
              '<div class="fc-content">' +
              '<span class="fc-title">' + $this.data('title') + '</span>' +
              '</div>' +
              '</a>';
          }
        });
      });
    },

    run: function(next) {
      $('#addNewCalendarForm').modal({
        show: false
      });


      this.handleEventList();
      this.handleFullcalendar();
      this.handleAction();
      this.handleSelective();

      next();
    }
  });

  /*$(document).ready(function() {
    
  });*/
})(document, window, jQuery);
