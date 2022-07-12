    config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'pcanvas',
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let rpText;
let rpScore = 0;
let gpText;
let gpScore = 0;
let enterKey;
let spaceBar;
let player1ButtonDown = false;
let player2ButtonDown = false;
let rpImage;
let gpImage;
let gameTimer = 5001;
let gamePaused = false;

let redSnap;
let greenSnap;
let target = new Phaser.Math.Vector2();
let screenCenter = new Phaser.Math.Vector2(400, 300);
//let offScreen = new Phaser.Math.Vector2(750, 300);
let moving = false;
let SnapX = 0.2;
let SnapY = 0.2;

let cardCount = 0;
let cardObjectsRED = [];
let cardObjectsPURPLE = [];
let cardObjectsGREEN = [];
let cardObjectsBLUE = [];

let availableCardObjectsRED = [];
let availableCardObjectsPURPLE = [];
let availableCardObjectsGREEN = [];
let availableCardObjectsBLUE = [];

let previousCard;
let currentCard;
let previousCardImage;
let currentCardImage;

let availableArrays = 4;

let chooseCard = false;
let cardTimer = 0;

let array1 = true;
let array2 = true;
let array3 = true;
let array4 = true;

let cardNumberOrder = [];
let cardColourOrder = [];
let cardOrder = [];

let resetCard = false;
let canSnap;

let stopPlaying = false;
let winnerShown = false;

let greenFrozen = false;
let redFrozen = false;

let greenFrozenTimer = 0;
let redFrozenTimer = 0;

let frozenImageGreen;
let frozenImageRed;

function preload ()
{
    this.load.image('gp', './images/greenPlayer.png');
    this.load.image('gpo', './images/greenPlayerOpaque.png');
    this.load.image('rp', './images/redPlayer.png');
    this.load.image('rpo', './images/redPlayerOpaque.png');
    this.load.image('rSnap', './images/snapRed.png');
    this.load.image('gSnap', './images/snapGreen.png');
    this.load.image('R1', './images/redCards/1.png');
    this.load.image('R2', './images/redCards/2.png');
    this.load.image('R3', './images/redCards/3.png');
    this.load.image('R4', './images/redCards/4.png');
    this.load.image('R5', './images/redCards/5.png');
    this.load.image('R6', './images/redCards/6.png');
    this.load.image('R7', './images/redCards/7.png');
    this.load.image('R8', './images/redCards/8.png');
    this.load.image('R9', './images/redCards/9.png');
    this.load.image('R10', './images/redCards/10.png');
    this.load.image('G1', './images/greenCards/1.png');
    this.load.image('G2', './images/greenCards/2.png');
    this.load.image('G3', './images/greenCards/3.png');
    this.load.image('G4', './images/greenCards/4.png');
    this.load.image('G5', './images/greenCards/5.png');
    this.load.image('G6', './images/greenCards/6.png');
    this.load.image('G7', './images/greenCards/7.png');
    this.load.image('G8', './images/greenCards/8.png');
    this.load.image('G9', './images/greenCards/9.png');
    this.load.image('G10', './images/greenCards/10.png');
    this.load.image('P1', './images/purpleCards/1.png');
    this.load.image('P2', './images/purpleCards/2.png');
    this.load.image('P3', './images/purpleCards/3.png');
    this.load.image('P4', './images/purpleCards/4.png');
    this.load.image('P5', './images/purpleCards/5.png');
    this.load.image('P6', './images/purpleCards/6.png');
    this.load.image('P7', './images/purpleCards/7.png');
    this.load.image('P8', './images/purpleCards/8.png');
    this.load.image('P9', './images/purpleCards/9.png');
    this.load.image('P10', './images/purpleCards/10.png');
    this.load.image('B1', './images/blueCards/1.png');
    this.load.image('B2', './images/blueCards/2.png');
    this.load.image('B3', './images/blueCards/3.png');
    this.load.image('B4', './images/blueCards/4.png');
    this.load.image('B5', './images/blueCards/5.png');
    this.load.image('B6', './images/blueCards/6.png');
    this.load.image('B7', './images/blueCards/7.png');
    this.load.image('B8', './images/blueCards/8.png');
    this.load.image('B9', './images/blueCards/9.png');
    this.load.image('B10', './images/blueCards/10.png');
    this.load.image('greenWins', './images/greenWins.png');
    this.load.image('redWins', './images/redWins.png');
    this.load.image('frozen', './images/frozenImage.png');
}

