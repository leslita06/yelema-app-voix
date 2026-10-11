/* Yelema Voix, prototype : navigation, code PIN, appel simulé, historique, réglages */
(function(){
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var page=document.body.getAttribute('data-page');
var Q=new URLSearchParams(location.search);

function toast(t){var el=$('#v-toast');if(!el)return;el.textContent=t;el.classList.remove('v-show');void el.offsetWidth;el.classList.add('v-show');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('v-show')},2600)}
document.addEventListener('click',function(e){var b=e.target.closest('[data-toast]');if(b){e.preventDefault();toast(b.getAttribute('data-toast'))}});

/* Experts : prénom, métier, féminin, scénario de démo (accueil, question, outil, réponse, demande, tâche, confirmation, résumé) */
var X={
 djeneba:{n:'Djénéba',j:'Chief of Staff',f:1,
  s:['Bonjour Aïcha, c’est Djénéba. Je vous écoute.','Fais-moi le point du jour.','Je regarde votre agenda et les validations en attente…',
     'Deux validations vous attendent, et Prosuma a décalé son rendez-vous à 15 h. Voulez-vous la note du codir avant midi ?','Oui, prépare-la en Word.',
     ['Note du comité de direction, en Word','Prête dans un quart d’heure environ.'],'C’est lancé, je vous l’envoie avant midi.',
     ['Deux validations en attente : devis transport et visuel Sossa.','Rendez-vous Prosuma décalé à 15 h.','Note du codir demandée pour midi.']]},
 fatima:{n:'Fatima',j:'Marketing et contenu',f:1,
  s:['Bonjour Aïcha, c’est Fatima. Je vous écoute.','Tu peux comparer nos prix de jus avec ceux de Carrefour ?','Je cherche les prix relevés hier dans vos fichiers…',
     'Sossa reste moins cher sur le litre, mais plus cher sur le 33 cl. Voulez-vous la comparaison complète en PDF ?','Oui, en PDF.',
     ['Comparaison des prix, en PDF','Prête dans une dizaine de minutes.'],'C’est lancé. Je vous l’envoie dans une dizaine de minutes.',
     ['Prix des jus Sossa comparés à ceux de Carrefour et Prosuma, relevés d’hier.','Sossa reste moins cher sur le litre, plus cher sur le format 33 cl.','À trancher lundi : baisse du 33 cl pendant la promo de rentrée.']]},
 koffi:{n:'Koffi',j:'Design et marque',f:0,
  s:['Bonjour Aïcha, c’est Koffi. Je vous écoute.','Où en est le kakémono du salon Agro ?','J’ouvre la maquette dans Figma…',
     'J’ai deux pistes, une verte et une orange. La verte respecte mieux la charte. Je vous envoie les deux ?','Oui, envoie les deux.',
     ['Kakémono du salon Agro, deux pistes en PDF','Prêt dans cinq minutes.'],'C’est parti, vous les aurez dans cinq minutes.',
     ['Kakémono du salon Agro : deux pistes prêtes.','La piste verte colle mieux à la charte.','Les deux pistes envoyées pour choix.']]},
 kouassi:{n:'Kouassi',j:'Ventes',f:0,
  s:['Bonjour Aïcha, c’est Kouassi. Je vous écoute.','Prosuma a répondu pour le devis ?','Je regarde le devis dans HubSpot…',
     'Pas encore, ça fait six jours. Je propose une relance avec 5 % de remise sur le volume. Je la prépare ?','Oui, prépare le mail.',
     ['Relance du devis Prosuma, mail à valider','Prêt dans quelques minutes.'],'C’est lancé, vous le validez avant que je l’envoie.',
     ['Devis Prosuma sans réponse depuis six jours.','Relance proposée avec 5 % de remise sur le volume.','Mail préparé, à valider avant envoi.']]},
 awa:{n:'Awa',j:'Service client',f:1,
  s:['Bonjour Aïcha, c’est Awa. Je vous écoute.','Il y a des réclamations ce matin ?','Je lis les messages clients du matin…',
     'Trois réclamations, toutes sur des retards de livraison à Yopougon. Je prépare les réponses ?','Oui, prépare-les.',
     ['Réponses aux trois réclamations, à valider','Prêtes dans quelques minutes.'],'C’est lancé, vous les validez avant envoi.',
     ['Trois réclamations ce matin, toutes sur Yopougon.','Cause : retards de livraison du transporteur.','Réponses préparées, à valider.']]},
 mamadou:{n:'Mamadou',j:'Finance',f:0,
  s:['Bonjour Aïcha, c’est Mamadou. Je vous écoute.','Comment se présente la trésorerie ?','J’ouvre la trésorerie à 13 semaines…',
     'Un creux est attendu fin novembre. Trois clients ont des factures en retard. Je prépare la liste des relances ?','Oui, en Excel.',
     ['Relances clients, en Excel','Prête dans dix minutes.'],'C’est lancé, vous l’aurez dans dix minutes.',
     ['Creux de trésorerie attendu fin novembre.','Trois clients avec des factures en retard.','Liste des relances demandée en Excel.']]}
};
var slug=X[Q.get('e')]?Q.get('e'):'fatima', E=X[slug];
function img(s){return 'img/'+s+'.jpg'}

