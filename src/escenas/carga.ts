import Constantes from '../constantes';
export default class Carga extends Phaser.Scene {
  //Barras de Carga
  private barraCarga: Phaser.GameObjects.Graphics; //Se creará un rectángulo
  private barraProgreso: Phaser.GameObjects.Graphics; //Se creará un rectángulo

  constructor() {
    super(Constantes.ESCENAS.CARGA);
  }

  //MÉTODO PARA COLOCAR TODAS LAS PRECARGAS DE ARCHIVOS QUE SE REQUIERAN PARA LA ESCENA ACTUAL
  preload(): void {
    this.cameras.main.setBackgroundColor(0x000000);
    this.creaBarras();

    //Listener mientras se cargan los assets
    this.load.on(
      "progress",
      function (value: number) {
        this.barraProgreso.clear();
        this.barraProgreso.fillStyle(0x125555, 1);
        this.barraProgreso.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    //Listener cuando se hayan cargado todos los Assets
    this.load.on(
      "complete",
      function () {
        const fuenteJSON = this.cache.json.get(Constantes.FUENTES.JSON);
        this.cache.bitmapFont.add(Constantes.FUENTES.BITMAP, Phaser.GameObjects.RetroFont.Parse(this, fuenteJSON));

        //Carga MENU
        this.scene.start(Constantes.ESCENAS.MENU);
      },
      this
    );

    //Carga los assets del juego
    this.load.image('logo1', 'assets/phaser3-logo.png')

    //Cargando el mapa
    this.load.tilemapTiledJSON(Constantes.MAPAS.NIVEL1.TILEMAPJSON, 'assets/niveles/nivel1.json');

    this.load.image(Constantes.MAPAS.TILESET, 'assets/niveles/nivelestileset.png');

    //Fondo
    this.load.image(Constantes.FONDOS.NIVEL1, 'assets/images/fondos/Brown.png')

    //Carga de fuentes
    this.load.json(Constantes.FUENTES.JSON, 'assets/fuentes/fuente.json');
    this.load.image(Constantes.FUENTES.IMAGEN, 'assets/fuentes/imagenFuente.png');

    //Carga del personaje jugador
    this.load.atlas(Constantes.JUGADOR.ID, 'assets/images/jugador/ninjafrog.png', 'assets/images/jugador/ninjafrog.json')

    //Objeto final
    this.load.image(Constantes.OBJETOS.FINAL, 'assets/images/objetos/final.png')
  }

  /**
   * Método que crea las barras de progreso
   */
  private creaBarras(): void {
    this.barraCarga = this.add.graphics();
    this.barraCarga.fillStyle(0xffffff, 1);
    this.barraCarga.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.barraProgreso = this.add.graphics();
  }
}