function create ()
{
    console.log('space');
    this.add.image(150,300,'gpo').setScale(0.2, 0.2);
    this.add.image(650,300,'rpo').setScale(0.2, 0.2);

    this.cameras.main.setBackgroundColor('#FFFFD1');

    gpText = this.add.text(230, 20, '0', {  //you have to minus 70 from x position of first text object as phaser positions object from the left no the center
        fontSize: '100px',
        fontFamily: 'Clarendon',
        fill: '#77DD77'
    })

    rpText = this.add.text(500, 20, '0', {
        fontSize: '100px',
        fontFamily: 'Clarendon',
        fill: '#FF6961'
    })

    enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    for(let i = 0; i < 10; i++)
    {
        cardObjectsRED[i] = new createCard(i, 0);
        cardObjectsPURPLE[i] = new createCard(i, 1);
        cardObjectsGREEN[i] = new createCard(i, 2);
        cardObjectsBLUE[i] = new createCard(i, 3);
    }

    availableCardObjectsGREEN = cardObjectsGREEN.slice();
    availableCardObjectsBLUE = cardObjectsBLUE.slice();
    availableCardObjectsRED = cardObjectsRED.slice();
    availableCardObjectsPURPLE = cardObjectsPURPLE.slice();

    /*for(let i = 0; i < 10; i++)
    {
        console.log(cardObjectsRED1[i].cardNumber, cardObjectsRED1[i].isRED);
        console.log(cardObjectsRED2[i].cardNumber, cardObjectsRED2[i].isRED);
        console.log(cardObjectsBLACK1[i].cardNumber, cardObjectsBLACK1[i].isRED);
        console.log(cardObjectsBLACK2[i].cardNumber, cardObjectsBLACK2[i].isRED);
    }*/
    chooseCard = true;
}

