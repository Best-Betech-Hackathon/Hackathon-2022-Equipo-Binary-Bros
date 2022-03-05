importScripts('lib/tank.js');

//BattleTank 1

var turnTime;
var dodgeTime;
var dodging;
var dodgeDir;
var tipoDisparo;
var bulletStrength;
var counter;

// SHOOT ENEMY ---------------------------------------------------------------------------------
function shootEnemy(state, control) {
  let enemy = state.radar.enemy;
  if(!enemy) {
    return;
  }

  let bulletSpeed = 4;
  let distance = Math.distance(state.x, state.y, enemy.x, enemy.y)
  let bulletTime = distance / bulletSpeed;
  let targetX = enemy.x + bulletTime * enemy.speed * Math.cos(Math.deg2rad(enemy.angle));
  let targetY = enemy.y + bulletTime * enemy.speed * Math.sin(Math.deg2rad(enemy.angle));

  let targetAngle = Math.deg.atan2(targetY - state.y, targetX - state.x);

  let gunAngle = Math.deg.normalize(targetAngle - state.angle);

  let angleDiff = Math.deg.normalize(gunAngle - state.gun.angle);
  control.GUN_TURN = 0.3 * angleDiff;

  // Poner en perpendicular el tanque
  let targetAngleBody = Math.deg.atan2(enemy.y - state.y, enemy.x - state.x) + 90;
  let angle = Math.deg.normalize(targetAngleBody - state.angle);
  control.TURN = angle;
  
  if(Math.abs(angleDiff) < 1) {
    control.SHOOT = bulletStrength;
  }
}

// DETECT AND DODGE THE BULLETS
function detectAndDodge (state, control){
  let enemy = state.radar.enemy;
  if(!enemy) {
    control.RADAR_TURN = 1;
    dodging = false;
  } else {
    let targetAngle = Math.deg.atan2(enemy.y - state.y, enemy.x - state.x);
    let radarAngle = Math.deg.normalize(targetAngle - state.angle);
    let angleDiff = Math.deg.normalize(radarAngle - state.radar.angle);
    control.RADAR_TURN = angleDiff;

    // Si el enemigo esta cerca, aumentar fuerza bala
    distance = Math.distance(state.x, state.y, enemy.x, enemy.y);
    if (distance < 100)
      bulletStrength = 1;
    
    if (!dodging) {
      dodging = true;
      dodgeTime = 10;
    }

    // Intentar esquivar moviendose de lado a lado
    if (dodging) {
      if(dodgeTime > 0) {
          control.THROTTLE = dodgeDir;
          control.BOOST = 1;
          dodgeTime--;
      }
      else {
        dodgeDir = -dodgeDir;
        dodgeTime = 30;
      }
    }
  }
}

tank.init(function(settings, info) {
  settings.SKIN = 'desert';
  turnTime = 0;
  dodging = false;
  dodgeDir = 1;
  bulletStrength = 0.1;
  counter = 0;
});

tank.loop(function(state, control) {
  detectAndDodge(state,control);
  shootEnemy(state, control);
});