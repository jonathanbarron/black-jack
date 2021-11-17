/**
 Funciones Anonimas utilizando el patron modulo
 a continuacion se muestra la forma en que se escribe
 //funcion flecha
 (() => {
     'use strict'
     ///codigo a escribir aqui
 }) ();

 //function tradicional
 (function() {
     'use strict'
     ///codigo a escribir aqui
 }) ();
 */

const myFunction = (() => 
{
    /**
     * 2C= Two of Clubs
     * 2D= Two of Diaminds
     * 2H= Two of Hearts
     * 2S= Two of Spades
     */
    //modo estricto de javascript
       'use strict'

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];
    
    let puntos_jugador = 0, puntos_npc = 0;
    let pts_jugadores = [];
    
    const labelpoint = document.querySelectorAll('small'),
        //   playerdeck = document.querySelector('#playerdeck'),
        //   npcdeck = document.querySelector('#cpudeck');
        deck_jugadores = document.querySelectorAll('.divCartas');

    const btnNewgame = document.querySelector('#btnNewgame'),
          btnPedir = document.querySelector('#btnPedir'),
          btnStop = document.querySelector('#btnStop');

    //se crea el deck
    const inicializarGame = (numJugadores = 2) =>{
        deck = crearDeck();
        pts_jugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            pts_jugadores.push(0);
        }
        labelpoint.forEach( elem => elem.innerHTML = 0);
        deck_jugadores.forEach( elem => elem.innerHTML = '');   
        btnPedir.disabled = false;
        btnStop.disabled = false;
    }

    const crearDeck = () => {
        deck = [];
        //comienza el for en 2 y llega hasta 10 (carta 2 a la carta 10)
        for( let i = 2; i <= 10; i++ ) {
            for( let tipo of tipos ) {
                //por cada tipo de carta, se crea un deck de 1 a 10
                deck.push( i + tipo );
            }
        }

        for ( let tipo of tipos ){
            //por cada tipo de carta se agrega la carta especial
            for (let especial of especiales) {
                deck.push( especial + tipo );
            }
        }

        //barajear deck y retornarlo
        return _.shuffle(deck);
    } 

    const pedirCarta = () => {
            //algo mas facil que aprendi en el curso 
            if (deck.length === 0) {
                throw "Ya no hay mas Cartas";
            }      
            //Mi show utilizando la libreria de underscore
            //const carta = _.indexOf(deck, _.sample(deck));
            //deck.splice(carta, 1);
            //el pop elimina el ultimo item del array y lo guarda en la const
            return deck.pop();

    }

    const valorCarta = ( carta ) => {
        //elimina el tipo de la carta y deja solo el valor
        //se hace un substring y se obtiene los ultimos elemenos eliminando el tipo de carta obtenindo numeros o letras sin el tipo de carta
        const valor = carta.substring(0, carta.length - 1); 
        return (isNaN ( valor )) ?
                ( valor === 'A') ? 11: 10
                : valor * 1;
    }

    //Turno:0 primer jugador y el ultimo sera del jugador
    const acumular_pts = ( carta, turno ) =>{
        pts_jugadores[turno] = pts_jugadores[turno] + valorCarta(carta);
        labelpoint[turno].innerHTML = `<b> ${pts_jugadores[turno]}</b>`;
        return pts_jugadores[turno];
    }

    const crearCarta = ( carta, turno ) =>{
        //se crea el elemento img
        const imgCarta = document.createElement('img'); 

        //se crea la ruta de la img de la carta y se agrega la clase "carta" a cada carta
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');

        //se agrega la carta al jugador
        deck_jugadores[turno].append(imgCarta);

    }

    //NPC
    const turnoNpc = (puntos_min) =>{
        do{
            const carta = pedirCarta();
            puntos_npc = acumular_pts( carta, pts_jugadores.length -1 );
            crearCarta( carta, pts_jugadores.length -1 );

        } while( (puntos_npc < puntos_min) && puntos_min < 21 ); 
        ganador(puntos_min, puntos_npc);
    }

    const ganador = (puntos_min, puntos_npc) =>{
        setTimeout (() => {
            if( puntos_npc === puntos_min){
                alert('nadie gana :c');
            }
            else if (puntos_min > 21) {
                alert('NPC gano !');
            }
            else if( puntos_npc > 21) {
                alert('La NPC perdio');
            }
            else if( puntos_npc === 21) {
                alert('La NPC Gano !');
            }
            else if( puntos_npc > puntos_min) {
                alert('La NPC Gano !');
            }
        },1000);
    }

    //Eventos
    btnPedir.addEventListener('click', () =>{
        //se pide la carta y se crea el elemento img para agregar cartas
        const carta = pedirCarta();

        //se agrega la carta
        crearCarta( carta, 0);

        //se escriben los puntos en el score
        puntos_jugador =  acumular_pts(carta, 0);

        // puntos_jugador = puntos_jugador + valorCarta(carta);
        // labelpoint[0].innerHTML = `<b> ${puntos_jugador}</b>`;
    
        //condicionar puntos
        if ( puntos_jugador > 21) {
            btnPedir.disabled = true;
            btnStop.disabled = true;
            console.warn('Perdiste');
            turnoNpc(puntos_jugador);
        }
        else if( puntos_jugador === 21){
            btnPedir.disabled = true;
            btnStop.disabled = true;
            alert('felicidades, ganaste');
            turnoNpc(puntos_jugador);

        }
    });

    btnStop.addEventListener('click', () =>{
        btnPedir.disabled = true;
        btnStop.disabled = true;
        turnoNpc(puntos_jugador);
    });

    btnNewgame.addEventListener('click', () =>{
        inicializarGame();
    });  

    return {
        newGame: inicializarGame
    }
}) ();








