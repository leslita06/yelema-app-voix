/* Yelema Voix v2, prototype : menu, code, appel simulé (avance au toucher), historique, réglages */
(function(){
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var page=document.body.getAttribute('data-page'), Q=new URLSearchParams(location.search);
function toast(t){var el=$('#v-toast');if(!el)return;el.textContent=t;el.classList.remove('v-show');void el.offsetWidth;el.classList.add('v-show');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('v-show')},2400)}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function img(s){return 'img/'+s+'.jpg'}

/* Experts : prénom, féminin, en pause, scénario (accueil, question, outil, réponse, demande, tâche, confirmation, résumé) */
var X={
 djeneba:{n:'Djénéba',f:1,s:['Bonjour Aïcha, je vous écoute.','Fais-moi le point du jour.','Votre agenda',
   'Deux validations vous attendent, et Lagune Distribution a décalé son rendez-vous à 15 h. Je prépare la note du codir ?','Oui, en Word.',
   'Note du comité de direction','C’est lancé, vous l’aurez avant midi.',
   ['Deux validations en attente : devis transport et visuel Sossa.','Rendez-vous Lagune Distribution décalé à 15 h.','Note du codir demandée pour midi.'],["Note du codir attendue avant midi."],["Aïcha valide le devis transport et le visuel Sossa.", "Djénéba envoie la note du codir avant midi."]]},
 fatima:{n:'Fatima',f:1,s:['Bonjour Aïcha, je vous écoute.','Tu peux comparer nos prix de jus avec ceux d’Hyper Lagune ?','Relevés de prix d’hier',
   'Sossa est moins cher sur le litre, mais plus cher sur le 33 cl. Je vous fais la comparaison en PDF ?','Oui, en PDF.',
   'Comparaison des prix, PDF','C’est lancé, vous l’aurez dans dix minutes.',
   ['Prix Sossa comparés à Hyper Lagune et Prix Doux.','Moins cher sur le litre, plus cher sur le 33 cl.','À trancher lundi : baisse du 33 cl pendant la promo.'],["Baisse du 33 cl à étudier pour la promo de rentrée."],["Fatima envoie la comparaison en PDF, ce matin.", "Décision sur le prix du 33 cl lundi, au codir."]]},
 koffi:{n:'Koffi',f:0,s:['Bonjour Aïcha, je vous écoute.','Où en est le kakémono du salon Agro ?','Figma',
   'J’ai deux pistes, une verte et une orange. La verte colle mieux à la charte. Je vous envoie les deux ?','Oui, envoie les deux.',
   'Kakémono salon Agro, deux pistes','C’est parti, vous les aurez dans cinq minutes.',
   ['Kakémono du salon Agro : deux pistes prêtes.','La verte colle mieux à la charte.','Les deux pistes envoyées pour choix.'],["La piste verte part en impression si Aïcha la valide."],["Aïcha choisit la piste, demain.", "Koffi envoie le bon à tirer à l’imprimeur."]]},
 kouassi:{n:'Kouassi',f:0,s:['Bonjour Aïcha, je vous écoute.','Lagune Distribution a répondu pour le devis ?','HubSpot',
   'Pas encore, ça fait six jours. Je propose une relance avec 5 % de remise sur le volume. Je la prépare ?','Oui, prépare le mail.',
   'Relance du devis, mail à valider','C’est prêt dans quelques minutes, vous validez avant envoi.',
   ['Devis Lagune Distribution sans réponse depuis six jours.','Relance proposée avec 5 % de remise sur le volume.','Mail préparé, à valider avant envoi.'],["Relance avec 5 % de remise sur le volume."],["Aïcha valide le mail de relance.", "Kouassi rappelle Lagune Distribution jeudi."]]},
 awa:{n:'Awa',f:1,s:['Bonjour Aïcha, je vous écoute.','Il y a des réclamations ce matin ?','Messages clients du matin',
   'Trois réclamations, toutes sur des retards de livraison à Yopougon. Je prépare les réponses ?','Oui, prépare-les.',
   'Réponses aux trois réclamations','C’est lancé, vous les validez avant envoi.',
   ['Trois réclamations ce matin, toutes à Yopougon.','Cause : retards du transporteur.','Réponses préparées, à valider.'],["Réponses envoyées après validation d’Aïcha."],["Aïcha valide les trois réponses.", "Awa signale les retards au transporteur."]]},
 mamadou:{n:'Mamadou',f:0,s:['Bonjour Aïcha, je vous écoute.','Comment se présente la trésorerie ?','Trésorerie à 13 semaines',
   'Un creux est attendu fin novembre. Trois clients ont des factures en retard. Je prépare les relances ?','Oui, en Excel.',
   'Relances clients, Excel','C’est lancé, vous l’aurez dans dix minutes.',
   ['Creux de trésorerie attendu fin novembre.','Trois clients avec des factures en retard.','Relances demandées en Excel.'],["Priorité aux trois factures en retard."],["Mamadou envoie la liste des relances en Excel.", "Point trésorerie avec Aïcha vendredi."]]}
};
['adjoua','alioune','fatou','ibrahim','nadia','salif'].forEach(function(k){var n=k.charAt(0).toUpperCase()+k.slice(1);
  X[k]={n:n,f:['adjoua','fatou','nadia'].indexOf(k)>=0?1:0,s:X.fatima.s.slice()};X[k].s[0]='Bonjour Aïcha, je vous écoute.'});
