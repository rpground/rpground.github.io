/* global Scene_Map, $gamePlayer, Game_Character, Game_Player, $gameMap, SceneManager, EventFactory, $gameParty, Utils, Input, $gameVariables, PluginManager, $dataArmors, $dataWeapons, $dataEnemies, $gameSelfSwitches, $gameSystem, Scene_Gameover, $dataMap, $dataTilesets, Game_Map, Game_CharacterBase, Sprite, ImageManager, Window_Base, Scene_Boot, DataManager, $gameTemp, $dataItems, SceneMap, AudioManager, $gameMessage, $gameSwitches, $gameScreen, Scene_Base, Graphics, $dataActors, Game_Actor, $dataSystem */

//===================================================================
// YuryolAbs.js
//===================================================================
/*:

 * @plugindesc Активная боевая система
 * @author Yuryol
 * @help Позволяет задать фон битвы для каждого региона, а так же
 * добавить дополнительные эффекты

 * @param buttonShotWeapon
 * @desc Кнопка Выстрела
 * @default a
 * @type text
 
 * @param buttonChangeWeapon
 * @desc Смена оружия
 * @default q
 * @type text
 
 * @param buttonShotArmor
 * @desc Кнопка Доп.оружия
 * @default s
 * @type text
  
 * @param buttonChangeArmor
 * @desc Смена доп.оружия
 * @default w
 * @type text
 
 * @param buttonShotItem
 * @desc кнопка прыжка
 * @default f
 * @type text

 * @param buttonChangeItem
 * @desc кнопка прыжка
 * @default r
 * @type text

 * @param buttonShotSkill
 * @desc кнопка прыжка
 * @default d
 * @type text

 * @param buttonChangeSkill
 * @desc кнопка прыжка
 * @default e
 * @type text
 
 * @param variableId
 * @desc Переменная для хранения номера пуль
 * @default 20
 * @type variable
 * 
 */
