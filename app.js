(function(){
'use strict';
var STORE='hpz-community-hpzfull-v1';
var ASSET='https://raw.githubusercontent.com/duyfelix1205-cell/hpzfull/main/frontend/public/assets/hpz/scene/';
var $=function(id){return document.getElementById(id)};
function ago(minutes){return Date.now()-minutes*60000}
function seed(){return{me:'ban_doc',posts:[
  {id:'p1',author:'Minh Thủy',title:'Bể 60cm đầu tiên: nên chọn layout nào cho người mới?',body:'Mình chuẩn bị setup bể 60x30x36, có sẵn vài viên đá seiryu và một cây lũa nhỏ. Mọi người cho mình xin ý kiến nên chọn layout tam giác hay đảo?',likes:47,t:ago(95)},
  {id:'p2',author:'HPZ Staff',title:'Checklist đón betta mới về: 7 bước trong 24 giờ đầu',body:'1. Chuẩn bị bể cách ly 10–15 lít.\n2. Giữ nhiệt độ ổn định 26–28°C.\n3. Hòa nước từ từ 30–45 phút.\n4. Quan sát vây, mang và phản xạ.\n5. Ghi lại ngày nhập để theo dõi.',likes:132,t:ago(600)},
  {id:'p3',author:'Anh Khoa',title:'Cá neon bơi lờ đờ, thân có đốm trắng nhỏ',body:'Bể 40 lít, 12 con neon, mới thêm cá hôm kia mà không cách ly. Hôm nay 3 con có đốm trắng li ti. Mình nên nâng nhiệt hay dùng thuốc ngay?',likes:21,t:ago(40)}
],comments:[
  {id:'c1',post:'p1',author:'HPZ Staff',body:'Bể 60cm mới chơi nên chọn layout đảo hoặc tam giác nhẹ. Nhớ chừa vùng nền trống để cây tiền cảnh lan.',t:ago(80)},
  {id:'c2',post:'p1',author:'Minh Thủy',body:'Cảm ơn anh! Mình sẽ thử layout tam giác lệch trái.',t:ago(70)},
  {id:'c3',post:'p3',author:'Bích Ngọc',body:'Có vẻ là bệnh đốm trắng. Nên cách ly ngay và dùng thuốc chuyên dụng đúng liều.',t:ago(30)}
],liked:[]}}
function load(){try{var value=JSON.parse(localStorage.getItem(STORE));if(value&&value.posts&&value.comments)return value}catch(e){}return seed()}
var state=load();var openComments={};
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){}}
function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(prefix){return prefix+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function date(value){return new Date(value).toLocaleString('vi-VN')}
function commentsFor(postId){return state.comments.filter(function(item){return item.post===postId})}
function postCard(post){
  var comments=commentsFor(post.id),liked=state.liked.indexOf(post.id)>-1,expanded=!!openComments[post.id];
  var html='<article class="hpz-card hpz-community-post" data-post="'+post.id+'"><div class="hpz-community-post__head"><div class="hpz-community-post__author"><b>'+esc(post.author)+'</b><small>'+date(post.t)+'</small></div><span class="hpz-status">Cộng đồng</span></div>';
  if(post.title)html+='<h2>'+esc(post.title)+'</h2>';
  html+='<div class="hpz-community-post__body">'+esc(post.body)+'</div><div class="hpz-community-post__meta"><button data-action="like" data-id="'+post.id+'" aria-pressed="'+liked+'">'+(liked?'♥':'♡')+' '+(post.likes+(liked?1:0))+'</button><button data-action="comments" data-id="'+post.id+'">Bình luận '+comments.length+'</button></div>';
  if(expanded){html+='<div class="hpz-community-comments">';
    if(comments.length)comments.forEach(function(comment){html+='<div class="hpz-community-comments__item"><b>'+esc(comment.author)+'</b><p>'+esc(comment.body)+'</p><small>'+date(comment.t)+'</small></div>'});
    else html+='<div class="hpz-empty"><b>Chưa có bình luận</b></div>';
    html+='<form data-comment="'+post.id+'"><label class="hpz-field"><span>Bình luận</span><textarea name="body" maxlength="1200" placeholder="Viết phản hồi…" required></textarea></label><button class="hpz-btn hpz-btn--primary">Gửi bình luận</button></form></div>';
  }
  return html+'</article>'
}
function render(){var feed=$('community-feed');if(!state.posts.length){feed.innerHTML='<section class="hpz-card"><div class="hpz-empty"><b>Community chưa có bài public</b><p>Anh có thể đăng bài đầu tiên bằng tài khoản đã liên kết customer_id.</p></div></section>';return}feed.innerHTML=state.posts.slice().sort(function(a,b){return b.t-a.t}).map(postCard).join('')}
function modal(open){$('composer-backdrop').hidden=!open;document.body.style.overflow=open?'hidden':'';if(open)setTimeout(function(){var input=$('composer-form').querySelector('input');if(input)input.focus()},0)}
document.addEventListener('click',function(event){
  var action=event.target.closest('[data-action]');
  if(action){var id=action.getAttribute('data-id'),type=action.getAttribute('data-action');if(type==='like'){var pos=state.liked.indexOf(id);if(pos>-1)state.liked.splice(pos,1);else state.liked.push(id);save();render()}else if(type==='comments'){openComments[id]=!openComments[id];render()}return}
  if(event.target.closest('a[href="#"]'))event.preventDefault();
});
document.addEventListener('submit',function(event){
  var form=event.target;if(form.id==='composer-form'){event.preventDefault();var title=form.elements.title.value.trim(),body=form.elements.body.value.trim();if(!body)return;state.posts.unshift({id:uid('p'),author:'Bạn đọc HPZ',title:title,body:body,likes:0,t:Date.now()});save();form.reset();modal(false);render();return}
  var postId=form.getAttribute('data-comment');if(postId){event.preventDefault();var text=form.elements.body.value.trim();if(!text)return;state.comments.push({id:uid('c'),post:postId,author:'Bạn đọc HPZ',body:text,t:Date.now()});save();openComments[postId]=true;render()}
});
$('open-composer').addEventListener('click',function(){modal(true)});$('close-composer').addEventListener('click',function(){modal(false)});$('cancel-composer').addEventListener('click',function(){modal(false)});$('composer-backdrop').addEventListener('click',function(event){if(event.target===this)modal(false)});document.addEventListener('keydown',function(event){if(event.key==='Escape')modal(false)});

function aquarium(){
  var host=$('aquarium-bg'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=innerWidth<760||/Mobi|Android/i.test(navigator.userAgent),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');host.appendChild(canvas);
  var names=['fish_blue','fish_brown','fish_green','fish_grey','fish_grey_long_a','fish_grey_long_b','fish_orange','fish_pink','fish_red'],bubbleNames=['bubble_a','bubble_b','bubble_c'],images={},W=0,H=0,dpr=1,last=performance.now(),start=last,raf=0;
  names.concat(bubbleNames).forEach(function(name){var image=new Image();image.crossOrigin='anonymous';image.src=ASSET+name+'.png';images[name]=image});
  function rand(a,b){return a+Math.random()*(b-a)}function pick(list){return list[Math.floor(Math.random()*list.length)]}
  var fish=Array.from({length:mobile?8:15},function(){return{name:pick(names),x:rand(-200,innerWidth+200),y:rand(.08,.88),dir:Math.random()<.5?1:-1,depth:rand(.25,1),phase:rand(0,Math.PI*2),speed:rand(22,72),bob:rand(5,13)}}),bubbles=Array.from({length:mobile?18:38},function(){return{name:pick(bubbleNames),x:Math.random(),y:Math.random(),speed:rand(14,52),size:rand(9,25),phase:rand(0,6.28)}}),dust=Array.from({length:mobile?40:95},function(){return{x:Math.random(),y:Math.random(),r:rand(.5,1.8),a:rand(.06,.25),s:rand(2,8),p:rand(0,6.28)}}),rays=Array.from({length:mobile?4:8},function(){return{x:Math.random(),w:rand(65,180),a:rand(.025,.075),p:rand(0,6.28)}});
  function resize(){dpr=Math.min(devicePixelRatio||1,mobile?1.4:2);W=innerWidth;H=innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  function sprite(name,x,y,w,h,flip,alpha,rotation){var image=images[name];if(!image||!image.complete||!image.naturalWidth)return;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation||0);ctx.scale(flip?-1:1,1);ctx.drawImage(image,-w/2,-h/2,w,h);ctx.restore()}
  function frame(now){var dt=Math.min(.05,(now-last)/1000)||.016,elapsed=(now-start)/1000;last=now;var depth=Math.min(1,scrollY/Math.max(900,document.documentElement.scrollHeight-innerHeight));var gradient=ctx.createLinearGradient(0,0,0,H);gradient.addColorStop(0,'rgb('+(16-9*depth|0)+','+(80-50*depth|0)+','+(126-76*depth|0)+')');gradient.addColorStop(.46,'rgb('+(11-5*depth|0)+','+(63-31*depth|0)+','+(102-50*depth|0)+')');gradient.addColorStop(1,'rgb('+(5-2*depth|0)+','+(37-20*depth|0)+','+(61-28*depth|0)+')');ctx.fillStyle=gradient;ctx.fillRect(0,0,W,H);
    ctx.save();ctx.globalCompositeOperation='lighter';rays.forEach(function(ray){var x=ray.x*W+Math.sin(elapsed*.11+ray.p)*45,g=ctx.createLinearGradient(x,0,x+ray.w*.35,H*.72);g.addColorStop(0,'rgba(180,235,255,'+(ray.a*(1-depth*.65))+')');g.addColorStop(1,'rgba(100,190,230,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-ray.w/2,0);ctx.lineTo(x+ray.w/2,0);ctx.lineTo(x+ray.w*.78,H*.72);ctx.lineTo(x-ray.w*.22,H*.72);ctx.closePath();ctx.fill()});ctx.restore();
    dust.forEach(function(item){item.y-=item.s*dt/H;if(item.y<0)item.y=1;ctx.fillStyle='rgba(210,240,250,'+item.a+')';ctx.beginPath();ctx.arc(item.x*W+Math.sin(elapsed*.18+item.p)*7,item.y*H-scrollY*.015,item.r,0,Math.PI*2);ctx.fill()});bubbles.forEach(function(item){item.y-=item.speed*dt/H;if(item.y<-.08){item.y=1.05;item.x=Math.random()}sprite(item.name,item.x*W+Math.sin(elapsed*.7+item.phase)*10,item.y*H,item.size,item.size,false,.48,0)});fish.forEach(function(item){item.x+=item.speed*item.dir*dt;if(item.dir>0&&item.x>W+170)item.x=-170;if(item.dir<0&&item.x<-170)item.x=W+170;var y=item.y*H+Math.sin(elapsed*(.7+item.depth)+item.phase)*item.bob-scrollY*(.01+.035*item.depth),w=(55+105*item.depth)*(mobile?.76:1);sprite(item.name,item.x,y,w,w*.56,item.dir<0,.36+.55*item.depth,Math.sin(elapsed*5+item.phase)*.025)});raf=requestAnimationFrame(frame)}
  resize();addEventListener('resize',resize);raf=requestAnimationFrame(frame);if(reduce)canvas.style.opacity='.92'
}
render();aquarium();
})();
