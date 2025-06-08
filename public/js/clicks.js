const selectTab = (name) => {
    $(".tabButton").removeClass("selected")
    $(`#${name}Button`).addClass("selected")

    $(".tabContainer").removeClass("selected")
    $(`#${name}Tab`).addClass("selected")
}

$("#packetsButton").on("click", () => {
    selectTab("packets")
})

$("#streamsButton").on("click", () => {
    selectTab("streams")
})

$("#devicesButton").on("click", () => {
    selectTab("devices")
})