var slug=X[Q.get('e')]?Q.get('e'):'fatima', E=X[slug];

document.addEventListener('click',function(e){
  var t=e.target.closest('[data-toast]');if(t){e.preventDefault();toast(t.getAttribute('data-toast'));return}
  if(e.target.closest('[data-menu]')){$('#v-ph').classList.add('v-open');return}
  if(e.target.closest('[data-close]')){$('#v-ph').classList.remove('v-open');return}
  var c=e.target.closest('[data-call]');
  if(c){e.preventDefault();var s=c.getAttribute('data-call');
    if(X[s].off){$('#v-ph').classList.remove('v-open');sheet(s);return}
    location.href='appel.html?e='+s;return}
  var o=e.target.closest('[data-open]');
  if(o){toast(o.getAttribute('data-open')==='tg'?'Ouvre le topic de '+E.n+' dans Telegram.':'Ouvre les Livrables de '+E.n+' sur la plateforme.')}
});
function sheet(s){
  var bg=document.createElement('div');bg.className='v-sheet-bg';
  bg.innerHTML='<div class="v-sheet" role="dialog"><img src="'+img(s)+'" alt=""><h2 class="v-h">'+X[s].n+' est en pause</h2><p>Mis en pause par votre administrateur</p><button class="v-btn v-pri" type="button">OK</button></div>';
  bg.addEventListener('click',function(e){if(e.target===bg||e.target.closest('button'))bg.remove()});
  $('#v-ph').appendChild(bg);
}

if(page==='oubli'){$('#v-oubli').addEventListener('submit',function(e){e.preventDefault();$('#v-oubli').hidden=true;$('#v-envoye').hidden=false});if(location.hash==='#envoye'){$('#v-oubli').hidden=true;$('#v-envoye').hidden=false}}
if(page==='index'){$('#v-login').addEventListener('submit',function(e){e.preventDefault();location.href='pin.html'})}

if(page==='pin'){
  var code='',dots=$$('#v-dots i');
  function draw(){dots.forEach(function(d,i){d.classList.toggle('v-on',i<code.length)})}
  $$('.v-pad button[data-k]').forEach(function(b){b.addEventListener('click',function(){
    var k=b.getAttribute('data-k');
    if(k==='del'){code=code.slice(0,-1);draw();return}
    if(code.length<4){code+=k;draw()}
    if(code.length===4)setTimeout(function(){location.href='experts.html'},250);
  })});
}

if(page==='experts'){
  if(location.hash==='#encours'){$('#v-live').hidden=false;var t0=192;setInterval(function(){$('#v-live-t').textContent=fmt(++t0)},1000)}
  if(location.hash==='#reseau'){$('#v-net').hidden=false}
  if(location.hash==='#menu'){$('#v-ph').classList.add('v-open')}
  if(location.hash==='#equipe12'){$$('.v-more').forEach(function(e){e.hidden=false});$('#v-search').hidden=false}
  var sq=$('#v-search input');sq.addEventListener('input',function(){var q=sq.value.trim().toLowerCase();
    $$('.v-ex').forEach(function(e){if(location.hash!=='#equipe12'&&e.classList.contains('v-more'))return;e.hidden=q&&e.textContent.toLowerCase().indexOf(q)<0})});
}

if(page==='verrouille'&&location.hash==='#livrable'){$('#v-nliv').hidden=false;$('#v-ncall').hidden=true}
if(page==='verrouille'){var t1=192;setInterval(function(){$('#v-lt').textContent=fmt(++t1)},1000)}

