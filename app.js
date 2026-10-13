(function(){
'use strict';
var STORE='hpz-community-hpzfull-v1';
var ASSET='https://raw.githubusercontent.com/duyfelix1205-cell/hpzfull/main/frontend/public/assets/hpz/scene/';
var TOPICS={benh:'Bệnh của cá',nuoc:'Chăm sóc nước',setup:'Set up bể mới',kythuat:'Kỹ thuật bể',ca:'Chọn & nuôi cá',hoidap:'Hỏi đáp chung'};
var currentTopic='all';
var $=function(id){return document.getElementById(id)};
function ago(minutes){return Date.now()-minutes*60000}
function seed(){return{me:'ban_doc',posts:[
  {id:'p1',topic:'setup',author:'Minh Thủy',title:'Bể 60cm đầu tiên: nên chọn layout nào cho người mới?',body:'Mình chuẩn bị setup bể 60x30x36, có sẵn vài viên đá seiryu và một cây lũa nhỏ. Mọi người cho mình xin ý kiến nên chọn layout tam giác hay đảo?',likes:47,t:ago(95)},
  {id:'p2',topic:'ca',author:'HPZ Staff',title:'Checklist đón betta mới về: 7 bước trong 24 giờ đầu',body:'1. Chuẩn bị bể cách ly 10–15 lít.\n2. Giữ nhiệt độ ổn định 26–28°C.\n3. Hòa nước từ từ 30–45 phút.\n4. Quan sát vây, mang và phản xạ.\n5. Ghi lại ngày nhập để theo dõi.',likes:132,t:ago(600)},
  {id:'p3',topic:'benh',author:'Anh Khoa',title:'Cá neon bơi lờ đờ, thân có đốm trắng nhỏ',body:'Bể 40 lít, 12 con neon, mới thêm cá hôm kia mà không cách ly. Hôm nay 3 con có đốm trắng li ti. Mình nên nâng nhiệt hay dùng thuốc ngay?',likes:21,t:ago(40)},
  {id:'p4',topic:'nuoc',author:'HPZ Staff',title:'Thay nước định kỳ: nên thay bao nhiêu mỗi lần?',body:'Với bể đã ổn định, nhiều người thay khoảng 20–30% nước mỗi tuần. Nước mới nên xử lý khử clo và chênh nhiệt độ không quá 1–2°C so với nước trong bể. Mọi người đang thay nước theo lịch nào?',likes:35,t:ago(300)},
  {id:'p5',topic:'kythuat',author:'Quang Huy',title:'Lọc thùng hay lọc tràn cho bể 80cm?',body:'Mình sắp nuôi bể 80x40x45 trồng thủy sinh nhẹ. Lọc thùng dễ bảo trì nhưng lọc tràn gọn bể hơn. Anh em có kinh nghiệm cho mình xin lời khuyên về độ ồn và chi phí với.',likes:18,t:ago(200)}
],comments:[
  {id:'c1',post:'p1',author:'HPZ Staff',body:'Bể 60cm mới chơi nên chọn layout đảo hoặc tam giác nhẹ. Nhớ chừa vùng nền trống để cây tiền cảnh lan.',likes:12,t:ago(80)},
  {id:'c2',post:'p1',author:'Minh Thủy',body:'Cảm ơn anh! Mình sẽ thử layout tam giác lệch trái.',likes:3,t:ago(70)},
  {id:'c3',post:'p3',author:'Bích Ngọc',body:'Có vẻ là bệnh đốm trắng. Nên cách ly ngay và dùng thuốc chuyên dụng đúng liều.',likes:8,t:ago(30)}
],liked:[],likedComments:[]}}
function load(){try{var value=JSON.parse(localStorage.getItem(STORE));if(value&&value.posts&&value.comments){if(!Array.isArray(value.liked))value.liked=[];if(!Array.isArray(value.likedComments))value.likedComments=[];return value}}catch(e){}return seed()}
var state=load();var openComments={};
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){}}
function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(prefix){return prefix+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function date(value){return new Date(value).toLocaleString('vi-VN')}
function topicOf(post){return TOPICS[post.topic]?post.topic:'hoidap'}
function commentsFor(postId){return state.comments.filter(function(item){return item.post===postId})}
function visiblePosts(){return state.posts.filter(function(post){if(currentTopic==='all')return true;if(currentTopic==='liked')return state.liked.indexOf(post.id)>-1;return topicOf(post)===currentTopic})}
function updateSidebar(){
  var counts={all:state.posts.length,liked:state.posts.filter(function(p){return state.liked.indexOf(p.id)>-1}).length};
  Object.keys(TOPICS).forEach(function(key){counts[key]=0});
  state.posts.forEach(function(p){counts[topicOf(p)]++});
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'),function(el){var key=el.getAttribute('data-count');el.textContent=counts[key]||0});
  Array.prototype.forEach.call(document.querySelectorAll('[data-action="topic"]'),function(el){if(el.getAttribute('data-id')===currentTopic)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current')})
}
function commentItem(comment){
  var liked=state.likedComments.indexOf(comment.id)>-1,count=(comment.likes||0)+(liked?1:0);
  return '<div class="hpz-community-comments__item"><b>'+esc(comment.author)+'</b><p>'+esc(comment.body)+'</p><small>'+date(comment.t)+'</small> <button type="button" class="hpz-comment-like" data-action="like-comment" data-id="'+comment.id+'" aria-pressed="'+liked+'" aria-label="'+(liked?'Bỏ thích bình luận':'Thích bình luận')+'" style="margin-left:8px;padding:2px 10px;min-height:28px;border:1px solid '+(liked?'rgba(255,107,129,.8)':'rgba(255,255,255,.28)')+';border-radius:999px;background:'+(liked?'rgba(255,107,129,.18)':'transparent')+';color:'+(liked?'#ff8da1':'inherit')+';font-size:12px;cursor:pointer">'+(liked?'♥':'♡')+' '+count+'</button><button type="button" class="hpz-comment-delete" data-action="delete-comment" data-id="'+comment.id+'" aria-label="Xoá bình luận" title="Xoá bình luận" style="margin-left:8px;padding:2px 10px;min-height:28px;border:1px solid rgba(255,120,120,.5);border-radius:999px;background:rgba(255,80,80,.12);color:#ffb4b4;font-size:12px;cursor:pointer">Xoá</button></div>'
}
function postCard(post){
  var comments=commentsFor(post.id),liked=state.liked.indexOf(post.id)>-1,expanded=!!openComments[post.id];
  var html='<article class="hpz-card hpz-community-post" data-post="'+post.id+'"><div class="hpz-community-post__head"><div class="hpz-community-post__author"><b>'+esc(post.author)+'</b><small>'+date(post.t)+'</small></div><span class="hpz-status">'+esc(TOPICS[topicOf(post)])+'</span></div>';
  if(post.title)html+='<h2>'+esc(post.title)+'</h2>';
  html+='<div class="hpz-community-post__body">'+esc(post.body)+'</div><div class="hpz-community-post__meta"><button data-action="like" data-id="'+post.id+'" aria-pressed="'+liked+'">'+(liked?'♥':'♡')+' '+(post.likes+(liked?1:0))+'</button><button data-action="comments" data-id="'+post.id+'">Bình luận '+comments.length+'</button><button type="button" class="hpz-post-delete" data-action="delete-post" data-id="'+post.id+'" aria-label="Xoá bài viết" title="Xoá bài viết" style="margin-left:auto;padding:4px 12px;min-height:28px;border:1px solid rgba(255,120,120,.5);border-radius:999px;background:rgba(255,80,80,.12);color:#ffb4b4">Xoá bài</button></div>';
  if(expanded){html+='<div class="hpz-community-comments">';
    if(comments.length)comments.forEach(function(comment){html+=commentItem(comment)});
    else html+='<div class="hpz-empty"><b>Chưa có bình luận</b></div>';
    html+='<form data-comment="'+post.id+'"><label class="hpz-field"><span>Bình luận</span><textarea name="body" maxlength="1200" placeholder="Viết phản hồi…" required></textarea></label><button class="hpz-btn hpz-btn--primary">Gửi bình luận</button></form></div>';
  }
  return html+'</article>'
}
function render(){
  var feed=$('community-feed'),list=visiblePosts();updateSidebar();
  if(!list.length){
    var msg=state.posts.length?(currentTopic==='liked'?'Bạn chưa thích bài viết nào':'Chưa có bài trong chủ đề này'):'Community chưa có bài public';
    var hint=state.posts.length?'Hãy là người đầu tiên chia sẻ trong mục này.':'Anh có thể đăng bài đầu tiên bằng tài khoản đã liên kết customer_id.';
    feed.innerHTML='<section class="hpz-card"><div class="hpz-empty"><b>'+msg+'</b><p>'+hint+'</p></div></section>';return
  }
  feed.innerHTML=list.slice().sort(function(a,b){return b.t-a.t}).map(postCard).join('')
}
function modal(open){$('composer-backdrop').hidden=!open;document.body.style.overflow=open?'hidden':'';if(open){var select=$('composer-form').elements.topic;if(select)select.value=TOPICS[currentTopic]?currentTopic:'hoidap';setTimeout(function(){var input=$('composer-form').querySelector('input');if(input)input.focus()},0)}}
function deletePost(id){
  var removed=commentsFor(id).map(function(item){return item.id});
  state.posts=state.posts.filter(function(item){return item.id!==id});
  state.comments=state.comments.filter(function(item){return item.post!==id});
  state.liked=state.liked.filter(function(pid){return pid!==id});
  state.likedComments=state.likedComments.filter(function(cid){return removed.indexOf(cid)===-1});
  delete openComments[id];save();render()
}
document.addEventListener('click',function(event){
  var action=event.target.closest('[data-action]');
  if(action){var id=action.getAttribute('data-id'),type=action.getAttribute('data-action');if(type==='topic'){currentTopic=id;render();return}
    if(type==='like'){var pos=state.liked.indexOf(id);if(pos>-1)state.liked.splice(pos,1);else state.liked.push(id);save();render()}else if(type==='like-comment'){var cpos=state.likedComments.indexOf(id);if(cpos>-1)state.likedComments.splice(cpos,1);else state.likedComments.push(id);save();render()}else if(type==='comments'){openComments[id]=!openComments[id];render()}else if(type==='delete-comment'){if(window.confirm('Xoá bình luận này?')){state.comments=state.comments.filter(function(item){return item.id!==id});state.likedComments=state.likedComments.filter(function(cid){return cid!==id});save();render()}}else if(type==='delete-post'){if(window.confirm('Xoá bài viết này cùng toàn bộ bình luận?'))deletePost(id)}return}
  if(event.target.closest('a[href="#"]'))event.preventDefault();
});
document.addEventListener('submit',function(event){
  var form=event.target;if(form.id==='composer-form'){event.preventDefault();var title=form.elements.title.value.trim(),body=form.elements.body.value.trim(),topic=TOPICS[form.elements.topic.value]?form.elements.topic.value:'hoidap';if(!body)return;state.posts.unshift({id:uid('p'),topic:topic,author:'Bạn đọc HPZ',title:title,body:body,likes:0,t:Date.now()});if(currentTopic!=='all'&&currentTopic!==topic)currentTopic=topic;save();form.reset();modal(false);render();return}
  var postId=form.getAttribute('data-comment');if(postId){event.preventDefault();var text=form.elements.body.value.trim();if(!text)return;state.comments.push({id:uid('c'),post:postId,author:'Bạn đọc HPZ',body:text,likes:0,t:Date.now()});save();openComments[postId]=true;render()}
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
