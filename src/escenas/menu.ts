import Constantes from '../constantes';

export default class Menu extends Phaser.Scene{

    private width: number;
    private height: number;

    constructor(){
        super(Constantes.ESCENAS.MENU);
    }

    init(){
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    }

    create(){
        const logo = this.add.image(this.width/2, 70, 'logo1');

        const jugarTXT:Phaser.GameObjects.BitmapText = this.add.bitmapText(50, this.height/2, Constantes.FUENTES.BITMAP,"JUGAR", 25).setInteractive();

        this.cambiarEscena(jugarTXT, Constantes.ESCENAS.NIVEL1);

        
    }

    //Cuando se pulse sobre el texto lleva  al escena indicada
    cambiarEscena(jugarTXT: Phaser.GameObjects.BitmapText, escena: string) {
        //Pointerdown : Evento que se da cuando da click al texto
        jugarTXT.on('pointerdown', () => {
            console.log('xd')
            this.scene.start(escena);
            this.scene.start(Constantes.ESCENAS.HUD);
            this.scene.bringToTop(Constantes.ESCENAS.HUD);
        })
    }
}