if(page==='appel'){
  $('#v-bg').style.backgroundImage='url('+img(slug)+')';if(Q.get('forme')==='carre')$('#v-ph').classList.add('v-carre');
  $('#v-nom').textContent=E.n;$('#v-thk-n').textContent=E.n;$('#v-end').href='fin.html?e='+slug;
  $('#v-fail-h').textContent=E.n+' injoignable';
  var S=E.s,sec=0,timer=setInterval(function(){$('#v-time').textContent=fmt(++sec)},1000);
  var wave=$('#v-wave'),sub=$('#v-sub'),longue=false,finir=false;
  function state(k){document.body.classList.toggle('v-s-parle-on',k==='parle');document.body.setAttribute('data-halo',k);['parle','ecoute','reflechit'].forEach(function(c){wave.classList.remove('v-s-'+c)});wave.classList.add('v-s-'+k);var th=k==='reflechit';$('#v-think').classList.toggle('v-on',th);$('#v-thk').hidden=!th}
  var hist=[];
  function say(who,t){if(!t){return}hist.push([who,t]);hist=hist.slice(-3);
    sub.innerHTML=hist.map(function(h,k){return '<span class="v-l'+(h[0]==='u'?' v-u':'')+(k<hist.length-1?' v-old':'')+'">'+h[1]+'</span>'}).join('')}
  function tool(t){$('#v-tool').hidden=!t;if(t)$('#v-tool-t').textContent=t}
  var steps=[
    function(){hist=[];sub.innerHTML='';state('parle');say('e',S[0]);tool('');$('#v-task').hidden=true},
    function(){state('ecoute');say('u',S[1])},
    function(){state('reflechit');tool(S[2])},
    function(){tool('');state('parle');say('e',S[3]);$('#v-ctx').style.opacity=0},
    function(){state('ecoute');say('u',S[4])},
    function(){state('parle');say('e',S[6]);$('#v-task').hidden=false;$('#v-task-t').textContent=S[5]},
    function(){state('ecoute')}
  ];
  var i=-1,auto;
  function go(n){i=n;for(var k=0;k<=n;k++)steps[k]()}
  function next(){if(i<steps.length-1)go(i+1)}
  function play(){clearInterval(auto);auto=setInterval(function(){if(i>=steps.length-1)clearInterval(auto);else next()},2800)}
  $('#v-bg').addEventListener('click',function(){play();next()});
  $('#v-long').addEventListener('click',function(){longue=!longue;this.classList.toggle('v-on',longue);this.setAttribute('aria-pressed',longue);
    toast(longue?E.n+' prendra le temps de chercher.':'Réponses rapides.')});
  $('#v-finir').addEventListener('click',function(){finir=!finir;this.classList.toggle('v-on',finir);this.setAttribute('aria-pressed',finir);
    if(finir){clearInterval(auto);state('ecoute');say('u','… et pour le 33 cl, regarde aussi ce que fait Prix Doux, parce que')}
    toast(finir?E.n+' attend que vous ayez fini.':E.n+' peut reprendre la parole.')});
  $('#v-mic').addEventListener('click',function(){var on=this.classList.toggle('v-on');$('.v-m1',this).hidden=on;$('.v-m2',this).hidden=!on;toast(on?'Micro coupé.':'Micro rétabli.')});
  $('#v-cc').addEventListener('click',function(){var on=this.classList.toggle('v-on');sub.style.visibility=on?'':'hidden'});
  $('#v-hp').addEventListener('click',function(){var on=this.classList.toggle('v-on');toast(on?'Haut-parleur.':'Écouteur. Le téléphone bascule seul selon qu’il est à l’oreille.')});
  $('#v-retry').addEventListener('click',function(){$('#v-fail').hidden=true;clearInterval(timer);sec=0;timer=setInterval(function(){$('#v-time').textContent=fmt(++sec)},1000);go(0);play()});
  $('#v-write').addEventListener('click',function(){toast('Ouvre le topic de '+E.n+' dans Telegram.')});
  var h=location.hash.slice(1), at={decroche:0,ecoute:1,recherche:2,reponse:3,tache:5}[h];
  function reco(){$('#v-reco').hidden=false;document.body.setAttribute('data-halo','reco');wave.style.visibility='hidden';
    setTimeout(function(){$('#v-reco').hidden=true;wave.style.visibility='';var c=$('#v-ctx');c.style.opacity=1;$('span',c).textContent='Reprise où vous en étiez';state('ecoute')},3000)}
  if(h==='reconnexion'){go(3);sec=52;reco()}
  else if(h==='injoignable'){go(0);$('#v-fail').hidden=false;clearInterval(timer)}
  else if(h==='finir'){go(3);sec=74;$('#v-finir').click()}
  else if(h==='longue'){go(2);sec=96;$('#v-long').click()}
  else if(at!==undefined){go(at);sec=[1,9,21,38,0,62][at]}
  else{go(0);play()}
  $('#v-time').textContent=fmt(sec);
}

