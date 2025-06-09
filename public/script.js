var GLOBAL_DATA = null;
var loaded = false;
const DEBUG = true

const loadFile = async () => {
    $("#loadButton").hide();
    $("#loadingText").show();
    await window.API.readFile()
}

window.API.onSendResults((response) => {
    console.log('Received backend callback:', response);
    console.log(JSON.stringify(response))
    resultsCallback(response)
});

const resultsCallback = (response) => {
    console.log(response)
    GLOBAL_DATA = response.data
    loaded = true
    $("#loadPage").hide();
    $("#contentPage").show();
    $("#fileTitle").html(GLOBAL_DATA.file)

    buildDevices();
    buildStreams();
}



const preloadDebug = async () => {
    const response = await getData("sample.json")
    resultsCallback(response);
}


if(DEBUG)
{
    preloadDebug()
}