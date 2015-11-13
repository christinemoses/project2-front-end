'use strict';
var api = {
  svr: 'https://sleepy-hollows-7012.herokuapp.com/',
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
      url: this.svr + '/register',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
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
    $('input:text').val('');
    var arr = data.holidays;
    arr.forEach(function(holiday, _index, _arr){
      $(".holiday-listing").append("<li><a class='holiday-li' data-id='" + holiday.id +  "' href='#'>"+ holiday.name + "</a></li>");

      // html data-* attribute
      // $('a').data('id') == 1
    });
  };

  var recipientListCallback = function(error, data) {
    $(".recipient-listing").empty();
    $('input:text').val('');
    var arr = data.recipients;
    arr.forEach(function(recipient, _index, _arr){
      $(".recipient-listing").append("<li><a class='recipient-li' data-id='" + recipient.id +  "' href='#'>"+ recipient.name + "</a></li>");
    });
  };

  var giftListCallback = function(error, data) {
    $(".gift-listing").empty();
    $('input:text').val('');
    var arr = data.gift_ideas;
    arr.forEach(function(giftIdea, _index, _arr){
      $(".gift-listing").append("<li class='gift-idea-li' data-id='" + giftIdea.id +  "' href='#'>"+ giftIdea.description + "</li>");
    });
  };

  var callback = function callback(error, data) {
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4)); // formatting it to a more readable view
  };

  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    api.register(credentials, callback);
    e.preventDefault(); // prevents page from reloading
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

  $("#register-button").click(function() {
    $("#registration-form").hide();
    $('#registration-complete').show();
    $('#logged-in').hide();
    // $('input:password').val('')
  });

  $("#login-button").click(function() {
    $(".holiday-view").show();
    // $("#logout-button").show();
    $("#registration-form").hide();
    $("#login-form").hide();
    $('#logged-in').hide();
    $('#registration-complete').hide();
    $('#login-complete').show();
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
    $('.gift-listing').empty();
    $('#add-recipients').show();
    $('#login-complete').hide();
    $('#recipient-heading').empty();
    $(".recipient-view").show();
    api.listRecipients(recipientListCallback, holidayId);
  });

  $(document).on('click','.recipient-li', function(e){
    e.preventDefault();
    var recipientId = $(this).data('id');
    var recipientName = $(this).text();
    var holidayId = $("#recipient-holiday-id").val();
    $("#gift-idea-recipient-id").val(recipientId);
    $(".gift-view").show();
    $('#add-recipients').hide();
    $('#recipient-heading').html("Gift ideas for " + recipientName + ":");
    api.listGiftIdeas(giftListCallback, holidayId, recipientId);
  });

  $('#create-holiday').on('submit', function(e) {
    e.preventDefault();
    var name = $('#holiday-name').val();
    $('#add-gift-ideas').show();
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
