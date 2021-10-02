import Constantes from "../constantes";
import Jugador from "../gameObjects/jugador";

export default class Nivel1 extends Phaser.Scene {
  private width: number;
  private height: number;
  private vidas: number;
  private puntuacion: number;

  private mapaNivel: Phaser.Tilemaps.Tilemap;
  private conjuntoPatrones: Phaser.Tilemaps.Tileset;
  private capaMapaNivel: Phaser.Tilemaps.TilemapLayer;

  private imagenFondo: Phaser.GameObjects.TileSprite;

  private jugador: Jugador;

  constructor() {
    super(Constantes.ESCENAS.NIVEL1);
  }

  init(): void {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;

    this.vidas = 3;
    this.puntuacion = 0;

    //Con el sistema de registro global de variables
    //Inicializamos las del juego
    this.registry.set(Constantes.REGISTRO.VIDAS, this.vidas);
    this.registry.set(Constantes.REGISTRO.PUNTUACION, this.puntuacion);
  }

  create() {
    const logo = this.add.image(400, 70, "logo1");

    const vidasTxt: Phaser.GameObjects.Text = this.add
      .text(this.width / 2, this.height / 2, "Quitar una vida", {
        fontSize: "32px",
        color: "#FFFFFF",
      })
      .setInteractive();

    vidasTxt.on("pointerdown", () => {
      this.vidas--;

      //Creando una variable global
      this.registry.set(Constantes.REGISTRO.VIDAS, this.vidas);
      this.events.emit(Constantes.EVENTOS.VIDAS);
    });

    const puntosTxt: Phaser.GameObjects.Text = this.add
      .text(this.width / 2, this.height / 2 + 20, "Puntos+1", {
        fontSize: "32px",
        color: "#FF5722",
      })
      .setInteractive();

    puntosTxt.on("pointerdown", () => {
      this.puntuacion++;

      //Creando variable global para los puntos
      this.registry.set(Constantes.REGISTRO.PUNTUACION, this.puntuacion);
      //Evento para actualizar los puntos en todas las escenas
      this.events.emit(Constantes.EVENTOS.PUNTUACION);
    });

    //Crear jugador
    this.jugador = new Jugador({
      escena: this,
      x: 80,
      y: 80,
      texture: Constantes.JUGADOR.ID,
    });

    /*  CARGAR TILEMAP */
    this.mapaNivel = this.make.tilemap({
      key: Constantes.MAPAS.NIVEL1.TILEMAPJSON,
      tileWidth: 16,
      tileHeight: 16,
    });

    this.physics.world.bounds.setTo(0,0,this.mapaNivel.widthInPixels, this.mapaNivel.heightInPixels);

    //Las cámaras siguen al jugador
    this.cameras.main.setBounds(
      0,
      0,
      this.mapaNivel.widthInPixels,
      this.mapaNivel.heightInPixels
    );

    this.cameras.main.startFollow(this.jugador);

    this.conjuntoPatrones = this.mapaNivel.addTilesetImage(
      Constantes.MAPAS.TILESET
    );

    this.capaMapaNivel = this.mapaNivel.createLayer(
      Constantes.MAPAS.NIVEL1.CAPAPLATAFORMAS,
      this.conjuntoPatrones
    );
    //Añadimos método para que la capa sea colisionable
    this.capaMapaNivel.setCollisionByExclusion([-1]);


    //CREA SPRITE CON POSICIÓN FINAL
    let objetoFinal: any = this.mapaNivel.createFromObjects(Constantes.MAPAS.POSICIONFINAL, {
      name: Constantes.MAPAS.POSICIONFINAL
    })[0];
    this.physics.world.enable(objetoFinal);
    objetoFinal.body.setAllowGravity(false);
    objetoFinal.setTexture(Constantes.OBJETOS.FINAL);
    objetoFinal.body.setSize(40,50);
    objetoFinal.body.setOffset(10,15);


    //Collisión para el final del nivel
    this.physics.add.collider(this.jugador, objetoFinal, () => {
      this.scene.stop(Constantes.ESCENAS.NIVEL1);
      this.scene.stop(Constantes.ESCENAS.HUD);
      this.scene.start(Constantes.ESCENAS.MENU);      
    })


    //Fondo
    this.imagenFondo = this.add
      .tileSprite(
        0,
        0,
        this.mapaNivel.widthInPixels,
        this.mapaNivel.heightInPixels,
        Constantes.FONDOS.NIVEL1
      )
      .setOrigin(0.0)
      .setDepth(-1);
    this.physics.add.collider(this.jugador, this.capaMapaNivel);

    //Animaciones para el jugaodr - ESPERA
    this.anims.create({
      key: Constantes.JUGADOR.ANIMACION.ESPERA,
      frames: this.anims.generateFrameNames(Constantes.JUGADOR.ID, {
        prefix: Constantes.JUGADOR.ANIMACION.ESPERA + "-",
        end: 11,
      }),
      frameRate: 20,
      repeat: -1,
    });

    //Animaciones para el jugador - CORRER
    this.anims.create({
      key: Constantes.JUGADOR.ANIMACION.CORRER,
      frames: this.anims.generateFrameNames(Constantes.JUGADOR.ID, {
        prefix: Constantes.JUGADOR.ANIMACION.CORRER + "-",
        end: 11,
      }),
      frameRate: 20,
      repeat: -1,
    });
  }

  update(): void {
    //Mover el fondo
    this.imagenFondo.tilePositionY -= 0.4;

    if (parseInt(this.registry.get(Constantes.REGISTRO.VIDAS)) === 0) {
      this.scene.stop(Constantes.ESCENAS.NIVEL1);
      this.scene.stop(Constantes.ESCENAS.HUD);
      this.scene.start(Constantes.ESCENAS.MENU);
    }

    this.jugador.update();
  }
}
