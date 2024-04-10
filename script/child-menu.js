function load_menu(){
    const container = document.getElementById("menu");

    const pages = [
        {
            "name": "XS",
            "link": "1_XS"
        }
    ]

    for (let x = 0; x < pages.length; x++){
        container.innerHTML += "<li><a class='link' href=https://ixd-supsi.github.io/2024/" + pages[x].link + ">" + pages[x].name +" </a></li>"
    }
}

document.addEventListener("DOMContentLoaded", function(){
    load_menu()
});