/* Connexion */
if(page==='index'){$('#v-login').addEventListener('submit',function(e){e.preventDefault();location.href='pin.html'})}

/* Code PIN */
if(page==='pin'){
  var code='',dots=$$('#v-dots i');
  function draw(){dots.forEach(function(d,i){d.classList.toggle('v-on',i<code.length)})}
  $$('.v-pad button').forEach(function(b){b.addEventListener('click',function(){
    var k=b.getAttribute('data-k');
    if(k==='del'){code=code.slice(0,-1);draw();return}
    if(k==='bio'){toast('Empreinte reconnue.');setTimeout(function(){location.href='experts.html'},700);return}
    if(code.length<4){code+=k;draw()}
    if(code.length===4){setTimeout(function(){location.href='experts.html'},250)}
  })});
}

/* Mes Experts : bandeau d'appel en cours, réseau faible */
if(page==='experts'){
  var h=location.hash;
  if(h==='#encours'){var lv=$('#v-live');lv.hidden=false;var t0=192;setInterval(function(){t0++;$('#v-live-t').textContent=fmt(t0)},1000)}
  if(h==='#reseau'){$('#v-net').hidden=false}
}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}

/* Appel */
if(page==='appel'){
  $('#v-bg').style.backgroundImage='url('+img(slug)+')';
  $('#v-nom').textContent=E.n;$('#v-job').textContent=E.j;
  $('#v-end').href='fin.html?e='+slug;
  $('#v-fail-h').textContent='Impossible de joindre '+E.n;
  $('#v-fail p').textContent='Votre connexion est trop faible pour un appel. Réessayez dans un endroit mieux couvert, ou écrivez-lui : '+(E.f?'elle':'il')+' répond aussi par écrit.';
  $('#v-write-t').textContent='Écrire à '+E.n+' sur Telegram';
  var S=E.s, subs=$('#v-subs'), sec=0, timer=setInterval(function(){sec++;$('#v-time').textContent=fmt(sec)},1000);
  function state(k){
    var st=$('#v-state');['parle','ecoute','reflechit'].forEach(function(c){st.classList.remove('v-s-'+c)});st.classList.add('v-s-'+k);
    var lab={parle:E.n+' parle',ecoute:E.n+' écoute',reflechit:E.n+' réfléchit'}[k];
    if(k==='ecoute'&&finir)lab=E.n+' vous laisse finir';
    if(k==='reflechit'&&longue)lab=E.n+' prend le temps de réfléchir';
    $('#v-state-t').textContent=lab;
  }
  function say(who,t){var p=document.createElement('p');if(who==='u')p.className='v-u';p.innerHTML='<b>'+(who==='u'?'Vous':E.n)+'</b>'+t;subs.appendChild(p);while(subs.children.length>3)subs.removeChild(subs.firstChild)}
  function tool(t){$('#v-tool').hidden=!t;if(t)$('#v-tool-t').textContent=t}
  function task(){$('#v-task').hidden=false;$('#v-task-t').textContent=S[5][0];$('#v-task-s').textContent='Tâche lancée. '+S[5][1]}
  var steps={
    decroche:function(){state('parle');say('e',S[0])},
    ecoute:function(){steps.decroche();state('ecoute');say('u',S[1])},
    recherche:function(){steps.ecoute();state('reflechit');tool(S[2])},
    reponse:function(){steps.recherche();tool('');state('parle');say('e',S[3])},
    tache:function(){steps.reponse();say('u',S[4]);task();state('parle');say('e',S[6])}
  };
  var longue=false, finir=false;
  $('#v-long').addEventListener('click',function(){longue=!longue;this.classList.toggle('v-on',longue);this.setAttribute('aria-pressed',longue);
    this.querySelector('span').textContent=longue?'Réflexion longue':'Réfléchis plus';
    toast(longue?E.n+' prendra plus de temps pour une réponse plus fouillée, et vous préviendra.':'Retour aux réponses rapides.')});
  var fb=$('#v-finir');
  function finOn(){finir=true;fb.classList.add('v-on');fb.setAttribute('aria-pressed','true');state('ecoute')}
  function finOff(){if(!finir)return;finir=false;fb.classList.remove('v-on');fb.setAttribute('aria-pressed','false');state('ecoute')}
  fb.addEventListener('pointerdown',function(e){e.preventDefault();finOn()});
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){fb.addEventListener(ev,finOff)});
  fb.addEventListener('click',function(){if(!finir){toast('Maintenez le bouton appuyé tant que vous parlez : '+E.n+' attendra.')}});
  $('#v-mic').addEventListener('click',function(){var on=this.classList.toggle('v-on');$('.v-ml',this).textContent=on?'Micro coupé':'Micro';
    $('.v-m1',this).hidden=on;$('.v-m2',this).hidden=!on;toast(on?E.n+' ne vous entend plus.':E.n+' vous entend à nouveau.')});
  $('#v-cc').addEventListener('click',function(){var on=this.classList.toggle('v-on');subs.hidden=!on});
  $('#v-hp').addEventListener('click',function(){var on=this.classList.toggle('v-on');toast(on?'Haut-parleur activé.':'Son dans l’écouteur.')});
  $('#v-retry').addEventListener('click',function(){$('#v-fail').hidden=true;run()});
  $('#v-write').addEventListener('click',function(){toast('Ouvre le topic de '+E.n+' dans Telegram.')});

  var h=location.hash.slice(1);
  function run(){
    subs.innerHTML='';tool('');$('#v-task').hidden=true;
    var seq=[['decroche',0],['ecoute',2600],['recherche',5200],['reponse',8000],['tache',11500]];
    seq.forEach(function(x){setTimeout(function(){subs.innerHTML='';tool('');$('#v-task').hidden=true;steps[x[0]]()},x[1])});
    setTimeout(function(){state('ecoute')},15500);
  }
  if(h==='injoignable'){steps.decroche();$('#v-fail').hidden=false;clearInterval(timer)}
  else if(h==='finir'){steps.ecoute();sec=74;finOn();say('u','… et pour le 33 cl, je voudrais aussi qu’on regarde ce que fait Prosuma, parce que');}
  else if(h==='longue'){steps.recherche();sec=96;$('#v-long').click();state('reflechit')}
  else if(steps[h]){steps[h]();sec={decroche:1,ecoute:9,recherche:21,reponse:38,tache:62}[h]}
  else run();
  $('#v-time').textContent=fmt(sec);
  $('.v-min').href='experts.html#encours';
}

