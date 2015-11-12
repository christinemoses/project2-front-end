'use strict';
var api = {
  svr: 'http://localhost:3000',
  token: null,

  ajax: function(config, cb) {
    if(this.token !== null){
      var headers = {
        headers: {
          Authorization: 'Token token=' + this.token
        }
      };

      config = $.extend({}, config, headers);
    }

    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/register', //look at the curl method for the path
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),  // takes a JS object and converts it to valid JSON
      dataType: 'json' // expecting to get json content back
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/login', //look at the curl method for the path
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),  // takes a JS object and converts it to valid JSON
      dataType: 'json'
    }, callback);
  },

  //Authenticated api actions

  createHoliday: function (callback, name) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/holidays',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"holiday": {"name":name}}),
      dataType: 'json'
    }, callback);
  },

  listHolidays: function (callback) {
    this.ajax({
      method: 'GET',
      url: this.svr + '/holidays',
      dataType: 'json'
    }, callback);
  },

  deleteHoliday: function (callback, name) {
    this.ajax({
      method: 'DELETE',
      url: this.svr + '/holidays',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"holiday": {"name":name}}),
      dataType: 'json'
    }, callback);
  },

  createRecipient: function (callback, holidayId, name) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/holidays/' + holidayId + '/recipients',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"recipient": {"name":name}}),
      dataType: 'json'
    }, callback);
  },

  listRecipients: function (callback, holidayId) {
    this.ajax({
      method: 'GET',
      url: this.svr + '/holidays/' + holidayId + '/recipients',
      dataType: 'json'
    }, callback);
  },

  deleteRecipients: function (callback, holidayID, name) {
    this.ajax({
      method: 'DELETE',
      url: this.svr + '/holidays' + holidayId + '/recipients',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"recipient": {"name":name}}),
      dataType: 'json'
    }, callback);
  },

  createGiftIdea: function (callback, holidayId, recipientId, description) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/holidays/' + holidayId + '/recipients/' + recipientId + '/gift_ideas',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"gift_idea": {"description":description}}),
      dataType: 'json'
    }, callback);
  },

  updateGiftIdea: function (callback, holidayId, recipientId, description) {
    this.ajax({
      method: 'PATCH',
      url: this.svr + '/holidays/' + holidayId + '/recipients/' + recipientId + '/gift_ideas',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"gift_idea": {"description":description}}),
      dataType: 'json'
    }, callback);
  },

  listGiftIdeas: function (callback, holidayId, recipientId) {
    this.ajax({
      method: 'GET',
      url: this.svr + '/holidays/' + holidayId + '/recipients/' + recipientId + '/gift_ideas',
      dataType: 'json'
    }, callback);
  },

  deleteGiftIdea: function (callback, holidayId, recipientId, description) {
    this.ajax({
      method: 'DELETE',
      url: this.svr + '/holidays/' + holidayId + '/recipients/' + recipientId + '/gift_ideas',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"gift_idea": {"description":description}}),
      dataType: 'json'
    }, callback);
  },

};


