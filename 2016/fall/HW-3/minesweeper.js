// Test Funcs
// See Inspect Element's Console Log Output

getGameXML();

getNewGame(`
    <request>
    <rows>3</rows>
    <cols>3</cols>
    <mines>3</mines>
    </request>
`);

function createModal() {
    var modalBar = document.createElement("div");
    document.body.appendChild(modalBar);
    modalBar.setAttribute("id", "alert-modal");
    modalBar.className += "modal";

    var modalContent = document.createElement("div");
    modalBar.appendChild(modalContent);
    modalContent.className += "modal-content";

    var nameInp = document.createElement("input");
    modalContent.appendChild(nameInp);
    nameInp.setAttribute("id", "name");
    nameInp.className += "field";
    //palceholder doesn't work?!
    nameInp.setAttribute('placeholder', 'Enter your name');

    var btn = document.createElement("button");
    btn.appendChild(document.createTextNode("OK"));
    modalContent.appendChild(btn);
}

function createWindow() {
    var myWindow = document.createElement("div");
    myWindow.className += "window";
    document.body.appendChild(myWindow);

    var titleBar = document.createElement("div");
    titleBar.className += "title-bar";
    myWindow .appendChild(titleBar);

    var gameTitle = document.createElement("span");
    gameTitle.setAttribute("id", "game-title");
    gameTitle.innerHTML = "Minesweeper Online - Beginner!";
    titleBar.appendChild(gameTitle);

    var div1 = document.createElement("div");
    titleBar.appendChild(div1);

    var btnMinimize = document.createElement("span");
    btnMinimize.className += "btn";
    btnMinimize.setAttribute("id", "btn-minimize");
    btnMinimize.innerHTML = "&minus;";
    div1.appendChild(btnMinimize);

    var btnClose = document.createElement("span");
    btnClose.className += "btn";
    btnClose.setAttribute("id", "btn-close");
    btnClose.innerHTML = "&times;";
    div1.appendChild(btnClose);

    var topDiv = document.createElement("div");
    topDiv.className += "top";
    myWindow.appendChild(topDiv);

    var counter = document.createElement("span");
    counter.className += 'counter';
    counter.innerHTML = '123';
    topDiv.appendChild(counter);

    var smile = document.createElement("span");
    smile.className += 'smile';
    smile.setAttribute('data-value', 'normal');
    topDiv.appendChild(smile);

    var counter2 = document.createElement("span");
    counter2.className += 'counter';
    counter2.innerHTML = '321';
    topDiv.appendChild(counter2);

}

createModal();
createWindow();