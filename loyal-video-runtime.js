/* LOYAL TATTOO VIDEO RUNTIME v2.1 | GitHub | YouTube muted autoplay */
(function(w,d){'use strict';

if(!/^(www\.)?bavariancustomirons\.jp$/.test(location.hostname))return;

var KEY='__LOYAL_VIDEO_RUNTIME_V2__';

if(w[KEY]){
 w[KEY].scan();
 return;
}

var PAT=/^\[\[LOYAL-VIDEO:([A-Za-z0-9_-]{11})(?::(9x16|16x9))?\]\]$/i;

var PLAYLIST='https://youtube.com/playlist?list=PLHq8YFvjZORB06GA9e_aIoR_uSzr0Ist8&si=8xxrjI4hNxcRxSH_';

var apiPromise=null,serial=0,active=null;

var CSS=
'.lvr-widget{box-sizing:border-box;clear:both;max-width:760px;width:100%;margin:26px auto 36px;padding:16px 12px;background:#fff;border:1px solid #ddd;border-radius:15px;color:#171717;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;text-align:center}'+
'.lvr-widget *{box-sizing:border-box}'+

'.lvr-widget .lvr-title{display:block;width:100%;margin:0 auto 6px;padding:0;color:#171717;font-size:clamp(18px,4vw,26px);font-weight:800;line-height:1.45;letter-spacing:.01em;text-align:center!important;overflow-wrap:break-word}'+

'.lvr-widget .lvr-sub{display:block;width:100%;margin:0 auto 18px;padding:0;color:#777;font-size:clamp(10px,2.6vw,13px);font-weight:650;line-height:1.6;letter-spacing:.045em;text-align:center!important}'+

'.lvr-widget .lvr-stage{position:relative;width:100%;max-width:405px;aspect-ratio:9/16;background:#111;overflow:hidden;border-radius:9px;margin:0 auto}'+

'.lvr-widget .lvr-stage[data-ratio="16x9"]{max-width:680px;aspect-ratio:16/9}'+

'.lvr-widget .lvr-stage iframe{position:absolute;inset:0;width:100%;height:100%;display:block;border:0}'+

'.lvr-widget .lvr-cover{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;background-color:#171717;background-size:cover;background-position:center}'+

'.lvr-widget .lvr-play{width:80px;height:80px;border:2px solid #fff;border-radius:50%;background:rgba(0,0,0,.35);color:#fff;font:32px Arial,sans-serif;cursor:pointer}'+

'.lvr-widget .lvr-message{max-width:405px;margin:12px auto 0;color:#666;font-size:12px;line-height:1.6;text-align:center!important}'+

'.lvr-widget .lvr-message[hidden]{display:none!important}'+

'.lvr-widget .lvr-actions{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;width:100%;max-width:405px;margin:14px auto 0}'+

'.lvr-widget .lvr-sound{display:flex;align-items:center;justify-content:center;width:100%;min-height:44px;padding:10px 15px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#222;font:700 13px Arial,sans-serif;text-align:center!important;cursor:pointer}'+

'.lvr-widget .lvr-sound:disabled{opacity:.45;cursor:default}'+

'.lvr-widget .lvr-link{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;margin:0;padding:11px 12px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#191919!important;text-decoration:none!important;font-size:clamp(12px,2.8vw,14px);font-weight:700;line-height:1.55;text-align:center!important;overflow-wrap:break-word}'+

'.lvr-widget .lvr-sound:hover,.lvr-widget .lvr-link:hover{background:#f7f7f7}'+

'.lvr-widget a:focus-visible,.lvr-widget button:focus-visible{outline:3px solid #777;outline-offset:3px}'+

'@media(max-width:480px){.lvr-widget{padding:11px 8px;margin:22px auto 30px}.lvr-widget .lvr-play{width:70px;height:70px}.lvr-widget .lvr-actions{gap:9px}.lvr-widget .lvr-title{font-size:clamp(18px,4.4vw,23px)}}';

function el(t,c,s){
 var n=d.createElement(t);
 if(c)n.className=c;
 if(s!==undefined)n.textContent=s;
 return n;
}

function add(p,n){
 p.appendChild(n);
 return n;
}

function css(){
 if(d.getElementById('lvr-style-v2'))return;

 var x=el('style');
 x.id='lvr-style-v2';
 x.textContent=CSS;

 add(d.head||d.documentElement,x);
}

function api(){
 if(w.YT&&typeof w.YT.Player==='function'){
  return Promise.resolve(w.YT);
 }

 if(apiPromise)return apiPromise;

 apiPromise=new Promise(function(ok,bad){
  var s=d.querySelector('script[src="https://www.youtube.com/iframe_api"]');

  if(!s){
   s=el('script');
   s.src='https://www.youtube.com/iframe_api';
   s.async=true;
   add(d.head||d.body,s);
  }

  var n=0;

  var t=setInterval(function(){
   if(w.YT&&typeof w.YT.Player==='function'){
    clearInterval(t);
    ok(w.YT);
   }else if(++n>75){
    clearInterval(t);
    bad(new Error('YouTube API timeout'));
   }
  },200);
 });

 return apiPromise;
}

function render(m,id,ratio){
 if(
  !m||
  m.dataset.lvrReady==='1'||
  !/^[A-Za-z0-9_-]{11}$/.test(id)
 )return;

 m.dataset.lvrReady='1';

 css();

 ratio=ratio==='16x9'?'16x9':'9x16';

 var root=add(m,el('section','lvr-widget'));

 root.setAttribute(
  'aria-label',
  'LOYAL TATTOO YouTube 動画作品'
 );

 add(
  root,
  el('h2','lvr-title','LOYAL TATTOO Tattoo art YouTube')
 );

 add(
  root,
  el('p','lvr-sub','LT+LTM OFFICIAL TATTOO VIDEO')
 );

 var stage=add(root,el('div','lvr-stage'));

 stage.dataset.ratio=ratio;

 var cover=add(stage,el('div','lvr-cover'));

 cover.style.backgroundImage=
  'url("https://i.ytimg.com/vi/'+id+'/hqdefault.jpg")';

 var button=add(
  cover,
  el('button','lvr-play','▶')
 );

 button.type='button';

 button.setAttribute(
  'aria-label',
  '動画を再生'
 );

 var note=add(
  root,
  el('p','lvr-message','')
 );

 note.hidden=true;

 note.setAttribute(
  'aria-live',
  'polite'
 );

 var actions=add(
  root,
  el('div','lvr-actions')
 );

 var sound=add(
  actions,
  el('button','lvr-sound','音声をオンにする')
 );

 sound.type='button';
 sound.disabled=true;

 var link=add(
  actions,
  el(
   'a',
   'lvr-link',
   'LOYAL TATTOO Tattoo art YouTube List を開く'
  )
 );

 link.href=PLAYLIST;
 link.target='_blank';
 link.rel='noopener noreferrer';

 link.setAttribute(
  'aria-label',
  'LOYAL TATTOO YouTube映像作品再生リストを開く'
 );

 var iframe=null;
 var player=null;
 var ready=false;
 var visible=false;
 var manual=false;
 var muted=true;

 var mine={
  pause:function(){
   if(ready&&player){
    try{
     player.pauseVideo();
    }catch(e){}
   }
  }
 };

 function message(s){
  note.textContent=s||'';
  note.hidden=!s;
 }

 function want(){
  return (visible||manual)&&!d.hidden;
 }

 function sync(){
  if(!ready||!player)return;

  try{
   if(want()){
    if(active&&active!==mine){
     active.pause();
    }

    active=mine;
    player.playVideo();

   }else{
    player.pauseVideo();
   }
  }catch(e){}
 }

 function attachAPI(){
  api().then(function(){
   if(player||!iframe)return;

   try{
    player=new w.YT.Player(iframe,{
     events:{

      onReady:function(ev){
       ready=true;

       try{
        ev.target.mute();
       }catch(e){}

       sound.disabled=false;
       cover.style.display='none';

       message('');

       sync();
      },

      onStateChange:function(ev){

       if(ev.data===1){
        message('');

        if(!want()){
         mine.pause();
        }
       }

       if(ev.data===0&&want()){
        try{
         ev.target.seekTo(0,true);
         ev.target.playVideo();
        }catch(e){}
       }
      },

      onAutoplayBlocked:function(){
       cover.style.display='none';

       message(
        'このブラウザでは自動再生が制限されています。動画内の再生ボタンをご利用いただけます。'
       );
      },

      onError:function(){
       message(
        '埋め込み動画を再生できません。YouTubeの再生リストから視聴できます。'
       );
      }
     }
    });

   }catch(e){
    message(
     '動画APIの初期化に失敗しました。YouTubeの再生リストをご利用いただけます。'
    );
   }

  }).catch(function(){
   message(
    'YouTube APIの読み込みが制限されました。YouTubeの再生リストをご利用いただけます。'
   );
  });
 }

 function load(){
  if(iframe){
   sync();
   return;
  }

  iframe=el('iframe');

  iframe.id='loyal-video-player-'+(++serial);

  iframe.title='LOYAL TATTOO YouTube 動画';

  iframe.setAttribute(
   'allow',
   'autoplay; encrypted-media; picture-in-picture; fullscreen'
  );

  iframe.setAttribute('allowfullscreen','');

  iframe.referrerPolicy='strict-origin-when-cross-origin';

  iframe.loading='eager';

  iframe.addEventListener('load',function(){
   cover.style.display='none';
  },{once:true});

  var params=
   '?enablejsapi=1&autoplay=1&mute=1&playsinline=1&controls=1&rel=0&loop=1&playlist='+
   encodeURIComponent(id)+
   '&origin='+
   encodeURIComponent(location.origin);

  iframe.src=
   'https://www.youtube-nocookie.com/embed/'+id+params;

  stage.insertBefore(iframe,cover);

  message('');

  attachAPI();
 }

 button.addEventListener('click',function(){
  manual=true;
  load();

  if(ready){
   sync();
  }
 });

 sound.addEventListener('click',function(){
  if(!ready||!player)return;

  try{
   if(player.isMuted()){
    player.unMute();
    player.setVolume(70);
    muted=false;

   }else{
    player.mute();
    muted=true;
   }

   sound.textContent=muted?
    '音声をオンにする':
    '音声をオフにする';

  }catch(e){}
 });

 d.addEventListener(
  'visibilitychange',
  sync
 );

 if('IntersectionObserver'in w){

  var observer=new IntersectionObserver(function(es){
   es.forEach(function(e){
    if(e.target!==stage)return;

    var next=
     e.isIntersecting&&
     e.intersectionRatio>=0.45;

    if(visible===next)return;

    visible=next;

    if(visible){
     load();

    }else{
     manual=false;
     sync();
    }
   });
  },{
   threshold:[0,0.45,0.75]
  });

  observer.observe(stage);

 }else{
  visible=true;
  load();
 }
}

function scan(){
 if(!/^\/blog\//.test(location.pathname))return;

 var body=d.querySelector('.blog_body');

 if(!body)return;

 var nodes=body.querySelectorAll(
  'p,h3,h4,li,div'
 );

 for(var i=0;i<nodes.length;i++){
  var n=nodes[i];

  if(
   !n.parentNode||
   (n.closest&&n.closest('.lvr-widget'))||
   n.querySelector(
    'iframe,video,img,script,.loyal-video-mount'
   )
  )continue;

  var m=(n.textContent||'').trim().match(PAT);

  if(!m)continue;

  var h=el('div','loyal-video-mount');

  h.dataset.video=m[1];
  h.dataset.ratio=m[2]||'9x16';

  n.parentNode.replaceChild(h,n);
 }

 var mounts=d.querySelectorAll(
  '.loyal-video-mount,#loyal-scar-shorts-mount,[data-loyal-video]'
 );

 for(var j=0;j<mounts.length;j++){
  var holder=mounts[j];

  render(
   holder,
   holder.dataset.video||
    holder.getAttribute('data-loyal-video')||
    '-M8B3dFWKjQ',
   holder.dataset.ratio||'9x16'
  );
 }
}

w[KEY]={scan:scan};

if(d.readyState==='loading'){
 d.addEventListener(
  'DOMContentLoaded',
  scan,
  {once:true}
 );

}else{
 scan();
}

})(window,document);
