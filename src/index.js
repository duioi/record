const MAX_STORAGE_BYTES = 8 * 1024 * 1024 * 1024;
const MAX_PART_BYTES = 16 * 1024 * 1024;
const ALLOWED_AUDIO = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
]);

const page = String.raw`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f4f2ec">
  <title>UMC Meeting Recorder</title>
  <style>
    :root{--ink:#16211d;--muted:#66716c;--line:#d7d8d1;--paper:#f4f2ec;--card:#fffef9;--green:#174c3c;--mint:#dbeadf;--red:#b63a35;--amber:#b36b18;--shadow:0 14px 45px rgba(24,42,34,.08);font-family:Inter,"Segoe UI",Arial,sans-serif;color:var(--ink);background:var(--paper)}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 15% 0,#fff 0,transparent 32rem),var(--paper)}button,input,select{font:inherit}button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.48}
    .shell{max-width:1440px;margin:auto;padding:22px 28px 40px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:22px}.brand{display:flex;align-items:center;gap:12px}.mark{width:42px;height:42px;border-radius:13px;background:var(--green);display:grid;place-items:center;color:white;font-weight:800;letter-spacing:-1px}.brand h1{font-size:18px;margin:0}.brand p{font-size:12px;color:var(--muted);margin:3px 0 0}.topmeta{display:flex;align-items:center;gap:10px}.pill{border:1px solid var(--line);background:rgba(255,255,255,.7);padding:8px 12px;border-radius:999px;font-size:12px;color:var(--muted)}.online:before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#2e8a62;margin-right:7px}.offline:before{background:var(--red)}
    .layout{display:grid;grid-template-columns:310px minmax(0,1fr) 330px;gap:18px}.panel{background:rgba(255,254,249,.92);border:1px solid rgba(202,204,196,.9);border-radius:22px;box-shadow:var(--shadow)}.side{padding:20px;height:calc(100vh - 112px);min-height:650px;position:sticky;top:20px;display:flex;flex-direction:column}.side h2,.right h2{font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin:0 0 16px}.field{margin-bottom:14px}.field label{display:block;font-size:12px;font-weight:650;margin-bottom:7px}.input{width:100%;border:1px solid var(--line);border-radius:12px;background:white;padding:11px 12px;color:var(--ink);outline:none}.input:focus{border-color:#6e9285;box-shadow:0 0 0 3px rgba(23,76,60,.09)}
    .record-orb{width:152px;height:152px;border-radius:50%;margin:18px auto 22px;border:1px solid #cfd7d1;background:radial-gradient(circle at 40% 30%,#fff 0,#e9eee8 60%,#d7dfda);display:grid;place-items:center;position:relative;box-shadow:inset 0 0 0 13px rgba(255,255,255,.55)}.record-orb:after{content:"";width:54px;height:54px;background:var(--red);border-radius:50%;box-shadow:0 0 0 9px rgba(182,58,53,.12)}.recording .record-orb:after{animation:pulse 1.6s infinite}.paused .record-orb:after{border-radius:10px;background:var(--amber);animation:none}@keyframes pulse{50%{box-shadow:0 0 0 22px rgba(182,58,53,0)}}
    .timer{text-align:center;font-variant-numeric:tabular-nums;font-size:34px;font-weight:700;letter-spacing:.04em}.state{text-align:center;color:var(--muted);font-size:12px;margin:5px 0 18px}.primary{width:100%;border:0;border-radius:13px;background:var(--green);color:white;padding:13px 15px;font-weight:700}.controls{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:9px}.secondary,.danger,.ghost{border:1px solid var(--line);border-radius:12px;background:white;padding:11px;font-weight:650}.danger{color:var(--red);border-color:#e7c8c4}.side-foot{margin-top:auto;border-top:1px solid var(--line);padding-top:14px}.sync-row{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin:7px 0}.sync-row strong{color:var(--ink)}
    .main{min-height:650px;overflow:hidden}.meeting-head{padding:24px 26px 18px;border-bottom:1px solid var(--line);display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--green);font-weight:800}.meeting-head h2{font-size:28px;letter-spacing:-.03em;margin:6px 0 5px}.meeting-head p{font-size:13px;color:var(--muted);margin:0}.live-tag{padding:8px 11px;border-radius:999px;background:#f5e0dd;color:var(--red);font-size:11px;font-weight:800;letter-spacing:.08em}.transcript{padding:26px;height:calc(100vh - 235px);min-height:535px;overflow:auto;scroll-behavior:smooth}.empty{height:100%;display:grid;place-items:center;text-align:center;color:var(--muted)}.empty .icon{width:66px;height:66px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;margin:auto auto 14px;font-size:27px}.empty h3{color:var(--ink);margin:0 0 7px;font-size:17px}.empty p{max-width:330px;font-size:13px;line-height:1.6;margin:0}
    .segment{display:grid;grid-template-columns:58px 1fr;gap:16px;padding:0 0 23px;position:relative}.segment:before{content:"";position:absolute;left:27px;top:25px;bottom:0;width:1px;background:var(--line)}.segment:last-child:before{display:none}.stamp{font-size:11px;color:var(--muted);padding-top:4px}.bubble{background:white;border:1px solid var(--line);border-radius:15px;padding:13px 15px;line-height:1.6;font-size:14px}.bubble.interim{color:var(--muted);border-style:dashed;background:#fbfaf6}.source{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#7f8c86;margin-top:7px}
    .right{padding:20px;height:calc(100vh - 112px);min-height:650px;position:sticky;top:20px;display:flex;flex-direction:column}.storage{border:1px solid var(--line);border-radius:16px;padding:15px;margin-bottom:18px;background:white}.storage-top{display:flex;justify-content:space-between;font-size:12px;margin-bottom:10px}.bar{height:7px;border-radius:99px;background:#e8e9e3;overflow:hidden}.bar span{display:block;height:100%;width:0;background:var(--green);border-radius:inherit;transition:width .3s}.storage small{display:block;color:var(--muted);margin-top:8px}.history-head{display:flex;align-items:center;justify-content:space-between;margin-top:3px}.history-head button{border:0;background:transparent;color:var(--green);font-size:12px}.history{overflow:auto;margin:0 -6px;padding:0 6px}.meeting-item{width:100%;text-align:left;border:1px solid transparent;background:transparent;border-radius:14px;padding:12px;margin-bottom:5px}.meeting-item:hover,.meeting-item.active{background:white;border-color:var(--line)}.meeting-item strong{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.meeting-item span{display:flex;justify-content:space-between;color:var(--muted);font-size:11px;margin-top:6px}.right-actions{margin-top:auto;padding-top:12px;border-top:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:8px}.right-actions button{font-size:12px}.toast{position:fixed;right:28px;bottom:25px;background:#14251f;color:white;padding:12px 16px;border-radius:12px;box-shadow:0 12px 35px rgba(0,0,0,.18);font-size:13px;opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s;max-width:360px;z-index:10}.toast.show{opacity:1;transform:none}.toast.error{background:#722b28}
    @media(max-width:1080px){.layout{grid-template-columns:280px 1fr}.right{position:relative;grid-column:1/-1;height:auto;min-height:0;top:0}.history{max-height:300px}.right-actions{margin-top:14px}}@media(max-width:720px){.shell{padding:14px}.topbar{align-items:flex-start}.topmeta .pill:first-child{display:none}.layout{display:block}.side,.right{position:relative;height:auto;min-height:0;top:0;margin-bottom:14px}.main{margin-bottom:14px}.transcript{height:520px;min-height:0}.meeting-head h2{font-size:22px}.record-orb{width:118px;height:118px}.timer{font-size:29px}}
  </style>
</head>
<body>
  <div class="shell" id="app">
    <header class="topbar">
      <div class="brand"><div class="mark">UMC</div><div><h1>Meeting Recorder</h1><p>Ghi âm an toàn · Phụ đề tiếng Việt</p></div></div>
      <div class="topmeta"><span class="pill">Bảo vệ bởi Cloudflare Access</span><span class="pill online" id="netState">Đang kết nối</span></div>
    </header>
    <div class="layout">
      <aside class="panel side" id="controlPanel">
        <h2>Điều khiển cuộc họp</h2>
        <div class="field"><label for="title">Tên cuộc họp</label><input class="input" id="title" maxlength="120" placeholder="Ví dụ: Họp sản xuất ca sáng"></div>
        <div class="field"><label for="microphone">Thiết bị ghi âm</label><select class="input" id="microphone"><option value="">Micro mặc định</option></select></div>
        <div class="record-orb" aria-hidden="true"></div>
        <div class="timer" id="timer">00:00:00</div>
        <div class="state" id="recordState">Sẵn sàng ghi âm</div>
        <button class="primary" id="startBtn">Bắt đầu ghi âm</button>
        <div class="controls"><button class="secondary" id="pauseBtn" disabled>Tạm dừng</button><button class="danger" id="finishBtn" disabled>Kết thúc</button></div>
        <div class="side-foot">
          <div class="sync-row"><span>Đã lưu trên máy chủ</span><strong id="savedParts">0 phần</strong></div>
          <div class="sync-row"><span>Chờ đồng bộ</span><strong id="pendingParts">0 phần</strong></div>
          <div class="sync-row"><span>Phụ đề trực tiếp</span><strong id="speechState">Đang kiểm tra</strong></div>
        </div>
      </aside>
      <main class="panel main">
        <div class="meeting-head"><div><div class="eyebrow">Bản ghi trực tiếp</div><h2 id="currentTitle">Chưa bắt đầu cuộc họp</h2><p id="meetingMeta">Âm thanh gốc là dữ liệu chuẩn; hãy đối chiếu trước khi dùng số liệu.</p></div><div class="live-tag" id="liveTag">SẴN SÀNG</div></div>
        <section class="transcript" id="transcript" aria-live="polite"><div class="empty" id="emptyState"><div><div class="icon">◉</div><h3>Phụ đề sẽ xuất hiện ở đây</h3><p>Nhấn Bắt đầu để ghi âm. Nếu trình duyệt không hỗ trợ nhận diện trực tiếp, âm thanh vẫn được lưu bình thường.</p></div></div></section>
      </main>
      <aside class="panel right">
        <h2>Lưu trữ & lịch sử</h2>
        <div class="storage"><div class="storage-top"><span>Dung lượng audio</span><strong id="storageText">0 MB / 8 GB</strong></div><div class="bar"><span id="storageBar"></span></div><small id="storageHint">Hệ thống cảnh báo từ 70% và khóa upload ở 8 GiB.</small></div>
        <div class="history-head"><h2>Cuộc họp gần đây</h2><button id="refreshBtn">Làm mới</button></div>
        <div class="history" id="history"><div class="empty" style="height:170px"><div><p>Đang tải lịch sử…</p></div></div></div>
        <div class="right-actions"><button class="ghost" id="exportBtn" disabled>Xuất TXT</button><button class="danger" id="deleteBtn" disabled>Xóa cuộc họp</button></div>
      </aside>
    </div>
  </div>
  <div class="toast" id="toast"></div>
  <script>
  (function(){
    "use strict";
    var state={meetingId:null,meeting:null,stream:null,recorder:null,recording:false,paused:false,startedAt:0,elapsedBeforePause:0,timerHandle:null,rolloverHandle:null,sequence:0,saved:0,pending:0,recognition:null,transcript:[],interimEl:null,selectedId:null,ending:false,lastQueueJob:null};
    var el={app:byId("app"),panel:byId("controlPanel"),title:byId("title"),mic:byId("microphone"),timer:byId("timer"),recordState:byId("recordState"),start:byId("startBtn"),pause:byId("pauseBtn"),finish:byId("finishBtn"),saved:byId("savedParts"),pending:byId("pendingParts"),speech:byId("speechState"),currentTitle:byId("currentTitle"),meetingMeta:byId("meetingMeta"),liveTag:byId("liveTag"),transcript:byId("transcript"),empty:byId("emptyState"),history:byId("history"),storageText:byId("storageText"),storageBar:byId("storageBar"),storageHint:byId("storageHint"),net:byId("netState"),refresh:byId("refreshBtn"),exportBtn:byId("exportBtn"),deleteBtn:byId("deleteBtn"),toast:byId("toast")};
    function byId(id){return document.getElementById(id)}
    function api(path,options){return fetch(path,options||{}).then(async function(r){var data=null;try{data=await r.json()}catch(e){}if(!r.ok)throw new Error(data&&data.error?data.error:"Yêu cầu không thành công");return data})}
    function notify(message,isError){el.toast.textContent=message;el.toast.className="toast show"+(isError?" error":"");clearTimeout(notify.timer);notify.timer=setTimeout(function(){el.toast.className="toast"},3500)}
    function formatTime(ms){var s=Math.max(0,Math.floor(ms/1000));var h=String(Math.floor(s/3600)).padStart(2,"0");var m=String(Math.floor((s%3600)/60)).padStart(2,"0");return h+":"+m+":"+String(s%60).padStart(2,"0")}
    function formatStamp(ms){var s=Math.floor((ms||0)/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
    function currentElapsed(){return state.elapsedBeforePause+(state.recording&&!state.paused?Date.now()-state.startedAt:0)}
    function updateTimer(){el.timer.textContent=formatTime(currentElapsed())}
    function setNetwork(){var on=navigator.onLine;el.net.textContent=on?"Đang kết nối":"Mất kết nối";el.net.className="pill "+(on?"online":"offline");if(on)flushQueue()}
    function setUi(mode){el.panel.classList.remove("recording","paused");if(mode==="recording")el.panel.classList.add("recording");if(mode==="paused")el.panel.classList.add("paused");el.start.disabled=mode!=="idle";el.title.disabled=mode!=="idle";el.mic.disabled=mode!=="idle";el.pause.disabled=mode==="idle"||mode==="ending";el.finish.disabled=mode==="idle"||mode==="ending";el.pause.textContent=mode==="paused"?"Tiếp tục":"Tạm dừng";el.liveTag.textContent=mode==="recording"?"● ĐANG GHI":mode==="paused"?"TẠM DỪNG":mode==="ending"?"ĐANG LƯU":"SẴN SÀNG";el.recordState.textContent=mode==="recording"?"Đang ghi và đồng bộ từng phần":mode==="paused"?"Đã tạm dừng ghi âm":mode==="ending"?"Đang hoàn tất dữ liệu":"Sẵn sàng ghi âm"}
    async function listDevices(){try{var devices=await navigator.mediaDevices.enumerateDevices();var selected=el.mic.value;el.mic.innerHTML='<option value="">Micro mặc định</option>';devices.filter(function(d){return d.kind==="audioinput"}).forEach(function(d,i){var o=document.createElement("option");o.value=d.deviceId;o.textContent=d.label||("Micro "+(i+1));el.mic.appendChild(o)});el.mic.value=selected}catch(e){}}
    function chooseMime(){var options=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(var i=0;i<options.length;i++)if(MediaRecorder.isTypeSupported(options[i]))return options[i];return ""}
    async function startMeeting(){
      if(!window.MediaRecorder||!navigator.mediaDevices){notify("Trình duyệt này không hỗ trợ ghi âm.",true);return}
      var title=el.title.value.trim()||("Cuộc họp "+new Date().toLocaleString("vi-VN"));
      try{
        var constraints={audio:el.mic.value?{deviceId:{exact:el.mic.value}}:true};state.stream=await navigator.mediaDevices.getUserMedia(constraints);await listDevices();
        var created=await api("/api/meetings",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({title:title,language:"vi-VN"})});
        state.meetingId=created.id;state.selectedId=created.id;state.meeting=created;state.recording=true;state.paused=false;state.startedAt=Date.now();state.elapsedBeforePause=0;state.sequence=0;state.saved=0;state.transcript=[];state.ending=false;
        el.currentTitle.textContent=title;el.meetingMeta.textContent="Bắt đầu "+new Date().toLocaleTimeString("vi-VN")+" · Phụ đề tạm tính";clearTranscript();setUi("recording");updateTimer();state.timerHandle=setInterval(updateTimer,500);startPart();startRecognition();loadMeetings();notify("Đã bắt đầu ghi âm");
      }catch(e){if(state.stream){state.stream.getTracks().forEach(function(t){t.stop()});state.stream=null}notify(e.message||"Không thể bắt đầu ghi âm",true)}
    }
    function startPart(){
      if(!state.recording||state.paused||state.ending||!state.stream)return;
      var mime=chooseMime();var options=mime?{mimeType:mime,audioBitsPerSecond:64000}:{audioBitsPerSecond:64000};
      try{var recorder=new MediaRecorder(state.stream,options);state.recorder=recorder;var chunks=[];var partStarted=Date.now();recorder.ondataavailable=function(ev){if(ev.data&&ev.data.size)chunks.push(ev.data)};recorder.onstop=function(){var blob=new Blob(chunks,{type:recorder.mimeType||mime||"audio/webm"});if(blob.size>0){var seq=state.sequence++;state.lastQueueJob=queuePart(state.meetingId,seq,blob,Date.now()-partStarted)}if(state.recording&&!state.paused&&!state.ending)setTimeout(startPart,120)};recorder.start();clearTimeout(state.rolloverHandle);state.rolloverHandle=setTimeout(function(){if(recorder.state!=="inactive")recorder.stop()},30000)}catch(e){notify("Không thể tạo phần ghi âm: "+e.message,true)}
    }
    function stopCurrentPart(){clearTimeout(state.rolloverHandle);if(state.recorder&&state.recorder.state!=="inactive")state.recorder.stop()}
    function togglePause(){if(!state.recording||state.ending)return;if(state.paused){state.paused=false;state.startedAt=Date.now();setUi("recording");startPart();startRecognition();notify("Đã tiếp tục ghi âm")}else{state.elapsedBeforePause=currentElapsed();state.paused=true;stopCurrentPart();stopRecognition();setUi("paused");updateTimer();notify("Đã tạm dừng")}}
    async function finishMeeting(){
      if(!state.recording||state.ending)return;if(!confirm("Kết thúc cuộc họp? Ứng dụng sẽ lưu phần ghi âm cuối và đồng bộ dữ liệu còn chờ."))return;
      state.ending=true;state.elapsedBeforePause=currentElapsed();state.recording=false;state.paused=false;clearInterval(state.timerHandle);clearTimeout(state.rolloverHandle);stopRecognition();stopCurrentPart();setUi("ending");
      if(state.stream){state.stream.getTracks().forEach(function(t){t.stop()});state.stream=null}
      try{await waitForRecorder();await flushQueue();await api("/api/meetings/"+encodeURIComponent(state.meetingId)+"/finish",{method:"POST"});notify(state.pending?"Cuộc họp đã kết thúc; còn dữ liệu chờ đồng bộ.":"Cuộc họp đã lưu hoàn tất");state.selectedId=state.meetingId;await openMeeting(state.meetingId);await loadMeetings()}catch(e){notify(e.message,true)}finally{state.meetingId=null;state.ending=false;setUi("idle");el.timer.textContent="00:00:00"}
    }
    function waitForRecorder(){return new Promise(function(resolve){var tries=0;var t=setInterval(function(){tries++;if(!state.recorder||state.recorder.state==="inactive"||tries>30){clearInterval(t);setTimeout(resolve,150)}},100)}).then(function(){return state.lastQueueJob||Promise.resolve()})}
    function startRecognition(){
      var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){el.speech.textContent="Không hỗ trợ";return}if(state.recognition)return;
      try{var r=new SR();r.lang="vi-VN";r.continuous=true;r.interimResults=true;r.onresult=function(event){var interim="";for(var i=event.resultIndex;i<event.results.length;i++){var text=event.results[i][0].transcript.trim();if(event.results[i].isFinal){addSegment(text,currentElapsed(),false);saveTranscript(text,currentElapsed())}else interim+=text+" "}showInterim(interim.trim())};r.onerror=function(event){if(event.error!=="no-speech"&&event.error!=="aborted")el.speech.textContent="Tạm gián đoạn"};r.onend=function(){state.recognition=null;if(state.recording&&!state.paused&&!state.ending)setTimeout(startRecognition,350)};state.recognition=r;r.start();el.speech.textContent="Hoạt động"}catch(e){state.recognition=null;el.speech.textContent="Không khả dụng"}
    }
    function stopRecognition(){if(state.recognition){try{state.recognition.stop()}catch(e){}state.recognition=null}showInterim("")}
    function clearTranscript(){el.transcript.innerHTML="";state.interimEl=null}
    function addSegment(text,ms,interim){if(!text)return;var row=document.createElement("div");row.className="segment";var stamp=document.createElement("div");stamp.className="stamp";stamp.textContent=formatStamp(ms);var bubble=document.createElement("div");bubble.className="bubble"+(interim?" interim":"");var body=document.createElement("div");body.textContent=text;bubble.appendChild(body);if(!interim){var source=document.createElement("div");source.className="source";source.textContent="Phụ đề trình duyệt · cần hiệu đính";bubble.appendChild(source)}row.appendChild(stamp);row.appendChild(bubble);el.transcript.appendChild(row);el.transcript.scrollTop=el.transcript.scrollHeight;return row}
    function showInterim(text){if(state.interimEl){state.interimEl.remove();state.interimEl=null}if(text)state.interimEl=addSegment(text,currentElapsed(),true)}
    function saveTranscript(text,endMs){if(!state.meetingId)return;api("/api/meetings/"+encodeURIComponent(state.meetingId)+"/transcript",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({text:text,start_ms:Math.max(0,endMs-4000),end_ms:endMs,source:"browser"})}).catch(function(){})}
    function openDb(){return new Promise(function(resolve,reject){var req=indexedDB.open("umc-meeting-recorder",1);req.onupgradeneeded=function(){var db=req.result;if(!db.objectStoreNames.contains("parts"))db.createObjectStore("parts",{keyPath:"key"})};req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}
    async function queuePart(meetingId,seq,blob,duration){var digest=await crypto.subtle.digest("SHA-256",await blob.arrayBuffer());var sha=Array.from(new Uint8Array(digest)).map(function(b){return b.toString(16).padStart(2,"0")}).join("");var item={key:meetingId+":"+seq,meetingId:meetingId,seq:seq,blob:blob,duration:duration,sha:sha,mime:(blob.type||"audio/webm").split(";")[0]};var db=await openDb();await txPromise(db,"parts","readwrite",function(store){store.put(item)});await updatePending();if(navigator.onLine)uploadItem(item)}
    function txPromise(db,name,mode,action){return new Promise(function(resolve,reject){var tx=db.transaction(name,mode);action(tx.objectStore(name));tx.oncomplete=function(){resolve()};tx.onerror=function(){reject(tx.error)}})}
    async function getQueued(){var db=await openDb();return new Promise(function(resolve,reject){var req=db.transaction("parts").objectStore("parts").getAll();req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}
    async function removeQueued(key){var db=await openDb();await txPromise(db,"parts","readwrite",function(store){store.delete(key)})}
    async function updatePending(){try{var items=await getQueued();state.pending=items.length;el.pending.textContent=items.length+" phần"}catch(e){}}
    async function uploadItem(item){try{var r=await fetch("/api/meetings/"+encodeURIComponent(item.meetingId)+"/parts",{method:"POST",headers:{"content-type":item.mime,"x-sequence":String(item.seq),"x-duration-ms":String(Math.round(item.duration)),"x-sha256":item.sha},body:item.blob});var data=await r.json();if(!r.ok)throw new Error(data.error||"Upload thất bại");await removeQueued(item.key);if(item.meetingId===state.meetingId){state.saved++;el.saved.textContent=state.saved+" phần"}await updatePending();loadStorage();return true}catch(e){await updatePending();return false}}
    async function flushQueue(){if(!navigator.onLine)return;var items=[];try{items=await getQueued()}catch(e){return}for(var i=0;i<items.length;i++)await uploadItem(items[i])}
    async function loadMeetings(){try{var data=await api("/api/meetings");el.history.innerHTML="";if(!data.meetings.length){el.history.innerHTML='<div class="empty" style="height:170px"><div><p>Chưa có cuộc họp nào.</p></div></div>';return}data.meetings.forEach(function(m){var b=document.createElement("button");b.className="meeting-item"+(m.id===state.selectedId?" active":"");b.type="button";var strong=document.createElement("strong");strong.textContent=m.title;var meta=document.createElement("span");var date=document.createElement("i");date.style.fontStyle="normal";date.textContent=new Date(m.started_at).toLocaleDateString("vi-VN");var count=document.createElement("i");count.style.fontStyle="normal";count.textContent=(m.part_count||0)+" phần";meta.appendChild(date);meta.appendChild(count);b.appendChild(strong);b.appendChild(meta);b.onclick=function(){openMeeting(m.id)};el.history.appendChild(b)})}catch(e){el.history.innerHTML='<div class="empty" style="height:170px"><div><p>Không tải được lịch sử.</p></div></div>'}}
    async function openMeeting(id){try{var data=await api("/api/meetings/"+encodeURIComponent(id));state.selectedId=id;state.meeting=data.meeting;state.transcript=data.transcript;el.currentTitle.textContent=data.meeting.title;el.meetingMeta.textContent=(data.meeting.status==="finished"?"Đã kết thúc":"Đang ghi")+" · "+new Date(data.meeting.started_at).toLocaleString("vi-VN")+" · "+data.parts.length+" phần audio";clearTranscript();if(!data.transcript.length){var box=document.createElement("div");box.className="empty";box.innerHTML='<div><div class="icon">⌁</div><h3>Chưa có văn bản</h3><p>Bạn vẫn có thể nghe lại từng phần âm thanh đã lưu.</p></div>';el.transcript.appendChild(box)}else data.transcript.forEach(function(s){addSegment(s.text,s.start_ms||0,false)});if(data.parts.length){var audioWrap=document.createElement("div");audioWrap.style.cssText="border-top:1px solid var(--line);padding-top:18px;margin-top:8px";var heading=document.createElement("div");heading.className="eyebrow";heading.textContent="Nghe lại từng phần";audioWrap.appendChild(heading);data.parts.forEach(function(p){var row=document.createElement("div");row.style.cssText="display:grid;grid-template-columns:70px 1fr;gap:10px;align-items:center;margin-top:12px";var lab=document.createElement("span");lab.style.cssText="font-size:12px;color:var(--muted)";lab.textContent="Phần "+(p.seq+1);var audio=document.createElement("audio");audio.controls=true;audio.preload="none";audio.style.width="100%";audio.src="/api/meetings/"+encodeURIComponent(id)+"/audio/"+p.seq;row.appendChild(lab);row.appendChild(audio);audioWrap.appendChild(row)});el.transcript.appendChild(audioWrap)}el.exportBtn.disabled=false;el.deleteBtn.disabled=false;loadMeetings()}catch(e){notify(e.message,true)}}
    async function loadStorage(){try{var d=await api("/api/storage");var mb=d.used_bytes/1024/1024;var pct=Math.min(100,d.used_bytes/d.limit_bytes*100);el.storageText.textContent=(mb<1024?mb.toFixed(1)+" MB":(mb/1024).toFixed(2)+" GB")+" / 8 GB";el.storageBar.style.width=pct+"%";el.storageBar.style.background=pct>=80?"var(--red)":pct>=70?"var(--amber)":"var(--green)";el.storageHint.textContent=pct>=80?"Cảnh báo mạnh: dung lượng đã vượt 80%.":pct>=70?"Cảnh báo: dung lượng đã vượt 70%.":"Hệ thống cảnh báo từ 70% và khóa upload ở 8 GiB."}catch(e){}}
    function exportTxt(){if(!state.meeting)return;var lines=[state.meeting.title,"Bắt đầu: "+state.meeting.started_at,"",].concat((state.transcript||[]).map(function(s){return "["+formatStamp(s.start_ms||0)+"] "+s.text}));var blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(state.meeting.title||"bien-ban").replace(/[^a-zA-Z0-9À-ỹ _-]/g,"")+".txt";a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
    async function deleteMeeting(){if(!state.selectedId||!confirm("Xóa vĩnh viễn cuộc họp này cùng toàn bộ audio và transcript?"))return;try{await api("/api/meetings/"+encodeURIComponent(state.selectedId),{method:"DELETE"});state.selectedId=null;state.meeting=null;state.transcript=[];el.exportBtn.disabled=true;el.deleteBtn.disabled=true;el.currentTitle.textContent="Chưa bắt đầu cuộc họp";el.meetingMeta.textContent="Âm thanh gốc là dữ liệu chuẩn; hãy đối chiếu trước khi dùng số liệu.";el.transcript.innerHTML='<div class="empty"><div><div class="icon">◉</div><h3>Phụ đề sẽ xuất hiện ở đây</h3><p>Nhấn Bắt đầu để ghi âm.</p></div></div>';await loadMeetings();await loadStorage();notify("Đã xóa cuộc họp")}catch(e){notify(e.message,true)}}
    el.start.addEventListener("click",startMeeting);el.pause.addEventListener("click",togglePause);el.finish.addEventListener("click",finishMeeting);el.refresh.addEventListener("click",function(){loadMeetings();loadStorage()});el.exportBtn.addEventListener("click",exportTxt);el.deleteBtn.addEventListener("click",deleteMeeting);window.addEventListener("online",setNetwork);window.addEventListener("offline",setNetwork);window.addEventListener("beforeunload",function(e){if(state.recording||state.pending){e.preventDefault();e.returnValue=""}});
    if(!window.MediaRecorder){el.start.disabled=true;el.recordState.textContent="Trình duyệt không hỗ trợ MediaRecorder"}var SR=window.SpeechRecognition||window.webkitSpeechRecognition;el.speech.textContent=SR?"Sẵn sàng":"Không hỗ trợ";setNetwork();setUi("idle");listDevices();updatePending();flushQueue();loadMeetings();loadStorage();
  })();
  </script>
</body>
</html>`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function userFrom(request) {
  const email = request.headers.get("cf-access-authenticated-user-email");
  return {
    id: email?.trim().toLowerCase() || null,
    email,
  };
}

