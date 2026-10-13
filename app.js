(function(){
'use strict';
var STORE='hpz-community-reddit-v1';
var FLAIRS=['Thảo luận','Hướng dẫn','Cần tư vấn','Nhật ký bể'];
var $=function(id){return document.getElementById(id)};

function ago(m){return Date.now()-m*60000}
function seed(){
  return{
    communities:[
      {slug:'Aquascape',title:'Aquascape',desc:'Thiết kế bể thủy sinh: layout, đá, lũa, rêu và ánh sáng.',members:1280},
      {slug:'Betta',title:'Betta',desc:'Nuôi, phối giống và chăm sóc cá betta.',members:2140},
      {slug:'SucKhoeCa',title:'Sức khỏe cá',desc:'Bệnh cá, thuốc, cách ly và xử lý nước.',members:960},
      {slug:'NuocVaLoc',title:'Nước và lọc',desc:'Chu trình nitrat, thay nước, hệ lọc và thiết bị.',members:730},
      {slug:'ChoMuaBan',title:'Chợ HPZ',desc:'Chia sẻ nguồn cá, phụ kiện, kinh nghiệm mua bán an toàn.',members:540}
    ],
    posts:[
      {id:'p1',c:'Aquascape',author:'minhthuy',title:'Bể 60cm đầu tiên: nên chọn layout nào cho người mới?',body:'Mình chuẩn bị setup bể 60x30x36, có sẵn vài viên đá seiryu và một cây lũa nhỏ. Mọi người cho mình xin ý kiến nên chọn layout tam giác hay đảo? Ngân sách cây thủy sinh khoảng 1 triệu.',flair:'Cần tư vấn',score:47,t:ago(95)},
      {id:'p2',c:'Betta',author:'hpz_staff',title:'Checklist đón betta mới về: 7 bước trong 24 giờ đầu',body:'1. Chuẩn bị bể cách ly 10-15 lít.\n2. Nhiệt độ ổn định 26-28 độ C.\n3. Hòa nước từ từ 30-45 phút.\n4. Không cho ăn trong vài giờ đầu.\n5. Quan sát vây, mang và phản xạ.\n6. Thay nước nhẹ ngày thứ 2.\n7. Ghi lại ngày nhập để theo dõi.',flair:'Hướng dẫn',score:132,t:ago(600)},
      {id:'p3',c:'SucKhoeCa',author:'anhkhoa',title:'Cá neon bơi lờ đờ, thân có đốm trắng nhỏ, xử lý thế nào?',body:'Bể 40 lít, 12 con neon, mới thêm cá hôm kia mà không cách ly. Hôm nay 3 con có đốm trắng li ti. Mình nên nâng nhiệt hay dùng thuốc ngay?',flair:'Cần tư vấn',score:21,t:ago(40)},
      {id:'p4',c:'NuocVaLoc',author:'bichngoc',title:'Nhật ký chu trình nitrat sau 21 ngày',body:'Ngày 1-7: amoniac cao. Ngày 8-14: nitrit bắt đầu lên. Ngày 15-21: nitrat xuất hiện, nitrit về 0. Mình dùng vi sinh và không thay nước nhiều. Chia sẻ để ai đang chạy bể tham khảo.',flair:'Nhật ký bể',score:64,t:ago(1500)},
      {id:'p5',c:'ChoMuaBan',author:'tuanhuy',title:'Kinh nghiệm kiểm tra cá khi nhận hàng ship',body:'Khi nhận túi cá: quay video lúc mở, kiểm tra màu nước, mang, vây trước khi thả. Nên có bể cách ly sẵn. Ai có thêm mẹo thì bổ sung nhé.',flair:'Thảo luận',score:38,t:ago(300)}
    ],
    comments:[
      {id:'c1',post:'p1',parent:null,author:'hpz_staff',body:'Bể 60cm mới chơi thì nên chọn layout đảo hoặc tam giác nhẹ. Đá seiryu hợp với kiểu núi, nhớ chừa vùng nền trống để cây tiền cảnh lan.',score:18,t:ago(80)},
      {id:'c2',post:'p1',parent:'c1',author:'minhthuy',body:'Cảm ơn anh! Vậy mình thử layout tam giác lệch trái, lũa đặt gần góc.',score:6,t:ago(70)},
      {id:'c3',post:'p1',parent:null,author:'langbiec',body:'Đừng quên chọn đèn đủ sáng và CO2 nhẹ, nếu không cây tiền cảnh rất khó lên.',score:9,t:ago(60)},
      {id:'c4',post:'p3',parent:null,author:'bichngoc',body:'Có vẻ bệnh đốm trắng (ich). Cách ly ngay, nâng nhiệt từ từ lên 29-30 độ và dùng thuốc chuyên dụng đúng liều.',score:15,t:ago(30)},
      {id:'c5',post:'p2',parent:null,author:'anhkhoa',body:'Bước hòa nước rất quan trọng, mình từng bỏ qua và cá bị sốc.',score:11,t:ago(400)}
    ],
    votes:{},saved:[],joined:[],me:'ban_doc'
  };
}
var state=(function(){
  try{var s=JSON.parse(localStorage.getItem(STORE));if(s&&s.posts&&s.communities)return s}catch(e){}
  return seed();
})();
var ui={sort:'hot',q:'',reply:null};
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function timeAgo(t){
  var m=Math.max(1,Math.round((Date.now()-t)/60000));
  if(m<60)return m+' phút trước';
  var h=Math.round(m/60);if(h<24)return h+' giờ trước';
  return Math.round(h/24)+' ngày trước';
}
function myVote(key){return state.votes[key]||0}
function scoreOf(item,key){return item.score+myVote(key)}
function commentCount(pid){return state.comments.filter(function(c){return c.post===pid}).length}
function hotRank(p){var age=(Date.now()-p.t)/3600000;return scoreOf(p,'p:'+p.id)/Math.pow(age+2,1.5)}
function commOf(slug){return state.communities.filter(function(c){return c.slug===slug})[0]}

function route(){
  var h=location.hash.replace(/^#\/?/,'').split('/');
  if(h[0]==='post'&&h[1])return{name:'post',id:h[1]};
  if(h[0]==='h'&&h[1])return{name:'comm',slug:decodeURIComponent(h[1])};
  if(h[0]==='saved')return{name:'saved'};
  return{name:'home'};
}

function renderTop(){
  var dark=document.documentElement.getAttribute('data-theme')==='dark';
  $('top').innerHTML='<a class="brand" href="#/" aria-label="HPZ Community"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 16c5-8 13-8 18 0-5 8-13 8-18 0z"/><path d="M21 16l7-6v12z"/><circle cx="10" cy="15" r="1.2" fill="currentColor"/></svg><span>HPZ Community</span></a>'+
  '<input class="search" id="q" type="search" placeholder="Tìm bài viết, cộng đồng…" aria-label="Tìm kiếm" value="'+esc(ui.q)+'">'+
  '<button class="btn" data-act="theme" aria-label="Đổi giao diện sáng tối">'+(dark?'Sáng':'Tối')+'</button>'+
  '<button class="btn primary" data-act="compose">+ Tạo bài</button>';
}
function renderLeft(r){
  var h='<div class="card"><h3>Điều hướng</h3><a class="navlink '+(r.name==='home'?'on':'')+'" href="#/">Trang chủ</a><a class="navlink '+(r.name==='saved'?'on':'')+'" href="#/saved">Đã lưu <small>'+state.saved.length+'</small></a></div>';
  h+='<div class="card"><h3>Cộng đồng</h3>';
  state.communities.forEach(function(c){
    h+='<a class="navlink '+(r.name==='comm'&&r.slug===c.slug?'on':'')+'" href="#/h/'+encodeURIComponent(c.slug)+'"><span>h/'+esc(c.slug)+'</span></a>';
  });
  $('left').innerHTML=h+'</div>';
}
function renderRight(r){
  var c=r.name==='comm'?commOf(r.slug):null,h='';
  if(c){
    var joined=state.joined.indexOf(c.slug)>-1,n=state.posts.filter(function(p){return p.c===c.slug}).length;
    h+='<div class="card"><h3>Về h/'+esc(c.slug)+'</h3><p>'+esc(c.desc)+'</p><div class="stats"><div><b>'+(c.members+(joined?1:0))+'</b><small>thành viên</small></div><div><b>'+n+'</b><small>bài viết</small></div></div><button class="btn small '+(joined?'':'primary')+'" data-act="join" data-slug="'+esc(c.slug)+'">'+(joined?'Đã tham gia':'Tham gia')+'</button></div>';
  }else{
    h+='<div class="card"><h3>HPZ Community</h3><p>Diễn đàn cá cảnh theo chủ đề. Bình chọn để bài hay lên đầu, bình luận theo nhánh để thảo luận rõ ràng.</p></div>';
  }
  h+='<div class="card"><h3>Quy tắc chung</h3><ol class="rules"><li>Tôn trọng thành viên khác.</li><li>Nêu rõ thông số bể khi hỏi bệnh.</li><li>Không spam quảng cáo.</li><li>Chọn đúng cộng đồng và flair.</li></ol></div>';
  $('right').innerHTML=h;
}
function voteBtns(key,item,cls){
  var v=myVote(key);
  return '<button class="up '+(v===1?'on':'')+'" data-act="vote" data-key="'+key+'" data-v="1" aria-label="Upvote" aria-pressed="'+(v===1)+'">▲</button><b>'+scoreOf(item,key)+'</b><button class="dn '+(v===-1?'on':'')+'" data-act="vote" data-key="'+key+'" data-v="-1" aria-label="Downvote" aria-pressed="'+(v===-1)+'">▼</button>';
}
function postCard(p){
  var key='p:'+p.id,saved=state.saved.indexOf(p.id)>-1,ex=p.body.length>180?p.body.slice(0,180)+'…':p.body;
  return '<article class="post"><div class="votes">'+voteBtns(key,p)+'</div><div class="pbody"><div class="meta"><a class="comm" href="#/h/'+encodeURIComponent(p.c)+'">h/'+esc(p.c)+'</a><span>u/'+esc(p.author)+'</span><span>'+timeAgo(p.t)+'</span></div><h2><a href="#/post/'+p.id+'">'+esc(p.title)+'</a></h2><span class="flair">'+esc(p.flair)+'</span><p class="excerpt">'+esc(ex).replace(/\n/g,' ')+'</p><div class="actions"><a href="#/post/'+p.id+'">Bình luận ('+commentCount(p.id)+')</a><button data-act="save" data-id="'+p.id+'">'+(saved?'Bỏ lưu':'Lưu')+'</button><button data-act="share" data-id="'+p.id+'">Chia sẻ</button></div></div></article>';
}
function sortPosts(list){
  var a=list.slice();
  if(ui.sort==='new')a.sort(function(x,y){return y.t-x.t});
  else if(ui.sort==='top')a.sort(function(x,y){return scoreOf(y,'p:'+y.id)-scoreOf(x,'p:'+x.id)});
  else a.sort(function(x,y){return hotRank(y)-hotRank(x)});
  return a;
}
function sortTabs(){
  return '<div class="sort" role="tablist">'+[['hot','Nổi bật'],['new','Mới'],['top','Top']].map(function(s){return '<a href="#" role="tab" data-act="sort" data-s="'+s[0]+'" class="'+(ui.sort===s[0]?'on':'')+'">'+s[1]+'</a>'}).join('')+'</div>';
}
function empty(t,d){return '<div class="card empty"><h3>'+t+'</h3><p>'+d+'</p></div>'}
function feed(list,head){
  var q=ui.q.trim().toLowerCase();
  if(q)list=list.filter(function(p){return (p.title+' '+p.body+' '+p.c+' '+p.author).toLowerCase().indexOf(q)>-1});
  list=sortPosts(list);
  return head+sortTabs()+(list.length?list.map(postCard).join(''):empty('Chưa có bài phù hợp','Hãy thử từ khóa khác hoặc đăng bài đầu tiên.'));
}
function commentNode(c){
  var key='c:'+c.id,kids=state.comments.filter(function(x){return x.parent===c.id}),h='';
  h+='<div class="comment"><div class="cwrap"><div class="cline"></div><div class="cbody"><div class="meta"><b style="color:var(--text)">u/'+esc(c.author)+'</b><span>'+timeAgo(c.t)+'</span></div><p>'+esc(c.body)+'</p><div class="actions"><span class="cvote">'+voteBtns(key,c)+'</span><button data-act="reply" data-id="'+c.id+'">Trả lời</button></div>';
  if(ui.reply===c.id)h+=commentForm(c.post,c.id);
  kids.forEach(function(k){h+=commentNode(k)});
  return h+'</div></div></div>';
}
function commentForm(pid,parent){
  return '<form class="stack" data-form="comment" data-post="'+pid+'" data-parent="'+(parent||'')+'" style="margin:.5rem 0"><label for="cb'+(parent||'root')+'">'+(parent?'Trả lời':'Bình luận của bạn')+'</label><textarea id="cb'+(parent||'root')+'" name="body" required maxlength="1200" placeholder="Viết phản hồi…"></textarea><div class="row"><button class="btn primary small">Gửi</button></div></form>';
}
function postPage(id){
  var p=state.posts.filter(function(x){return x.id===id})[0];
  if(!p)return empty('Không tìm thấy bài viết','Bài có thể đã bị xóa. <a href="#/" style="color:var(--accent)">Về trang chủ</a>');
  var key='p:'+p.id,saved=state.saved.indexOf(p.id)>-1;
  var roots=state.comments.filter(function(c){return c.post===p.id&&!c.parent}).sort(function(a,b){return scoreOf(b,'c:'+b.id)-scoreOf(a,'c:'+a.id)});
  return '<article class="post"><div class="votes">'+voteBtns(key,p)+'</div><div class="pbody"><div class="meta"><a class="comm" href="#/h/'+encodeURIComponent(p.c)+'">h/'+esc(p.c)+'</a><span>u/'+esc(p.author)+'</span><span>'+timeAgo(p.t)+'</span></div><h2>'+esc(p.title)+'</h2><span class="flair">'+esc(p.flair)+'</span><div class="fulltext">'+esc(p.body)+'</div><div class="actions"><span>'+commentCount(p.id)+' bình luận</span><button data-act="save" data-id="'+p.id+'">'+(saved?'Bỏ lưu':'Lưu')+'</button><button data-act="share" data-id="'+p.id+'">Chia sẻ</button></div></div></article>'+
  '<div class="card">'+commentForm(p.id,'')+(roots.length?roots.map(commentNode).join(''):'<p class="empty">Chưa có bình luận. Hãy là người đầu tiên.</p>')+'</div>';
}
function render(){
  var r=route(),h='';
  renderTop();renderLeft(r);renderRight(r);
  if(r.name==='post'){h=postPage(r.id);document.title='Bài viết - HPZ Community'}
  else if(r.name==='comm'){
    var c=commOf(r.slug);
    if(!c)h=empty('Không có cộng đồng này','<a href="#/" style="color:var(--accent)">Về trang chủ</a>');
    else h=feed(state.posts.filter(function(p){return p.c===c.slug}),'<div class="banner"><div><h1>h/'+esc(c.slug)+'</h1><p>'+esc(c.desc)+'</p></div></div>');
    document.title='h/'+r.slug+' - HPZ Community';
  }else if(r.name==='saved'){
    h=feed(state.posts.filter(function(p){return state.saved.indexOf(p.id)>-1}),'<div class="banner"><div><h1>Bài đã lưu</h1><p>Các bài bạn đánh dấu để đọc lại.</p></div></div>');
    document.title='Đã lưu - HPZ Community';
  }else{
    h=feed(state.posts,'');document.title='HPZ Community';
  }
  var keep=document.activeElement&&document.activeElement.id==='q';
  $('main').innerHTML=h;
  if(keep){var q=$('q');if(q){q.focus();q.setSelectionRange(q.value.length,q.value.length)}}
}
function toast(t){
  var d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);
  setTimeout(function(){d.remove()},1800);
}
function openComposer(){
  var r=route(),def=r.name==='comm'?r.slug:state.communities[0].slug;
  $('composer').innerHTML='<h2>Tạo bài viết</h2><form class="stack" data-form="post" method="dialog"><div><label for="fc">Cộng đồng</label><select id="fc" name="c">'+state.communities.map(function(c){return '<option value="'+esc(c.slug)+'"'+(c.slug===def?' selected':'')+'>h/'+esc(c.slug)+'</option>'}).join('')+'</select></div><div><label for="ft">Tiêu đề</label><input id="ft" name="title" required maxlength="180"></div><div><label for="ff">Flair</label><select id="ff" name="flair">'+FLAIRS.map(function(f){return '<option>'+f+'</option>'}).join('')+'</select></div><div><label for="fb">Nội dung</label><textarea id="fb" name="body" required maxlength="2000"></textarea></div><div class="row"><button type="button" class="btn" data-act="close">Hủy</button><button class="btn primary">Đăng bài</button></div></form>';
  $('composer').showModal();
}

document.addEventListener('click',function(e){
  var el=e.target.closest('[data-act]');if(!el)return;
  var a=el.getAttribute('data-act'),id=el.getAttribute('data-id');
  if(a==='sort'){e.preventDefault();ui.sort=el.getAttribute('data-s');render()}
  else if(a==='vote'){
    var k=el.getAttribute('data-key'),v=parseInt(el.getAttribute('data-v'),10);
    state.votes[k]=state.votes[k]===v?0:v;save();render();
  }else if(a==='save'){
    var i=state.saved.indexOf(id);if(i>-1)state.saved.splice(i,1);else state.saved.push(id);save();render();
  }else if(a==='share'){
    var url=location.href.split('#')[0]+'#/post/'+id;
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(function(){toast('Đã sao chép liên kết')},function(){toast(url)});else toast(url);
  }else if(a==='reply'){ui.reply=ui.reply===id?null:id;render()}
  else if(a==='join'){
    var s=el.getAttribute('data-slug'),j=state.joined.indexOf(s);if(j>-1)state.joined.splice(j,1);else state.joined.push(s);save();render();
  }else if(a==='theme'){
    var d=document.documentElement.getAttribute('data-theme')==='dark';
    document.documentElement.setAttribute('data-theme',d?'light':'dark');renderTop();
  }else if(a==='compose')openComposer();
  else if(a==='close')$('composer').close();
});
document.addEventListener('input',function(e){
  if(e.target.id==='q'){ui.q=e.target.value;render()}
});
document.addEventListener('submit',function(e){
  var f=e.target,kind=f.getAttribute('data-form');if(!kind)return;
  e.preventDefault();
  var fd=new FormData(f);
  if(kind==='post'){
    var p={id:uid('p'),c:fd.get('c'),author:state.me,title:String(fd.get('title')).trim(),body:String(fd.get('body')).trim(),flair:fd.get('flair'),score:1,t:Date.now()};
    if(!p.title||!p.body)return;
    state.posts.unshift(p);state.votes['p:'+p.id]=0;save();$('composer').close();location.hash='#/post/'+p.id;render();
  }else if(kind==='comment'){
    var body=String(fd.get('body')).trim();if(!body)return;
    state.comments.push({id:uid('c'),post:f.getAttribute('data-post'),parent:f.getAttribute('data-parent')||null,author:state.me,body:body,score:1,t:Date.now()});
    ui.reply=null;save();render();
  }
});
window.addEventListener('hashchange',function(){ui.reply=null;render();window.scrollTo(0,0)});

if(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark');
render();
})();
