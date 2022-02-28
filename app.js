window.addEventListener("load", () => {
	registerSW();
});

const registerSW = async () => {
	// this line checks wether the browser supports serviceWorker or not.
	if ("serviceWorker" in navigator) {
		try {
			await navigator.serviceWorker.register("./sw.js");
            console.log("Registered");
		} catch (e) {
			console.log(`SW registration failed`);
		}
	}
};
var btnTranslate = document.querySelector("#btn-translate");
var txtInput = document.querySelector("#txt-input");
var outputDiv = document.querySelector("#output");

var serverURL = "https://api.funtranslations.com/translate/pirate.json"

function getTranslationURL(input) {
    return serverURL + "?" + "text=" + input
}

function errorHandler(error) {
    console.log("error occured", error);
    alert("something wrong with server! try again after some time")
}

function clickHandler() {
    var inputText = txtInput.value; 

    fetch(getTranslationURL(inputText))
        .then(response => response.json())
        .then(json => {
            var translatedText = json.contents.translated;
            outputDiv.innerText = translatedText; 
           })
        .catch(errorHandler)
};

btnTranslate.addEventListener("click", clickHandler)