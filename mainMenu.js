var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'pcanvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload () {

}

function create(){

    //start button code, can be used as template
    let startButton = this.add.image(400,200,'../images/LEIDLogo.png');
    startButton.setInteractive();

    startButton.on('pointerdown', () => startButtonClick());
    
}



//start buttons on click function, can be used as template
function startButtonClick(){
    console.log("Smile Emoji");
}