function fill(){
  $('#v-av').src=img(slug);$('#v-n').textContent=E.n;
  $$('#v-res li').forEach(function(li,k){li.textContent=E.s[7][k]});
  $$('#v-dec li').forEach(function(li,k){li.textContent=E.s[8][k]});
  $$('#v-next li').forEach(function(li,k){li.textContent=E.s[9][k]});
  $('#v-tk').textContent=E.s[5];
  $('#v-recall').href='appel.html?e='+slug;$('#v-recall span').textContent='Rappeler '+E.n;
}
if(page==='fin'){fill()}
if(page==='detail'){
  var D={djeneba:['Aujourd’hui, 08:12, 3 min',0],fatima:Q.get('h')==='1018'?['Aujourd’hui, 10:18, 6 min',1]:['Hier, 17:40, 4 min',2],
    koffi:['Vendredi, 16:30, 5 min',2],kouassi:['Hier, 11:05, 8 min',2],awa:['Jeudi, 09:40, 3 min',2],mamadou:['Vendredi, 09:10, 7 min',2]}[slug];
  fill();$('#v-d').textContent=D[0];
  if(slug==='fatima'&&D[1]===2){var r=['Posts de la semaine passés en revue.','Tout validé sauf le jeu concours de jeudi.','Jeu concours décalé à samedi si besoin.'];
    $$('#v-res li').forEach(function(li,k){li.textContent=r[k]});
    $('#v-dec li').textContent='Jeu concours maintenu jeudi si le règlement est relu mercredi.';
    var nx=$$('#v-next li');nx[0].textContent='Aïcha relit le règlement, mercredi.';nx[1].textContent='Fatima publie les posts validés à partir de lundi.';$('#v-tk').textContent='Calendrier des posts, semaine du 12'}
  if(D[1]===0)$('#v-tkb').hidden=true;
  if(D[1]===1)$('#v-tks').innerHTML='<i></i>En préparation';
}

if(page==='historique'){
  var fE='tous',fP=999;
  function filt(){var q=$('#v-q').value.trim().toLowerCase(),n=0;
    $$('.v-hi').forEach(function(a){var ok=(fE==='tous'||a.getAttribute('data-e')===fE)&&(+a.getAttribute('data-age')<=fP)&&
      (!q||(a.textContent+' '+a.getAttribute('data-k')).toLowerCase().indexOf(q)>=0);a.hidden=!ok;if(ok)n++});
    $$('.v-grp').forEach(function(g){g.hidden=!$$('.v-hi',g).some(function(a){return !a.hidden})});
    $('#v-empty').hidden=n>0}
  $$('#v-chips button').forEach(function(b){b.addEventListener('click',function(){$$('#v-chips button').forEach(function(x){x.classList.toggle('v-on',x===b)});fE=b.getAttribute('data-f');filt()})});
  $$('#v-per button').forEach(function(b){b.addEventListener('click',function(e){e.stopImmediatePropagation();$$('#v-per button').forEach(function(x){x.classList.toggle('v-on',x===b)});fP=+b.getAttribute('data-p');filt()})});
  $('#v-q').addEventListener('input',filt);
  if(location.hash.indexOf('#q=')===0){$('#v-q').value=decodeURIComponent(location.hash.slice(3));filt()}
}

$$('.v-seg:not(.v-per)').forEach(function(g){$$('button',g).forEach(function(b){b.addEventListener('click',function(){
  $$('button',g).forEach(function(x){x.classList.toggle('v-on',x===b)});toast(b.textContent+', enregistré.')})})});
$$('[data-tog]').forEach(function(r){r.addEventListener('click',function(){var t=$('.v-tog',r);var on=t.classList.toggle('v-on');toast($('b',r).textContent+(on?' activé.':' désactivé.'))})});
/* allers-retours : le retour système suit la hiérarchie de l'app */
var PARENT={pin:'index.html',oubli:'index.html',detail:'historique.html',fin:'experts.html',historique:'experts.html',reglages:'experts.html'};
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if($('#v-ph').classList.contains('v-open')){$('#v-ph').classList.remove('v-open');return}
  var sh=$('.v-sheet-bg');if(sh){sh.remove();return} if(PARENT[page])location.href=PARENT[page]}});
})();
