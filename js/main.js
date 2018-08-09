function Main() {
    /// zmienne ///
    var gamefield;
    var canvas;
    var ctx;
    var bombs = [];
    var bombsCounter;
    var levelCounter = 1;
    var levelDifficulty = 1;
    var bomb = new Image();
    bomb.src = "img/bomb.png";
    var lives = 3;
    var score = 0;
    var player = new Image();
    player.src = "img/player.png"
    var playerCoordinates = {};
    playerCoordinates.x = 450;
    var caughtBombs = 0;

    /// gamefield ///
    gamefield = document.getElementById("gamefield");
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = 1000;
    canvas.height = 1000;
    gamefield.appendChild(canvas);

    ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1c751f";
    ctx.fillRect(0, 200, 1000, 700); //bombs
    ctx.fillRect(0, 900, 1000, 100); //player

    ctx.fillStyle = "#a0a0a0";
    ctx.fillRect(0, 0, 1000, 200); //prisoner





    /// prisoner ///

    function Prisoner() {
        ctx.clearRect(0, 0, 1000, 200);
        ctx.fillStyle = "#a0a0a0";
        ctx.fillRect(0, 0, 1000, 200); //prisoner
        var prisoner = new Image();
        prisoner.src = "img/prisoner.png";
        var x = 450;
        const y = 30;
        ctx.drawImage(prisoner, x, y);

        var direction, oldDirection;
        bombsCounter = 20;

        function startInterval() {
            var interval = setInterval(function () {
                ctx.clearRect(0, 0, 1000, 200);
                ctx.fillStyle = "#a0a0a0";
                ctx.fillRect(0, 0, 1000, 200);
                if (x > 80 && x < 920) {
                    direction = Math.floor(Math.random() * (2)) + 0;
                }
                else if (x <= 80) {
                    direction = 1;
                }
                else if (x >= 920) {
                    direction = 0;
                }

                //direction = 0 -> left, direction = 1 -> right
                if (direction == 0) {
                    x -= 45;
                    ctx.drawImage(prisoner, x, y);
                }
                else if (direction == 1) {
                    x += 45;
                    ctx.drawImage(prisoner, x, y);
                }
                ///set bomb
                if (oldDirection != direction) {
                    if (bombsCounter > 0) {
                        //drawBomb(x, 200);
                        var bombObj = {};
                        bombObj.x = x;
                        bombObj.y = 200;
                        bombs.push(bombObj);
                        //console.log(bombs);
                        bombsCounter--;
                    }
                }
                oldDirection = direction;

                updateBombs(interval);

            }, (1600 - levelDifficulty*150))
        }

        startInterval();
    }
        /// Bombs ///

        function drawBomb(x, y) {
            ctx.drawImage(bomb, x, y);
        }

        function updateBombs(interval) {
            if (bombs[0]) {
                if (bombs[0].y > 800) {
                    checkCollision(interval);
                    bombs.shift();
                }
                ctx.clearRect(0, 200, 1000, 700);
                ctx.fillStyle = "#1c751f";
                ctx.fillRect(0, 200, 1000, 700); //bombs

                for (var i = 0; i < bombs.length; i++) {
                    bombs[i].y += 50;
                    //console.log(bombs[i].x, bombs[i].y);
                    drawBomb(bombs[i].x, bombs[i].y);
                }

            }
                
        }


    /// Player ///

        function createPlayer() {
            ctx.fillStyle = "#1c751f";
            ctx.clearRect(0, 900, 1000, 100);
            ctx.fillRect(0, 900, 1000, 100); //player
            for (var i = (lives-1); i >= 0; i--) {
                playerCoordinates.y = 900 + i * 35;

                ctx.drawImage(player, playerCoordinates.x, playerCoordinates.y);
             }
        }

        function movePlayer() {
            document.body.onkeydown = function (e) {
                //console.log(e.which);
                ctx.fillStyle = "#1c751f";
                ctx.clearRect(0, 900, 1000, 100);
                ctx.fillRect(0, 900, 1000, 100); //player
                if (e.which == 37) { /// left /
                    if (playerCoordinates.x > 10) {
                        playerCoordinates.x -= 20;
                    }
                }
                else if (e.which == 39) {
                    if(playerCoordinates.x < 890){
                        playerCoordinates.x += 20;
                    }
                }
                createPlayer();
            };
        }

    /// kolizja ///

        function checkCollision(interval) {
            console.log("PLAYER: " + playerCoordinates.x);
            console.log("BOMBA: " + bombs[0].x);
            console.log("WYNIK: " + score);
            caughtBombs++;

            var left_right;


            if (playerCoordinates.x >= bombs[0].x) {
                left_right = playerCoordinates.x - bombs[0].x;
            }
            else {
                left_right = bombs[0].x - playerCoordinates.x;
            }

            if (left_right <= 65) { //bomba złapana
                score += levelCounter * levelCounter;
                updateScore();
                console.log(caughtBombs);
                if (caughtBombs == 20) {
                    clearInterval(interval);
                    levelCounter++;
                    console.log(levelCounter);
                    var showScore = document.getElementById("showScore");
                    showScore.innerHTML = "Next level!";
                    caughtBombs = 0;
                    setTimeout(function () {
                        bombsCounter = 20;
                        if (levelCounter < 11) {
                            levelDifficulty = levelCounter;
                        }
                        Prisoner();
                    }, 1000)
                }
            }
            else { //bomba przepuszczona
                if (lives > 1) {
                    lives--;
                    createPlayer();
                }
                else {
                    clearInterval(interval);
                    alert("KONIEC GRY! UZYSKAŁEŚ " + score + " PKT.");
                    var showScore = document.getElementById("showScore");
                    showScore.innerHTML = "YOU LOST. Refresh page to try again!"
                } 
            }
        }


    /// score ///

        function updateScore() {
            var showScore = document.getElementById("showScore");
            showScore.id = "showScore";
            showScore.innerHTML = "Your score: " + score;
        }

    /// btStart ///

        document.getElementById("btStart").onclick = function () {

            document.getElementById("btStart").classList.toggle('hidden');
            document.getElementById("showScore").classList.toggle('hidden');

            Prisoner();
            createPlayer();
            movePlayer();
            updateScore();
        }
    
}