function extensionFor(mime) {
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mp4")) return "m4a";
  return "webm";
}

async function ownedMeeting(env, meetingId, ownerId) {
  return env.DB.prepare(
    "SELECT * FROM meetings WHERE id = ? AND owner_id = ?",
  ).bind(meetingId, ownerId).first();
}

async function audit(env, actorId, meetingId, event) {
  await env.DB.prepare(
    "INSERT INTO audit_events (id, actor_id, meeting_id, event) VALUES (?, ?, ?, ?)",
  ).bind(crypto.randomUUID(), actorId, meetingId, event).run();
}

async function apiHandler(request, env, url, user) {
  if (!user.id) return json({ error: "Bạn cần đăng nhập để tiếp tục." }, 401);
  if (!env.DB || !env.AUDIO) return json({ error: "D1/R2 chưa được kết nối." }, 503);

  if (url.pathname === "/api/meetings" && request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const title = String(body.title || "").trim().slice(0, 120);
    if (!title) return json({ error: "Tên cuộc họp không được để trống." }, 400);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO meetings (id, owner_id, owner_email, title, language, status, started_at, created_at) VALUES (?, ?, ?, ?, ?, 'recording', ?, ?)",
    ).bind(id, user.id, user.email || null, title, "vi-VN", now, now).run();
    await audit(env, user.id, id, "meeting.created");
    return json({ id, title, language: "vi-VN", status: "recording", started_at: now }, 201);
  }

  if (url.pathname === "/api/meetings" && request.method === "GET") {
    const result = await env.DB.prepare(
      "SELECT m.id, m.title, m.status, m.started_at, m.ended_at, COUNT(p.id) AS part_count FROM meetings m LEFT JOIN audio_parts p ON p.meeting_id = m.id WHERE m.owner_id = ? GROUP BY m.id ORDER BY m.created_at DESC LIMIT 80",
    ).bind(user.id).all();
    return json({ meetings: result.results || [] });
  }

  if (url.pathname === "/api/storage" && request.method === "GET") {
    const row = await env.DB.prepare(
      "SELECT COALESCE(SUM(p.bytes), 0) AS used_bytes, COUNT(DISTINCT p.meeting_id) AS meeting_count FROM audio_parts p JOIN meetings m ON m.id = p.meeting_id WHERE m.owner_id = ?",
    ).bind(user.id).first();
    return json({ used_bytes: Number(row?.used_bytes || 0), limit_bytes: MAX_STORAGE_BYTES, meeting_count: Number(row?.meeting_count || 0) });
  }

  const detail = url.pathname.match(/^\/api\/meetings\/([^/]+)$/);
  if (detail && request.method === "GET") {
    const meetingId = decodeURIComponent(detail[1]);
    const meeting = await ownedMeeting(env, meetingId, user.id);
    if (!meeting) return json({ error: "Không tìm thấy cuộc họp." }, 404);
    const [parts, transcript] = await Promise.all([
      env.DB.prepare("SELECT seq, mime, bytes, duration_ms, uploaded_at FROM audio_parts WHERE meeting_id = ? ORDER BY seq").bind(meetingId).all(),
      env.DB.prepare("SELECT id, source, start_ms, end_ms, text, state, created_at FROM transcript_segments WHERE meeting_id = ? ORDER BY start_ms, created_at").bind(meetingId).all(),
    ]);
    return json({ meeting, parts: parts.results || [], transcript: transcript.results || [] });
  }

  if (detail && request.method === "DELETE") {
    const meetingId = decodeURIComponent(detail[1]);
    const meeting = await ownedMeeting(env, meetingId, user.id);
    if (!meeting) return json({ error: "Không tìm thấy cuộc họp." }, 404);
    const keys = await env.DB.prepare("SELECT r2_key FROM audio_parts WHERE meeting_id = ?").bind(meetingId).all();
    const objectKeys = (keys.results || []).map((row) => row.r2_key);
    if (objectKeys.length) await env.AUDIO.delete(objectKeys);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM transcript_segments WHERE meeting_id = ?").bind(meetingId),
      env.DB.prepare("DELETE FROM audio_parts WHERE meeting_id = ?").bind(meetingId),
      env.DB.prepare("DELETE FROM audit_events WHERE meeting_id = ?").bind(meetingId),
      env.DB.prepare("DELETE FROM meetings WHERE id = ? AND owner_id = ?").bind(meetingId, user.id),
    ]);
    return json({ ok: true });
  }

  const partsRoute = url.pathname.match(/^\/api\/meetings\/([^/]+)\/parts$/);
  if (partsRoute && request.method === "POST") {
    const meetingId = decodeURIComponent(partsRoute[1]);
    const meeting = await ownedMeeting(env, meetingId, user.id);
    if (!meeting) return json({ error: "Không tìm thấy cuộc họp." }, 404);
    if (meeting.status === "finished") return json({ error: "Cuộc họp đã kết thúc." }, 409);
    const seq = Number(request.headers.get("x-sequence"));
    const duration = Number(request.headers.get("x-duration-ms") || 0);
    const sha = String(request.headers.get("x-sha256") || "").slice(0, 128);
    const mime = (request.headers.get("content-type") || "").split(";")[0].toLowerCase();
    const length = Number(request.headers.get("content-length") || 0);
    if (!Number.isInteger(seq) || seq < 0 || seq > 100000) return json({ error: "Số thứ tự phần ghi không hợp lệ." }, 400);
    if (!ALLOWED_AUDIO.has(mime)) return json({ error: "Định dạng audio không được hỗ trợ." }, 415);
    if (length > MAX_PART_BYTES) return json({ error: "Phần ghi âm vượt quá 16 MB." }, 413);
    const existing = await env.DB.prepare("SELECT bytes, sha256 FROM audio_parts WHERE meeting_id = ? AND seq = ?").bind(meetingId, seq).first();
    if (existing) {
      if (!sha || existing.sha256 === sha) return json({ ok: true, duplicate: true, seq });
      return json({ error: "Số thứ tự phần ghi đã tồn tại với nội dung khác." }, 409);
    }
    const buffer = await request.arrayBuffer();
    if (!buffer.byteLength || buffer.byteLength > MAX_PART_BYTES) return json({ error: "Phần ghi âm trống hoặc quá lớn." }, 413);
    const usage = await env.DB.prepare("SELECT COALESCE(SUM(bytes), 0) AS total FROM audio_parts").first();
    if (Number(usage?.total || 0) + buffer.byteLength >= MAX_STORAGE_BYTES) return json({ error: "Đã chạm giới hạn lưu trữ 8 GiB." }, 507);
    const key = `meetings/${meetingId}/audio/${String(seq).padStart(6, "0")}.${extensionFor(mime)}`;
    await env.AUDIO.put(key, buffer, { httpMetadata: { contentType: mime }, customMetadata: { meetingId, seq: String(seq), sha256: sha } });
    try {
      await env.DB.prepare(
        "INSERT INTO audio_parts (id, meeting_id, seq, r2_key, mime, bytes, sha256, duration_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ).bind(crypto.randomUUID(), meetingId, seq, key, mime, buffer.byteLength, sha || null, Number.isFinite(duration) ? duration : null).run();
    } catch (error) {
      await env.AUDIO.delete(key);
      throw error;
    }
    await audit(env, user.id, meetingId, "audio_part.uploaded");
    return json({ ok: true, seq, bytes: buffer.byteLength }, 201);
  }

  const transcriptRoute = url.pathname.match(/^\/api\/meetings\/([^/]+)\/transcript$/);
  if (transcriptRoute && request.method === "POST") {
    const meetingId = decodeURIComponent(transcriptRoute[1]);
    const meeting = await ownedMeeting(env, meetingId, user.id);
    if (!meeting) return json({ error: "Không tìm thấy cuộc họp." }, 404);
    const body = await request.json().catch(() => ({}));
    const text = String(body.text || "").trim().slice(0, 4000);
    if (!text) return json({ error: "Văn bản trống." }, 400);
    const id = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO transcript_segments (id, meeting_id, source, start_ms, end_ms, text, state) VALUES (?, ?, ?, ?, ?, ?, 'draft')",
    ).bind(id, meetingId, body.source === "browser" ? "browser" : "manual", Number(body.start_ms || 0), Number(body.end_ms || 0), text).run();
    return json({ id }, 201);
  }

  const finishRoute = url.pathname.match(/^\/api\/meetings\/([^/]+)\/finish$/);
  if (finishRoute && request.method === "POST") {
    const meetingId = decodeURIComponent(finishRoute[1]);
    const meeting = await ownedMeeting(env, meetingId, user.id);
    if (!meeting) return json({ error: "Không tìm thấy cuộc họp." }, 404);
    const endedAt = new Date().toISOString();
    await env.DB.prepare("UPDATE meetings SET status = 'finished', ended_at = ? WHERE id = ? AND owner_id = ?").bind(endedAt, meetingId, user.id).run();
    await audit(env, user.id, meetingId, "meeting.finished");
    return json({ ok: true, ended_at: endedAt });
  }

  const audioRoute = url.pathname.match(/^\/api\/meetings\/([^/]+)\/audio\/(\d+)$/);
  if (audioRoute && request.method === "GET") {
    const meetingId = decodeURIComponent(audioRoute[1]);
    const meeting = await ownedMeeting(env, meetingId, user.id);
    if (!meeting) return new Response("Not found", { status: 404 });
    const part = await env.DB.prepare("SELECT r2_key, mime FROM audio_parts WHERE meeting_id = ? AND seq = ?").bind(meetingId, Number(audioRoute[2])).first();
    if (!part) return new Response("Not found", { status: 404 });
    const object = await env.AUDIO.get(part.r2_key);
    if (!object) return new Response("Not found", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("content-type", part.mime);
    headers.set("cache-control", "private, no-store");
    headers.set("content-disposition", `inline; filename="meeting-part-${audioRoute[2]}.${extensionFor(part.mime)}"`);
    await audit(env, user.id, meetingId, "audio_part.played");
    return new Response(object.body, { headers });
  }

  return json({ error: "Không tìm thấy endpoint." }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) return await apiHandler(request, env, url, userFrom(request));
      if (url.pathname !== "/") return new Response("Not found", { status: 404 });
      return new Response(page, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src 'self' blob:; connect-src 'self'; img-src 'self' data:; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com",
          "referrer-policy": "no-referrer",
          "x-content-type-options": "nosniff",
        },
      });
    } catch (error) {
      console.error(error);
      if (url.pathname.startsWith("/api/")) return json({ error: "Lỗi máy chủ. Vui lòng thử lại." }, 500);
      return new Response("Internal server error", { status: 500 });
    }
  },
};