(function(){
    const parameters = PluginManager.parameters('YuryolAbs'),
	ShotWeapon = parameters['buttonShotWeapon'],
	ChangeWeapon = parameters['buttonChangeWeapon'],
	ShotArmor = parameters['buttonShotArmor'],
	ChangeArmor = parameters['buttonChangeArmor'],
	ShotItem = parameters['buttonShotItem'],
	ChangeItem = parameters['buttonChangeItem'],
	ShotSkill = parameters['buttonShotSkill'],
	ChangeSkill = parameters['buttonChangeSkill'],
    variableId = parameters['variableId'];
    let YuryolUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        //считывание нажатий кнопок:
        YuryolUpdate.call(this);
        this.YuryolInput();
        if ($gameMap.bullet) this.collision();       
        if ($gameMap.enemy) this.collisionEnemyPlayer();
    };
    
    //управление
    Scene_Map.prototype.YuryolInput = function() {
        if (Input.isTriggered('`')) {
//            console.log($gameParty.leader()._skills);
            console.log($gameParty.leader()._equips);
            console.log($gameParty);
//            $gameScreen._shakeDirection = 60;
            //console.log($gamePlayer);
//            console.log($gameMap.tileId($gamePlayer.x, $gamePlayer.y, 0));
//            console.log($gameMap.tileId($gamePlayer.x, $gamePlayer.y, 1));
//            console.log($gameMap.tileId($gamePlayer.x, $gamePlayer.y, 2));
//            console.log('ID тайла на 3 слое:',$gameMap.tileId($gamePlayer.x, $gamePlayer.y, 3));
        }
        if (Input.isTriggered('capslock')) {
            $gamePlayer._directionFix = !$gamePlayer._directionFix;
        }
        if (Input.isTriggered('v')) {
            $gamePlayer.isBlockMove = !$gamePlayer.isBlockMove;
        }
        //кнопка выстрела
        if (Input.isTriggered(ShotWeapon)) {
            if (Input.isPressed('`')) {
                this.shotWeapon($gameParty.leader()._equips.length-3);
            }
            else this.shotWeapon('weapons');
        }
        //кнопка смена оружия
        if (Input.isTriggered(ChangeWeapon)) {
            this.change('weapons');
        }
        //кнопка второго оружия
        if (Input.isTriggered(ShotArmor)) {
            if (Input.isPressed('`')) {
                this.shotWeapon($gameParty.leader()._equips.length-2);
            }
            else this.shotWeapon('armors');
        }
        //кнопка смены второго оружия
        if (Input.isTriggered(ChangeArmor)) {
            this.change('armors');
        }
        if (Input.isTriggered(ShotItem)) {
            this.shotItem();
        }
        if (Input.isTriggered(ChangeItem)) {
            this.change('items');
//            this.teleport();
        }
        if (Input.isTriggered(ChangeSkill)) {
            this.change('weapons');
//            this.teleport();
        }
    };
    //резкое ускорение вперед
    Scene_Map.prototype.boost = function(n) {
        $gamePlayer._opacity = 100;
        $gamePlayer.enableBlock();
        $gamePlayer._moveSpeed = $gamePlayer._moveSpeed+2;
        $gameMap.moveEvent(0, 12, +n);
    };
    
    Scene_Map.prototype.teleport = function() {
        $gamePlayer['_opacity'] = 200;
        $gamePlayer['_through'] = true;
        $gamePlayer._moveFrequency = $gamePlayer._moveFrequency+1;
        setTimeout(function() {$gamePlayer['_opacity'] = 150;}, 100);
        setTimeout(function() {$gamePlayer['_opacity'] = 100;}, 200);
        setTimeout(function() {$gamePlayer['_opacity'] = 50;}, 300);
        setTimeout(function() {$gamePlayer['_opacity'] = 0;}, 400);
        setTimeout(function() {$gamePlayer['_opacity'] = 50;}, 600);
        setTimeout(function() {$gamePlayer['_opacity'] = 100;}, 700);
        setTimeout(function() {$gamePlayer['_opacity'] = 150;}, 800);
        setTimeout(function() {$gamePlayer['_opacity'] = 250;}, 900);
        setTimeout(function() {$gamePlayer['_opacity'] = 250;}, 900);
        setTimeout(function() {$gamePlayer['_through'] = false;}, 900);
        setTimeout(function() {$gamePlayer._moveFrequency = $gamePlayer._moveFrequency-1;}, 900);
        setTimeout(function() {
            if (!$gameMap.isPassable($gamePlayer._x,$gamePlayer._y)) {
                $gameParty.leader().gainHp(-$gameParty.leader().mhp*.5);
            };
        }, 900);
        
    };
    
    Scene_Map.prototype.collisionEnemyPlayer = function() {
        let enemy = $gameMap.enemy;
        for (let i = 0; i < enemy.length; i++) {
            let id = enemy[i].id; 
            //удаляем пулю из массива если такого события нет
            if(!$gameMap.event(id)) {
                enemy.splice(i, 1);
                return;
            }
            
            let x = $gameMap.event(id).x;
            let y = $gameMap.event(id).y;            
//            if (x==enemy[i].x0 && y==enemy[i].y0) continue; // проверка координат только если координаты новые
                      
//            if ($gamePlayer.x==enemy[i].x0 && $gamePlayer.y==enemy[i].y0) continue;
//            enemy[i].x0 = x;
//            enemy[i].y0 = y;
            
            if (x == $gamePlayer.x && y == $gamePlayer.y && !('immortal' in $gamePlayer)) {
//                let toward = this.towardsEvent($gamePlayer, $gameMap.event(id));
//                let guard = (toward && $gamePlayer.shield) ? $gamePlayer.guard : 0;
                const idEnemy = $gameMap.event(id).event().note;
                
//                let atk = $dataEnemies[idEnemy].params[2] * (1 - guard);
                let atk = $dataEnemies[idEnemy].params[2];
                this.calcDamagePlayer(atk);
//                this.collisionEffectPlayer(id);
            }       
		}
//        let x0, y0;
    };
    
    Scene_Map.prototype.collision = function() {
        let bullet = $gameMap.bullet;
        for (let i = 0; i < bullet.length; i++) {
            let id = bullet[i].id; 
            //удаляем пулю из массива если такого события нет
            if(!$gameMap.event(id)) {
                bullet.splice(i, 1);
                return;
            }
            
            let x = $gameMap.event(id).x;
            let y = $gameMap.event(id).y;            
            if (x==bullet[i].x0 && y==bullet[i].y0) continue; // проверка координат только если координаты новые
                       
            if (this.collisionTile(id,x,y)) {
                bullet[i].x0 = x;
                bullet[i].y0 = y;
                return;
            }
            
            if (this.collisionEvent(id,x,y)) {
                bullet[i].x0 = x;
                bullet[i].y0 = y;
                return;
            }
                      
            if ($gamePlayer.x==bullet[i].x0 && $gamePlayer.y==bullet[i].y0) continue;
            bullet[i].x0 = x;
            bullet[i].y0 = y;
            this.collisionPlayer(id,x,y);
		}
        let x0, y0;
    };
    
    // проверка столкновений с тайлами
    Scene_Map.prototype.collisionTile = function(id, x, y) {	
        if ($gameMap.terrainTag(x, y) == 1){
            console.log('столкновение пули с id=', id, ' с тайлом ', $gameMap.tileId(x, y, 3), " на ", x, y);
            this.collisionTileEffect(id, x, y);
            $gameMap.event(id).removeEvent();            
            return true;
        }
    };
    
    Scene_Map.prototype.collisionTileEffect = function(id, x, y) {
        let tile = this.tile;
        let tileId = $gameMap.tileId(x, y, 3);
        for (let i=0; i<tile.length; i++){
            if (tile[i].id == tileId) {
                //проверка типа оружия
                if (tile[i].type && tile[i].type == $gameMap.event(id).type) {
                    //если есть здоровье тайла
                    if (tile[i].hp) {
                        let idHp, tileHp;
                        
                        //проверка есть ли тайл в массиве со здоровьем тайла                      
                        tileHp = this.tileHp;
                        tileHp.filter((el, k) => {if (el.x == x && el.y == y) idHp = k;});
                        
                        if (idHp == undefined) {
                            tileHp.push({
                                x: x,
                                y: y,
                                hp: tile[i].hp
                            });
                            idHp = tileHp.length-1;
                        }
                        //урон тайлу
                        tileHp[idHp].hp -= 1;
                        if (tileHp[idHp].hp <= 0) {
                            this.changedTile(tile[i], x, y);
                        }
                    } else {
                        this.changedTile(tile[i], x, y);
                    }
                }
            }
        }
    };
    
    Scene_Map.prototype.changedTile = function(tile, x, y) {
        //смена тайла
        $gameSystem.changedTiles().addChangedTile($gameMap.mapId(), x, y, 3, tile.id2);
        SceneManager._scene._spriteset.refreshTilemap();
        //включениие свича
        if (tile.switch) $gameSwitches.setValue(tile.switch, true);
        //прибавление единицы к переменной
        if (tile.var) $gameVariables.setValue(tile.var, $gameVariables.value(tile.var)+1);
    };
    
    var YuryolStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        YuryolStart.call(this);
        //создание массива с тайлами
        this.addTile();      
    };
    var YuryolTerminate  = Scene_Map.prototype.terminate ;
    Scene_Map.prototype.terminate = function() {
        YuryolTerminate.call(this);
//        $gameVariables.setValue(1, 0); //например, обнуляем 1-ую переменную
    };
    Scene_Map.prototype.addTile = function() {
        let set = $dataTilesets[$gameMap._tilesetId].meta;
        if ('tile' in set) {
            let setArr = set.tile.split(',');
            for(var i=0; i < setArr.length; i++){
                setArr[i] = setArr[i].slice(1).split(' ');
            }
            //0 - ид тайла
            //1 - ид тайла,на который меняется тайл при "смерти" тайла
            //2 - свитч который включается при смене на тайл 1
            //3 - переменная которая увеличивается на 1 при смене на тайл 1
            //4 - тип оружия, который действует на тайл
            //5 - "здоровье" тайла
            //6 - промежуточный тайл
            this.tile = setArr.map(function(tile) {
              return {
                  id: tile[0],
                  id2: tile[1],
                  switch: tile[2],
                  var: tile[3],
                  type: tile[4],
                  hp: tile[5]           
              };
            });;
            this.tileHp = [];
        }
        else this.tile = {};
    };
    
    Scene_Map.prototype.collisionEvent = function(id, x, y) {	
        for (let i = 1; i < $gameMap._events.length; i++) {
            
            if (i == id) return;
            let event = $gameMap.event(i);
            if(!event) return;//почему-то проскакивают события андефайнд, поэтому если проскакивают то убегаем из функции
            
            let comment = $gameMap.getCommentEvent(i);
            if (comment[0]=='b') {
                if (comment[1]=='|') {
                    if (this.collisionEventBoxArr(event, x, y, id, comment)) return;
                } else {
                    if (this.collisionEventBox(event, x, y, id, comment)) return;
                }
            }
            
            if (x == event.x && y == event.y) {
                console.log('столкновение пули с id=', id, ' с врагом ', i, " на ", x, y);
                this.collisionEnemy(id, i);
                return true;
            }
            
        }
    };
    
    Scene_Map.prototype.collisionPlayer = function(id, x, y) {
        let event = $gameMap.event(id);
        if (!event) return;//если быстро бежишь можешь столкнуться с патроном и вылетет ошибка
        if (event.boomerang == true && event.player == 0) return;
        if (event.player == 0) return;
        this.collisionPlayerEffect(id, x, y);
        
    };
    
    Scene_Map.prototype.collisionPlayerEffect = function(id, x, y) {
        let event = $gameMap.event(id);
        if (x == $gamePlayer.x && y == $gamePlayer.y) {
            let toward = this.towardsEvent($gamePlayer, event);
            let guard = (toward && $gamePlayer.shield) ? $gamePlayer.guard : 0;
            let atk = event.atk * (1 - guard);
            this.calcDamagePlayer(atk);
            this.collisionEffectPlayer(id);
        }
    };
    
    Scene_Map.prototype.collisionEventBox = function(event, x, y, bulletId, comment) {
      
        let direct = event._direction;
        let length = comment.length;
        let d = (length==11) && (direct==4||direct==6) ? 5 :
                (length==16) && (direct==4) ? 5 :
                (length==16) &&(direct==6) ? 10 : 
                0;
        
        let x1 = -comment[2+d];
        let x2 = +comment[3+d];
        let y1 = -comment[4+d];
        let y2 = +comment[5+d];
        
        console.log(x1,x2,y1,y2);
        for (let xd=x1; xd<=x2; xd++){
            for (let yd=y2; yd<=y1; yd++){
                if (x == event.x+xd && y == event.y+yd) {
                    this.collisionEnemy(bulletId, event._eventId);
                    return true;
                }
            }   
        }
    };
    Scene_Map.prototype.collisionEventBoxArr = function(event, x, y, bulletId, comment) {
        comment = comment.split('|');
        
        let direct = event._direction;
        let length = comment.length;
        let d = (length==3)&&(direct==4 && direct==6) ? 2 :
                (length==4)&&(direct==4) ? 2 :
                (length==4)&&(direct==6) ? 3 :
                (length==5)&&(direct==8) ? 2 : 
                (length==5)&&(direct==4) ? 3 :
                (length==5)&&(direct==6) ? 4 :
                1;
        
        comment[d] = comment[d].split(',');
        let x1 = +comment[d][0];
        let x2 = +comment[d][1];
        let y1 = -comment[d][2];
        let y2 = -comment[d][3];
        
        for (let xd=x1; xd<=x2; xd++){
            for (let yd=y2; yd<=y1; yd++){
                if (x == event.x+xd && y == event.y+yd) {
                    this.collisionEnemy(bulletId,event._eventId);
                    return true;
                }
            }   
        }
    };
    
    Scene_Map.prototype.collisionEnemy = function(id, enemyId) {
        const event = $gameMap.event(enemyId);
        
        if ($gameMap.event(id).boomerang == true && $gameMap.event(id).player == enemyId) return;
        if ($gameMap.event(id).player == enemyId) return;
        
        if(event.event().name.contains('enemy')) {
            const idEnemy = event.event().note;
            if (idEnemy != '') {
                this.addParamEnemy(enemyId, idEnemy);
                this.calcDamage(event, $gameMap.event(id).atk);
            }
            this.collisionEffectEnemy(id, enemyId);
        }
    };
    
    Scene_Map.prototype.collisionEffectEnemy = function(id, enemyId) {
        let noRemove;
        if ($gameMap.event(enemyId).shake || $gameMap.event(id).shake) {
            $gameScreen._shakeDuration = 15;
            $gameScreen._shakePower = 2;
            $gameScreen._shakeSpeed = 10;
        }
        if ($gameMap.event(enemyId).flash || $gameMap.event(id).flash) {
            $gameScreen.startFlash([255, 255, 255, 255], 10);
        }
        if ($gameMap.event(enemyId).rebound && $gameMap.event(id).rebound) {
            this.rebound(id, enemyId);
            noRemove = true;
        }
        if (!noRemove) $gameMap.event(id).removeEvent();
    };
    
    Scene_Map.prototype.rebound = function(id, playerId) {
        player = (playerId) ? $gameMap.event(playerId) : $gamePlayer;
        console.log(player.rebound);
        switch (player.rebound) {
            case 1:
                $gameMap.event(id).diagonalDirect = 1;
                break;
            case 3:
                $gameMap.event(id).diagonalDirect = 3;
                break;
            case 7:
                $gameMap.event(id).diagonalDirect = 7;
                break;
            case 9:
                $gameMap.event(id).diagonalDirect = 9;
                break;
            case 16:
                $gameMap.event(id).setDirection(2);
                console.log('player.rebound');
                break;
            case 17:
                $gameMap.event(id).setDirection(4);
                break;
            case 18:
                $gameMap.event(id).setDirection(6);
                break;
            case 19:
                $gameMap.event(id).setDirection(8);
                break;
            case 20:
                $gameMap.event(id).turnRight90();
                break;
            case 21:
                $gameMap.event(id).turnLeft90();
                break;
            case 22:
                $gameMap.event(id).turn180();
                break;
            case 23:
                $gameMap.event(id).turnRightOrLeft90();
                break;
            case 24:
                $gameMap.event(id).turnRandom();
                break;
            case 25:
                $gameMap.event(id).turnTowardPlayer();
                break;
            case 26:
                $gameMap.event(id).turnAwayFromPlayer();
                break;
            default:
                break;
        }
        $gameMap.event(id).player = null;
    };
            
    Scene_Map.prototype.addParamEnemy = function(id, idEnemy) {
        if ('hp' in $gameMap.event(id)) return;
        $gameMap.event(id).hp = $dataEnemies[idEnemy].params[0];
        $gameMap.event(id).mhp = $dataEnemies[idEnemy].params[0];
        $gameMap.event(id).mp = $dataEnemies[idEnemy].params[1];
        $gameMap.event(id).atk = $dataEnemies[idEnemy].params[2];
        $gameMap.event(id).def = $dataEnemies[idEnemy].params[3];
        $gameMap.event(id).matk = $dataEnemies[idEnemy].params[4];
        $gameMap.event(id).mdef = $dataEnemies[idEnemy].params[5];
        $gameMap.event(id).agi = $dataEnemies[idEnemy].params[6];
        $gameMap.event(id).luk = $dataEnemies[idEnemy].params[7];
        $gameMap.event(id).shake = $dataEnemies[idEnemy].meta.shake;
        $gameMap.event(id).flash = $dataEnemies[idEnemy].meta.flash;
        $gameMap.event(id).switch = $dataEnemies[idEnemy].meta.switch;
        console.log('здоровье врага = ', $gameMap.event(id).hp);
    };
    
    Scene_Map.prototype.calcDamage = function(enemy, atk) {
        atk = atk * (1 - (enemy.guard||0));
        if (enemy.hp > atk) {
            YuryolParamTime(enemy, '_blendMode', 1, 0, 70);
            enemy.hp -= atk;//уменьшение здоровья
            YuryolHud.hudEnemy = enemy._eventId;
            setTimeout(function() {YuryolHud.hudEnemy = null;}, 1700);
        } else {
            this.deadEnemy(enemy);// смерть врага
            YuryolHud.hudEnemy = null;
        }
    };
    
    Scene_Map.prototype.calcDamagePlayer = function(atk) {
        let player = $gameParty.leader();
        if (player.hp > atk) {
            YuryolParamTime($gamePlayer, '_blendMode', 1, 0, 500);
            YuryolParamTime($gamePlayer, 'immortal', 1, 'delete', 500);
            player.gainHp(-atk);//уменьшение здоровья
        } else {
            SceneManager.goto(Scene_Gameover);// смерть 
        }
    };
    
    Scene_Map.prototype.collisionEffectPlayer = function(id) {
        let noRemove;
        let event = $gameMap.event(id);
        //тряска экрана
        if ($gamePlayer.shake || event.shake) {
            $gameScreen._shakeDuration = 15;
            $gameScreen._shakePower = 2;
            $gameScreen._shakeSpeed = 10;
        }
        //вспышка экрана
        if ($gamePlayer.flash || event.flash) {
            $gameScreen.startFlash([255, 255, 255, 255], 10);
        }
        //отскок
        if ($gamePlayer.rebound && event.rebound) {
            let toward = this.towardsEvent($gamePlayer, event);
            if (toward && $gamePlayer.shield) { 
                this.rebound(id);
                noRemove = true;
            }
        }
        //удаление пули
        if (!noRemove) event.removeEvent();
    };
    
    Scene_Map.prototype.deadEnemy = function(enemy) {
        enemy.hp = 0;
        let id = enemy._eventId;
        let sw = enemy.switch;
        
        //переключение вкладки Д при смерти врага если параметр switch не задан
        if (!sw) $gameSelfSwitches.setValue([$gameMap.mapId(), id, 'D'], true);
        //переключение свича если параметр задан и свитч не локальный (так как число)
        if (Number(sw) == sw) $gameSwitches.setValue(sw, true);
        // переключение локального свитча
        else $gameSelfSwitches.setValue([$gameMap.mapId(), id, sw], true);
        
        enemy.event().name = '';// перемименовываем ивент чтоб не было имени enemy
    };

    var YuryolParamTime = function(event, param, value1, value2, time) {
        event[param] = value1;
        if (value2 === 'delete') {
            setTimeout(function() {delete event[param];}, time);
        } else {
            setTimeout(function() {event[param] = value2;}, time);
        }
    };
    
    //подготовка к выстрелу из оружия
    Scene_Map.prototype.shotWeapon = function(type) {
        let equip = $gameParty.equip[type][0];
        if (!equip) return;
        
//        const weapon = (id == 0 || id == $gameParty.leader().equips().length-3) ? 'weapon' : 'armor'; 
        //проверка экипировки щитом
//        if (this.equipShield(equip)) return;
        if (!equip.nameBullet) return;
        
        if (equip.intervalShot) return;
        
//        let idBase = (id == $gameParty.leader().equips().length-2) ? 1 : 0;
        //проверяем использует ли алтернативное оружие такие же птароны как основное
//        let altEquip = ($gameParty.leader().equips()[idBase].meta.itemBullet == equip.itemBullet) ? $gameParty.leader().equips()[idBase] : equip;
        let altEquip = equip;
        
        switch (this.setBullet(altEquip)) {
          case 'costHp':
            this.costBullet(altEquip, 'costHp');
            this.startShotWeapon(equip, 'costHp');
            break;
          case 'costMp':
            this.costBullet(altEquip, 'costMp');
            this.startShotWeapon(equip, 'costMp');
            break;
          case 'costBullet':
            this.costBullet(altEquip, 'costBullet', type);
            this.startShotWeapon(equip, 'costBullet');
            break;
          case 'infinit':
            this.startShotWeapon(equip, 'infinit');
            break;
          case 'reload':
            this.getPatron(altEquip);//доабвление патронов
            this.reloadWeapon(equip);
            break;
          case 'noneBullet':
            this.noneBullet(equip.nonePatronSe);
            break;
        }
    };
    
    Scene_Map.prototype.equipShield = function(equip) {
        if (equip.shield) {
            if ('shield' in $gamePlayer) {
                delete $gamePlayer.shield;
                delete $gamePlayer.guard;
                delete $gamePlayer.rebound;
            } else {
                $gamePlayer.shield = true;
                $gamePlayer.enableGuard(equip.guard);
                $gamePlayer.enableRebound(equip.rebound);
            }
        }
        return equip.shield;
    };
    
    Scene_Map.prototype.towardsEvent = function(event1, event2) {
        return (event1._direction == 6 && event2._direction == 4 ||
                event1._direction == 4 && event2._direction == 6 ||
                event1._direction == 8 && event2._direction == 2 ||
                event1._direction == 2 && event2._direction == 8  
                );
    };

    Scene_Map.prototype.noneBullet = function(se) {
        AudioManager.playSe({name: se, volume: 90, pitch: 100, pan: 0});
    };
    
    //перезарядка
    Scene_Map.prototype.reloadWeapon = function(equip) {
        AudioManager.playSe({name: equip.reloadSe, volume: 90, pitch: 100, pan: 0});
    };
    
    //выстрел из оружия
    Scene_Map.prototype.startShotWeapon = function(equip, type, side) {
        this.soundShot(equip, type);
        this.addBullet(equip, side);
    };
    
     Scene_Map.prototype.animationShot = function(id, idAnimation) {
//         $gamePlayer.requestBalloon(idAnimation);
//         $gameMap.event(id).requestAnimation(idAnimation);
     };
    
    Game_Character.prototype.Shot = function(id){
        let eventId = this._eventId;
        SceneManager._scene.addParamsByWeapon(eventId, id);
        SceneManager._scene.startShotWeapon($gameMap.event(eventId).equip.weapon, 'costMp', eventId);
    };
    Game_Character.prototype.Attack = function(){
        if (!('enemy' in $gameMap)) $gameMap.enemy = [];
        for (let i = 0; i < $gameMap.enemy.length; i++) {
            if ($gameMap.enemy[i].id == this._eventId) return;
        }
        $gameMap.enemy.push({id: this._eventId});
    };
    
    Game_Character.prototype.noAttack = function(){
        for (let i = 0; i < $gameMap.enemy.length; i++) {
            if ($gameMap.enemy[i].id == this._eventId) $gameMap.enemy.splice(i, 1);
        }
    };
    
    Scene_Map.prototype.addBullet = function(equip,id) {
        this.addBulletEvent(equip,id);
    };
    
    Scene_Map.prototype.addBulletEvent = function(equip,id) {        
        
    let direct = equip.direct;
    switch (direct) {
        case 1:
            this.createBulletEvent(equip, 'LF', '', id);
            this.createBulletEvent(equip, 'RF', '', id);
            break;
        case 10:
            this.createBulletEvent(equip, 'L', '', id);
            this.createBulletEvent(equip, 'R', '', id);
            break;
        case 2:
            this.createBulletEvent(equip, 'inv', '', id);
            this.createBulletEvent(equip, '', '', id);
            break;
        case 20:
            this.createBulletEvent(equip, '', -1, id);
            this.createBulletEvent(equip, '', 1, id);
            break;
        case 3:
            this.createBulletEvent(equip);
            this.createBulletEvent(equip, 'LF', '', id);
            this.createBulletEvent(equip, 'RF', '', id);
            break;
        case 30:
            this.createBulletEvent(equip, '', '', id);
            this.createBulletEvent(equip, 'L', '', id);
            this.createBulletEvent(equip, 'R', '', id);
            break;
        case 4:
            this.createBulletEvent(equip, '', '', id);
            this.createBulletEvent(equip, 'inv', '', id);
            this.createBulletEvent(equip, 'L', '', id);
            this.createBulletEvent(equip, 'R', '', id);
            break;
        case 40:
            this.createBulletEvent(equip, 'LF', '', id);
            this.createBulletEvent(equip, 'RF', '', id);
            this.createBulletEvent(equip, 'LB', '', id);
            this.createBulletEvent(equip, 'RB', '', id);
            break;
        case 8:
            this.createBulletEvent(equip, '', '', id);
            this.createBulletEvent(equip, 'inv', '', id);
            this.createBulletEvent(equip, 'L', '', id);
            this.createBulletEvent(equip, 'R', '', id);
            this.createBulletEvent(equip, 'LF', '', id);
            this.createBulletEvent(equip, 'RF', '', id);
            this.createBulletEvent(equip, 'LB', '', id);
            this.createBulletEvent(equip, 'RB', '', id);
            break;
        default:
            this.createBulletEvent(equip, '', '', id);
            break;                
        }
    };
    
    Scene_Map.prototype.createBulletEvent = function(equip, direct, pos=0, playerId) {
        let player = (playerId) ? $gameMap.event(playerId) : $gamePlayer,
            x = player.x,
            y = player.y;
        switch(player.direction()) {
            case 2:
                x = player.x-pos;
                break;
            case 4:
                y = player.y-pos;
                break;
            case 6:
                y = player.y+pos;
                break;
            case 8:
                x = player.x+pos;
                break;
        }
        //создаем событие
        EventFactory.createEvent(equip.nameBullet, x, y, null, variableId);
        let id = $gameVariables.value(variableId); //сохраняем ИД события       
        this.animationShot(id, equip.animationShot);
        this.addParamsBullet(id, equip, playerId); //добавляем пулю в список для отслеживания тсолкновений
        this.getDirectEvent(id, direct, playerId);//задаем направление пули
        this.speedShot(equip, equip.speedShot);//определяем скорость интервала выстрела
    };
    
    Scene_Map.prototype.addParamsBullet = function(id, equip, playerId) {
        if (!('bullet' in $gameMap)) $gameMap.bullet = [];
        //id - ид события
        //итем - итем пули в БД
        $gameMap.bullet.push({
            id: id
        });
        $gameMap.event(id).player = (playerId) ? playerId : 0;
        $gameMap.event(id).item = equip.itemBullet;
        $gameMap.event(id).collisionSe = equip.collisionSe;
        $gameMap.event(id).animationCollision = equip.animation;
        $gameMap.event(id).atk = equip.atk;
        $gameMap.event(id).piercing = equip.piercing;
        $gameMap.event(id).shake = equip.shake;
        $gameMap.event(id).flash = equip.flash;
        $gameMap.event(id).rebound = equip.rebound;
        $gameMap.event(id).delay = equip.delay;
        $gameMap.event(id).type = equip.type;
    };
    
    Scene_Map.prototype.getDirectEvent = function(id, direct, player) {
        switch (direct) {
            case 'LF':
                $gameMap.directEventLf(id,player);
                break;
            case 'RF':
                $gameMap.directEventRf(id,player);
                break;
            case 'LB':
                $gameMap.directEventLb(id,player);
                break;
            case 'RB':
                $gameMap.directEventRb(id,player);
                break;
            case 'L':
                $gameMap.directEventL(id,player);
                break;
            case 'R':
                $gameMap.directEventR(id,player);
                break;
            case 'inv':
                $gameMap.directEvent(id,player);
                $gameMap.directEventInverse(id,player);
                break;
            default:
                $gameMap.directEvent(id,player);
                break;                
        }
    };

    //скорость стрельбы
    Scene_Map.prototype.speedShot = function(equip, speed) {
        equip.intervalShot = true;
        setTimeout(function() {
            equip.intervalShot = false;
        }, speed);
    };
    
    Scene_Map.prototype.addMoveList = function(event, codeList, script) {
        event._moveRoute.list[event._moveRoute.list.length-1] ={
            code: codeList, 
            parameters: [script],
            indent: null
        };
        event._moveRoute.list[event._moveRoute.list.length] ={
            code:0,
            parameters:[]
        };
    };

    Game_Map.prototype.directEvent = function(id, player) {	
        let event = $gameMap.event(id);
        player = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(player.direction()) {
            case 2:
                event.setDirection(2);
                break;
            case 4:
                event.setDirection(4);
                break;
            case 6:
                event.setDirection(6);
                break;
            case 8:
                event.setDirection(8);
                break;
        }
    };
    
    Game_Map.prototype.directEventR = function(id, player) {	
        let event = $gameMap.event(id),
            char = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(char.direction()) {
            case 2:
                event.setDirection(4);
                break;
            case 4:
                event.setDirection(8);
                break;
            case 6:
                event.setDirection(2);
                break;
            case 8:
                event.setDirection(6);
                break;
        }
    };
    Game_Map.prototype.directEventL = function(id, player) {	
        let event = $gameMap.event(id),
            char = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(char.direction()) {
            case 2:
                event.setDirection(6);
                break;
            case 4:
                event.setDirection(2);
                break;
            case 6:
                event.setDirection(8);
                break;
            case 8:
                event.setDirection(4);
                break;
        }
    };
    
    Game_Map.prototype.directEventLf= function(id, player) {	
        let event = $gameMap.event(id),
            char = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(char.direction()) {
            case 2:
                event.diagonalDirect = 3;
                break;
            case 4:
                event.diagonalDirect = 1;
                break;
            case 6:
                event.diagonalDirect = 9;
                break;
            case 8:
                event.diagonalDirect = 7;
                break;
        }
    };
    
    Game_Map.prototype.directEventRf = function(id, player) {	
        let event = $gameMap.event(id),
            char = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(char.direction()) {
            case 2:
                event.diagonalDirect = 1;
                break;
            case 4:
                event.diagonalDirect = 7;
                break;
            case 6:
                event.diagonalDirect = 3;
                break;
            case 8:
                event.diagonalDirect = 9;
                break;
        }
    };
    Game_Map.prototype.directEventLb= function(id, player) {	
        let event = $gameMap.event(id),
            char = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(char.direction()) {
            case 2:
                event.diagonalDirect = 7;
                break;
            case 4:
                event.diagonalDirect = 9;
                break;
            case 6:
                event.diagonalDirect = 1;
                break;
            case 8:
                event.diagonalDirect = 3;
                break;
        }
    };
    
    Game_Map.prototype.directEventRb = function(id, player) {	
        let event = $gameMap.event(id),
            char = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(char.direction()) {
            case 2:
                event.diagonalDirect = 9;
                break;
            case 4:
                event.diagonalDirect = 3;
                break;
            case 6:
                event.diagonalDirect = 7;
                break;
            case 8:
                event.diagonalDirect = 1;
                break;
        }
    };
    
    var YuryolMoveForward = Game_Character.prototype.moveForward;
    Game_Character.prototype.moveForward = function() {
        switch (this.diagonalDirect) {
            case 1:
                this.moveDiagonally(4, 2);
                break;
            case 3:
                this.moveDiagonally(6, 2);
                break;
            case 7:
                this.moveDiagonally(4, 8);
                break;
            case 9:
                this.moveDiagonally(6, 8);
                break;
            default:
                YuryolMoveForward.call(this);
                break;
        }
    };
    Game_Map.prototype.directEventInverse = function(id, player) {	
        let event = $gameMap.event(id),
            char = (!player) ? $gamePlayer : $gameMap.event(player);
        switch(char.direction()) {
            case 2:
                event.setDirection(8);
                break;
            case 4:
                event.setDirection(6);
                break;
            case 6:
                event.setDirection(4);
                break;
            case 8:
                event.setDirection(2);
                break;
        }
    };

    Scene_Map.prototype.setBullet = function(equip) {
        if (equip.costHp) {
            if ($gameParty.leader().hp) return 'costHp';
            else return false;
        }
        
        if (equip.costMp) {
            if( $gameParty.leader().mp) return 'costMp';
            else return false;
        }
        
        if (!equip.itemBullet) return 'infinit';
        
        if (equip.itemBullet) {
            //проверяем магазин птарон
            let items = $gameParty.numItems($dataItems[equip.itemBullet]);//количество патронов
            if (!items) return 'noneBullet';
            
            if (equip.patron) return 'costBullet';
            else return 'reload';
        }
    };

    Scene_Map.prototype.costBullet = function(equip, type, weapon) {
        switch (type) {
            case 'costHp':
                $gameParty.leader().gainHp(-equip.costHp);
                break;
            case 'costMp':
                $gameParty.leader().gainMp(-equip.costMp);
                break;
            case 'costBullet':
                this.gainPatron(weapon); //тратим птарон
                break;
            default:
                break;
        }
    };
    
    Scene_Map.prototype.soundShot = function(equip,type) {
        switch (type) {
            case 'costHp':
                AudioManager.playSe({name: equip.shotSe, volume: 90, pitch: 100, pan: 0} );
                break;
            case 'infinit':
                AudioManager.playSe({name: equip.shotSe, volume: 90, pitch: 100, pan: 0} );
                break;
            case 'costMp':
                AudioManager.playSe({name: equip.shotSe, volume: 90, pitch: 100, pan: 0} );
                break;
            case 'costBullet':
                AudioManager.playSe({name: equip.shotSe, volume: 90, pitch: 100, pan: 0} );
                break;
            default:
                break;
        }
    };
    
    Scene_Map.prototype.gainPatron = function(type) {
        $gameParty.gainItem($dataItems[$gameParty.equip[type][0].itemBullet], -1);
        $gameParty.equip[type][0].patron -= 1;
    };
    
    Scene_Map.prototype.change = function(type) {
        let equip = this.getChangeEquip(type);       
        if (!equip.length) return;
        if (!$gameParty.equip[type].length) {
            $gameParty.equip[type][0] = equip[0];
        } else {
            let id = $gameParty.equip[type][0].id;
            const index = equip.findIndex(el => el.id === id);
            
            if (equip.length-1 == index) {
               $gameParty.equip[type] = [];
            } else {
                $gameParty.equip[type][0] = equip[index+1];
            }
        }
        
        if (type == 'weapons' || type == 'armors') {
            $gameParty.leader().changeEquip(7-type.length, $gameParty.equip[type][0]);
            if ($gameParty.equip[type].length) this.addParamsByWeapon(type);
        }
    };
    
    Scene_Map.prototype.addParamsByWeapon = function(type, idWeapon) {
        let equip = (typeof(type) == 'string')? $gameParty.equip[type][0] : ($gameMap.event(type).equip = {weapon:[],armor:[]}, $gameMap.event(type).equip.weapon),
            id = (typeof(type) == 'string') ? equip.id : idWeapon,
            data = (typeof(type) == 'string') ? '$data'+type[0].toUpperCase() + type.substring(1) : '$dataWeapons';
            data = window[data][id];
        let db = data.meta;
        
//        let {nameBullet, magazine} = db;
//        console.log(db, nameBullet, typeof(+magazine));
        equip.nameBullet = db.nameBullet || null;
        equip.skill = db.skill || null;
        equip.shield = db.shield || null;
        equip.alt = +db.alt || null;
        equip.atk = data.params[2] | null;
        equip.type = db.type || null;
        
        equip.speedShot = db.speedShot | null;
        equip.intervalShot = false;
        equip.direct = +db.direct | 0;
        equip.piercing = db.piercing || null;
        equip.shake = db.shake || null;
        equip.flash = db.flash || null;
        equip.rebound = db.rebound || null;
        equip.guard = +db.guard || null;
        equip.delay = db.delay || null;
        
        equip.shotSe = db.shotSe || null;
        equip.collisionSe = db.collisionSe || null;
        equip.reloadSe = db.reloadSe || null;
        equip.equipSe = db.equipSe || null;
        equip.nonePatronSe = db.nonePatronSe || null;
        
        equip.namePoseEquip = db.namePoseEquip || null;
        equip.indexPoseEquip = db.indexPoseEquip || null;
        equip.indexAddEquip = db.indexAddEquip || null;
        
        equip.namePoseShot = db.namePoseShot || null;
        equip.indexPoseShot = db.indexPoseShot || null;
        equip.speedPoseShot = db.speedPoseShot || null;
        
        equip.animationShot = db.animationShot | null;
        equip.animationCollision = db.animationCollision | null;

        equip.costMp = db.costMp | null;
        equip.costHp = db.costHp | null;
        equip.itemBullet = +db.itemBullet || undefined;
        equip.magazine = +db.magazine | null;
        equip.patron = (equip.patron !== undefined) ? equip.patron : this.getPatron(equip);
    };
    
    Scene_Map.prototype.getChangeEquip = function(type) {
        if (type == 'items' || type == 'skill') {
            return $gameParty[type]();
        }
        if (type == 'weapons' || type == 'armors') {
            let equip = $gameParty[type]().concat($gameParty.leader().equips()[7-type.length]);
            if (equip.length) equip.sort((a, b) => {
                if (a == null || b == null) {
                   equip.pop();
                    return;
                }
                return a.id - b.id;
            });
            if (type == 'armors') {
                equip = equip.filter(el => {
                    if (el == null) return;
                    return el.etypeId == 2;
                });
            }
            return equip;
        }
    };
    
    Scene_Map.prototype.shotItem = function() {
        if (!$gameParty.equip.items.length) return;
        const item = $dataItems[$gameParty.equip.items[0].id];
        
        const player = $gameParty.leader();
        player.useItem(item);
        
        const action = new Game_Action(player);
        action.setItemObject(item);
        action.apply(player);
    };
    
    //пока нигде не используется
    Scene_Map.prototype.cleareWeapon = function(slot) {
        delete $gamePlayer.shield;    
        const num = $gameParty.leader()._equips.length-3+slot;
        $gameParty.leader()._equips[num]._itemId = 0;
        $gameParty.leader().changeEquip(num, null);
    };

    Scene_Map.prototype.getPatron = function(equip) {
        let items = $gameParty.numItems($dataItems[equip.itemBullet]);
        
        if (equip.magazine > items)  equip.patron = items;
        else equip.patron = Number(equip.magazine);
        return equip.patron;
    };

    //Приближение события к герою
    Game_Character.prototype.boomerang = function() {
        $gameParty.equip.weapon[$gameParty.leader().equips()[0].id].intervalShot = true;
        this.boomerang = true;
        console.log(this);
    };
    //исчезновение события
    Game_Character.prototype.removeEvent = function() {
        if (!$gameMap.event(this._eventId).piercing) EventFactory.removeEvent(this._eventId);
        
        //еслиайди этого события совпадает с айди из массива пуль то удаляем элемент массива
//        let bullet = $gameMap.bullet;
//        for (var i = 0; i < bullet.length; i++) {
//            var id = bullet[i].id;
//            if (id == this._eventId) bullet.splice(i, 1);
//            if ($gameMap.bullet.length == 0) delete $gameMap.bullet;
//        }
    };
    
    Game_Character.prototype.remove = function() {
//        this.endAnimation();
        EventFactory.removeEvent(this._eventId);
    };
    
    Game_Character.prototype.movePlayer = function() {
        if (this._x == $gamePlayer.x && this._y == $gamePlayer.y) {
            EventFactory.removeEvent(this._eventId);
            $gameParty.equip.weapon[$gameParty.leader().equips()[0].id].intervalShot = false;
        } else {
            this.moveTowardCharacter($gamePlayer);
            this._moveRoute.list.push({code: 45, parameters: ['this.movePlayer()']});
        }
    };
    
    //Приближение события к событию
    Game_Character.prototype.moveEvent = function(id) {
        if (this._x == $gameMap.event(id).x && this._y == $gameMap.event(id).y) {
            EventFactory.removeEvent(this._eventId);
            $gameMap.event(id).intervalShot = false;
        } else {
            this.moveTowardCharacter($gameMap.event(5));
            this._moveRoute.list.push({code: 45, parameters: ['this.moveEvent(' + id + ')']});
        }
    };
    
    // рикошеты
    Game_Character.prototype.disableRebound = function() {
        delete this.rebound;
    };
    
    Game_Character.prototype.enableRebound = function(direct) {
        this.rebound = +direct;
    };
    
    Game_Character.prototype.disableGuard = function() {
        delete this.guard;
    };
    
    Game_Character.prototype.enableGuard = function(atk) {
        this.guard = +atk; //в формате 0.1. сколкьо процентов от атаки будет поглощено защитой
    };
    
    //движение события к герою/от героя с добавлением диагонального
    var YuryolMoveTowardCharacter = Game_Character.prototype.moveTowardCharacter;
    Game_Character.prototype.moveTowardCharacter = function(character) {

        var sx = this.deltaXFrom(character.x);
        var sy = this.deltaYFrom(character.y);

        if (sx && sy) {
           (sx > 0 && sy > 0) ? this.moveDiagonally(4,8):
           (sx > 0 && sy < 0) ? this.moveDiagonally(4,2):
           (sx < 0 && sy > 0) ? this.moveDiagonally(6,8):
                                this.moveDiagonally(6,2);
        }
        else if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 4 : 6);
            if (!this.isMovementSucceeded() && sy) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
        } 
        else if (sy) {
            this.moveStraight(sy > 0 ? 8 : 2);
            if (!this.isMovementSucceeded() && sx) {
                this.moveStraight(sx > 0 ? 4 : 6);
            }
        }
    };
    
    var YuryolMoveAwayFromCharacter = Game_Character.prototype.moveAwayFromCharacter;
    Game_Character.prototype.moveAwayFromCharacter = function(character) {

        var sx = this.deltaXFrom(character.x);
        var sy = this.deltaYFrom(character.y);

        if (sx && sy) {
           (sx > 0 && sy > 0) ? this.moveDiagonally(6,2):
           (sx > 0 && sy < 0) ? this.moveDiagonally(6,8):
           (sx < 0 && sy > 0) ? this.moveDiagonally(4,2):
                                this.moveDiagonally(4,8);
        }
        else if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 6 : 4);
            if (!this.isMovementSucceeded() && sy) {
                this.moveStraight(sy > 0 ? 2 : 8);
            }
        }
        else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
            if (!this.isMovementSucceeded() && sx) {
                this.moveStraight(sx > 0 ? 6 : 4);
            }
        }
    };

    Game_Map.prototype.getCommentEvent = function (id) { 
        var event = $gameMap.event(id);
        var comment = event.page().list[0];
        if (comment.code === 108) return comment.parameters[0];
        else return [0];
    };

    Game_Actor.prototype.initEquips = function(equips) {
        var slots = this.equipSlots();
        var maxSlots = slots.length+1;
        this._equips = [];
        for (var i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (var j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    };

    // худ бар, пока только показ оружия
    let YuryolOnMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        YuryolOnMapLoaded.call(this);
        this.YuryolHud = new YuryolHud();	 
        this.addChild(this.YuryolHud); 
    };
    
    function YuryolHud() {
        this.initialize.apply(this, arguments);
    };

    YuryolHud.prototype = Object.create(Sprite.prototype);
    YuryolHud.prototype.constructor = YuryolHud;
    YuryolHud.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this.x = 0;
        this.y = 0;
        this.bitmap = new Bitmap(Graphics.width, 70);
        this.update();
    };
    YuryolHud.prototype.update = function() {      
        this.bitmap.clear();
        this.drawHudPlayer(); // вызываем функцию отрисовки полосок здоровья
        this.drawHudEnemy(); // вызываем функцию отрисовки полосок здоровья врага  
        this.drawHud('items'); // вызываем функцию отрисовки полосок здоровья врага
        this.drawHud('weapons'); // вызываем функцию отрисовки полосок здоровья врага
        this.drawHud('armors'); // вызываем функцию отрисовки полосок здоровья врага
    };

    YuryolHud.prototype.drawHud = function (type) {
         if (!('equip' in $gameParty)) {
            //заполняем объект экипировки,пока без брони
            $gameParty.equip = {
                weapon: [],
                items: [],
                weapons: [],
                skill: [],
                armors: [],
                armor: []
            };
        }
        let x = (type == 'weapons') ? 0  :
                (type == 'armors')  ? 45 :
                (type == 'skills')  ? 90 : 135;
        
        if (!$gameParty.equip[type].length) return;
        let icon = $gameParty.equip[type][0];
        this.drawIcon(icon.iconIndex, 5 + x, 10, 40, 40);
        
        let data = '$data'+type[0].toUpperCase() + type.substring(1);
        let id, items;
        if (type == 'weapons' || type == 'armors') {
            id = $gameParty.equip[type][0].itemBullet;
            items = $gameParty.numItems($dataItems[id]);
            if ($gameParty.equip[type][0].itemBullet===undefined) {
                items = '';
                return;
            }
            if ($gameParty.equip[type][0].patron!==undefined) items = $gameParty.equip[type][0].patron + '/' + items;
        } else {
            id = $gameParty.equip[type][0].id;
            items = $gameParty.numItems($dataItems[id]);
        }
        
        this.bitmap.drawText(items, 8 + x, 50, 500, 20);
    };
    
    YuryolHud.prototype.drawHudPlayer = function () {

        let hp = $gameParty.leader().hp; //смотрим чему равна ХП героя
        let mhp = $gameParty.leader().mhp; //чему равна макисмальная ХП
        this.drawHudBar(hp, mhp, 250, 14, 120, 14, '#cd6500', '#005900', 1, '#98830a');//#ffd800 #cd6500 #005900 ntrcn #e5bf00
        this.bitmap.drawText(hp + '/' +  mhp, 185, 14, 120, 14);
        
        let mp = $gameParty.leader().mp; //то же самое но для МП
        let mmp = $gameParty.leader().mmp;
        this.drawHudBar(mp, mmp, 250, 34, 80, 10, '#0065cd', '#005900', 1, '#98830a');
        this.bitmap.drawText(mp + '/' +  mmp, 185, 34, 120, 14);

        this.bitmap.textColor = '#98830a';
        this.bitmap.fontSize = 18;
    };
    
    YuryolHud.prototype.drawHudEnemy = function () {
        if (!YuryolHud.hudEnemy) return;
        let enemy = $gameMap.event(YuryolHud.hudEnemy);
        let hp = enemy.hp;
        let mhp = enemy.mhp;
        this.drawHudBar(hp, mhp,  Graphics.width-130, 10, 120, 14, '#cd0606', '#005900', 1, '#98830a');
        this.bitmap.drawText(hp + '/' +  mhp, Graphics.width-90, 10, 120, 14);
    };
    
    YuryolHud.prototype.drawHudBar = function (value, maxValue, x, y, w, h, colValue1,  colValue2, wBord, colBord) {
        //находим соотношение хп героя относительно амкисмальному ХП
        let wHud = w * value / maxValue;
        //рисуем фон полоски. кординаты ее, затем ширина и высота, и потом цвет в формате HEX
        this.bitmap.fillRect(x, y, w, h, colBord); 
        //рисуем саму полоску
        this.bitmap.fillRect(x + wBord, y + wBord, w-wBord*2, h-wBord*2, '#000'); 
        //рисуем саму полоску
        this.bitmap.gradientFillRect(x + wBord, y + wBord, wHud-wBord*2, h-wBord*2, colValue1, colValue2);
    };
    YuryolHud.prototype.drawIcon = function(index, x, y, w, h) {
        if (!this.bitmap) return false;
        let bitmap = ImageManager.loadSystem('IconSet');
        let pw = Window_Base._iconWidth;
        let ph = Window_Base._iconHeight;
        let sx = index%16*pw;
        let sy = Math.floor(index/16)*pw;
        this.bitmap.blt(bitmap,sx,sy,pw,ph,x,y, w,h);
        return true;
    };
    
    // список клавиш
    Input.keyMapper = {
        8: 'backspace',	// backspace
        9: 'tab',		// tab
        13: 'ok',		// enter
        16: 'shift',	// shift
        17: 'control',	// control
        18: 'alt',  	// alt
        19: 'pause',	// pause
        20: 'capslock',	// capslock
        27: 'escape',   // escape
        32: 'space',	// space
        33: 'pageup',   // pageup
        34: 'pagedown', // pagedown
        35: 'end',		// end
        36: 'home',		// home
        37: 'left',       // left arrow
        38: 'up',       // up arrow
        39: 'right',    // right arrow
        40: 'down',     // down arrow
        44: 'printscreen',	// printscreen
        45: 'insert',   // insert
        46: 'delete',	// delete
        48: '0',		// 0
        49: '1',		// 1
        50: '2',		// 2
        51: '3',		// 3
        52: '4',		// 4
        53: '5',		// 5
        54: '6',		// 6
        55: '7',		// 7
        56: '8',		// 8
        57: '9',		// 9
        65: 'a',		// A ф
        66: 'b',		// B и
        67: 'c',		// C с
        68: 'd',		// D в
        69: 'e',		// E у
        70: 'f',		// F а
        71: 'g',		// G п
        72: 'h',		// H р
        73: 'i',		// I ш
        74: 'j',		// J о
        75: 'k',		// K л
        76: 'l',		// L д
        77: 'm',		// M ь
        78: 'n',		// N т
        79: 'o',		// O щ
        80: 'p',		// P з
        81: 'q',		// Q й
        82: 'r',		// R к
        83: 's',		// S ы
        84: 't',		// T е
        85: 'u',		// U г
        86: 'v',		// V м
        87: 'w',		// W ц
        88: 'x',		// X ч
        89: 'y',		// Y н
        90: 'z',		// Z я
        96: 'escape',   // numpad 0
        97: 'numpad1',	// numpad 1
        98: 'down',     // numpad 2
        99: 'numpad3',	// numpad 3
        100: 'left',    // numpad 4
        101: 'numpad5',	// numpad 5
        102: 'right',   // numpad 6
        103: 'numpad7',	// numpad 7
        104: 'up',      // numpad 8
        105: 'numpad9', // numpad 9
        106: '*',		// *
        107: '+',		// +
        109: '-',		// -
        110: '.',		// .
        111: '/',		// /
        112: 'f1',		// F1
        113: 'f2',		// F2
        114: 'f3',		// F3
        115: 'f4',		// F4
        116: 'f5',		// F5
        117: 'f6',		// F6
        118: 'f7',		// F7
        119: 'f8',		// F8
        120: 'debug',   // F9
        121: 'f10',		// F10
        122: 'f11',		// F11
        123: 'f12',		// F12
        144: 'numlock',	// numlock
        145: 'scrolllock',	// scrolllock
        186: ';',		// :;ж
        187: '=',		// +=
        188: '<',		// <,Б
        189: '-',		// -_
        190: '>',		// >.Ю
        191: '?',		// /?,/.
        192: '`',		// ~`ё
        219: '[',		// {[х
        220: '|',		// |
        221: ']',		// }]ъ
        222: '"'		// "'э   
    };
    
    Game_Player.prototype.disableBlock = function() { 
        this.block = false;
    };
    Game_Player.prototype.enableBlock = function() { 
        this.block = true; 
    };
    
    var YuryolCanMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if ($gameMap.isEventRunning() || $gameMessage.isBusy() || $gamePlayer.block) {
            return false;
        }
        if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
            return false;
        }
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        if (this.isInVehicle() && !this.vehicle().canMove()) {
            return false;
        }
        return true;
    };

    var YuryolMoveEvent = Game_Map.prototype.moveEvent;
    Game_Map.prototype.moveEvent = function(id, direction, amount) {
        var event = (id) ? this.event(id) : $gamePlayer;
        if (!event) return;

        var route = { list: [] };
        var code;

        switch(direction){
            case 0:{
                code = Game_Character.ROUTE_END;
                break;
            }
            case 2:{
                code = Game_Character.ROUTE_MOVE_DOWN;
                break;
            }
            case 4:{
                code = Game_Character.ROUTE_MOVE_LEFT;
                break;
            }
            case 6:{
                code = Game_Character.ROUTE_MOVE_RIGHT;
                break;
            }
            case 8:{
                code = Game_Character.ROUTE_MOVE_UP;
                break;
            }
            case 12:{
                code = Game_Character.ROUTE_MOVE_FORWARD;
                break;
            }
        }

        for(var i = 0; code && i < amount; i++){
            route.list[i] = { code: code };    
        }

        route.list[amount] = {code: 29, parameters: [4], indent: null};
        route.list[amount+1] = {code: 45, parameters: ["$gamePlayer._opacity = 255;"], indent: null};
        route.list[amount+2] = {code: 45, parameters: ["$gamePlayer.disableBlock();"], indent: null};
        route.list[amount+3] = {code: Game_Character.ROUTE_END};
        route.skippable = true;
        event.forceMoveRoute(route);
    };
    // блокировка управления
    var YuryolMoveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight= function(d) {
        YuryolMoveStraight.call(this);
        ($gamePlayer.isBlockMove) ? this.setDirection(d) : Game_Character.prototype.moveStraight.call(this, d);
    };

})();