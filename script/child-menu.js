function load_menu(){
    const container = document.getElementById("menu");

    const pages = [
        {
            "name": "Marionetta digitale",
            "link": "1_marionetta_digitale"
        }
    ]

    for (let x = 0; x < pages.length; x++){
        container.innerHTML += "<li><a class='link' href=https://ixd-supsi.github.io/2023/" + pages[x].link + ">" + pages[x].name +" </a></li>"
    }
}

document.addEventListener("DOMContentLoaded", function(){
    load_menu()
});
