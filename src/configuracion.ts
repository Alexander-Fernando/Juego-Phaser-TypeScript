import Nivel1 from './escenas/nivel1';
import Menu from './escenas/menu'
import HUD from './escenas/hud'
import Carga from './escenas/carga';


const Configuracion = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: [Carga, Menu ,Nivel1, HUD],
    pixelArt: true,
    //PROPIEDADES PARA AÑADIRLE LAS ANIMACIONES
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y:600},
            debug: true
        }
    }
};

export default Configuracion;