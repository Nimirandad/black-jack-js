const modulo = (() => {
    'use strict'

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'], especiales = ['A', 'J', 'Q', 'K'];

    // let puntosJugador = 0, puntosComputadora = 0;
    let puntosJugadores = [];

    // Referencias HTML
    const btnPedir = document.querySelector('#btnPedir'), btnDetener = document.querySelector('#btnDetener'), btnNuevoJuego = document.querySelector('#btnNuevo');

    const puntosHtml = document.querySelectorAll('small'), divCartasJugador = document.querySelectorAll('.divCartas');

    // Funcion que inicializa el mazo
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHtml.forEach(elem => elem.innerText = 0);
        divCartasJugador.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    // Funcion que crea el mazo
    const crearDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (const tipo of tipos) {
                deck.push(i + tipo)
            }
        }

        for (const tipo of tipos) {
            for (const especial of especiales) {
                deck.push(especial + tipo)
            }
        }

        return _.shuffle(deck);
    }

    // Funcion que permite pedir cartas del mazo
    const pedirCarta = () => {

        if (deck.length === 0) {
            throw 'No hay cartas en el mazo.'
        }

        return deck.pop();
    }

    // pedirCarta();

    // Funcion que devuelve el valor obtenido de la carta pedida
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);

        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            : Number(valor);
    }

    // Turno: 0 = primer jugador y el ultimo es la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHtml[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');

        divCartasJugador[turno].append(imgCarta);
    }

    const alertaGanador = (mensaje, icono) => {
        Swal.fire(
            {
                title: mensaje,
                icon: icono,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Nueva Partida'
            }).then((result) => {
                if (result.value) {
                    nuevaPartida();
                }
            });
    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            (puntosComputadora === puntosMinimos) ? alertaGanador('Nadie ha ganado', 'warning')
                :
                (puntosMinimos > 21) ? alertaGanador('La computadora gana', 'error') :
                    (puntosComputadora > 21) ? alertaGanador('Has Ganado', 'success') : alertaGanador('La computadora gana', 'error');
        }, 450);
    }

    // Funcion que simula el turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            const turnoComputadora = puntosJugadores.length - 1;

            puntosComputadora = acumularPuntos(carta, turnoComputadora)

            crearCarta(carta, turnoComputadora);

        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();

    }

    // Funcion que permite resetear la partida y crear una nueva
    const nuevaPartida = () => {
        inicializarJuego();
    }

    // Eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }

    });

    btnDetener.addEventListener('click', () => {
        
        turnoComputadora(puntosJugadores[0]);

        btnPedir.disabled = true;
        btnDetener.disabled = true;
    });

    btnNuevoJuego.addEventListener('click', () => {
        nuevaPartida();
    });


    return { inicializarJuego };
})();