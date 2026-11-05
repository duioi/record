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
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f4f2ec">
  <title>UMC Meeting Recorder</title>
  <style>
    :root{--ink:#17231f;--muted:#64716c;--line:#d8dcd5;--paper:#f3f2ed;--card:#fffefa;--green:#185441;--green-hover:#103f31;--mint:#e0eee6;--red:#a93632;--amber:#a75e12;--focus:#3d8069;--shadow:0 16px 45px rgba(22,48,39,.08);font-family:Inter,"Segoe UI",Arial,sans-serif;color:var(--ink);background:var(--paper);color-scheme:light}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-width:320px;min-height:100vh;min-height:100dvh;overflow-x:hidden;background:radial-gradient(circle at 12% 0,#fff 0,transparent 34rem),var(--paper);line-height:1.45}button,input,select{font:inherit}button{min-height:44px;cursor:pointer;touch-action:manipulation}button:disabled{cursor:not-allowed;opacity:.48}button:active:not(:disabled){filter:brightness(.94)}:focus-visible{outline:3px solid rgba(61,128,105,.32);outline-offset:2px}.skip-link{position:fixed;left:16px;top:12px;z-index:100;transform:translateY(-150%);border-radius:10px;background:var(--green);color:white;padding:10px 14px;text-decoration:none}.skip-link:focus{transform:none}
    .shell{width:min(100%,1500px);margin:auto;padding:clamp(16px,2vw,28px) clamp(16px,2.5vw,36px) 44px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:22px}.brand{display:flex;align-items:center;gap:12px;min-width:0}.mark{width:44px;height:44px;flex:0 0 auto;border-radius:14px;background:var(--green);display:grid;place-items:center;color:white;font-weight:800;letter-spacing:-1px;box-shadow:0 8px 20px rgba(24,84,65,.18)}.brand h1{font-size:18px;margin:0}.brand p{font-size:12px;color:var(--muted);margin:3px 0 0}.topmeta{display:flex;align-items:center;gap:10px}.pill{border:1px solid var(--line);background:rgba(255,255,255,.78);padding:8px 12px;border-radius:999px;font-size:12px;color:var(--muted);white-space:nowrap}.online:before,.offline:before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#2e8a62;margin-right:7px}.offline:before{background:var(--red)}
    .layout{display:grid;grid-template-columns:minmax(280px,310px) minmax(420px,1fr) minmax(290px,330px);align-items:start;gap:18px}.panel{background:rgba(255,254,250,.94);border:1px solid rgba(202,207,199,.92);border-radius:22px;box-shadow:var(--shadow)}.side,.right{height:calc(100dvh - 118px);min-height:620px;position:sticky;top:18px;display:flex;flex-direction:column}.side{padding:20px}.side h2,.right h2{font-size:12px;text-transform:uppercase;letter-spacing:.13em;color:var(--muted);margin:0 0 16px}.field{margin-bottom:14px}.field label{display:block;font-size:12px;font-weight:700;margin-bottom:7px}.input{width:100%;min-height:44px;border:1px solid var(--line);border-radius:12px;background:white;padding:10px 12px;color:var(--ink);outline:none}.input:focus{border-color:var(--focus);box-shadow:0 0 0 3px rgba(61,128,105,.13)}
    .record-orb{width:144px;height:144px;border-radius:50%;margin:14px auto 18px;border:1px solid #cfd7d1;background:radial-gradient(circle at 40% 30%,#fff 0,#e9eee8 60%,#d7dfda);display:grid;place-items:center;position:relative;box-shadow:inset 0 0 0 13px rgba(255,255,255,.58),0 12px 30px rgba(22,48,39,.08)}.record-orb:after{content:"";width:52px;height:52px;background:var(--red);border-radius:50%;box-shadow:0 0 0 9px rgba(169,54,50,.12)}.recording .record-orb:after{animation:pulse 1.6s infinite}.paused .record-orb:after{border-radius:10px;background:var(--amber);animation:none}@keyframes pulse{50%{box-shadow:0 0 0 22px rgba(169,54,50,0)}}
    .audio-monitor{border:1px solid var(--line);border-radius:14px;background:#f8f8f4;padding:10px 11px;margin:0 0 10px}.audio-monitor-head,.audio-monitor-foot{display:flex;align-items:center;justify-content:space-between;gap:8px}.audio-monitor-head{font-size:11px;color:var(--muted);margin-bottom:6px}.audio-monitor-head strong{color:var(--ink);font-variant-numeric:tabular-nums}.audio-monitor canvas{display:block;width:100%;height:64px;border-radius:8px;background:linear-gradient(180deg,#eef3ef,#f8f8f3)}.audio-monitor-foot{font-size:11px;color:var(--muted);margin-top:6px}.audio-monitor-foot strong{color:var(--green);font-variant-numeric:tabular-nums}.timer{text-align:center;font-variant-numeric:tabular-nums;font-size:34px;font-weight:760;letter-spacing:.035em}.state{text-align:center;color:var(--muted);font-size:12px;margin:5px 0 16px}.primary{width:100%;border:0;border-radius:13px;background:var(--green);color:white;padding:12px 15px;font-weight:750;box-shadow:0 7px 18px rgba(24,84,65,.16)}.primary:hover:not(:disabled){background:var(--green-hover)}.controls{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:9px}.secondary,.danger,.ghost{border:1px solid var(--line);border-radius:12px;background:white;padding:10px 12px;font-weight:680}.danger{color:var(--red);border-color:#e5c6c2}.side-foot{margin-top:auto;border-top:1px solid var(--line);padding-top:12px}.sync-row{display:flex;justify-content:space-between;gap:12px;font-size:12px;color:var(--muted);margin:7px 0}.sync-row strong{color:var(--ink);text-align:right}
    .main{min-height:620px;overflow:hidden}.meeting-head{min-height:118px;padding:23px 25px 18px;border-bottom:1px solid var(--line);display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--green);font-weight:800}.meeting-head h2{font-size:clamp(23px,2.2vw,29px);line-height:1.15;letter-spacing:-.035em;margin:6px 0 7px;overflow-wrap:anywhere}.meeting-head p{font-size:13px;line-height:1.5;color:var(--muted);margin:0}.live-tag{flex:0 0 auto;padding:8px 11px;border-radius:999px;background:#f5e0dd;color:var(--red);font-size:11px;font-weight:800;letter-spacing:.08em;white-space:nowrap}.transcript{padding:25px;height:calc(100dvh - 236px);min-height:502px;overflow:auto;overscroll-behavior:contain;scroll-behavior:smooth}.empty{height:100%;min-height:150px;display:grid;place-items:center;text-align:center;color:var(--muted)}.empty .icon{width:66px;height:66px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;margin:auto auto 14px;color:var(--green);background:#fbfcf8}.empty .icon svg{width:27px;height:27px}.empty h3{color:var(--ink);margin:0 0 7px;font-size:17px}.empty p{max-width:350px;font-size:13px;line-height:1.6;margin:0}
    .segment{display:grid;grid-template-columns:58px minmax(0,1fr);gap:16px;padding:0 0 23px;position:relative}.segment:before{content:"";position:absolute;left:27px;top:25px;bottom:0;width:1px;background:var(--line)}.segment:last-child:before{display:none}.stamp{font-size:11px;color:var(--muted);padding-top:4px}.bubble{background:white;border:1px solid var(--line);border-radius:15px;padding:13px 15px;line-height:1.6;font-size:14px;overflow-wrap:anywhere}.bubble.interim{color:var(--muted);border-style:dashed;background:#fbfaf6}.source{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#6f7d77;margin-top:7px}.audio-section{border-top:1px solid var(--line);padding-top:20px;margin-top:8px}.audio-section-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:4px}.audio-section-head span{font-size:12px;color:var(--muted)}.audio-row{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid #e9ebe6}.audio-label{font-size:12px;color:var(--muted);font-weight:700}.audio-row audio{display:block;width:100%;min-width:0;height:42px}.audio-error{grid-column:2;color:var(--red);font-size:12px;line-height:1.45}.audio-error a{color:inherit;font-weight:700}
    .right{padding:20px}.storage{border:1px solid var(--line);border-radius:16px;padding:15px;margin-bottom:18px;background:white}.storage-top{display:flex;justify-content:space-between;gap:10px;font-size:12px;margin-bottom:10px}.storage-top strong{white-space:nowrap}.bar{height:7px;border-radius:99px;background:#e8e9e3;overflow:hidden}.bar span{display:block;height:100%;width:0;background:var(--green);border-radius:inherit;transition:width .3s}.storage small{display:block;color:var(--muted);line-height:1.45;margin-top:8px}.history-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:3px}.history-head h2{margin-bottom:8px}.history-head button{min-height:44px;border:0;background:transparent;color:var(--green);font-size:12px;font-weight:700;padding:6px 8px}.history{overflow:auto;margin:0 -6px;padding:0 6px;overscroll-behavior:contain}.meeting-item{width:100%;min-height:60px;text-align:left;border:1px solid transparent;background:transparent;border-radius:14px;padding:11px 12px;margin-bottom:4px}.meeting-item:hover,.meeting-item.active{background:white;border-color:var(--line)}.meeting-item.active{box-shadow:0 5px 16px rgba(22,48,39,.06)}.meeting-item strong{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.meeting-item span{display:flex;justify-content:space-between;gap:10px;color:var(--muted);font-size:11px;margin-top:6px}.right-actions{margin-top:auto;padding-top:12px;border-top:1px solid var(--line);display:grid;grid-template-columns:1fr;gap:8px}.right-actions small{display:block;color:var(--muted);font-size:11px;line-height:1.45;margin-bottom:2px}.right-actions button{font-size:12px}.toast{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));background:#14251f;color:white;padding:12px 16px;border-radius:12px;box-shadow:0 12px 35px rgba(0,0,0,.18);font-size:13px;line-height:1.45;opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s;max-width:min(360px,calc(100vw - 32px));z-index:10}.toast.show{opacity:1;transform:none}.toast.error{background:#722b28}
    @media(max-width:1180px){.layout{grid-template-columns:minmax(270px,300px) minmax(0,1fr)}.right{position:relative;grid-column:1/-1;top:0;width:100%;height:auto;min-height:0}.right .history{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-height:310px}.right-actions{margin-top:14px}.main{min-width:0}}
    @media(max-width:760px){.shell{padding:14px 12px calc(28px + env(safe-area-inset-bottom))}.topbar{align-items:flex-start;gap:12px;margin-bottom:14px}.brand p{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:56vw}.topmeta .pill:first-child{display:none}.pill{padding:8px 10px}.layout{display:flex;flex-direction:column;gap:12px}.side,.right{position:relative;top:0;width:100%;height:auto;min-height:0}.side{padding:17px}.main{width:100%;min-height:0}.meeting-head{min-height:0;padding:19px 17px 16px;gap:12px}.meeting-head h2{font-size:22px}.meeting-head p{font-size:12px}.live-tag{padding:7px 9px}.transcript{height:auto;min-height:430px;max-height:none;padding:18px 16px}.record-orb{width:116px;height:116px;margin:10px auto 14px;box-shadow:inset 0 0 0 10px rgba(255,255,255,.58),0 10px 24px rgba(22,48,39,.07)}.record-orb:after{width:44px;height:44px}.timer{font-size:30px}.audio-monitor canvas{height:58px}.segment{grid-template-columns:43px minmax(0,1fr);gap:9px}.segment:before{left:20px}.bubble{padding:12px 13px}.audio-row{grid-template-columns:1fr;gap:6px;padding:12px 0}.audio-error{grid-column:1}.audio-label{display:flex;justify-content:space-between}.right{padding:17px}.right .history{display:block;max-height:390px}.toast{left:16px;right:16px;bottom:max(16px,env(safe-area-inset-bottom));max-width:none}}
    @media(max-width:390px){.brand h1{font-size:16px}.mark{width:40px;height:40px;border-radius:12px;font-size:13px}.topmeta{gap:0}.meeting-head{display:block}.live-tag{display:inline-block;margin-top:12px}.controls,.right-actions{grid-template-columns:1fr}.transcript{padding-inline:13px}.audio-monitor-head span{max-width:175px}.storage-top{display:block}.storage-top strong{display:block;margin-top:4px}}
    @media(max-height:760px) and (min-width:761px){.record-orb{width:104px;height:104px;margin:8px auto 10px}.record-orb:after{width:42px;height:42px}.audio-monitor canvas{height:52px}.side,.right{min-height:560px}.state{margin-bottom:10px}}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.recording .record-orb:after{animation:none}.bar span,.toast{transition:none}.transcript{scroll-behavior:auto}}
  </style>
</head>
<body>
  <a class="skip-link" href="#mainContent">Bỏ qua đến nội dung chính</a>
  <div class="shell" id="app">
    <header class="topbar">
      <div class="brand"><div class="mark">UMC</div><div><h1>Meeting Recorder</h1><p>Ghi âm an toàn · Phụ đề tiếng Việt</p></div></div>
      <div class="topmeta"><span class="pill">Truy cập trực tiếp</span><span class="pill online" id="netState">Đang kết nối</span></div>
    </header>
    <div class="layout">
      <aside class="panel side" id="controlPanel">
        <h2>Điều khiển cuộc họp</h2>
        <div class="field"><label for="title">Tên cuộc họp</label><input class="input" id="title" maxlength="120" placeholder="Ví dụ: Họp sản xuất ca sáng"></div>
        <div class="field"><label for="microphone">Thiết bị ghi âm</label><select class="input" id="microphone"><option value="">Micro mặc định</option></select></div>
        <div class="audio-monitor">
          <div class="audio-monitor-head"><span>Phổ âm đầu vào realtime</span><strong id="frequencyValue">-- Hz</strong></div>
          <canvas id="audioSpectrum" width="520" height="136" aria-label="Phổ tần số âm thanh đầu vào"></canvas>
          <div class="audio-monitor-foot"><span id="signalQuality">Chưa có tín hiệu</span><strong id="levelValue">-- dBFS</strong></div>
        </div>
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
      <main class="panel main" id="mainContent" tabindex="-1">
        <div class="meeting-head"><div><div class="eyebrow">Bản ghi trực tiếp</div><h2 id="currentTitle">Chưa bắt đầu cuộc họp</h2><p id="meetingMeta">Âm thanh gốc là dữ liệu chuẩn; hãy đối chiếu trước khi dùng số liệu.</p></div><div class="live-tag" id="liveTag">SẴN SÀNG</div></div>
        <section class="transcript" id="transcript" aria-live="polite"><div class="empty" id="emptyState"><div><div class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg></div><h3>Phụ đề sẽ xuất hiện ở đây</h3><p>Nhấn Bắt đầu để ghi âm. Nếu trình duyệt không hỗ trợ nhận diện trực tiếp, âm thanh vẫn được lưu bình thường.</p></div></div></section>
      </main>
      <aside class="panel right">
        <h2>Lưu trữ & lịch sử</h2>
        <div class="storage"><div class="storage-top"><span>Dung lượng audio</span><strong id="storageText">0 MB / 8 GB</strong></div><div class="bar"><span id="storageBar"></span></div><small id="storageHint">Hệ thống cảnh báo từ 70% và khóa upload ở 8 GiB.</small></div>
        <div class="history-head"><h2>Cuộc họp gần đây</h2><button id="refreshBtn">Làm mới</button></div>
        <div class="history" id="history"><div class="empty" style="height:170px"><div><p>Đang tải lịch sử…</p></div></div></div>
        <div class="right-actions"><small>Gồm toàn bộ audio, playlist, phụ đề TXT/SRT và metadata.</small><button class="primary" id="exportBtn" disabled>Tải bản ghi + phụ đề</button><button class="danger" id="deleteBtn" disabled>Xóa cuộc họp</button></div>
      </aside>
    </div>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script>
  (function(){
    "use strict";
    var state={meetingId:null,meeting:null,parts:[],stream:null,rawStream:null,audioContext:null,sourceNode:null,analyserNode:null,gainNode:null,compressorNode:null,spectrumFrame:null,recorder:null,recorders:[],queueJobs:[],recording:false,paused:false,startedAt:0,elapsedBeforePause:0,timerHandle:null,rolloverHandle:null,sequence:0,saved:0,pending:0,recognition:null,transcript:[],interimEl:null,selectedId:null,ending:false,lastQueueJob:null};
    var el={app:byId("app"),panel:byId("controlPanel"),title:byId("title"),mic:byId("microphone"),spectrum:byId("audioSpectrum"),frequency:byId("frequencyValue"),level:byId("levelValue"),signalQuality:byId("signalQuality"),timer:byId("timer"),recordState:byId("recordState"),start:byId("startBtn"),pause:byId("pauseBtn"),finish:byId("finishBtn"),saved:byId("savedParts"),pending:byId("pendingParts"),speech:byId("speechState"),currentTitle:byId("currentTitle"),meetingMeta:byId("meetingMeta"),liveTag:byId("liveTag"),transcript:byId("transcript"),empty:byId("emptyState"),history:byId("history"),storageText:byId("storageText"),storageBar:byId("storageBar"),storageHint:byId("storageHint"),net:byId("netState"),refresh:byId("refreshBtn"),exportBtn:byId("exportBtn"),deleteBtn:byId("deleteBtn"),toast:byId("toast")};
    function byId(id){return document.getElementById(id)}
    function api(path,options){return fetch(path,options||{}).then(async function(r){var data=null;try{data=await r.json()}catch(e){}if(!r.ok)throw new Error(data&&data.error?data.error:"Yêu cầu không thành công");return data})}
    function notify(message,isError){el.toast.textContent=message;el.toast.className="toast show"+(isError?" error":"");el.toast.setAttribute("role",isError?"alert":"status");clearTimeout(notify.timer);notify.timer=setTimeout(function(){el.toast.className="toast"},3500)}
    function formatTime(ms){var s=Math.max(0,Math.floor(ms/1000));var h=String(Math.floor(s/3600)).padStart(2,"0");var m=String(Math.floor((s%3600)/60)).padStart(2,"0");return h+":"+m+":"+String(s%60).padStart(2,"0")}
    function formatStamp(ms){var s=Math.floor((ms||0)/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
    function currentElapsed(){return state.elapsedBeforePause+(state.recording&&!state.paused?Date.now()-state.startedAt:0)}
    function updateTimer(){el.timer.textContent=formatTime(currentElapsed())}
    function setNetwork(){var on=navigator.onLine;el.net.textContent=on?"Đang kết nối":"Mất kết nối";el.net.className="pill "+(on?"online":"offline");if(on)flushQueue()}
    function setUi(mode){el.panel.classList.remove("recording","paused");if(mode==="recording")el.panel.classList.add("recording");if(mode==="paused")el.panel.classList.add("paused");el.start.disabled=mode!=="idle";el.title.disabled=mode!=="idle";el.mic.disabled=mode!=="idle";el.pause.disabled=mode==="idle"||mode==="ending";el.finish.disabled=mode==="idle"||mode==="ending";el.pause.textContent=mode==="paused"?"Tiếp tục":"Tạm dừng";el.liveTag.textContent=mode==="recording"?"● ĐANG GHI":mode==="paused"?"TẠM DỪNG":mode==="ending"?"ĐANG LƯU":"SẴN SÀNG";el.recordState.textContent=mode==="recording"?"Đang ghi · tăng âm 2× · đồng bộ từng phần":mode==="paused"?"Đã tạm dừng ghi âm":mode==="ending"?"Đang hoàn tất dữ liệu":"Sẵn sàng ghi âm"}
    async function listDevices(){try{var devices=await navigator.mediaDevices.enumerateDevices();var selected=el.mic.value;el.mic.innerHTML='<option value="">Micro mặc định</option>';devices.filter(function(d){return d.kind==="audioinput"}).forEach(function(d,i){var o=document.createElement("option");o.value=d.deviceId;o.textContent=d.label||("Micro "+(i+1));el.mic.appendChild(o)});el.mic.value=selected}catch(e){}}
    function chooseMime(){var options=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(var i=0;i<options.length;i++)if(MediaRecorder.isTypeSupported(options[i]))return options[i];return ""}
    async function prepareAudioStream(){
      var audio={echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:{ideal:1},sampleRate:{ideal:48000},sampleSize:{ideal:16}};
      if(el.mic.value)audio.deviceId={exact:el.mic.value};
      state.rawStream=await navigator.mediaDevices.getUserMedia({audio:audio});
      var rawTrack=state.rawStream.getAudioTracks()[0];
      if(rawTrack&&"contentHint" in rawTrack)rawTrack.contentHint="speech";
      state.stream=state.rawStream;
      var AudioContextClass=window.AudioContext||window.webkitAudioContext;
      if(!AudioContextClass)return;
      try{
        state.audioContext=new AudioContextClass();
        await state.audioContext.resume();
        state.sourceNode=state.audioContext.createMediaStreamSource(state.rawStream);
        state.analyserNode=state.audioContext.createAnalyser();
        state.analyserNode.fftSize=2048;
        state.analyserNode.smoothingTimeConstant=0.78;
        state.analyserNode.minDecibels=-90;
        state.analyserNode.maxDecibels=-10;
        state.gainNode=state.audioContext.createGain();
        state.gainNode.gain.value=2;
        state.compressorNode=state.audioContext.createDynamicsCompressor();
        state.compressorNode.threshold.value=-18;
        state.compressorNode.knee.value=12;
        state.compressorNode.ratio.value=4;
        state.compressorNode.attack.value=0.003;
        state.compressorNode.release.value=0.25;
        var destination=state.audioContext.createMediaStreamDestination();
        state.sourceNode.connect(state.analyserNode).connect(state.gainNode).connect(state.compressorNode).connect(destination);
        state.stream=destination.stream;
        startAudioVisualizer();
      }catch(e){
        if(state.audioContext){try{await state.audioContext.close()}catch(ignore){}}
        state.audioContext=null;state.sourceNode=null;state.analyserNode=null;state.gainNode=null;state.compressorNode=null;state.stream=state.rawStream;
      }
    }
    function startAudioVisualizer(){
      if(!state.analyserNode||!el.spectrum)return;
      if(state.spectrumFrame)cancelAnimationFrame(state.spectrumFrame);
      var analyser=state.analyserNode;
      var frequencyData=new Uint8Array(analyser.frequencyBinCount);
      var timeData=new Uint8Array(analyser.fftSize);
      var context=el.spectrum.getContext("2d");
      function draw(){
        if(!state.analyserNode||state.analyserNode!==analyser)return;
        state.spectrumFrame=requestAnimationFrame(draw);
        analyser.getByteFrequencyData(frequencyData);
        analyser.getByteTimeDomainData(timeData);
        var sum=0;
        for(var i=0;i<timeData.length;i++){var sample=(timeData[i]-128)/128;sum+=sample*sample}
        var rms=Math.sqrt(sum/timeData.length);
        var db=Math.max(-100,20*Math.log10(Math.max(rms,0.00001)));
        var sampleRate=state.audioContext?state.audioContext.sampleRate:48000;
        var firstBin=Math.max(1,Math.floor(60*analyser.fftSize/sampleRate));
        var lastBin=Math.min(frequencyData.length-1,Math.ceil(8000*analyser.fftSize/sampleRate));
        var peakBin=firstBin;var peakValue=0;
        for(var p=firstBin;p<=lastBin;p++){if(frequencyData[p]>peakValue){peakValue=frequencyData[p];peakBin=p}}
        var dominantHz=peakBin*sampleRate/analyser.fftSize;
        el.frequency.textContent=db>-62&&peakValue>8?Math.round(dominantHz)+" Hz":"-- Hz";
        el.level.textContent=db.toFixed(1)+" dBFS";
        if(db>-15){el.signalQuality.textContent="Tín hiệu rất mạnh";el.signalQuality.style.color="#b63a35"}
        else if(db>-38){el.signalQuality.textContent="Tín hiệu tốt";el.signalQuality.style.color="#174c3c"}
        else if(db>-55){el.signalQuality.textContent="Tín hiệu hơi yếu";el.signalQuality.style.color="#b36b18"}
        else{el.signalQuality.textContent="Tín hiệu rất yếu";el.signalQuality.style.color="#b63a35"}
        var rect=el.spectrum.getBoundingClientRect();var width=Math.max(220,Math.round(rect.width));var height=68;var ratio=Math.min(2,window.devicePixelRatio||1);
        if(el.spectrum.width!==Math.round(width*ratio)||el.spectrum.height!==Math.round(height*ratio)){el.spectrum.width=Math.round(width*ratio);el.spectrum.height=Math.round(height*ratio)}
        context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);
        var bars=48;var gap=2;var barWidth=(width-gap*(bars-1))/bars;
        for(var b=0;b<bars;b++){
          var start=Math.floor(firstBin+(lastBin-firstBin)*b/bars);var end=Math.max(start+1,Math.floor(firstBin+(lastBin-firstBin)*(b+1)/bars));var total=0;
          for(var f=start;f<end;f++)total+=frequencyData[f];
          var value=total/Math.max(1,end-start)/255;var barHeight=Math.max(2,value*height);var color=value>.82?"#b63a35":value>.55?"#b36b18":"#2a725b";
          context.fillStyle=color;context.fillRect(b*(barWidth+gap),height-barHeight,barWidth,barHeight);
        }
      }
      draw();
    }
    function resetAudioVisualizer(){
      if(state.spectrumFrame)cancelAnimationFrame(state.spectrumFrame);state.spectrumFrame=null;
      if(el.frequency)el.frequency.textContent="-- Hz";if(el.level)el.level.textContent="-- dBFS";
      if(el.signalQuality){el.signalQuality.textContent="Chưa có tín hiệu";el.signalQuality.style.color=""}
      if(el.spectrum){var context=el.spectrum.getContext("2d");context.clearRect(0,0,el.spectrum.width,el.spectrum.height)}
    }
    function releaseAudio(){
      resetAudioVisualizer();
      var streams=[state.stream,state.rawStream];
      streams.forEach(function(stream){if(stream)stream.getTracks().forEach(function(track){try{track.stop()}catch(e){}})});
      if(state.audioContext&&state.audioContext.state!=="closed")state.audioContext.close().catch(function(){});
      state.stream=null;state.rawStream=null;state.audioContext=null;state.sourceNode=null;state.analyserNode=null;state.gainNode=null;state.compressorNode=null;
    }
    async function startMeeting(){
      if(!window.MediaRecorder||!navigator.mediaDevices){notify("Trình duyệt này không hỗ trợ ghi âm.",true);return}
      var title=el.title.value.trim()||("Cuộc họp "+new Date().toLocaleString("vi-VN"));
      try{
        await prepareAudioStream();await listDevices();
        var created=await api("/api/meetings",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({title:title,language:"vi-VN"})});
        state.meetingId=created.id;state.selectedId=created.id;state.meeting=created;state.recording=true;state.paused=false;state.startedAt=Date.now();state.elapsedBeforePause=0;state.sequence=0;state.saved=0;state.transcript=[];state.recorders=[];state.queueJobs=[];state.ending=false;
        el.currentTitle.textContent=title;el.meetingMeta.textContent="Bắt đầu "+new Date().toLocaleTimeString("vi-VN")+" · Phụ đề tạm tính";clearTranscript();setUi("recording");updateTimer();state.timerHandle=setInterval(updateTimer,500);startPart();startRecognition();loadMeetings();notify("Đã bắt đầu ghi âm");
      }catch(e){releaseAudio();notify(e.message||"Không thể bắt đầu ghi âm",true)}
    }
    function startPart(){
      if(!state.recording||state.paused||state.ending||!state.stream)return;
      var mime=chooseMime();var options=mime?{mimeType:mime,audioBitsPerSecond:96000}:{audioBitsPerSecond:96000};
      try{var recorder=new MediaRecorder(state.stream,options);var partSeq=state.sequence++;state.recorder=recorder;var chunks=[];var partStarted=Date.now();recorder.ondataavailable=function(ev){if(ev.data&&ev.data.size)chunks.push(ev.data)};recorder.onstop=function(){state.recorders=state.recorders.filter(function(active){return active!==recorder});var blob=new Blob(chunks,{type:recorder.mimeType||mime||"audio/webm"});if(blob.size>0){var job=queuePart(state.meetingId,partSeq,blob,Date.now()-partStarted);state.lastQueueJob=job;state.queueJobs.push(job)}};recorder.start();state.recorders.push(recorder);clearTimeout(state.rolloverHandle);state.rolloverHandle=setTimeout(function(){if(recorder.state==="inactive")return;if(state.recording&&!state.paused&&!state.ending)startPart();if(recorder.state!=="inactive")recorder.stop()},30000)}catch(e){notify("Không thể tạo phần ghi âm: "+e.message,true)}
    }
    function stopCurrentPart(){clearTimeout(state.rolloverHandle);state.recorders.slice().forEach(function(recorder){if(recorder.state!=="inactive")recorder.stop()})}
    function togglePause(){if(!state.recording||state.ending)return;if(state.paused){state.paused=false;state.startedAt=Date.now();setUi("recording");startPart();startRecognition();notify("Đã tiếp tục ghi âm")}else{state.elapsedBeforePause=currentElapsed();state.paused=true;stopCurrentPart();stopRecognition();setUi("paused");updateTimer();notify("Đã tạm dừng")}}
    async function finishMeeting(){
      if(!state.recording||state.ending)return;if(!confirm("Kết thúc cuộc họp? Ứng dụng sẽ lưu phần ghi âm cuối và đồng bộ dữ liệu còn chờ."))return;
      state.ending=true;state.elapsedBeforePause=currentElapsed();state.recording=false;state.paused=false;clearInterval(state.timerHandle);clearTimeout(state.rolloverHandle);stopRecognition();stopCurrentPart();setUi("ending");
      try{await waitForRecorder();releaseAudio();await flushQueue();await api("/api/meetings/"+encodeURIComponent(state.meetingId)+"/finish",{method:"POST"});notify(state.pending?"Cuộc họp đã kết thúc; còn dữ liệu chờ đồng bộ.":"Cuộc họp đã lưu hoàn tất");state.selectedId=state.meetingId;await openMeeting(state.meetingId);await loadMeetings()}catch(e){notify(e.message,true)}finally{releaseAudio();state.meetingId=null;state.ending=false;setUi("idle");el.timer.textContent="00:00:00"}
    }
    function waitForRecorder(){return new Promise(function(resolve){var tries=0;var t=setInterval(function(){tries++;if(!state.recorders.length||tries>50){clearInterval(t);setTimeout(resolve,150)}},100)}).then(function(){return Promise.all(state.queueJobs.map(function(job){return job.catch(function(){})}))})}
    function startRecognition(){
      var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){el.speech.textContent="Không hỗ trợ";return}if(state.recognition)return;
      try{var r=new SR();r.lang="vi-VN";r.continuous=true;r.interimResults=true;r.maxAlternatives=1;r.onresult=function(event){var interim="";for(var i=event.resultIndex;i<event.results.length;i++){var text=event.results[i][0].transcript.trim();if(event.results[i].isFinal){addSegment(text,currentElapsed(),false);saveTranscript(text,currentElapsed())}else interim+=text+" "}showInterim(interim.trim())};r.onerror=function(event){if(event.error!=="no-speech"&&event.error!=="aborted")el.speech.textContent="Tạm gián đoạn"};r.onend=function(){state.recognition=null;if(state.recording&&!state.paused&&!state.ending)setTimeout(startRecognition,350)};state.recognition=r;var speechTrack=state.stream&&state.stream.getAudioTracks()[0];try{speechTrack?r.start(speechTrack):r.start()}catch(trackError){r.start()}el.speech.textContent="Hoạt động"}catch(e){state.recognition=null;el.speech.textContent="Không khả dụng"}
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
    async function loadMeetings(){
      try{
        var data=await api("/api/meetings");el.history.innerHTML="";
        if(!data.meetings.length){el.history.innerHTML='<div class="empty" style="height:170px"><div><p>Chưa có cuộc họp nào.</p></div></div>';return}
        data.meetings.forEach(function(m){
          var selected=m.id===state.selectedId;var b=document.createElement("button");b.className="meeting-item"+(selected?" active":"");b.type="button";if(selected)b.setAttribute("aria-current","true");
          var strong=document.createElement("strong");strong.textContent=m.title;var meta=document.createElement("span");var date=document.createElement("i");date.style.fontStyle="normal";date.textContent=new Date(m.started_at).toLocaleDateString("vi-VN");var count=document.createElement("i");count.style.fontStyle="normal";count.textContent=(m.part_count||0)+" phần";meta.appendChild(date);meta.appendChild(count);b.appendChild(strong);b.appendChild(meta);b.onclick=function(){openMeeting(m.id)};el.history.appendChild(b)
        })
      }catch(e){el.history.innerHTML='<div class="empty" style="height:170px"><div><p>Không tải được lịch sử.</p></div></div>'}
    }
    function addAudioPart(audioWrap,id,p){
      var row=document.createElement("div");row.className="audio-row";
      var lab=document.createElement("div");lab.className="audio-label";var name=document.createElement("span");name.textContent="Phần "+(p.seq+1);var duration=document.createElement("span");duration.textContent=p.duration_ms?formatStamp(p.duration_ms):"";lab.appendChild(name);lab.appendChild(duration);
      var audio=document.createElement("audio");audio.controls=true;audio.preload="none";audio.setAttribute("aria-label","Nghe phần "+(p.seq+1));var audioUrl="/api/meetings/"+encodeURIComponent(id)+"/audio/"+p.seq;audio.src=audioUrl;
      audio.addEventListener("play",function(){document.querySelectorAll("audio").forEach(function(other){if(other!==audio&&!other.paused)other.pause()})});
      audio.addEventListener("error",function(){
        if(row.querySelector(".audio-error"))return;var message=document.createElement("div");message.className="audio-error";message.appendChild(document.createTextNode("Không phát được phần này. "));var link=document.createElement("a");link.href=audioUrl;link.target="_blank";link.rel="noopener";link.textContent="Mở audio trực tiếp";message.appendChild(link);row.appendChild(message);notify("Không thể phát phần "+(p.seq+1)+". Hãy thử mở audio trực tiếp.",true)
      });
      row.appendChild(lab);row.appendChild(audio);audioWrap.appendChild(row)
    }
    async function openMeeting(id){
      try{
        var data=await api("/api/meetings/"+encodeURIComponent(id));state.selectedId=id;state.meeting=data.meeting;state.parts=data.parts||[];state.transcript=data.transcript||[];el.currentTitle.textContent=data.meeting.title;el.meetingMeta.textContent=(data.meeting.status==="finished"?"Đã kết thúc":"Đang ghi")+" · "+new Date(data.meeting.started_at).toLocaleString("vi-VN")+" · "+data.parts.length+" phần audio";clearTranscript();
        if(!state.transcript.length){var box=document.createElement("div");box.className="empty";box.innerHTML='<div><div class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h2l2-5 4 10 3-7 2 2h3"/></svg></div><h3>Chưa có văn bản</h3><p>Bạn vẫn có thể nghe lại từng phần âm thanh đã lưu.</p></div>';el.transcript.appendChild(box)}else state.transcript.forEach(function(s){addSegment(s.text,s.start_ms||0,false)});
        if(data.parts.length){var audioWrap=document.createElement("section");audioWrap.className="audio-section";var header=document.createElement("div");header.className="audio-section-head";var heading=document.createElement("div");heading.className="eyebrow";heading.textContent="Nghe lại từng phần";var help=document.createElement("span");help.textContent="Chọn Play để nghe · chỉ phát một phần cùng lúc";header.appendChild(heading);header.appendChild(help);audioWrap.appendChild(header);data.parts.forEach(function(p){addAudioPart(audioWrap,id,p)});el.transcript.appendChild(audioWrap)
        }
        el.exportBtn.disabled=false;el.deleteBtn.disabled=false;loadMeetings()
      }catch(e){notify(e.message,true)}
    }
    async function loadStorage(){try{var d=await api("/api/storage");var mb=d.used_bytes/1024/1024;var pct=Math.min(100,d.used_bytes/d.limit_bytes*100);el.storageText.textContent=(mb<1024?mb.toFixed(1)+" MB":(mb/1024).toFixed(2)+" GB")+" / 8 GB";el.storageBar.style.width=pct+"%";el.storageBar.style.background=pct>=80?"var(--red)":pct>=70?"var(--amber)":"var(--green)";el.storageHint.textContent=pct>=80?"Cảnh báo mạnh: dung lượng đã vượt 80%.":pct>=70?"Cảnh báo: dung lượng đã vượt 70%.":"Hệ thống cảnh báo từ 70% và khóa upload ở 8 GiB."}catch(e){}}
    function safeFileName(value){return String(value||"").replace(/[<>:"\/\\|?*\u0000-\u001F]/g,"_").replace(/[. ]+$/g,"").slice(0,80)||"cuoc-hop"}
    function fileDate(value){var d=new Date(value||Date.now());return String(d.getFullYear())+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-"+String(d.getHours()).padStart(2,"0")+String(d.getMinutes()).padStart(2,"0")}
    function audioExtension(mime){mime=String(mime||"");if(mime.includes("ogg"))return"ogg";if(mime.includes("wav"))return"wav";if(mime.includes("mp4"))return"m4a";return"webm"}
    function transcriptText(){if(!state.meeting)return"";var lines=[state.meeting.title,"Bắt đầu: "+(state.meeting.started_at||""),"Kết thúc: "+(state.meeting.ended_at||"Chưa kết thúc"),"Trạng thái: "+(state.meeting.status||""),""];if(!(state.transcript||[]).length)lines.push("(Chưa có transcript)");else(state.transcript||[]).forEach(function(s){lines.push("["+formatStamp(s.start_ms||0)+"] "+s.text)});return lines.join("\n")}
    function subtitleTime(ms){var value=Math.max(0,Math.round(Number(ms)||0));var h=Math.floor(value/3600000);var m=Math.floor(value%3600000/60000);var s=Math.floor(value%60000/1000);var milli=value%1000;return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+","+String(milli).padStart(3,"0")}
    function subtitleText(){var segments=state.transcript||[];if(!segments.length)return"";var blocks=[];segments.forEach(function(segment,index){var start=Math.max(0,Number(segment.start_ms)||0);var next=segments[index+1];var end=Number(segment.end_ms)||0;if(end<=start)end=next&&Number(next.start_ms)>start?Number(next.start_ms):start+4000;blocks.push(String(index+1)+"\n"+subtitleTime(start)+" --> "+subtitleTime(end)+"\n"+String(segment.text||"").trim())});return blocks.join("\n\n")+"\n"}
    function exportAudioFiles(){return(state.parts||[]).map(function(part){return{part:part,name:"audio-"+String(part.seq+1).padStart(4,"0")+"."+audioExtension(part.mime)}})}
    function playlistText(files){var lines=["#EXTM3U"];files.forEach(function(file,index){var seconds=Math.max(0,Number(file.part.duration_ms)||0)/1000;lines.push("#EXTINF:"+seconds.toFixed(3)+",Phần "+(index+1));lines.push(file.name)});return lines.join("\n")+"\n"}
    function guideText(){return["BẢN GHI CUỘC HỌP",state.meeting?state.meeting.title:"","","Toàn bộ thời lượng ghi được lưu theo các tệp audio đánh số thứ tự.","Mở play-all.m3u bằng VLC hoặc trình phát hỗ trợ playlist để nghe lần lượt toàn bộ buổi họp.","transcript.txt: nội dung phụ đề dễ đọc.","subtitles.srt: phụ đề có mốc thời gian để nhập vào trình phát/video.","metadata.json: thông tin kỹ thuật của cuộc họp và từng phần audio.","","Lưu ý: phụ đề nhận diện từ trình duyệt có thể cần hiệu đính."].join("\n")}
    async function writeDirectoryFile(directory,name,data){var handle=await directory.getFileHandle(name,{create:true});var writable=await handle.createWritable();try{await writable.write(data)}finally{await writable.close()}}
    function triggerDownload(data,name){var url=URL.createObjectURL(data);var a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},60000)}
    async function fetchAudioFile(file,index,total){el.exportBtn.textContent="Đang tải audio "+(index+1)+"/"+total;var response=await fetch("/api/meetings/"+encodeURIComponent(state.selectedId)+"/audio/"+file.part.seq);if(!response.ok)throw new Error("Không tải được phần audio "+(file.part.seq+1));return response.blob()}
    function baseExportEntries(files){
      var totalDuration=(state.parts||[]).reduce(function(sum,part){return sum+(Number(part.duration_ms)||0)},0);
      var metadata={meeting:state.meeting,parts:state.parts,total_duration_ms:totalDuration,exported_at:new Date().toISOString()};
      return[
        {name:"HUONG-DAN.txt",data:new Blob(["\ufeff"+guideText()],{type:"text/plain;charset=utf-8"})},
        {name:"transcript.txt",data:new Blob(["\ufeff"+transcriptText()],{type:"text/plain;charset=utf-8"})},
        {name:"subtitles.srt",data:new Blob(["\ufeff"+subtitleText()],{type:"application/x-subrip;charset=utf-8"})},
        {name:"play-all.m3u",data:new Blob(["\ufeff"+playlistText(files)],{type:"audio/x-mpegurl;charset=utf-8"})},
        {name:"metadata.json",data:new Blob([JSON.stringify(metadata,null,2)],{type:"application/json;charset=utf-8"})}
      ]
    }
    var zipCrcTable=null;
    function getZipCrcTable(){if(zipCrcTable)return zipCrcTable;zipCrcTable=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;zipCrcTable[n]=c>>>0}return zipCrcTable}
    async function crc32Blob(blob){var table=getZipCrcTable();var crc=0xffffffff;function update(bytes){for(var i=0;i<bytes.length;i++)crc=table[(crc^bytes[i])&255]^(crc>>>8)}if(blob.stream){var reader=blob.stream().getReader();while(true){var chunk=await reader.read();if(chunk.done)break;update(chunk.value)}}else update(new Uint8Array(await blob.arrayBuffer()));return(crc^0xffffffff)>>>0}
    function zipDateTime(value){var d=new Date(value||Date.now());var year=Math.min(2107,Math.max(1980,d.getFullYear()));return{date:((year-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate(),time:(d.getHours()<<11)|(d.getMinutes()<<5)|Math.floor(d.getSeconds()/2)}}
    async function createZip(entries){
      if(entries.length>65535)throw new Error("Gói tải xuống có quá nhiều tệp.");var encoder=new TextEncoder();var localParts=[];var centralRecords=[];var offset=0;var stamp=zipDateTime(state.meeting&&state.meeting.started_at);
      for(var i=0;i<entries.length;i++){
        el.exportBtn.textContent="Đang đóng gói "+(i+1)+"/"+entries.length;var entry=entries[i];var data=entry.data instanceof Blob?entry.data:new Blob([entry.data]);var name=encoder.encode(entry.name);if(data.size>0xffffffff||offset>0xffffffff)throw new Error("Bản ghi quá lớn để đóng gói ZIP trên trình duyệt.");var crc=await crc32Blob(data);var local=new Uint8Array(30);var view=new DataView(local.buffer);view.setUint32(0,0x04034b50,true);view.setUint16(4,20,true);view.setUint16(6,0x0800,true);view.setUint16(8,0,true);view.setUint16(10,stamp.time,true);view.setUint16(12,stamp.date,true);view.setUint32(14,crc,true);view.setUint32(18,data.size,true);view.setUint32(22,data.size,true);view.setUint16(26,name.length,true);view.setUint16(28,0,true);localParts.push(local,name,data);centralRecords.push({name:name,size:data.size,crc:crc,offset:offset});offset+=local.length+name.length+data.size
      }
      var centralOffset=offset;var centralParts=[];
      centralRecords.forEach(function(record){var header=new Uint8Array(46);var view=new DataView(header.buffer);view.setUint32(0,0x02014b50,true);view.setUint16(4,20,true);view.setUint16(6,20,true);view.setUint16(8,0x0800,true);view.setUint16(10,0,true);view.setUint16(12,stamp.time,true);view.setUint16(14,stamp.date,true);view.setUint32(16,record.crc,true);view.setUint32(20,record.size,true);view.setUint32(24,record.size,true);view.setUint16(28,record.name.length,true);view.setUint16(30,0,true);view.setUint16(32,0,true);view.setUint16(34,0,true);view.setUint16(36,0,true);view.setUint32(38,0,true);view.setUint32(42,record.offset,true);centralParts.push(header,record.name);offset+=header.length+record.name.length});
      var centralSize=offset-centralOffset;if(offset>0xffffffff)throw new Error("Bản ghi quá lớn để đóng gói ZIP trên trình duyệt.");var end=new Uint8Array(22);var endView=new DataView(end.buffer);endView.setUint32(0,0x06054b50,true);endView.setUint16(4,0,true);endView.setUint16(6,0,true);endView.setUint16(8,entries.length,true);endView.setUint16(10,entries.length,true);endView.setUint32(12,centralSize,true);endView.setUint32(16,centralOffset,true);endView.setUint16(20,0,true);return new Blob(localParts.concat(centralParts,[end]),{type:"application/zip"})
    }
    async function downloadMeetingBundle(){
      if(!state.meeting||!state.selectedId)return;
      if(!state.parts.length){notify("Cuộc họp chưa có phần audio để tải xuống.",true);return}var previousText=el.exportBtn.textContent;el.exportBtn.disabled=true;el.exportBtn.setAttribute("aria-busy","true");
      try{
        var folderName=fileDate(state.meeting.started_at)+"_"+safeFileName(state.meeting.title);
        var audioFiles=exportAudioFiles();var entries=baseExportEntries(audioFiles);
        if(window.showDirectoryPicker){
          var root=await window.showDirectoryPicker({mode:"readwrite"});
          var directory=await root.getDirectoryHandle(folderName,{create:true});
          for(var e=0;e<entries.length;e++)await writeDirectoryFile(directory,entries[e].name,entries[e].data);
          for(var i=0;i<state.parts.length;i++){
            var file=audioFiles[i];await writeDirectoryFile(directory,file.name,await fetchAudioFile(file,i,audioFiles.length));
          }
          notify("Đã lưu toàn bộ bản ghi và phụ đề vào thư mục "+folderName);
        }else{
          for(var j=0;j<audioFiles.length;j++)entries.push({name:audioFiles[j].name,data:await fetchAudioFile(audioFiles[j],j,audioFiles.length)});var archive=await createZip(entries);triggerDownload(archive,folderName+".zip");notify("Đã tải gói bản ghi đầy đủ kèm phụ đề");
        }
      }catch(e){if(e&&e.name!=="AbortError")notify(e.message||"Không thể tải bản ghi",true)}finally{el.exportBtn.textContent=previousText;el.exportBtn.disabled=false;el.exportBtn.removeAttribute("aria-busy")}
    }
    async function deleteMeeting(){if(!state.selectedId||!confirm("Xóa vĩnh viễn cuộc họp này cùng toàn bộ audio và transcript?"))return;try{await api("/api/meetings/"+encodeURIComponent(state.selectedId),{method:"DELETE"});state.selectedId=null;state.meeting=null;state.parts=[];state.transcript=[];el.exportBtn.disabled=true;el.deleteBtn.disabled=true;el.currentTitle.textContent="Chưa bắt đầu cuộc họp";el.meetingMeta.textContent="Âm thanh gốc là dữ liệu chuẩn; hãy đối chiếu trước khi dùng số liệu.";el.transcript.innerHTML='<div class="empty"><div><div class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg></div><h3>Phụ đề sẽ xuất hiện ở đây</h3><p>Nhấn Bắt đầu để ghi âm.</p></div></div>';await loadMeetings();await loadStorage();notify("Đã xóa cuộc họp")}catch(e){notify(e.message,true)}}
    el.start.addEventListener("click",startMeeting);el.pause.addEventListener("click",togglePause);el.finish.addEventListener("click",finishMeeting);el.refresh.addEventListener("click",function(){loadMeetings();loadStorage()});el.exportBtn.addEventListener("click",downloadMeetingBundle);el.deleteBtn.addEventListener("click",deleteMeeting);window.addEventListener("online",setNetwork);window.addEventListener("offline",setNetwork);window.addEventListener("beforeunload",function(e){if(state.recording||state.pending){e.preventDefault();e.returnValue=""}});
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

function getDeviceId(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(
    /(?:^|;\s*)umc_device=([0-9a-f-]{36})(?:;|$)/i,
  );

  return match ? match[1] : null;
}

function userFrom(request) {
  const email = request.headers.get("cf-access-authenticated-user-email");
  const deviceId = getDeviceId(request);

  return {
    id: email
      ? `access:${email.trim().toLowerCase()}`
      : deviceId
        ? `device:${deviceId}`
        : null,
    email: email || null,
  };
}

function extensionFor(mime) {
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mp4")) return "m4a";
  return "webm";
}

function parseByteRange(value, size) {
  if (!value) return undefined;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2]) || size <= 0) return null;

  let start;
  let end;
  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return null;
    if (start >= size || end < start) return null;
    end = Math.min(end, size - 1);
  }

  return { start, end, length: end - start + 1 };
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
  if (audioRoute && (request.method === "GET" || request.method === "HEAD")) {
    const meetingId = decodeURIComponent(audioRoute[1]);
    const meeting = await ownedMeeting(env, meetingId, user.id);
    if (!meeting) return new Response("Not found", { status: 404 });
    const part = await env.DB.prepare("SELECT r2_key, mime FROM audio_parts WHERE meeting_id = ? AND seq = ?").bind(meetingId, Number(audioRoute[2])).first();
    if (!part) return new Response("Not found", { status: 404 });
    const metadata = await env.AUDIO.head(part.r2_key);
    if (!metadata) return new Response("Not found", { status: 404 });
    const headers = new Headers();
    metadata.writeHttpMetadata(headers);
    headers.set("content-type", part.mime);
    headers.set("accept-ranges", "bytes");
    headers.set("cache-control", "private, max-age=0, must-revalidate");
    headers.set("content-disposition", `inline; filename="meeting-part-${audioRoute[2]}.${extensionFor(part.mime)}"`);
    if (metadata.httpEtag) headers.set("etag", metadata.httpEtag);

    if (request.method === "HEAD") {
      headers.set("content-length", String(metadata.size));
      return new Response(null, { headers });
    }

    const range = parseByteRange(request.headers.get("range"), metadata.size);
    if (range === null) {
      headers.set("content-range", `bytes */${metadata.size}`);
      return new Response(null, { status: 416, headers });
    }

    const object = range
      ? await env.AUDIO.get(part.r2_key, { range: { offset: range.start, length: range.length } })
      : await env.AUDIO.get(part.r2_key);
    if (!object) return new Response("Not found", { status: 404 });

    if (range) {
      headers.set("content-range", `bytes ${range.start}-${range.end}/${metadata.size}`);
      headers.set("content-length", String(range.length));
    } else {
      headers.set("content-length", String(metadata.size));
    }

    if (!range || range.start === 0) {
      try {
        await audit(env, user.id, meetingId, "audio_part.played");
      } catch (error) {
        console.error("Could not write playback audit event", error);
      }
    }
    return new Response(object.body, { status: range ? 206 : 200, headers });
  }

  return json({ error: "Không tìm thấy endpoint." }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) {
        return await apiHandler(request, env, url, userFrom(request));
      }

      if (url.pathname !== "/") {
        return new Response("Not found", { status: 404 });
      }

      const headers = new Headers({
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src 'self' blob:; connect-src 'self'; img-src 'self' data:",
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff",
      });

      if (!getDeviceId(request)) {
        headers.append(
          "set-cookie",
          `umc_device=${crypto.randomUUID()}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
        );
      }

      return new Response(page, { headers });
    } catch (error) {
      console.error(error);
      if (url.pathname.startsWith("/api/")) return json({ error: "Lỗi máy chủ. Vui lòng thử lại." }, 500);
      return new Response("Internal server error", { status: 500 });
    }
  },
};
