importScripts('lib/tank.js');

//BattleTank 1

var turnTime;
var dodgeTime;
var dodging;
var dodgeDir;
var tipoDisparo;
var bulletStrength;

// SHOOT ENEMY ---------------------------------------------------------------------------------
function shootEnemy(state, control) {
  let enemy = state.radar.enemy;
  if(!enemy) {
    return;
  }

  // predict position of moving target
  let bulletSpeed = 4;
  let distance = Math.distance(state.x, state.y, enemy.x, enemy.y)
  let bulletTime = distance / bulletSpeed;
  let targetX = enemy.x + bulletTime * enemy.speed * Math.cos(Math.deg2rad(enemy.angle));
  let targetY = enemy.y + bulletTime * enemy.speed * Math.sin(Math.deg2rad(enemy.angle));

  let targetAngleBody = Math.deg.atan2(enemy.y - state.y, enemy.x - state.x) + 90;
  

  // calculate desired direction of the gun
  let targetAngle = Math.deg.atan2(targetY - state.y, targetX - state.x);

  let gunAngle = Math.deg.normalize(targetAngle - state.angle);

  // point the gun at the target
  let angleDiff = Math.deg.normalize(gunAngle - state.gun.angle);
  control.GUN_TURN = 0.3 * angleDiff;

  let angle = Math.deg.normalize(targetAngleBody - state.angle);
  control.TURN = angle;
  
  // shoot when aiming at target
  if(Math.abs(angleDiff) < 1) {
    control.SHOOT = bulletStrength;
  }
}

// DETECT AND DODGE THE BULLETS
function detectAndDodge (state, control){
  let enemy = state.radar.enemy;
  if(!enemy) {
    // scan around for the enemy
    control.RADAR_TURN = 1;
    dodging = false;
  } else {
    //keep the enemy in the middle of radar beam
    let targetAngle = Math.deg.atan2(enemy.y - state.y, enemy.x - state.x);
    let radarAngle = Math.deg.normalize(targetAngle - state.angle);
    let angleDiff = Math.deg.normalize(radarAngle - state.radar.angle);
    control.RADAR_TURN = angleDiff;

    distance = Math.distance(state.x, state.y, enemy.x, enemy.y);
    if (distance < 100)
      bulletStrength = 1;
    
    if (!dodging) {
      dodging = true;
      dodgeTime = 10;
    }

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
});

tank.loop(function(state, control) {
  detectAndDodge(state,control);
  shootEnemy(state, control);
});