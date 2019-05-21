// Imports
var socket = io();

$( document ).ready(function() {
    $('select').formSelect();
});

socket.on('connect', function(){
    socket.emit('validateLogin', sessionStorage.userId);
    socket.emit('getUserList');
});

socket.on('validateSuccess', function () { window.location = "/quiz"; });

socket.on('getUserList', function(userList) {
    console.log(userList);
    if (userList != null) populateUserSelection(userList);
});

socket.on('loginSuccess', function(userId) {
    sessionStorage.userId = userId;
    window.location = "/quiz";
});

socket.on('loginFailed', function(userId) {
    $('#password').val('');
    M.toast({html: 'Login Failed. Wrong Credentials?'});
});

function populateUserSelection(userList) {
    $('#userList').empty();
    
    $('#userList').append('<option value="" disabled selected>Select the user</option>');
    for (let i = 0; i < userList.length; i++) {
        $('#userList').append('<option value="'+userList[i]+'">'+userList[i]+'</option>');
    }

    $('select').formSelect();
}

function refreshPage() {
    location.reload();
}

function login() {
    var userData = {
        name: "",
        password: "",
    }

    if ($('#userList').val() && $('#password').val())  {
        userData.name = $('#userList').val();
        userData.password = $('#password').val();
        socket.emit('userLogin', userData);
    } else {
        M.toast({html: 'Please specify both a UserName and Password.'});
    }

}
