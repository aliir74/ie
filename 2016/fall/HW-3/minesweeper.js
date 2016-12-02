// Test Funcs
// See Inspect Element's Console Log Output

//step 2 validate?!
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

var unvisited;

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
var win = false;
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

function newGameSmile() {
    var grid = document.getElementsByClassName('grid')[0];
    var size = grid.childNodes.length
    for(i = size-1; i > -1; i--) {
        grid.removeChild(grid.childNodes[i]);
    }
    var levelTitle = prompt('Please enter new level id: ');
    newGame(levelTitle);
    start();
}

function newGame(levelTitle) {
   // alert('khar');
    var levelAndis = -1
    for(i = 0; i < levels.length; i++) {
        if(levelTitle == levels[i].id) {
            levelAndis = i;
            break;
        }
    }
    //alert(levelAndis);
    var requestXML = `
        <request>
        <rows>`+levels[levelAndis].rows+`</rows>
        <cols>`+levels[levelAndis].cols+`</cols>
        <mines>`+levels[levelAndis].mines+`</mines>
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
    modalBar.className = "modal";

    var modalContent = document.createElement("div");
    modalBar.appendChild(modalContent);
    modalContent.className = "modal-content";

    var nameInp = document.createElement("input");
    modalContent.appendChild(nameInp);
    nameInp.setAttribute("id", "name");
    nameInp.className = "field";
    //palceholder doesn't work?!
    nameInp.setAttribute('placeholder', 'Enter your name');

    var btn = document.createElement("button");
    btn.appendChild(document.createTextNode("OK"));
    btn.setAttribute('onclick', 'hideModal()');
    modalContent.appendChild(btn);
}

function hideModal() {
    var inp = document.getElementById('name');
    var name = inp.value;
    console.log('name:', name);
    var correct = true;
    for (i = 0; i < name.length; i++) {
        if (name[i] > 'z' || name[i] < 'a') {
            correct = false;
        }
    }
    if (!correct) {
        alert('Your name is incorrect!');
        inp.value = '';
    } else {
        //document.getElementsByClassName('modal-content')[0].removeChild(document.getElementsByTagName('button')[0]);
        document.getElementById('alert-modal').style.display = 'none';
    }
}

function createWindow() {
    var myWindow = document.createElement("div");
    myWindow.className = "window";
    document.body.appendChild(myWindow);

    var titleBar = document.createElement("div");
    titleBar.className = "title-bar";
    myWindow .appendChild(titleBar);

    var gameTitle = document.createElement("span");
    gameTitle.setAttribute("id", "game-title");
    gameTitle.innerHTML = "Minesweeper Online - Beginner!";
    titleBar.appendChild(gameTitle);

    var div1 = document.createElement("div");
    titleBar.appendChild(div1);

    var btnMinimize = document.createElement("span");
    btnMinimize.className = "btn";
    btnMinimize.setAttribute("id", "btn-minimize");
    btnMinimize.innerHTML = "&minus;";
    div1.appendChild(btnMinimize);

    var btnClose = document.createElement("span");
    btnClose.className = "btn";
    btnClose.setAttribute("id", "btn-close");
    btnClose.innerHTML = "&times;";
    div1.appendChild(btnClose);

    var topDiv = document.createElement("div");
    topDiv.className = "top";
    myWindow.appendChild(topDiv);

    var counter = document.createElement("span");
    counter.className = 'counter';
    counter.innerHTML = '123';
    topDiv.appendChild(counter);

    var smile = document.createElement("span");
    smile.className = 'smile';
    smile.setAttribute('data-value', 'normal');
    smile.setAttribute('onclick', 'newGameSmile()');
    topDiv.appendChild(smile);

    var counter2 = document.createElement("span");
    counter2.className = 'counter';
    counter2.innerHTML = '100';
    topDiv.appendChild(counter2);

    var grid = document.createElement('div');
    grid.className = 'grid';
    grid.setAttribute('id', 'grid');
    myWindow.appendChild(grid);

}

function start() {
    setCounters();
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

    unvisited = grid.childNodes.length - levels[currentLevel].mines;
    document.getElementsByClassName('smile')[0].setAttribute('data-value', 'normal');
}

function onRightClick(x) {
    startTimer();
    var span = document.getElementById(x);
    str = span.className.split(' ');
    var b = true;
    var andis = -1;
    for (i = 0; i < str.length; i++) {
        if (str[i] == 'flag' || str[i] == 'active' || str[i] == 'revealed') {
            b = false;
            if(str[i] == 'flag')
                andis = i;
            break;
        }
    }
    if(b) {
        span.className = 'flag';
        document.getElementsByClassName('counter')[0].innerHTML--;
    } else {
        span.className = "";
        for(i = 0; i < str.length; i++) {
            if(i != andis) {
                span.className = str[i];
            }
        }
        if(andis != -1)
            document.getElementsByClassName('counter')[0].innerHTML++;
    }
}

function setOnClicks() {
    var grid = document.getElementsByClassName('grid')[0];
    for(i = 0; i < grid.childNodes.length; i++) {
        grid.childNodes[i].setAttribute(`onclick`, `onClickEvents('`+grid.childNodes[i].getAttribute('id')+`', event)`);
        grid.childNodes[i].setAttribute('oncontextmenu', `onRightClick('`+grid.childNodes[i].getAttribute('id')+`')`);
        //grid.childNodes[i].addEventListener('mousedown', 'onClickEvents', false);
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
            //console.log(loose);
            console.log(unvisited);
            if(win || (unvisited == 0 && document.getElementsByClassName('counter')[0].innerHTML == 0)) {
                clearInterval(numCounter);
                console.log('You Win!');
                alert('You Win');
                return;
            }
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
    //alert(e.button);
    if(e.button == 0) {
        /*
        var b = true;

        for (i = 0; i < str.length; i++) {
            if (str[i] == 'active' || str[i] == 'flag') {
                b = false;
            }
        }
        */
        if(span.className == 'active' || span.className == 'revealed') {
            showAll();
        } else if(span.className != 'flag') {
            if (span.getAttribute('mine')) {
                //span.setAttribute('data-value', 'mine');
                span.className = 'revealed';
                loose = true;
            } else {
                span.className = 'revealed';
                revealNeighbors(x);
            }
        }
    } else if(e.button == 1) {

    } else if(e.button == 2)
        alert('right click');
}

function showAll() {
    if(document.getElementsByClassName('counter')[0].innerHTML != 0)
        return;
    var grid = document.getElementsByClassName('grid')[0];
    for(i = 0; i < grid.childNodes.length; i++) {
        if(grid.childNodes[i].className != 'flag') {
            var count = 0;
            var number = i + 1;
            var right = false, left = false, top = false, bottom = false;
            var num2 = number - 1;
            //alert(parseInt(1/9))
            if (parseInt(num2 / 9) > 0)
                top = true;
            if (parseInt(num2 / 9) < 8)
                bottom = true;
            if (num2 % 9 > 0)
                left = true;
            if (num2 % 9 < 8)
                right = true;

            if (top) {
                if (document.getElementById('c' + (number - 9)).getAttribute('mine') == 'true')
                    count++;

                if (right) {
                    if (document.getElementById('c' + (number - 8)).getAttribute('mine') == 'true')
                        count++;
                }
                if (left) {
                    if (document.getElementById('c' + (number - 10)).getAttribute('mine') == 'true')
                        count++;
                }
            }
            if (bottom) {
                if (document.getElementById('c' + (number + 9)).getAttribute('mine') == 'true')
                    count++;

                if (right) {
                    if (document.getElementById('c' + (number + 10)).getAttribute('mine') == 'true')
                        count++;
                }
                if (left) {
                    if (document.getElementById('c' + (number + 8)).getAttribute('mine') == 'true')
                        count++;
                }
            }
            if (right) {
                if (document.getElementById('c' + (number + 1)).getAttribute('mine') == 'true')
                    count++;
            }
            if (left) {
                if (document.getElementById('c' + (number - 1)).getAttribute('mine') == 'true')
                    count++;
            }
            if(grid.childNodes[i].getAttribute('mine') == 'true') {
                loose = true;
                grid.childNodes[i].setAttribute('data-value', 'mine');
            } else
                grid.childNodes[i].setAttribute('data-value', count);
            grid.childNodes[i].className = 'revealed';
        }
    }
    if(loose == false) {
        win = true;
    }
}

function revealNeighbors(x) {
    console.log(x);
    var span = document.getElementById(x);
    if(span.getAttribute('mine') == 'true' || span.className == 'flag')
        return;

    var count = 0;
    var number = parseInt(x.slice(1, x.length));
    var right = false, left = false, top = false, bottom = false;
    var num2 = number-1;
    //alert(parseInt(1/9))
    if(parseInt(num2/9) > 0)
        top = true;
    if(parseInt(num2/9) < 8)
        bottom = true;
    if(num2%9 > 0)
        left = true;
    if(num2%9 < 8)
        right = true;

    if(top) {
        if(document.getElementById('c'+(number-9)).getAttribute('mine') == 'true')
            count++;

        if(right) {
            if(document.getElementById('c'+(number-8)).getAttribute('mine') == 'true')
                count++;
        }
        if(left) {
            if(document.getElementById('c'+(number-10)).getAttribute('mine') == 'true')
                count++;
        }
    }
    if(bottom) {
        if(document.getElementById('c'+(number+9)).getAttribute('mine') == 'true')
            count++;

        if(right) {
            if(document.getElementById('c'+(number+10)).getAttribute('mine') == 'true')
                count++;
        }
        if(left) {
            if(document.getElementById('c'+(number+8)).getAttribute('mine') == 'true')
                count++;
        }
    }
    if(right) {
        if(document.getElementById('c'+(number+1)).getAttribute('mine') == 'true')
            count++;
    }
    if(left) {
        if(document.getElementById('c'+(number-1)).getAttribute('mine') == 'true')
            count++;
    }

    span.setAttribute('data-value', count);
    span.className = 'revealed';
    unvisited--;
    if(count != 0)
        return;
    //alert(count);


    if(top) {
        if(revealedCheck('c'+(number-9)))
            revealNeighbors('c'+(number-9));
        if(right) {
            if(revealedCheck('c'+(number-8)))
                revealNeighbors('c'+(number-8))
        }
        if(left) {
            if(revealedCheck('c'+(number-10)))
                revealNeighbors('c'+(number-10))
        }
    }
    if(bottom) {
        if(revealedCheck('c'+(number+9)))
            revealNeighbors('c'+(number+9))
        if(right) {
            if(revealedCheck('c'+(number+10)))
                revealNeighbors('c'+(number+10))
        }
        if(left) {
            if(revealedCheck('c'+(number+8)))
                revealNeighbors('c'+(number+8))
        }
    }
    if(right) {
        if(revealedCheck('c'+(number+1)))
            revealNeighbors('c'+(number+1))
    }
    if(left) {
        if(revealedCheck('c'+(number-1)))
            revealNeighbors('c'+(number-1))
    }

    return;
}

function revealedCheck(x) {
    var span = document.getElementById(x);
    var str = span.className.split(' ');
    for(i = 0; i < str.length; i++) {
        if(str[i] == 'revealed' || str[i] == 'active')
            return false;
    }
    return true;
}

createModal();
createWindow();
getGameXml2();
window.onload = newGame(1);
start()