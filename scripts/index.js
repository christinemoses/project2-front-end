'use strict';
var api = {
  svr: 'http://localhost:3000',

  ajax: function(config, cb) {
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
};



$(function() {
  var form2object = function(form) { // extracts input data from aform and adds it to an object
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
    //
    $('#logged-in').html("User " + loginData.user.email + " is Logged IN");

    callback(null, loginData);
    $('.token').val(loginData.user.token); // stores token data on the page
  };

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));

    e.preventDefault();
    api.login(credentials, loginCallback);
  });
});