/* Fin d'appel */
if(page==='fin'){
  var S2=E.s;$('#v-av').src=img(slug);$('#v-sub').textContent=E.n+', 6 min 12 s';
  var li=$$('.v-card ul li');S2[7].forEach(function(t,i){if(li[i])li[i].textContent=t});
  $('.v-task b').textContent=S2[5][0];$('.v-task small').textContent='En préparation. '+S2[5][1];
  $('.v-note span').textContent='Ce résumé est aussi dans le topic Telegram de '+E.n+' et dans '+'son'+' espace sur la plateforme Yelema. '+(E.f?'Elle':'Il')+' s’en souviendra au prochain appel.';
  $('#v-recall').href='appel.html?e='+slug;$('#v-recall span').textContent='Rappeler '+E.n;
}

/* Historique : filtre par Expert */
if(page==='historique'){
  $$('#v-chips button').forEach(function(b){b.addEventListener('click',function(){
    $$('#v-chips button').forEach(function(x){x.classList.toggle('v-on',x===b)});
    var f=b.getAttribute('data-f'),n=0;
    $$('.v-hi').forEach(function(a){var ok=f==='tous'||a.getAttribute('data-e')===f;a.hidden=!ok;if(ok)n++});
    $$('.v-grp').forEach(function(g){g.hidden=!$$('.v-hi',g).some(function(a){return !a.hidden})});
    $('#v-empty').hidden=n>0;
  })});
}

/* Détail d'un appel passé */
if(page==='detail'){
  var D={djeneba:['Aujourd’hui, 08:12, 3 min',null],fatima:Q.get('h')==='1018'?['Aujourd’hui, 10:18, 6 min','wait']:['Hier, 17:40, 4 min','ok'],
    koffi:['Vendredi 9 octobre, 16:30, 5 min','ok'],kouassi:['Hier, 11:05, 8 min','ok'],awa:['Jeudi 8 octobre, 09:40, 3 min','ok'],mamadou:['Vendredi 9 octobre, 09:10, 7 min','ok']}[slug];
  if(!(slug==='fatima'&&Q.get('h')!=='1018')){
    $('.v-endh img').src=img(slug);$('.v-endh h1').textContent=E.n;
    var lis=$$('.v-card ul li');E.s[7].forEach(function(t,i){if(lis[i])lis[i].textContent=t});
    var tb=$$('.v-card')[1];
    if(!D[1]){tb.hidden=true}
    else{$('.v-task b',tb).textContent=E.s[5][0];
      $('.v-task small',tb).innerHTML=D[1]==='ok'?'<span class="v-pill v-ok">Livré</span>':'<span class="v-pill v-wait">En préparation</span>'}
    $$('[data-toast]').forEach(function(b){b.setAttribute('data-toast',b.getAttribute('data-toast').replace(/Fatima/g,E.n))});
    $('.v-acts a').href='appel.html?e='+slug;$('.v-acts span').textContent='Rappeler '+E.n;
  }
  $('.v-endh small').textContent=D[0];
}

/* Réglages : choix segmentés et interrupteurs */
$$('.v-seg').forEach(function(g){$$('button',g).forEach(function(b){b.addEventListener('click',function(){
  $$('button',g).forEach(function(x){x.classList.toggle('v-on',x===b)});toast(b.textContent+' : enregistré.')})})});
$$('[data-tog]').forEach(function(r){r.addEventListener('click',function(){var t=$('.v-tog',r);var on=t.classList.toggle('v-on');toast((on?'Activé : ':'Désactivé : ')+$('b',r).textContent)})});
})();
