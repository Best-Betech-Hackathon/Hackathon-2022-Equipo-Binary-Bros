importScripts('lib/tank.js');

let i;
let nMovimientos;

tank.init(function(settings, info) {
    settings.SKIN = 'desert';
    nMovimientos = 50; // Cada 50 movimientos checkea si enemigo
});

tank.loop(function(state, control) {
    i = 0;
    //Disparar a lo loco
    // enemyDetected = check4Enemies(state, control);
    // while( i < nMovimientos && !enemyDetected){
        moveTankNoEnemy(state, control);

    // }
    
    
    
});

function check4Enemies(state, control){
    //Radar movimiento a tope:
    control.RADAR_TURN = 1;
    return state.radar.enemy != null;
}

function moveTankNoEnemy(state, control){
    control.THROTTLE = 1;
    control.TURN = 0;
    if(state.collisions.wall){
        // Movimiento aleatorio
        control.TURN = 1;
        
    }
    else{
        
    }
}
