(() => {
  const $ = id => document.getElementById(id);
  const { binarySteps, evaluate } = window.LedModel;
  const weights = [16, 8, 4, 2, 1];
  let target = 13, steps = binarySteps(target), done = 0, timer = null;
  let inputA = false, inputB = false, rule = 'and';
  const rules = {
    and: { label: 'AND', question: 'Are BOTH buttons pressed?', description: 'AND turns on only when A and B are both pressed.' },
    or: { label: 'OR', question: 'Is AT LEAST ONE button pressed?', description: 'OR turns on for A, for B, or for both together.' },
    xor: { label: 'XOR', question: 'Is EXACTLY ONE button pressed?', description: 'XOR means exclusive OR. One pressed button turns it on; two turn it off.' },
    not: { label: 'NOT A', question: 'Is A RELEASED?', description: 'NOT A turns on when A is released. Button B does not affect this rule.' }
  };
  const bitNodes = weights.map(weight => {
    const node = document.createElement('div'); node.className = 'bit'; node.dataset.weight = weight;
    const value = document.createElement('div'); value.className = 'weight'; value.textContent = weight;
    const bulb = document.createElement('div'); bulb.className = 'lamp waiting'; bulb.setAttribute('role','img');
    const status = document.createElement('div'); status.className = 'bit-status';
    const pin = document.createElement('div'); pin.className='bit-pin'; pin.textContent='D'+(12-Math.log2(weight)); node.append(value, bulb, status, pin); $('binary-lights').append(node);
    return { node, bulb, status };
  });
  function stop() { clearTimeout(timer); timer = null; $('play').textContent = 'Play slowly'; $('play').setAttribute('aria-pressed','false'); }
  function renderBinary() {
    // One initial state, then read bit / choose pin / write LED for each of 5 iterations.
    const finished=done===16;
    const index=done===0?0:Math.min(4,Math.floor((done-1)/3));
    const phase=done===0?'start':finished?'end':['bit','pin','write'][(done-1)%3];
    const current=steps[index];
    $('counter-value').textContent=target;$('index-value').textContent=finished?5:index;
    $('step-label').textContent=finished?'Loop finished':`LED ${index+1} of 5`;
    ['code-for','code-write','code-pin','code-bit'].forEach(id=>$(id).classList.remove('highlight'));
    $(phase==='start'||phase==='end'?'code-for':phase==='bit'?'code-bit':phase==='pin'?'code-pin':'code-write').classList.add('highlight');
    bitNodes.forEach(({node,bulb,status},i)=>{
      const bitIndex=4-i;
      const written=finished || (done>0 && (bitIndex<index || (bitIndex===index&&phase==='write')));
      const on=written&&steps[bitIndex].bit===1;
      node.classList.toggle('current',!finished&&bitIndex===index);
      bulb.className='lamp'+(written?(on?' on':''):' waiting');
      bulb.textContent=written?(on?'1':'0'):'—';
      bulb.setAttribute('aria-label',`D${steps[bitIndex].pin}, ${weights[i]}s LED: ${written?(on?'on':'off'):'not written yet'}`);
      status.textContent=written?(on?'ON':'OFF'):'Not written';
    });
    let title,text,label,call;
    if(phase==='start'){
      title='The loop starts at i = 0.';text=`counter is ${target}. The loop will visit each of the five LED positions.`;label='Written binary (16s to 1s)';call=`${target} = ${target.toString(2).padStart(5,'0')} in binary`;
    }else if(phase==='bit'){
      title=`Read bit ${index}: it is ${current.bit}.`;text=`i is ${index}, so bitRead reads the ${current.weight}s position of ${target}.`;label='Put the values into the highlighted code';call=`bitRead(${target}, ${index}) = (${target} >> ${index}) & 1 = ${current.bit}`;
    }else if(phase==='pin'){
      title=`Choose the pin: D${current.pin}.`;text=`LED_PINS[${index}] selects ${current.pin} from {12, 11, 10, 9, 8}. D${current.pin} connects to the ${current.weight}s LED.`;label='Put the index into the highlighted code';call=`LED_PINS[${index}] → ${current.pin}`;
    }else if(phase==='write'){
      title=`Turn the ${current.weight}s LED ${current.bit?'ON':'OFF'}.`;text=`digitalWrite sends ${current.bit?'HIGH':'LOW'} to D${current.pin}. ${index<4?`Then i increases to ${index+1} and the loop repeats.`:'Then i increases to 5.'}`;label='The call with real values';call=`digitalWrite(${current.pin}, ${current.bit}) → ${current.bit?'ON':'OFF'}`;
    }else{
      title='i is now 5. The loop stops.';text='5 < 5 is false, so every LED has been handled. These are the five bits of your number.';label='Written binary (16s to 1s)';call=`${target.toString(2).padStart(5,'0')} = ${target}`;
    }
    $('instruction-title').textContent=title;$('instruction-text').textContent=text;$('resolved-label').textContent=label;$('resolved-call').textContent=call;
    $('bit-code-math').hidden=phase!=='bit';
    $('bit-code-math').textContent=`Written binary: ${target.toString(2).padStart(5,'0')} >> ${index} = ${(target>>index).toString(2).padStart(5,'0')}\n${(target>>index).toString(2).padStart(5,'0')} & 00001 = ${current.bit.toString(2).padStart(5,'0')}`;
    $('back').disabled=done===0;$('next').disabled=finished;$('next').textContent=finished?'Finished':'Next instruction →';
    $('binary-answer').hidden=!finished;
    if(finished)$('binary-answer').textContent=`ON lights: ${weights.filter(w=>target&w).join(' + ')||'none'}. The displayed number is ${target}.`;
  }
  function advance(){if(done<16){done++;renderBinary();}}
  function play(){
    if(timer){stop();return;}if(done===16){done=0;renderBinary();}
    $('play').textContent='Pause';$('play').setAttribute('aria-pressed','true');advance();
    const schedule=()=>{if(done===16){stop();return;}timer=setTimeout(()=>{advance();schedule();},3200);};schedule();
  }
  function inputButton(id, pressed, letter) {
    const button = $(id); const action = `${pressed ? 'Release' : 'Press'} ${letter}`;
    button.setAttribute('aria-pressed',String(pressed)); button.setAttribute('aria-label',action);
    $(id+'-state').textContent = pressed ? 'PRESSED · 1' : 'RELEASED · 0';
    $(id+'-action').textContent = action;
  }
  function renderLogic() {
    const values = evaluate(inputA, inputB), meta = rules[rule], on = values[rule];
    const count = +inputA + +inputB;
    const inputText = count === 0 ? 'Neither button is pressed.' : count === 2 ? 'Both buttons are pressed.' : `Only ${inputA ? 'A' : 'B'} is pressed.`;
    inputButton('input-a',inputA,'A'); inputButton('input-b',inputB,'B');
    document.querySelectorAll('[data-rule]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.rule === rule)));
    $('rule-question').textContent = meta.question; $('rule-description').textContent = meta.description;
    $('output-label').textContent = meta.label+' light'; $('output-lamp').className = 'lamp output-lamp'+(on?' on':'');
    $('output-lamp').setAttribute('aria-label',meta.label+' light '+(on?'on':'off'));
    $('output-digit').textContent = on ? '1' : '0'; $('output-state').textContent = on ? 'ON' : 'OFF';
    let reason, conclusion;
    if (rule === 'and') {
      reason = (on?'Yes. ':'No. ')+inputText;
      conclusion = on ? 'AND turns ON because it has both buttons.' : 'AND stays OFF because it needs both buttons.';
    } else if (rule === 'or') {
      reason = (on?'Yes. ':'No. ')+inputText;
      conclusion = on ? 'OR turns ON because at least one button is pressed.' : 'OR stays OFF because no button is pressed.';
    } else if (rule === 'xor') {
      reason = (on?'Yes. ':'No. ')+inputText;
      conclusion = on ? 'XOR turns ON because exactly one button is pressed.' : count === 2 ? 'XOR turns OFF: two buttons is not exactly one.' : 'XOR stays OFF: it needs exactly one pressed button.';
    } else {
      reason = inputA ? 'No. A is pressed.' : 'Yes. A is released.';
      conclusion = inputA ? 'NOT A turns OFF. It is the opposite of A.' : 'NOT A turns ON. It is the opposite of A.';
    }
    $('logic-reason').textContent = reason; $('logic-conclusion').textContent = conclusion;
    $('logic-equation').textContent = rule === 'not' ? `NOT ${+inputA} = ${+on}` : `${+inputA} ${meta.label} ${+inputB} = ${+on}`;
    const expressions={not:['notA','!stateA',2,9],and:['andResult','stateA && stateB',3,10],or:['orResult','stateA || stateB',4,11],xor:['xorExpression','(stateA && !stateB) || (!stateA && stateB)',5,12]};
    const [name,expression,ledIndex,pin]=expressions[rule];
    $('logic-source-code').textContent=`bool ${name} = ${expression};\ndigitalWrite(logicLeds[${ledIndex}], ${name});`;
    $('logic-substitution').textContent=`stateA = ${inputA}, stateB = ${inputB} → ${name} = ${on} → digitalWrite(${pin}, ${+on}) → ${on?'ON':'OFF'}`;

    $('all-outputs').replaceChildren();
    [['A',values.a],['B',values.b],['NOT A',values.not],['AND',values.and],['OR',values.or],['XOR',values.xor]].forEach(([label,state]) => {
      const holder=document.createElement('div');holder.className='output-mini';
      const name=document.createElement('span');name.textContent=label;
      const bulb=document.createElement('div');bulb.className='lamp'+(state?' on':'');bulb.textContent=+state;bulb.setAttribute('role','img');bulb.setAttribute('aria-label',label+' '+(state?'on':'off'));
      const status=document.createElement('span');status.textContent=state?'ON':'OFF';holder.append(name,bulb,status);$('all-outputs').append(holder);
    });
  }
  function switchMode(logic, focus=false) {
    stop(); $('binary-panel').hidden=logic; $('logic-panel').hidden=!logic;
    $('binary-tab').setAttribute('aria-selected',String(!logic));$('logic-tab').setAttribute('aria-selected',String(logic));
    $('binary-tab').tabIndex=logic?-1:0;$('logic-tab').tabIndex=logic?0:-1;
    if(focus)$(logic?'logic-tab':'binary-tab').focus();
  }
  $('number-form').addEventListener('submit',e => { e.preventDefault(); if(!$('number-form').reportValidity())return; stop();target=Number($('number').value);steps=binarySteps(target);done=0;renderBinary(); });
  $('number').addEventListener('input',stop);
  $('back').addEventListener('click',()=>{stop();done=Math.max(0,done-1);renderBinary();});
  $('next').addEventListener('click',()=>{stop();advance();});
  $('restart').addEventListener('click',()=>{stop();done=0;renderBinary();});$('play').addEventListener('click',play);
  $('binary-tab').addEventListener('click',()=>switchMode(false));$('logic-tab').addEventListener('click',()=>switchMode(true));
  document.querySelector('.mode-tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();switchMode(e.key==='End'||(e.key!=='Home'&&$('binary-tab').getAttribute('aria-selected')==='true'),true);}});
  $('input-a').addEventListener('click',()=>{inputA=!inputA;renderLogic();});$('input-b').addEventListener('click',()=>{inputB=!inputB;renderLogic();});
  document.querySelectorAll('[data-rule]').forEach(button=>button.addEventListener('click',()=>{rule=button.dataset.rule;renderLogic();}));
  renderBinary();renderLogic();switchMode(false);
})();
