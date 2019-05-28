// Imports
var socket = io();

$( document ).ready(function() {
    $('select').formSelect();
    $('#password').bind("enterKey",function(e){
        loginButton();
    });
    $('#password').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });
});

// Networking Stuff
socket.on('connect', function(){
    if (sessionStorage.sessionToken) socket.emit('validateToken', sessionStorage.sessionToken);
    socket.emit('getUserList');
});

socket.on('loginSuccess', function(d) {
    sessionStorage.sessionToken = d.token;
    if (d.isMaster == true) { 
        window.location = "/master";
    } else {
        window.location = "/quiz";
    }
});

socket.on('loginFailed', function(token) {
    $('#password').val('');
    M.toast({html: 'Login Failed. Wrong Credentials?'});
});

socket.on('validateSuccess', function (isMaster) { 
    if (isMaster == true) { 
        window.location = "/master";
    } else {
        window.location = "/quiz";
    }
});

socket.on('getUserList', function(userList) {
    if (userList != null) populateUserSelection(userList);
});

// Automated Scripts

function populateUserSelection(userList) {
    $('#user-list').empty();
    
    $('#user-list').append('<option value="" disabled selected>Select the user</option>');
    for (let i = 0; i < userList.length; i++) {
        $('#user-list').append('<option value="'+userList[i]+'">'+userList[i]+'</option>');
    }

    $('select').formSelect();
}

// Manual Button Scripts

function refreshButton() {
    location.reload();
}

function loginButton() {
    if ($('#user-list').val() && $('#password').val())  {
        var userData = {
            name: $('#user-list').val(),
            password: $('#password').val(),
        };
        socket.emit('loginUser', userData);
    } else {
        M.toast({html: 'Please specify both a Username and Password.'});
    }

}