function update(time, delta)
{
    if(stopPlaying === false)
    {
        if(rpScore === 5 || gpScore === 5)
        {
            stopPlaying = true;
        }
        if(gameTimer < 6000)
        {
            gameTimer += delta;
        }

        cardTimer += delta;

        if(greenFrozen === true)
        {
            greenFrozenTimer += delta;
            if(greenFrozenTimer > 5000)
            {
                greenFrozen = false;
                greenFrozenTimer = 0;
                frozenImageGreen.destroy();
            }
        }

        if(redFrozen === true)
        {
            redFrozenTimer += delta;
            if(redFrozenTimer > 5000)
            {
                redFrozen = false;
                redFrozenTimer = 0;
                frozenImageRed.destroy();
            }
        }

        if(cardTimer > 2500 && player1ButtonDown === false && player2ButtonDown === false)
        {
            cardTimer = 0;
            chooseCard = true;
        }

        if(spaceBar.isDown && player1ButtonDown === false && player2ButtonDown === false && greenFrozen === false) //checks if player one presses button
        {
            if(canSnap)
            {
                player1ButtonDown = true;
                gpImage = this.add.image(150,300,'gp').setScale(0.2, 0.2);
                greenSnap = this.add.image(400, 300, 'gSnap').setScale(0.2, 0.2);
                greenSnap.depth = 5;
                gpAddScore();
                getPreviousCard();
            }
            else
            {
                console.log('frozen');
                greenFrozen = true;
                frozenImageGreen = this.add.image(148, 171, 'frozen');
            }
        }

        if(enterKey.isDown && player2ButtonDown === false && player1ButtonDown === false && redFrozen === false) //checks if player two presses button
        {
            if(canSnap)
            {
                player2ButtonDown = true;
                rpImage = this.add.image(650,300,'rp').setScale(0.2, 0.2);
                redSnap = this.add.image(400, 300, 'rSnap').setScale(0.2, 0.2);
                redSnap.depth = 5;
                rpAddScore();
                getPreviousCard();
            }
            else
            {
                console.log('frozen');
                redFrozen = true;
                frozenImageRed = this.add.image(643, 171, 'frozen');
            }
        }

        if(gameTimer > 5000 && gamePaused) //restarts the game after a short cooldown
        {
            console.log('time to play');
            gamePaused = false;
            if(player1ButtonDown)
            {
                gpImage.destroy();
                greenSnap.destroy();
            }
            else
            {
                rpImage.destroy();
                redSnap.destroy();
            }
            SnapY = 0.2;
            SnapX = 0.2;
            player1ButtonDown = false;
            player2ButtonDown = false;
        }
        else if (gameTimer > 2500 && gamePaused)
        {
            SnapX += 0.1;
            SnapY += 0.1;
            if(player1ButtonDown)
            {
                greenSnap.setScale(SnapX, SnapY);
            }
            else
            {
                redSnap.setScale(SnapX, SnapY);
            }
        }

        if(chooseCard)
        {
            chooseCard = false;

            if(array1 === false && array2 === false && array3 === false && array4 === false)
            {
                console.log(cardObjectsPURPLE.length + cardObjectsBLUE.length + cardObjectsGREEN.length + cardObjectsRED.length);
                reshuffleDeck();
            }

            if(resetCard === false)
            {
                let randArray = Math.floor((Math.random() * 4));

                if(array1 !== true && randArray === 0)
                {
                    if(array2)
                    {
                        randArray = 1;
                    }
                    else if(array3)
                    {
                        randArray = 2;
                    }
                    else if (array4)
                    {
                        randArray = 3;
                    }

                }

                if(array2 !== true && randArray === 1)
                {
                    if(array1)
                    {
                        randArray = 0;
                    }
                    else if(array3)
                    {
                        randArray = 2;
                    }
                    else if (array4)
                    {
                        randArray = 3;
                    }

                }

                if(array3 !== true && randArray === 2)
                {
                    if(array4)
                    {
                        randArray = 3;
                    }
                    else if(array1)
                    {
                        randArray = 0;
                    }
                    else if (array2)
                    {
                        randArray = 1;
                    }

                }

                if(array4 !== true && randArray === 3)
                {
                    if(array3)
                    {
                        randArray = 2;
                    }
                    else if(array1)
                    {
                        randArray = 0;
                    }
                    else if (array2)
                    {
                        randArray = 1;
                    }

                }

                if(array1 !== true && randArray === 0)
                {
                    randArray = 1;
                }

                if(randArray === 0)
                {
                    let randArrayPOS = Math.floor((Math.random() * availableCardObjectsRED.length));
                    currentCard = availableCardObjectsRED[randArrayPOS];
                    availableCardObjectsRED.splice(randArrayPOS, 1);
                    if(availableCardObjectsRED.length === 0)
                    {
                        array1 = false;
                    }
                }
                if(randArray === 1)
                {
                    let randArrayPOS = Math.floor((Math.random() * availableCardObjectsPURPLE.length));
                    currentCard = availableCardObjectsPURPLE[randArrayPOS];
                    availableCardObjectsPURPLE.splice(randArrayPOS, 1);
                    if(availableCardObjectsPURPLE.length === 0)
                    {
                        array2 = false;
                    }
                }
                if(randArray === 2)
                {
                    let randArrayPOS = Math.floor((Math.random() * availableCardObjectsGREEN.length));
                    currentCard = availableCardObjectsGREEN[randArrayPOS];
                    availableCardObjectsGREEN.splice(randArrayPOS, 1);
                    if(availableCardObjectsGREEN.length === 0)
                    {
                        array3 = false;
                    }
                }
                if(randArray === 3)
                {
                    let randArrayPOS = Math.floor((Math.random() * availableCardObjectsBLUE.length));
                    currentCard = availableCardObjectsBLUE[randArrayPOS];
                    availableCardObjectsBLUE.splice(randArrayPOS, 1);
                    if(availableCardObjectsBLUE.length === 0)
                    {
                        array4 = false;
                    }
                }
            }

            if(currentCard.isRED === 0)
            {
                if(currentCard.cardNumber === 0)
                {
                    currentCardImage = this.add.image(400,300,'R1').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 1)
                {
                    currentCardImage = this.add.image(400,300,'R2').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 2)
                {
                    currentCardImage = this.add.image(400,300,'R3').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 3)
                {
                    currentCardImage = this.add.image(400,300,'R4').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 4)
                {
                    currentCardImage = this.add.image(400,300,'R5').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 5)
                {
                    currentCardImage = this.add.image(400,300,'R6').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 6)
                {
                    currentCardImage = this.add.image(400,300,'R7').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 7)
                {
                    currentCardImage = this.add.image(400,300,'R8').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 8)
                {
                    currentCardImage = this.add.image(400,300,'R9').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 9)
                {
                    currentCardImage = this.add.image(400,300,'R10').setScale(0.2, 0.2);
                }
            }
            else if(currentCard.isRED === 1)
            {
                if(currentCard.cardNumber === 0)
                {
                    currentCardImage = this.add.image(400,300,'P1').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 1)
                {
                    currentCardImage = this.add.image(400,300,'P2').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 2)
                {
                    currentCardImage = this.add.image(400,300,'P3').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 3)
                {
                    currentCardImage = this.add.image(400,300,'P4').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 4)
                {
                    currentCardImage = this.add.image(400,300,'P5').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 5)
                {
                    currentCardImage = this.add.image(400,300,'P6').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 6)
                {
                    currentCardImage = this.add.image(400,300,'P7').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 7)
                {
                    currentCardImage = this.add.image(400,300,'P8').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 8)
                {
                    currentCardImage = this.add.image(400,300,'P9').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 9)
                {
                    currentCardImage = this.add.image(400,300,'P10').setScale(0.2, 0.2);
                }
            }
            else if(currentCard.isRED === 2)
            {
                if(currentCard.cardNumber === 0)
                {
                    currentCardImage = this.add.image(400,300,'G1').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 1)
                {
                    currentCardImage = this.add.image(400,300,'G2').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 2)
                {
                    currentCardImage = this.add.image(400,300,'G3').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 3)
                {
                    currentCardImage = this.add.image(400,300,'G4').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 4)
                {
                    currentCardImage = this.add.image(400,300,'G5').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 5)
                {
                    currentCardImage = this.add.image(400,300,'G6').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 6)
                {
                    currentCardImage = this.add.image(400,300,'G7').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 7)
                {
                    currentCardImage = this.add.image(400,300,'G8').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 8)
                {
                    currentCardImage = this.add.image(400,300,'G9').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 9)
                {
                    currentCardImage = this.add.image(400,300,'G10').setScale(0.2, 0.2);
                }
            }
            else if(currentCard.isRED === 3)
            {
                if(currentCard.cardNumber === 0)
                {
                    currentCardImage = this.add.image(400,300,'B1').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 1)
                {
                    currentCardImage = this.add.image(400,300,'B2').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 2)
                {
                    currentCardImage = this.add.image(400,300,'B3').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 3)
                {
                    currentCardImage = this.add.image(400,300,'B4').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 4)
                {
                    currentCardImage = this.add.image(400,300,'B5').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 5)
                {
                    currentCardImage = this.add.image(400,300,'B6').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 6)
                {
                    currentCardImage = this.add.image(400,300,'B7').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 7)
                {
                    currentCardImage = this.add.image(400,300,'B8').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 8)
                {
                    currentCardImage = this.add.image(400,300,'B9').setScale(0.2, 0.2);
                }
                else if(currentCard.cardNumber === 9)
                {
                    currentCardImage = this.add.image(400,300,'B10').setScale(0.2, 0.2);
                }
            }
            if(resetCard === false)
            {
                cardCount++;
                console.log(cardCount);
                cardOrder.unshift(currentCard);
                cardNumberOrder.unshift(currentCard.cardNumber);
                cardColourOrder.unshift(currentCard.isRED);
            }
            resetCard = false;

        }

        if(cardCount > 1)
        {
            if(cardNumberOrder[0] === cardNumberOrder[1])
            {
                canSnap = true
            }
            else if(cardColourOrder[0] === cardColourOrder[1])
            {
                canSnap = true
            }
            else
            {
                canSnap = false;
            }
        }
    }
    else if(winnerShown === false)
    {
        winnerShown = true;
        if(rpScore > gpScore)
        {
            redSnap.destroy();
            this.add.image(400,360,'redWins').depth;
        }
        else
        {
            greenSnap.destroy();
            this.add.image(400,360,'greenWins').depth;
        }
    }
}

