!function(e){function t(t){for(var r,a,o=t[0],l=t[1],u=t[2],c=0,f=[];c<o.length;c++)a=o[c],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&f.push(i[a][0]),i[a]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);for(h&&h(t);f.length;)f.shift()();return s.push.apply(s,u||[]),n()}function n(){for(var e,t=0;t<s.length;t++){for(var n=s[t],r=!0,o=1;o<n.length;o++){var l=n[o];0!==i[l]&&(r=!1)}r&&(s.splice(t--,1),e=a(a.s=n[0]))}return e}var r={},i={0:0},s=[];function a(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=r,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var o=window.webpackJsonp=window.webpackJsonp||[],l=o.push.bind(o);o.push=t,o=o.slice();for(var u=0;u<o.length;u++)t(o[u]);var h=l;s.push([119,1]),n()}({119:function(e,t,n){"use strict";n.r(t);n(84),n(53),n(65),n(66),n(15),n(67),n(95),n(96),n(70),n(48),n(75),n(106),n(76),n(77),n(107),n(49),n(50),n(78),n(79);var r=1,i=function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.id=++r,this.typeId=t.typeId,this.gridX=t.gridX,this.gridY=t.gridY,this.radius=t.radius,this.lastShot=t.lastShot||0,this.shotInterval=t.shotInterval,this.projectileSpeed=t.projectileSpeed,this.projectileDamage=t.projectileDamage,this.projectileSize=t.projectileSize,this.projectileColor=t.projectileColor||"#f00",this.color=t.color||"#fff",this.size=t.size||10,this.sellPrice=Math.floor(t.price/10),this.dps=t.dps};function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var a=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.x=t.x,this.y=t.y,this.speed=t.speed,this.size=t.size,this.health=t.health,this.lastSegment=null,this.nextSegment=null,this.lastSegmentIndex=null,this.cellOffsetX=t.cellOffsetX||.5,this.cellOffsetY=t.cellOffsetY||.5,this.money=t.money,this.color=t.color,this.accentColor=t.accentColor,this.customRender=t.render}var t,n,r;return t=e,(n=[{key:"render",value:function(e){this.customRender?this.customRender(e):(e.fillStyle=this.color,e.fillRect(this.x,this.y,this.size,this.size))}}])&&s(t.prototype,n),r&&s(t,r),e}();function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var l=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.x=t.x,this.y=t.y,this.speed=t.speed,this.damage=t.damage,this.enemy=t.enemy,this.size=t.size,this.color=t.color}var t,n,r;return t=e,(n=[{key:"update",value:function(e){var t=this.enemy,n=t.x-this.x,r=t.y-this.y,i=Math.atan2(r,n),s=Math.hypot(n,r),a=Math.min(s,this.speed*e);this.x=Math.cos(i)*a+this.x,this.y=Math.sin(i)*a+this.y}},{key:"render",value:function(e){e.fillStyle=this.color,e.beginPath(),e.arc(this.x,this.y,this.size,0,2*Math.PI),e.fill(),e.closePath()}}])&&o(t.prototype,n),r&&o(t,r),e}(),u=(n(112),n(113),n(114),function(e,t){return Math.floor(Math.random()*(t+1-e))+e}),h=function(){return"#"+Math.floor(4096*Math.random()).toString(16).padStart(3,"0")},c=function(){return Math.random()<.5};function f(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,i=!1,s=void 0;try{for(var a,o=e[Symbol.iterator]();!(r=(a=o.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,s=e}finally{try{r||null==o.return||o.return()}finally{if(i)throw s}}return n}(e,t)||m(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e){return function(e){if(Array.isArray(e))return p(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||m(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){if(e){if("string"==typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var y=function(e,t,n,r){var i=e[e.length-1],s=v(i).filter((function(e){var i=f(e,2),s=i[0],a=i[1];return s>=1&&s<=n&&a>=1&&a<=r&&!t.some((function(t){return g(t,e)}))}));return s[u(0,s.length-1)]},v=function(e){var t=f(e,2),n=t[0],r=t[1];return[[n-1,r],[n+1,r],[n,r-1],[n,r+1]]},g=function(e,t){return e[0]===t[0]&&e[1]===t[1]},b=(n(52),1);function S(){return new Array(6).fill().map((function(e,t){return n=10+10*t,r=u(2,8)/10,i=200+200*(1-r),a=n*(s=1+(n-10)/50)*5,o=u(2,8)/10*1,l=1e3*o,f=(c=10*s)*o,{typeId:++b,price:a,radius:1+4*r,color:h(),size:10+10*r,shotInterval:l,projectileSpeed:i,projectileDamage:f,projectileSize:3+f/3,projectileColor:h(),dps:c};var n,r,i,s,a,o,l,c,f})).sort((function(e,t){return e.price-t.price}))}var w=1,T=[null,function(e){e.fillStyle=this.color,e.fillRect(this.x,this.y,this.size,this.size),e.fillStyle=this.accentColor,e.beginPath(),e.arc(this.x+this.size/2,this.y+this.size/2,this.size/3,0,2*Math.PI),e.fill(),e.closePath()},function(e){e.fillStyle=this.color,e.beginPath(),e.arc(this.x+this.size/2,this.y+this.size/2,this.size/2,0,2*Math.PI),e.fill(),e.closePath()}];function x(){return new Array(6).fill().map((function(e,t){return r=1+((n=10*(t+1))-10)/50,i=u(2,8)/10,s=50+100*r*(1-i),a=10*Math.pow(r,4)*i,{typeId:++w,level:n,speed:s,size:10+a/10,health:a,money:n/2,color:h(),accentColor:"#fffa",render:T[u(0,T.length-1)]};var n,r,i,s,a}))}n(81),n(83);function P(e){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=function(e,t){if(!e)return;if("string"==typeof e)return z(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return z(e,t)}(e))){var t=0,n=function(){};return{s:n,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i,s=!0,a=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return s=e.done,e},e:function(e){a=!0,i=e},f:function(){try{s||null==r.return||r.return()}finally{if(a)throw i}}}}function z(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function I(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var j=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var t=this.canvas=document.getElementById("game");this.ctx=this.canvas.getContext("2d"),this.gameWidth=800,this.gameHeight=450,t.height=this.gameHeight,t.width=this.gameWidth,this.gridWidth=16,this.gridHeight=9,this.cellSize=this.gameWidth/this.gridWidth,this.mouseX,this.mouseY,this.selectedTurret,this.placingTurret,this.autorun=!1,this.money=100,this.wave={number:0},this.turretTypes=S(),this.enemyTypes=x(),this.turrets=[],this.projectiles=[],this.enemies=[],this.path=function(e,t,n){for(var r=0,i=[],s=[];r<50&&(r++,i.length!==n);){var a=void 0;a=c()?[1,u(1,t-2)]:[u(1,e-2),1],i.length>s.length&&(s=i),i=[a];for(var o=[];i.length!==n;){var l=y(i,o,e-2,t-2);if(!l)break;o.push.apply(o,[l].concat(d(v(i[i.length-1])))),i.push(l)}}return i.length!==n&&(i=s),i}(this.gridWidth,this.gridHeight,this.gridWidth*this.gridHeight/2),this.advance(),this.lastRender=Date.now(),t.addEventListener("mousemove",this.onMouseMove.bind(this)),t.addEventListener("mouseleave",this.onMouseLeave.bind(this)),t.addEventListener("click",this.onClick.bind(this));var n=document.getElementById("loader"),r=document.getElementById("container");n.classList.add("hide"),setTimeout((function(){r.classList.add("descale")}),0),setTimeout((function(){n.remove()}),300),this.draw=this.draw.bind(this),requestAnimationFrame(this.draw)}var t,n,r;return t=e,(n=[{key:"draw",value:function(){var e=this,t=this.ctx,n=this.cellSize;!this.wave.inProgress&&this.autorun&&this.sendWave();var r=Date.now(),i=(r-this.lastRender)/1e3;!function(){var e=j.ctx,t=j.gameWidth,n=j.gameHeight,r=j.cellSize,i=j.path,s=j.gridWidth,a=j.gridHeight;e.fillStyle="#222",e.fillRect(0,0,t,n),i.forEach((function(t){e.fillStyle="#aaa",e.fillRect(t[0]*r,t[1]*r,r,r)})),i.forEach((function(t,n){if(!(n<1||n>i.length-1)){var s=i[n-1],a=Math.min(t[0],s[0])*r+4,o=Math.max(t[0],s[0])*r-4,l=Math.min(t[1],s[1])*r+4,u=Math.max(t[1],s[1])*r-4;e.fillStyle="#666",e.fillRect(a,l,o-a+r,u-l+r)}}));var o=i[0][0]*r+r/2,l=i[0][1]*r+r/2;e.fillStyle="#8a8",e.beginPath(),e.arc(o,l,r/3,0,2*Math.PI),e.fill(),e.closePath(),e.fillStyle="#fff",e.font="20px monospace",e.textAlign="center",e.textBaseline="middle",e.fillText("s",o,l);var u=i[i.length-1][0]*r+r/2,h=i[i.length-1][1]*r+r/2;e.fillStyle="#a88",e.beginPath(),e.arc(u,h,r/3,0,2*Math.PI),e.fill(),e.closePath(),e.fillStyle="#fff",e.fillText("e",u,h),e.strokeStyle="#fffa";for(var c=0;c<=a;c++)e.beginPath(),e.moveTo(0,c*r),e.lineTo(t,c*r),e.stroke(),e.closePath();for(var f=0;f<=s;f++)e.beginPath(),e.moveTo(f*r,0),e.lineTo(f*r,n),e.stroke(),e.closePath()}();for(var s=function(r){var s=e.enemies[r];if(s.health<=0)return"continue";if(!s.nextSegment){var a=Math.floor(s.x/n),o=Math.floor(s.y/n),l=e.path.findIndex((function(e,t){return(null==s.lastSegmentIndex||t>s.lastSegmentIndex)&&e[0]===a&&e[1]===o})),u=e.path[l+1];s.lastSegmentIndex=l,s.lastSegment=e.path[l],s.nextSegment=u}if(!s.nextSegment)return e.wave.missed++,s.health=0,"continue";s.lastSegment[0]!==s.nextSegment[0]?e.getEnemyOffsetX(s)>s.x?(s.x+=s.speed*i,e.getEnemyOffsetX(s)<=s.x&&(s.nextSegment=null)):e.getEnemyOffsetX(s)<s.x&&(s.x-=s.speed*i,e.getEnemyOffsetX(s)>=s.x&&(s.nextSegment=null)):s.lastSegment[1]!==s.nextSegment[1]&&(e.getEnemyOffsetY(s)>s.y?(s.y+=s.speed*i,e.getEnemyOffsetY(s)<=s.y&&(s.nextSegment=null)):e.getEnemyOffsetY(s)<s.y&&(s.y-=s.speed*i,e.getEnemyOffsetY(s)>=s.y&&(s.nextSegment=null))),s.render(t)},a=this.enemies.length-1;a>-1;a--)s(a);var o,u=P(this.turrets);try{for(u.s();!(o=u.n()).done;){var h=o.value,c=h.gridX*n+n/2,f=h.gridY*n+n/2;t.fillStyle=h.color,t.beginPath(),t.arc(c,f,h.size,0,2*Math.PI),t.fill(),t.closePath();var d=h.radius*n;if(this.selectedTurret&&this.selectedTurret.id===h.id&&(t.strokeStyle=h.color,t.fillStyle=h.color+"3",t.beginPath(),t.arc(c,f,d,0,2*Math.PI),t.stroke(),t.closePath()),r-h.lastShot>h.shotInterval)for(var m in this.enemies){var p=this.enemies[m];if(!(p.health<=0)&&Math.hypot(c-p.x,f-p.y)<d){this.projectiles.push(new l({x:c,y:f,speed:h.projectileSpeed,damage:h.projectileDamage,size:h.projectileSize,enemy:p,color:h.projectileColor})),h.lastShot=r;break}}}}catch(e){u.e(e)}finally{u.f()}for(var y=this.projectiles.length-1;y>-1;y--){var v=this.projectiles[y],g=v.enemy;!g||g.health<=0?this.projectiles.splice(y,1):(v.update(i),Math.hypot(g.x-v.x,g.y-v.y)<v.size?(this.projectiles.splice(y,1),g.health-=v.damage,g.health<=0&&(this.wave.killed++,this.money+=g.money)):v.render(t))}if(this.mouseX){var b=Math.floor(this.mouseX/n),S=Math.floor(this.mouseY/n);if(t.fillStyle="rgba(255, 255, 255, 0.2)",t.fillRect(b*n,S*n,n,n),this.placingTurret){var w=b*n+n/2,T=S*n+n/2;t.fillStyle=this.placingTurret.color,t.beginPath(),t.arc(w,T,this.placingTurret.size,0,2*Math.PI),t.fill(),t.closePath();var x=this.placingTurret.radius*n;t.strokeStyle=this.placingTurret.color,t.beginPath(),t.arc(w,T,x,0,2*Math.PI),t.stroke(),t.closePath()}}!this.wave.finishedAt&&this.wave.total-this.wave.missed-this.wave.killed<1&&(this.wave.finishedAt=r),this.wave.finishedAt&&this.wave.finishedAt+1e3<r&&this.advance(),this.lastRender=r,requestAnimationFrame(this.draw)}},{key:"onMouseMove",value:function(e){this.mouseX=e.layerX,this.mouseY=e.layerY}},{key:"onMouseLeave",value:function(){this.mouseX=null,this.mouseY=null}},{key:"onClick",value:function(e){e.stopPropagation();var t=Math.floor(this.mouseX/this.cellSize),n=Math.floor(this.mouseY/this.cellSize);if(this.selectedTurret=null,!this.path.find((function(e){return e[0]===t&&e[1]===n}))){var r=this.turrets.find((function(e){return e.gridX===t&&e.gridY===n}));if(this.placingTurret){if(r||!(this.money>=this.placingTurret.price))return void(this.placingTurret=null);this.placingTurret.gridX=t,this.placingTurret.gridY=n,r=new i(this.placingTurret),this.money-=this.placingTurret.price,this.placingTurret=null,this.turrets.push(r)}this.selectedTurret=r}}},{key:"getEnemyOffsetX",value:function(e){return e.nextSegment[0]*this.cellSize+e.cellOffsetX*this.cellSize-.5*e.size}},{key:"getEnemyOffsetY",value:function(e){return e.nextSegment[1]*this.cellSize+e.cellOffsetY*this.cellSize-.5*e.size}},{key:"sendWave",value:function(){var e=this;if(!this.wave.inProgress){this.wave.inProgress=!0;var t=function(t){var n=e.wave.enemyTypes[t].size;setTimeout((function(){e.enemies.push(new a(Object.assign({x:e.path[0][0]*e.cellSize+e.cellSize/2-n/2,y:e.path[0][1]*e.cellSize+e.cellSize/2-n/2},e.wave.enemyTypes[t])))}),300*t)};for(var n in this.wave.enemyTypes)t(n)}}},{key:"placeTurret",value:function(e){this.placingTurret=e,this.selectedTurret=null}},{key:"advance",value:function(){this.enemies=[],this.projectiles=[];for(var e=this.wave.number+1,t=14*(10+e),n=[];t>0;){var r=this.enemyTypes.filter((function(e){return e.level<=t}));if(!r.length)break;var i=r[u(0,r.length-1)];n.push(i),t-=i.level}this.wave={number:e,total:n.length,killed:0,missed:0,inProgress:!1,finishedAt:null,enemyTypes:n}}},{key:"sellSelectedTurret",value:function(){var e=this,t=this.turrets.findIndex((function(t){return t.id===e.selectedTurret.id}));-1!==t&&(this.turrets.splice(t,1),this.money+=this.selectedTurret.sellPrice,this.selectedTurret=null)}}])&&I(t.prototype,n),r&&I(t,r),e}());n(118);function M(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.toolbar=document.getElementById("toolbar"),this.turrets=document.getElementById("turrets"),this.readyButton=document.getElementById("ready-button"),this.waveNumber=document.getElementById("wave-number"),this.money=document.getElementById("money"),this.turretInfo=document.getElementById("turret-info"),this.sellTurret=document.getElementById("sell-turret"),this.autorun=document.getElementById("autorun"),this.turretButtons=[],this.turretButtonSize=70,this.lastValues={},this.init(),this.render=this.render.bind(this),requestAnimationFrame(this.render)}var t,n,r;return t=e,(n=[{key:"init",value:function(){var e=this;j.turretTypes.forEach((function(t){var n=document.createElement("div");n.classList.add("button","turret-button"),n.addEventListener("click",(function(e){e.stopPropagation(),j.placeTurret(t)})),n.addEventListener("mouseenter",(function(){e.showTurretInfo=t})),n.addEventListener("mouseleave",(function(){e.showTurretInfo=null})),e.turrets.appendChild(n);var r=document.createElement("canvas");n.appendChild(r),r.width=r.height=e.turretButtonSize;var i=r.getContext("2d");i.fillStyle=t.color,i.beginPath(),i.arc(e.turretButtonSize/2,e.turretButtonSize/2,t.size,0,2*Math.PI),i.fill(),i.closePath(),i.fillStyle=t.projectileColor,i.beginPath(),i.arc(e.turretButtonSize/2+t.size+t.projectileSize/2,e.turretButtonSize/2-t.size-t.projectileSize/2,t.projectileSize,0,2*Math.PI),i.fill(),i.closePath();var s=document.createElement("span");s.classList.add("price-label"),s.textContent="$ "+t.price,n.appendChild(s),e.turretButtons.push({turret:t,element:n})})),this.autorun.addEventListener("change",(function(e){j.autorun=e.target.checked})),this.readyButton.addEventListener("click",(function(e){e.stopPropagation(),j.sendWave(),j.placeTurret(null)})),this.sellTurret.addEventListener("click",(function(e){e.stopPropagation(),j.sellSelectedTurret()})),document.addEventListener("click",(function(){j.placeTurret(null)}))}},{key:"render",value:function(){var e=this;this.callOrder=0,this.onChange([j.autorun],(function(){e.autorun.checked=j.autorun})),this.onChange([j.wave.inProgress],(function(){j.wave.inProgress?e.readyButton.classList.add("disabled"):e.readyButton.classList.remove("disabled")})),this.onChange([j.wave.number],(function(){e.waveNumber.textContent="Wave "+j.wave.number})),this.onChange([j.money,this.turretButtons.length],(function(){e.money.textContent="$ "+j.money,e.turretButtons.forEach((function(e){e.turret.price>j.money?e.element.classList.add("disabled"):e.element.classList.remove("disabled")}))})),this.onChange([j.selectedTurret&&j.selectedTurret.id,j.placingTurret&&j.placingTurret.typeId],(function(){var t=j.selectedTurret||j.placingTurret;if(t)return e.turretInfo.textContent=["dps","radius","shotInterval","projectileSpeed","projectileDamage"].map((function(e){return e+": "+Math.round(t[e])})).join("\n"),void(j.selectedTurret?(e.sellTurret.textContent="Sell $ ".concat(t.sellPrice),e.sellTurret.classList.add("visible")):e.sellTurret.classList.remove("visible"));e.sellTurret.classList.remove("visible"),e.turretInfo.textContent=""})),this.onChange([j.placingTurret&&j.placingTurret.typeId],(function(){e.turretButtons.forEach((function(e){j.placingTurret&&j.placingTurret.typeId===e.turret.typeId?e.element.classList.add("selected"):e.element.classList.remove("selected")}))})),requestAnimationFrame(this.render)}},{key:"onChange",value:function(e,t){var n=this.callOrder++;for(var r in e)if(!this.lastValues[n]||this.lastValues[n][r]!==e[r]){t();break}this.lastValues[n]=e}}])&&M(t.prototype,n),r&&M(t,r),e}())},84:function(e,t,n){}});
//# sourceMappingURL=app.c80b11e3.js.map