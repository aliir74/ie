// Test Funcs
// See Inspect Element's Console Log Output

//step 2 validate?!



var game;
var levels = [
    {
        id:1,
        title:"Beginner!",
        timer:true,
        rows:10,
        cols:10,
        mines:5,
        time:120,
    },
];
var default_level;
var xml_str;
var currentLevel;
var loose = false;
var timer = false; //not started yet

function getGameXml2() {
    getGameXML(function callback(xml_str) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml_str, "text/xml");
        game = xmlDoc.getElementsByTagName("game")[0];
        if (game.getAttribute("id") == "minesweeper") {
            //alert(game.getAttribute('title'));
            document.getElementById('game-title').textContent = game.getAttribute('title');
            var levelsTag = xmlDoc.getElementsByTagName("levels")[0];
            default_level = levelsTag.getAttribute('default');
            var levelTag = xmlDoc.getElementsByTagName('level');
            //alert(levelTag.length)
            for (i = 0; i < levelTag.length; i++) {
                var curLevel = levelTag[i];
                //alert(curLevel.childNodes.length);
                var curId = curLevel.getAttribute('id');
                var curTitle = curLevel.getAttribute('title');
                var curTimer = curLevel.getAttribute('timer');
                //var rows = curLevel.childNodes[0].nodeName;
                var rows = xmlDoc.getElementsByTagName('rows')[i].innerHTML;
                var cols = xmlDoc.getElementsByTagName('cols')[i].innerHTML
                var mines = xmlDoc.getElementsByTagName('mines')[i].innerHTML
                var time = xmlDoc.getElementsByTagName('time')[i].innerHTML;
                levels[i] = {
                    id: curId,
                    title: curTitle,
                    timer: curTimer,
                    rows: rows,
                    cols: cols,
                    mines: mines,
                    time: time
                };

                if(curId == default_level) {
                    currentLevel = i;
                }
                //  console.log({id: curId, title:curTitle, timer: curTimer, rows:rows, cols: cols, mines: mines, time: time});
            }

            console.log("xml parsed!");
            //console.log(levels);
        } else {
            alert("game's tag id is incorrect ( " + game.getAttribute("id") + " )");
        }
    });
}

function makeXSL() {
    var xml= `
        <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
            <xsl:template match="/grid/row/col">
                <span row="{../@row}"
                        col="{@col}"
                        mine="{@mine}"></span>
            </xsl:template>
        </xsl:stylesheet>
        `;
    return new DOMParser().parseFromString(xml,"text/xml");

}

function newGame() {
   // alert('khar');
    var requestXML = `
        <request>
        <rows>`+levels[0].rows+`</rows>
        <cols>`+levels[0].cols+`</cols>
        <mines>`+levels[0].mines+`</mines>
        </request>
        `;
    //alert(requestXML);
    console.log(requestXML);
    getNewGame(requestXML, function (xmlStr) {
// Process and convert xmlStr to DOM    using XSLTProcessor
        var xml = new DOMParser().parseFromString(xmlStr, 'text/xml');
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(makeXSL());
        resultDocument = xsltProcessor.transformToFragment(xml, document);
        console.log(1000);
        //alert(resultDocument);
        console.log(resultDocument);
        document.getElementById('grid').appendChild(resultDocument);
    });
}


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
    smile.setAttribute('onclick', 'newGame()');
    topDiv.appendChild(smile);

    var counter2 = document.createElement("span");
    counter2.className += 'counter';
    counter2.innerHTML = '100';
    topDiv.appendChild(counter2);

    var grid = document.createElement('div');
    grid.className += 'grid';
    grid.setAttribute('id', 'grid');
    myWindow.appendChild(grid);

}

function start() {
    setCounters();
    //set timer & ... default value
    setSpansId();
    setOnClicks();
}

function setCounters() {
    if(levels[currentLevel].timer)
        document.getElementsByClassName('counter')[1].innerHTML = levels[currentLevel].time;
    else
        document.getElementsByClassName('counter')[1].innerHTML = 0;

    var grid = document.getElementsByClassName('grid')[0];
    var count = 0;
    for(i = 0; i < grid.childNodes.length; i++) {
        if(grid.childNodes[i].getAttribute('mine') == 'true') {
            grid.childNodes[i].setAttribute('data-value', 'mine');
            count++;
        }
    }
    document.getElementsByClassName('counter')[0].innerHTML = count;
}

function setOnClicks() {
    var grid = document.getElementsByClassName('grid')[0];
    for(i = 0; i < grid.childNodes.length; i++) {
        grid.childNodes[i].setAttribute(`onclick`, `onClickEvents('`+grid.childNodes[i].getAttribute('id')+`', event)`);
        //grid.childNodes[i].addEventListener('click', 'clicked', false);
    }
}

function setSpansId() {
    for(i = 0; i < grid.childNodes.length; i++) {
        grid.childNodes[i].setAttribute('id', 'c'+(i+1));
        //grid.childNodes[i].addEventListener('click', 'clicked', false);
    }
}

function startTimer() {
    console.log('startTimer');
    if(levels[currentLevel].timer == false) {
        console.log('if startTimer');
        document.getElementsByClassName('counter')[1].innerHTML++;
    } else if(timer == false){
        timer = true;
        var numCounter = setInterval(function () {
            document.getElementsByClassName('counter')[1].innerHTML--;
            console.log(loose);
            if(loose || document.getElementsByClassName('counter')[1].innerHTML <= 0) {
                clearInterval(numCounter);
                loose = true;
                console.log('You loose!');
                document.getElementsByClassName('smile')[0].setAttribute('data-value', '');
                alert('You loose!');
                return;
            }

        }, 1000)

    }
}

function onClickEvents(x, e) {
    startTimer();
    var span = document.getElementById(x);
    str = span.className.split(' ');
    if(e.button == 0) {
        var b = true;
        for (i = 0; i < str.length; i++) {
            if (str[i] == 'active') {
                b = false;
            }
        }
        if (b) {
            if (span.getAttribute('mine')) {
                //span.setAttribute('data-value', 'mine');
                span.className += 'revealed ';
                loose = true;
            } else {
                span.className += 'active ';
            }
        }
    } else if(e.button == 1) {
        var b = true;
        var andis = -1;
        for (i = 0; i < str.length; i++) {
            if (str[i] == 'flag') {
                b = false;
                andis = i;
            }
        }
        if(b) {
            span.className += 'flag';
            document.getElementsByClassName('counter')[0].innerHTML--;
        } else {
            span.className = "";
            for(i = 0; i < str.length; i++) {
                if(i != andis) {
                    span.className += str[i]+' ';
                }
            }
            document.getElementsByClassName('counter')[0].innerHTML++;
        }
    }
}

createModal();
createWindow();
getGameXml2();
window.onload = newGame();
start()