function rpAddScore() //adds score to player two
{
    rpScore++;
    rpText.setText(rpScore);
    startTimer();
    return false;
}

function gpAddScore() //adds score to player one
{
    gpScore++;
    gpText.setText(gpScore);
    startTimer();
    return false;
}

function startTimer() //starts timer
{
   // console.log('timer reset');
    gamePaused = true;
    gameTimer = 0;
}

function createCard(cardNumber, isRED)
{
    this.cardNumber = cardNumber;
    this.isRED = isRED;
}

function getPreviousCard()
{
    if(cardOrder[0].isRED === 0)
    {
        const index = cardObjectsRED.indexOf(cardOrder[0]);
        cardObjectsRED.splice(index,1);
    }
    else if(cardOrder[0].isRED === 1)
    {
        const index = cardObjectsPURPLE.indexOf(cardOrder[0]);
        cardObjectsPURPLE.splice(index,1);
    }
    else if(cardOrder[0].isRED === 2)
    {
        const index = cardObjectsGREEN.indexOf(cardOrder[0]);
        cardObjectsGREEN.splice(index,1);
    }
    else if(cardOrder[0].isRED === 3)
    {
        const index = cardObjectsBLUE.indexOf(cardOrder[0]);
        cardObjectsBLUE.splice(index,1);
    }

    if(cardOrder[1].isRED === 0)
    {
        const index = cardObjectsRED.indexOf(cardOrder[1]);
        cardObjectsRED.splice(index,1);
    }
    else if(cardOrder[1].isRED === 1)
    {
        const index = cardObjectsPURPLE.indexOf(cardOrder[1]);
        cardObjectsPURPLE.splice(index,1);
    }
    else if(cardOrder[1].isRED === 2)
    {
        const index = cardObjectsGREEN.indexOf(cardOrder[1]);
        cardObjectsGREEN.splice(index,1);
    }
    else if(cardOrder[1].isRED === 3)
    {
        const index = cardObjectsBLUE.indexOf(cardOrder[1]);
        cardObjectsBLUE.splice(index,1);
    }
    cardOrder.splice(0,2);
    cardNumberOrder.splice(0,2);
    cardColourOrder.splice(0,2);
    currentCard = cardOrder[0];
    if(cardOrder.length === 0)
    {
        console.log(currentCard);
    }
    if(currentCard !== undefined)
    {
        cardTimer = 0;
        resetCard = true;
        chooseCard = true;
    }
    else
    {
        cardTimer = 0;
        chooseCard = true;
    }
}

function reshuffleDeck()
{
    availableCardObjectsGREEN = cardObjectsGREEN.slice();
    availableCardObjectsBLUE = cardObjectsBLUE.slice();
    availableCardObjectsRED = cardObjectsRED.slice();
    availableCardObjectsPURPLE = cardObjectsPURPLE.slice();
    cardCount = 0;
    array1 = true;
    array2 = true;
    array3 = true;
    array4 = true;
    resetCard = false;
    canSnap = false;
    cardOrder = [];
    cardNumberOrder = [];
    cardColourOrder = [];
}


