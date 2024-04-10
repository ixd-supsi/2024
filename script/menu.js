function load_menu(){
    const container = document.getElementById("menu");

    const pages = [
        {
            "link": "2020",
        },
        {
            "link": "2021",
        },
        {
            "link": "2022",
        },
        {
            "link": "2023"
        }
    ]

    for (let x = 0; x < pages.length; x++){
        container.innerHTML += "<li><a class='link' href=https://ixd-supsi.github.io/" + pages[x].link + ">" + pages[x].link +" </a></li>"
    }                
}

document.addEventListener("DOMContentLoaded", function(){
    load_menu()
});
