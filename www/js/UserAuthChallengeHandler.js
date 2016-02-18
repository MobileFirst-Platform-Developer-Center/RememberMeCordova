var UserLoginChallengeHandler = function() {
    var isChallenged = false;
    var securityCheckName = 'UserLogin';
    var userLoginChallengeHandler = WL.Client.createWLChallengeHandler(securityCheckName);
    
    document.getElementById("login").addEventListener("click", login);
    document.getElementById("logout").addEventListener("click", logout);
    
    userLoginChallengeHandler.securityCheckName = securityCheckName;
        
    userLoginChallengeHandler.handleChallenge = function(challenge) {
        WL.Logger.debug("handleChallenge");
        showLoginDiv();
        isChallenged = true;
        var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
        if (challenge.errorMsg != null){
            statusMsg = statusMsg + "<br/>" + challenge.errorMsg;
        }
        document.getElementById("statusMsg").innerHTML = statusMsg;
    }
    
    userLoginChallengeHandler.processSuccess = function(data) {
        WL.Logger.debug("processSuccess");
        isChallenged = false;
        document.getElementById ("rememberMe").checked = false;
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
        document.getElementById("helloUser").innerHTML = "Hello " + data.user.displayName;
        showProtectedDiv();
    }
    
    userLoginChallengeHandler.handleFailure = function(error) {
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
            userLoginChallengeHandler.submitChallengeAnswer({'username':username, 'password':password, rememberMe: rememberMeState});    
        } else {
            WLAuthorizationManager.login(securityCheckName,{'username':username, 'password':password, rememberMe: rememberMeState}).then(
                function () {
                    WL.Logger.debug("login onSuccess");
                },
                function (response) {
                    WL.Logger.debug("login onFailure: " + JSON.stringify(response));
                });
        }
    }
    
    function logout() {
    WLAuthorizationManager.logout(securityCheckName).then(
        function () {
            WL.Logger.debug("logout onSuccess");
            location.reload();
        },
        function (response) {
            WL.Logger.debug("logout onFailure: " + JSON.stringify(response));
        });
    }
    
    return userLoginChallengeHandler;
    
};