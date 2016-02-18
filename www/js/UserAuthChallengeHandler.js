

///////////////Add logs!!!!


var UserAuthChallengeHandler = function() {
    var isChallenged = false;
    var userAuthChallengeHandler = WL.Client.createWLChallengeHandler('UserAuthSecurityCheck');
    document.getElementById("login").addEventListener("click", login);
    document.getElementById("logout").addEventListener("click", logout);
        
    userAuthChallengeHandler.handleChallenge = function(challenge) {
        WL.Logger.debug("handleChallenge");
        isChallenged = true;
        if (challenge.errorMsg == null){
            showLoginDiv();
            document.getElementById('remainingAttempts').innerHTML = "Remaining Attempts: " + challenge.remainingAttempts;
        } else {
            document.getElementById('remainingAttempts').innerHTML = "Remaining Attempts: " + challenge.remainingAttempts + "<br/>" + challenge.errorMsg;
        }
    }
    
    userAuthChallengeHandler.processSuccess = function(data) {
        WL.Logger.debug("processSuccess");
        isChallenged = false;
        document.getElementById ("rememberMe").checked = false;
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
        document.getElementById("helloUser").innerHTML = "Hello " + data.user.displayName;
        showProtectedDiv();
    }
    
    userAuthChallengeHandler.handleFailure = function(error) {
        WL.Logger.debug("handleFailure: " + error.failure);
        isChallenged = false;
        if (error.failure != null){
            alert(error.failure);
        } else {
            alert("Failed to login.");
        }
    }
    
    function login() {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var rememberMeState = document.getElementById ("rememberMe").checked;
        if (username == "" || password == ""){
            alert("Username and password are required");
            return;
        }
        if (isChallenged){
            userAuthChallengeHandler.submitChallengeAnswer({'username':username, 'password':password, rememberMe: rememberMeState});    
        } else {
            WLAuthorizationManager.login('UserAuthSecurityCheck',{'username':username, 'password':password, rememberMe: rememberMeState}).then(
                function () {
                    WL.Logger.debug("login onSuccess");
                },
                function (response) {
                    WL.Logger.debug("login onFailure: " + response.errorMsg);
                })
        }
    }
    
    function logout() {
    WLAuthorizationManager.logout('UserAuthSecurityCheck').then(
        function () {
            WL.Logger.debug("logout onSuccess");
            location.reload();
        },
        function (response) {
            WL.Logger.debug("logout onFailure: " + response.errorMsg);
        })
    }
    
};