$(function() {
  var form2object = function(form) { // extracts input data from a form and adds it to an object
    var data = {};
    $(form).children().each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      } // take all form data that is a name but not submit or hidden
    });
    return data;
  };

  var wrap = function wrap(root, formData) { // wraps the form data in the correct format
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  var holidayListCallback = function(error, data) {
    $(".holiday-listing").empty();
    var arr = data.holidays;
    arr.forEach(function(holiday, _index, _arr){
      $(".holiday-listing").append("<li><a class='holiday-li' data-id='" + holiday.id +  "' href='#'>"+ holiday.name + "</a></li>");
      // html data-* attribute
      // $('a').data('id') == 1
    });
  };

  var recipientListCallback = function(error, data) {
    $(".recipient-listing").empty();
    var arr = data.recipients;
    arr.forEach(function(recipient, _index, _arr){
      $(".recipient-listing").append("<li><a class='recipient-li' data-id='" + recipient.id +  "' href='#'>"+ recipient.name + "</a></li>");
      // html data-* attribute
      // $('a').data('id') == 1
    });
  };

  var giftListCallback = function(error, data) {
    $(".gift-listing").empty();
    var arr = data.gift_ideas;
    arr.forEach(function(giftIdea, _index, _arr){
      $(".gift-listing").append("<li><a class='gift-idea-li' data-id='" + giftIdea.id +  "' href='#'>"+ giftIdea.description + "</a></li>");
      // html data-* attribute
      // $('a').data('id') == 1
    });
  };

  var callback = function callback(error, data) { // show me error or show me response - gets returns from the request
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4)); // formatting it so it prints pretty
  };

  $('#register').on('submit', function(e) { // should be similar to code used for clicks working
    var credentials = wrap('credentials', form2object(this)); // take form data
    api.register(credentials, callback);
    e.preventDefault(); // will always use prefentDefault with a submit function - to keep the browser from automatically sending the submit to the server - we want to do something else with it
  });

  var loginCallback = function(error, loginData){
    console.log('loginData is ', loginData);
    if (error) {
      callback(error);
      return;
    }

    $('#logged-in').html("Logged in as " + loginData.user.email);
    callback(null, loginData);
    api.token = loginData.user.token; // stores token data on the page
  };

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    e.preventDefault();
    api.login(credentials, loginCallback);
  });

  $('#list-holidays').on('submit', function(e) {
    e.preventDefault();
    api.listHolidays(holidayListCallback);
  });

  // this is event delegation method for event handling
  // tells the page to keep listening for this event
  // even if the element is created later on
  $(document).on('click','.holiday-li', function(e){
    e.preventDefault();
    var holidayId = $(this).data('id');
    var holidayName = $(this).text();
    $("#recipient-holiday-id").val(holidayId);
    $('#holiday-heading').html(holidayName + " recipients:");
    $('.gift-listing').empty()
    // I need to clear gift idea header and gift idea text entry box content when clicking on a new holiday
    api.listRecipients(recipientListCallback, holidayId);
  });

  $(document).on('click','.recipient-li', function(e){
    e.preventDefault();
    var recipientId = $(this).data('id');
    var recipientName = $(this).text();
    var holidayId = $("#recipient-holiday-id").val();
    $("#gift-idea-recipient-id").val(recipientId);
    $('#recipient-heading').html("Gift ideas for " + recipientName + ":");
    api.listGiftIdeas(giftListCallback, holidayId, recipientId);
  });

  $('#create-holiday').on('submit', function(e) {
    e.preventDefault();
    var name = $('#holiday-name').val();
    api.createHoliday(function(){$("#list-holidays").trigger("submit")}, name);
  });

  $('#create-recipient').on('submit', function(e) {
    e.preventDefault();
    var name = $('#recipient-name').val();
    var holidayId = $("#recipient-holiday-id").val();
    api.createRecipient(function(){
      api.listRecipients(recipientListCallback, holidayId);
    }, holidayId, name);
  });

  $('#create-gift-idea').on('submit', function(e) {
    e.preventDefault();
    var description = $('#gift-description').val();
    var holidayId = $("#recipient-holiday-id").val();
    var recipientId = $('#gift-idea-recipient-id').val();
    api.createGiftIdea(function(){
      api.listGiftIdeas(giftListCallback, holidayId, recipientId);
    }, holidayId, recipientId, description);
  });

  $('#update-gift-idea').on('submit', function(e) {
    e.preventDefault();
    var description = $('#gift-description').val();
    var holidayId = $("#recipient-holiday-id").val();
    var recipientId = $('#gift-idea-recipient-id').val();
    api.createGiftIdea(function(){
      api.listGiftIdeas(giftListCallback, holidayId, recipientId);
    }, holidayId, recipientId, description);
  });

  $('#delete-holiday').on('submit', function(e) {
    e.preventDefault();
    var name = $('#holiday-name').val();
    api.deleteHoliday(function(){$("#list-holidays").trigger("submit")}, name);
  });

  $('#delete-recipient').on('submit', function(e) {
    e.preventDefault();
    var name = $('#recipient-name').val();
    api.deleteRecipient(function(){$("#list-holidays").trigger("submit")}, name);
  });

  $('#delete-gift-idea').on('submit', function(e) {
    e.preventDefault();
    var name = $('#gift-description').val();
    api.deleteGiftIdea(function(){$("#list-holidays").trigger("submit")}, name);
  });

  $('#logout').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
  });

});
