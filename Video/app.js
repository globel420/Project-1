(() => {
  const $ = id => document.getElementById(id);
  const {sections,scenes,makeTrace}=window.ProjectTrace;
  const source=window.PROJECT_SOURCE;
  let selected=makeTrace('setup'), position=0, timer=null, sectionShown='';
  const escapeHtml = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const names={globals:'Global declarations',setup:'setup()',main:'loop()',button:'handleModeButton()',counter:'incrementCounter()',binary:'showBinary()',clear:'turnOffDataLeds()',toggle:'toggleProjectMode()',indicators:'updateModeIndicators()',logic:'runProjectB()',serial:'printLogicStates()'};
  const edges={
    globals:[[0,1],[1,2]],setup:[[0,1],[1,2],[2,3],[3,4,'true'],[4,3,'next i'],[3,5,'false'],[5,6],[6,7]],
    main:[[0,1],[1,2,'true'],[1,3,'false'],[2,4],[3,4],[4,0,'again']],
    button:[[0,1],[1,2],[2,3,'stable'],[2,6,'waiting'],[3,4,'pressed'],[3,5,'released'],[3,6,'same'],[4,6],[5,6],[6,7]],
    counter:[[0,1],[1,2,'true'],[1,3,'false'],[2,3],[3,4],[4,5]],
    binary:[[0,1],[1,2],[2,3,'true'],[3,4],[4,2,'next i'],[2,5,'false']],
    clear:[[0,1],[1,2,'true'],[2,3],[3,1,'next i'],[1,4,'false']],
    toggle:[[0,1],[1,2],[2,3],[3,4,'true'],[3,5,'false'],[4,6],[5,6]],
    indicators:[[0,1],[1,2]],logic:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7,'yes'],[6,8,'no'],[7,8]],
    serial:[[0,1],[1,2],[2,3],[3,4],[4,5]]
  };
  scenes.forEach(scene=>{const o=document.createElement('option');o.value=scene.id;o.textContent=scene.title;$('scene').append(o);});
  function pause(){clearTimeout(timer);timer=null;$('play').textContent='Play';$('play').setAttribute('aria-pressed','false');}
  function move(delta){pause();position=Math.max(0,Math.min(selected.steps.length-1,position+delta));render();}
  function tick(){
    if(position>=selected.steps.length-1){pause();return;}
    timer=setTimeout(()=>{position++;render();tick();},Number($('speed').value));
  }
  function play(){if(timer){pause();return;}if(position===selected.steps.length-1){position=0;render();}$('play').textContent='Pause';$('play').setAttribute('aria-pressed','true');tick();}
  function chapters(){
    const holder=$('chapter');holder.innerHTML='';let previous='';
    selected.steps.forEach((step,i)=>{if(step.section!==previous){const option=document.createElement('option');option.value=i;option.textContent=`${i+1} · ${names[step.section]}`;holder.append(option);previous=step.section;}});
  }
  function load(id){pause();selected=makeTrace(id);position=0;sectionShown='';chapters();render();}
  function diagram(step){
    const def=sections[step.section], n=def.nodes.length;
    const h=430,gap=Math.min(65,380/Math.max(1,n-1)),start=(h-gap*(n-1))/2;
    const ys=def.nodes.map((_,i)=>start+gap*i),x=212;
    let body='<title>'+escapeHtml(names[step.section])+': '+escapeHtml(def.nodes[step.node])+'</title><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--line)"/></marker><marker id="loop-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--warm)"/></marker></defs>';
    edges[step.section].forEach(([a,b,label=''],i)=>{
      const back=b<a,side=Math.abs(b-a)>1||back;
      let d,tx,ty;
      if(side){const rail=back?398:(26+(i%3)*15),startX=back?324:100;
        d=`M${startX},${ys[a]} H${rail} V${ys[b]} H${startX}`;tx=back?rail-5:rail+5;ty=(ys[a]+ys[b])/2-5;
      }else{d=`M${x},${ys[a]+17} V${ys[b]-17}`;tx=x+7;ty=(ys[a]+ys[b])/2+4;}
      body+=`<path class="edge ${back?'loop':''}" d="${d}" marker-end="url(#${back?'loop-arrow':'arrow'})"/>`;
      if(label)body+=`<text class="small" x="${tx}" y="${ty}" text-anchor="${back?'end':'start'}">${escapeHtml(label)}</text>`;
    });
    def.nodes.forEach((label,i)=>{
      const y=ys[i],cls='node'+(step.node===i?' active':'');
      if(def.diamond===i)body+=`<path class="${cls}" d="M${x},${y-19} L330,${y} L${x},${y+19} L94,${y} Z"/>`;
      else body+=`<rect class="${cls}" x="100" y="${y-17}" width="224" height="34" rx="${i===def.nodes.length-1?17:5}"/>`;
      body+=`<text x="${x}" y="${y+4}" text-anchor="middle">${escapeHtml(label)}</text>`;
    });
    $('flow').setAttribute('viewBox','0 0 430 430');$('flow').innerHTML=body;
  }
  function renderCode(step){
    const holder=$('code');
    if(sectionShown!==step.section){
      sectionShown=step.section;const [from,to]=sections[step.section].range;
      holder.innerHTML=source.lines.slice(from-1,to).map((line,i)=>({n:from+i,line})).filter(x=>x.line.trim()&&!x.line.trim().startsWith('//')).map(({n,line})=>{
        const clean=line.replace(/\s+\/\/.*$/,'').trimEnd();
        return `<div class="code-line" data-line="${n}"><span class="number">${n}</span><span class="text">${escapeHtml(clean)}</span></div>`;
      }).join('');
    }
    holder.querySelectorAll('.code-line').forEach(el=>el.classList.toggle('active',step.lines.includes(Number(el.dataset.line))));
    const first=holder.querySelector('.active');
    if(first){const top=first.offsetTop-holder.offsetTop;holder.scrollTop=Math.max(0,top-holder.clientHeight*.35);}
  }
  function render(){
    const step=selected.steps[position],s=step.state;
    $('scene-title').textContent=selected.scene.title;
    $('step-count').textContent=`Step ${position+1} / ${selected.steps.length}`;
    const currentChapter=Array.from($('chapter').options).filter(o=>Number(o.value)<=position).at(-1);
    if(currentChapter)$('chapter').value=currentChapter.value;
    $('mode').textContent=s.projectBActive?'Project B · Logic':'Project A · Binary';
    $('counter').textContent=`Stored count: ${s.counter}`;
    $('function-name').textContent=names[step.section];
    $('line-ref').textContent='Lines '+step.lines.join(', ');
    $('explanation').textContent=step.text;
    $('iteration').textContent=s.i===null?'':`i = ${s.i}`;
    $('call-path').textContent=step.path;
    $('timeline').style.setProperty('--progress',`${(position+1)/selected.steps.length*100}%`);
    const labels=s.projectBActive?['A','B','NOT A','AND','OR','XOR']:['unused','16','8','4','2','1'];
    $('led-board').innerHTML=labels.map((v,i)=>`<div class="led-unit"><span>${v}</span><div class="lamp ${s.leds[i]?'on':''}" role="img" aria-label="D${7+i} ${v}: ${s.leds[i]?'on':'off'}"></div><small>D${7+i} · ${s.leds[i]}</small></div>`).join('');
    $('state-extra').innerHTML=`<div>Mode: ${s.modeButton}</div><div>A=${s.stateA} · B=${s.stateB}</div><div>D5=${s.modes[0]} · D6=${s.modes[1]}</div>`;
    $('back').disabled=position===0;$('next').disabled=position===selected.steps.length-1;
    renderCode(step);diagram(step);
  }
  $('scene').addEventListener('change',()=>load($('scene').value));
  $('chapter').addEventListener('change',()=>{pause();position=Number($('chapter').value);render();});
  $('play').addEventListener('click',play);
  $('next').addEventListener('click',()=>move(1));$('back').addEventListener('click',()=>move(-1));
  $('restart').addEventListener('click',()=>load($('scene').value));
  $('speed').addEventListener('change',()=>{if(timer){pause();play();}});
  $('record').addEventListener('click',()=>document.body.classList.toggle('recording'));
  document.addEventListener('keydown',e=>{
    if(/SELECT|INPUT|TEXTAREA/.test(e.target.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;
    if(e.code==='Space'){e.preventDefault();play();}
    else if(e.key==='ArrowRight'){e.preventDefault();move(1);}
    else if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}
    else if(e.key.toLowerCase()==='r'){load($('scene').value);}
    else if(e.key.toLowerCase()==='h'){document.body.classList.toggle('recording');}
  });
  chapters();render();
})();
