var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};

var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit(){
    document.getElementById("getBalance").addEventListener("click", getBalance);
    var userLoginChallengeHandler = UserLoginChallengeHandler();

    WLAuthorizationManager.obtainAccessToken(userLoginChallengeHandler.securityCheckName).then(
        function (accessToken) {
            WL.Logger.debug("obtainAccessToken onSuccess");
            showProtectedDiv(); 
        },
        function (response) {
            WL.Logger.debug("obtainAccessToken onFailure: " + JSON.stringify(response));
            showLoginDiv();
    });
}

function showLoginDiv() {
    document.getElementById('protectedDiv').style.display = 'none'; 
    document.getElementById('statusMsg').innerHTML = "";
    document.getElementById('loginDiv').style.display = 'block';
}

function showProtectedDiv() {
    document.getElementById('loginDiv').style.display = 'none'; 
    document.getElementById('resultLabel').innerHTML = "";
    document.getElementById('protectedDiv').style.display = 'block';
}

function getBalance () {
    var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/balance", WLResourceRequest.GET);
    resourceRequest.send().then(
        function (response) {
            WL.Logger.debug("Balance: " + response.responseText);
            document.getElementById("resultLabel").innerHTML = "Balance: " + response.responseText;
        },
        function (response) {
            WL.Logger.debug("Failed to get balance: " + JSON.stringify(response));
            document.getElementById("resultLabel").innerHTML = "Failed to get balance.";
        });
}

