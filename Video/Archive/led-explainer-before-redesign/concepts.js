(() => {
  const $=id=>document.getElementById(id);
  const weights=[16,8,4,2,1];
  const ruleNames=['NOT A','AND','OR','Exclusive OR'];
  const ruleQuestions=['Is A released?','Are both buttons pressed?','Is at least one button pressed?','Is exactly one button pressed?'];
  let count=13,bit=-1,a=false,b=false,rule=-1,timer=null,playing=null;
  function stop(){clearTimeout(timer);timer=null;playing=null;$('read-bits').textContent='Read the five bits slowly';$('read-rules').textContent='Explain the four results slowly';}
  function lamp(on,label){const node=document.createElement('div');node.className='lamp'+(on?' on':'');node.setAttribute('role','img');node.setAttribute('aria-label',label+' '+(on?'on':'off'));return node;}
  function span(text,cls){const node=document.createElement('span');node.className=cls||'';node.textContent=text;return node;}
  function renderBinary(){
    $('number').value=count;$('binary-lights').replaceChildren();
    weights.forEach(w=>{const on=!!(count&w),node=document.createElement('div');node.className='bit'+(bit>=0&&w===2**bit?' current':'');node.append(span(w,'weight'),lamp(on,w+'s light'),span(on?'1':'0','digit'),span(on?'ON':'OFF','status'));$('binary-lights').append(node);});
    const parts=weights.filter(w=>count&w);$('sum').textContent=parts.length?`${parts.join(' + ')} = ${count}`:'All lights off = 0';
    if(bit<0){$('bit-explanation').textContent=`${count} in binary is ${count.toString(2).padStart(5,'0')}. Each digit matches the light directly above it.`;}
    else{const w=2**bit,result=(count>>bit)&1;$('bit-explanation').textContent=`The ${w}s bit is ${result}. The ${w}s light is ${result?'ON':'OFF'}. ${bit===4?'All five bits have now been read.':''}`;}
    const w=bit>=0?2**bit:4,q=Math.floor(count/w);$('arithmetic-example').textContent=`${count} ÷ ${w} → ${q} whole. ${q} is ${q%2?'odd':'even'} → bit ${q%2} → ${q%2?'ON':'OFF'}.`;
  }
  function changeCount(value){stop();const parsed=Number(value);count=Number.isFinite(parsed)?Math.max(0,Math.min(31,Math.trunc(parsed))):0;bit=-1;renderBinary();}
  function stepBit(){bit=bit<4?bit+1:0;renderBinary();}
  function bitsSlow(){if(playing==='bits'){stop();return;}stop();playing='bits';bit=0;renderBinary();$('read-bits').textContent='Pause';const run=()=>{if(bit>=4){stop();return;}timer=setTimeout(()=>{bit++;renderBinary();run();},3000);};run();}
  function values(){return [!a,a&&b,a||b,a!==b];}
  function renderLogic(){
    $('input-a').textContent='A: '+(a?'pressed':'released');$('input-b').textContent='B: '+(b?'pressed':'released');$('input-a').setAttribute('aria-pressed',String(a));$('input-b').setAttribute('aria-pressed',String(b));
    $('input-lights').replaceChildren();[a,b].forEach((on,i)=>{const el=document.createElement('div');el.className='input-light';el.append(lamp(on,(i?'B':'A')+' indicator'),span((i?'B':'A')+' indicator '+(on?'ON':'OFF')));$('input-lights').append(el);});
    const out=values();$('rules').replaceChildren();ruleNames.forEach((name,i)=>{const el=document.createElement('div');el.className='rule'+(rule===i?' current':'');const text=document.createElement('div'),title=document.createElement('h3'),question=document.createElement('p'),result=document.createElement('div');title.textContent=name;question.textContent=ruleQuestions[i];text.append(title,question);result.className='result';result.append(lamp(out[i],name+' output'),span(out[i]?'TRUE · ON':'FALSE · OFF'));el.append(text,result);$('rules').append(el);});
    if(rule>=0){$('logic-explanation').textContent=`${ruleNames[rule]}: ${ruleQuestions[rule]} ${out[rule]?'Yes. The result is true, so this light is ON.':'No. The result is false, so this light is OFF.'}`;}
    else{const lit=['A','B',...ruleNames].filter((_,i)=>[a,b,...out][i]);$('logic-explanation').textContent='Lights on: '+lit.join(', ')+'.';}
  }
  function stepRule(){rule=rule<3?rule+1:0;renderLogic();}
  function rulesSlow(){if(playing==='rules'){stop();return;}stop();playing='rules';rule=0;renderLogic();$('read-rules').textContent='Pause';const run=()=>{if(rule>=3){stop();return;}timer=setTimeout(()=>{rule++;renderLogic();run();},3000);};run();}
  function tab(logic){stop();$('binary-panel').hidden=logic;$('logic-panel').hidden=!logic;$('binary-tab').setAttribute('aria-pressed',String(!logic));$('logic-tab').setAttribute('aria-pressed',String(logic));}
  $('binary-tab').addEventListener('click',()=>tab(false));$('logic-tab').addEventListener('click',()=>tab(true));$('number').addEventListener('change',e=>changeCount(e.target.value));$('minus').addEventListener('click',()=>changeCount((count+31)%32));$('plus').addEventListener('click',()=>changeCount((count+1)%32));$('example13').addEventListener('click',()=>changeCount(13));$('read-bits').addEventListener('click',bitsSlow);$('next-bit').addEventListener('click',()=>{stop();stepBit();});$('input-a').addEventListener('click',()=>{stop();a=!a;rule=-1;renderLogic();});$('input-b').addEventListener('click',()=>{stop();b=!b;rule=-1;renderLogic();});$('read-rules').addEventListener('click',rulesSlow);$('next-rule').addEventListener('click',()=>{stop();stepRule();});
  renderBinary();renderLogic();
})();
