(function(){
'use strict';
var STORE='hpz-community-hpzfull-v1';
var TOPICS={benh:'Bệnh của cá',nuoc:'Chăm sóc nước',setup:'Set up bể mới',kythuat:'Kỹ thuật bể',ca:'Chọn & nuôi cá',hoidap:'Hỏi đáp chung'};
var currentTopic='all';
var $=function(id){return document.getElementById(id)};
/* Static surfaces; no canvas animation or scene asset loading. */
var staticStyle=document.createElement('style');staticStyle.id='hpz-static-theme';
staticStyle.textContent=`
:root{--hpz-navy-950:#08131F;--hpz-navy-900:#08131F;--hpz-navy-800:#122638;--hpz-text:#EAF2F8;--hpz-text-soft:#B6C6D4;--hpz-text-muted:#B6C6D4;--hpz-surface:#122638;--hpz-surface-2:#193448;--hpz-line:#294457;--hpz-cyan:#54C7E8;--hpz-cyan-2:#54C7E8;--hpz-shadow:none;--hpz-shadow-strong:none}
html,body,.hpz-app{background:#08131F!important;color:#EAF2F8}
#aquarium-bg,#aquarium-bg canvas{display:none!important}
.hpz-app::before{display:none!important;content:none}
.hpz-header,.hpz-footer,.hpz-bottom-nav{background:#08131F!important;border-color:#294457;box-shadow:none;backdrop-filter:none}
.hpz-card,.hpz-card--hero,.hpz-side,.hpz-modal,.hpz-more-nav__panel,.hpz-mobile-menu__panel{background:#122638!important;border-color:#294457;box-shadow:none;backdrop-filter:none}
.hpz-page-head{background:none}
.hpz-page-head p,.hpz-modal__subtitle,.hpz-side__section>summary{color:#B6C6D4}
.hpz-community-post__body,.hpz-community-comments__item p{color:#EAF2F8}
.hpz-community-post__author small,.hpz-community-comments__item small{color:#B6C6D4}
.hpz-community-comments__item{border-bottom-color:#294457}
.hpz-community-post__meta{flex-wrap:wrap;align-items:center}
.hpz-status{background:#193448;color:#B9EAF7;border-color:#35566C}
.hpz-side__item:hover,.hpz-side__item[aria-current="true"]{background:#193448}
.hpz-side__icon,.hpz-side__count{background:#193448}
.hpz-side__count{color:#B6C6D4}
.hpz-header__nav a:hover,.hpz-header__nav a.active,.hpz-account-link:hover,.hpz-icon-link:hover,.hpz-more-nav summary:hover,.hpz-mobile-menu summary:hover,.hpz-more-nav__panel a:hover,.hpz-mobile-menu__panel a:hover,.hpz-mobile-menu__panel a.active{background:#122638}
.hpz-brand__mark{background:#122638;border-color:#54C7E8;box-shadow:none}
.hpz-brand b{background:none;color:#EAF2F8;-webkit-background-clip:border-box;background-clip:border-box}
.hpz-btn--primary,.hpz-modal__mark{background:#54C7E8;color:#08131F!important;box-shadow:none}
.hpz-btn--secondary{background:#193448;border-color:#294457}
.hpz-field input,.hpz-field textarea,.hpz-field select,.hpz-field select option{background:#08131F;color:#EAF2F8;border-color:#294457}
.hpz-field>span{color:#B6C6D4}
.hpz-field input::placeholder,.hpz-field textarea::placeholder{color:#B6C6D4;opacity:.8}
.hpz-field input:focus,.hpz-field textarea:focus,.hpz-field select:focus{border-color:#54C7E8}
.hpz-empty{background:#122638;border-color:#294457}
.hpz-modal-backdrop{background:rgba(8,19,31,.85);backdrop-filter:none}
.hpz-bottom-nav a:active{background:#193448}
`;
document.head.appendChild(staticStyle);
var themeColor=document.querySelector('meta[name="theme-color"]');if(themeColor)themeColor.content='#08131F';
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
/* Keep legacy like keys/actions so saved votes remain intact. */
var ratingStyle=document.createElement('style');
ratingStyle.textContent='.hpz-community-post__meta button.hpz-rating,.hpz-community-comments__item button.hpz-rating{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;min-height:36px;border:1px solid rgba(255,212,90,.4);border-radius:999px;background:rgba(255,212,90,.06);color:#FFD45A!important;font-family:inherit;font-size:14px;font-weight:700;line-height:1.3;cursor:pointer}.hpz-community-post__meta button.hpz-rating:hover,.hpz-community-comments__item button.hpz-rating:hover{border-color:#FFD45A;background:rgba(255,212,90,.14)}.hpz-community-post__meta button.hpz-rating[aria-pressed="true"],.hpz-community-comments__item button.hpz-rating[aria-pressed="true"]{border-color:#FFD45A;background:rgba(255,212,90,.2);color:#FFE69A!important}.hpz-rating:focus-visible{outline:2px solid #FFD45A;outline-offset:3px}.hpz-rating__star{font-size:20px;line-height:1}.hpz-rating__count{font-variant-numeric:tabular-nums}.hpz-community-comments__item button.hpz-rating{margin-left:8px;min-height:32px;font-size:12px}.hpz-side__item[data-id="liked"] .hpz-side__icon{color:#FFD45A}';
document.head.appendChild(ratingStyle);
function ratingButton(id,selected,count,isComment){
  var target=isComment?'bình luận':'bài viết';
  var label=(selected?'Bỏ đánh giá cao ':'Đánh giá cao ')+target;
  return '<button type="button" class="hpz-rating" data-action="'+(isComment?'like-comment':'like')+'" data-id="'+esc(id)+'" aria-pressed="'+selected+'" aria-label="'+label+'; '+count+' lượt đánh giá cao" title="'+label+'"><span class="hpz-rating__star" aria-hidden="true">'+(selected?'★':'☆')+'</span><span>Đánh giá cao</span><b class="hpz-rating__count">'+count+'</b></button>'
}
function uid(prefix){return prefix+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function date(value){return new Date(value).toLocaleString('vi-VN')}
function topicOf(post){return TOPICS[post.topic]?post.topic:'hoidap'}
function commentsFor(postId){return state.comments.filter(function(item){return item.post===postId})}
function visiblePosts(){return state.posts.filter(function(post){if(currentTopic==='all')return true;if(currentTopic==='liked')return state.liked.indexOf(post.id)>-1;return topicOf(post)===currentTopic})}
function updateSidebar(){
  var ratedMenu=document.querySelector('.hpz-side__item[data-id="liked"]');
  if(ratedMenu){ratedMenu.querySelector('.hpz-side__icon').textContent='★';ratedMenu.querySelector('.hpz-side__label').textContent='Bài đã đánh giá cao';ratedMenu.title='Các bài viết bạn đã đánh giá cao'}
  var counts={all:state.posts.length,liked:state.posts.filter(function(p){return state.liked.indexOf(p.id)>-1}).length};
  Object.keys(TOPICS).forEach(function(key){counts[key]=0});
  state.posts.forEach(function(p){counts[topicOf(p)]++});
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'),function(el){var key=el.getAttribute('data-count');el.textContent=counts[key]||0});
  Array.prototype.forEach.call(document.querySelectorAll('[data-action="topic"]'),function(el){if(el.getAttribute('data-id')===currentTopic)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current')})
}
function commentItem(comment){
  var liked=state.likedComments.indexOf(comment.id)>-1,count=(comment.likes||0)+(liked?1:0);
  return '<div class="hpz-community-comments__item"><b>'+esc(comment.author)+'</b><p>'+esc(comment.body)+'</p><small>'+date(comment.t)+'</small> '+ratingButton(comment.id,liked,count,true)+'<button type="button" class="hpz-comment-delete" data-action="delete-comment" data-id="'+comment.id+'" aria-label="Xoá bình luận" title="Xoá bình luận" style="margin-left:8px;padding:2px 10px;min-height:28px;border:1px solid rgba(255,120,120,.5);border-radius:999px;background:rgba(255,80,80,.12);color:#ffb4b4;font-size:12px;cursor:pointer">Xoá</button></div>'
}
function postCard(post){
  var comments=commentsFor(post.id),liked=state.liked.indexOf(post.id)>-1,expanded=!!openComments[post.id];
  var html='<article class="hpz-card hpz-community-post" data-post="'+post.id+'"><div class="hpz-community-post__head"><div class="hpz-community-post__author"><b>'+esc(post.author)+'</b><small>'+date(post.t)+'</small></div><span class="hpz-status">'+esc(TOPICS[topicOf(post)])+'</span></div>';
  if(post.title)html+='<h2>'+esc(post.title)+'</h2>';
  html+='<div class="hpz-community-post__body">'+esc(post.body)+'</div><div class="hpz-community-post__meta">'+ratingButton(post.id,liked,(post.likes||0)+(liked?1:0),false)+'<button data-action="comments" data-id="'+post.id+'">Bình luận '+comments.length+'</button><button type="button" class="hpz-post-delete" data-action="delete-post" data-id="'+post.id+'" aria-label="Xoá bài viết" title="Xoá bài viết" style="margin-left:auto;padding:4px 12px;min-height:28px;border:1px solid rgba(255,120,120,.5);border-radius:999px;background:rgba(255,80,80,.12);color:#ffb4b4">Xoá bài</button></div>';
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
    var msg=state.posts.length?(currentTopic==='liked'?'Bạn chưa đánh giá cao bài viết nào':'Chưa có bài trong chủ đề này'):'Community chưa có bài public';
    var hint=state.posts.length?(currentTopic==='liked'?'Bấm ngôi sao ở bài viết để đánh giá cao nội dung hữu ích.':'Hãy là người đầu tiên chia sẻ trong mục này.'):'Anh có thể đăng bài đầu tiên bằng tài khoản đã liên kết customer_id.';
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
render();
})();
