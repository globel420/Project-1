/* Educational replay of Program.ino. This does not execute or instrument the board. */
(() => {
  const sections = {
    globals:{range:[73,132],nodes:['Pins and LED arrays','Timing constants','Starting state'],lines:[73,108,115]},
    setup:{range:[134,163],nodes:['Start Serial at 9600','Set button inputs','Set mode LED outputs','For each shared LED','Set OUTPUT; write LOW','Set mode indicators','Print startup message','Enter loop()'],loop:[4,3]},
    main:{range:[165,178],nodes:['Check Mode button','Is Project B active?','Run Project B','Show binary count','Repeat loop()'],diamond:1,branches:[[1,2,'true'],[1,3,'false']],skip:[[2,4]],loop:[4,0]},
    button:{range:[180,223],nodes:['Read Mode button','Reading changed?','Wait > 50 ms stable','Stable state changed?','Pressed: start hold timer','Released: short press?','Held for 5 seconds?','Return to loop()'],diamond:1},
    counter:{range:[260,276],nodes:['Add 1 to counter','Counter > 31?','Reset counter to 0','Draw binary LEDs','Print decimal count','Return'],diamond:1,branches:[[1,2,'true'],[1,3,'false']]},
    binary:{range:[278,292],nodes:['Clear shared LEDs','Start i = 0','Is i < 5?','Read bit; write its LED','Increase i','Return'],diamond:2,loop:[4,2],branches:[[2,5,'false']]},
    clear:{range:[364,370],nodes:['Start i = 0','Is i < 6?','Write this LED LOW','Increase i','Return'],diamond:1,loop:[3,1],branches:[[1,4,'false']]},
    toggle:{range:[225,250],nodes:['Flip active mode','Clear shared LEDs','Update mode indicators','Is Project B active?','Print B labels','Restore binary display','Return'],diamond:3,branches:[[3,4,'true'],[3,5,'false']],skip:[[4,6]]},
    indicators:{range:[252,258],nodes:['Set Project A LED','Set Project B LED','Return']},
    logic:{range:[294,337],nodes:['Read A and B','Calculate NOT A','Calculate AND','Calculate OR','Calculate exclusive OR','Write six output LEDs','First line or inputs changed?','Print and remember inputs','Return'],diamond:6,branches:[[6,8,'false']]},
    serial:{range:[339,362],nodes:['Print A and B','Print NOT A','Print AND','Print OR','Print exclusive OR','Return']}
  };
  const scenes = [
    {id:'setup',title:'Power on · start at zero',kind:'setup',count:0,b:false},
    {id:'idle',title:'The main loop · no button pressed',kind:'idle',count:0,b:false},
    {id:'count',title:'Short press · count 0 → 1',kind:'count',count:0,b:false},
    {id:'thirteen',title:'Read five bits · count 12 → 13',kind:'count',count:12,b:false},
    {id:'rollover',title:'Rollover · count 31 → 0',kind:'count',count:31,b:false},
    {id:'to-logic',title:'Hold for 5 seconds · A → B',kind:'toggle',count:13,b:false},
    {id:'logic00',title:'Logic · neither button pressed',kind:'logic',count:13,b:true,a:0,c:0},
    {id:'logic10',title:'Logic · A only',kind:'logic',count:13,b:true,a:1,c:0},
    {id:'logic01',title:'Logic · B only',kind:'logic',count:13,b:true,a:0,c:1},
    {id:'logic11',title:'Logic · both buttons pressed',kind:'logic',count:13,b:true,a:1,c:1},
    {id:'logic-idle',title:'Logic loop · unchanged inputs',kind:'logic-idle',count:13,b:true,a:1,c:1},
    {id:'to-counter',title:'Hold again · restore count 13',kind:'toggle',count:13,b:true,a:0,c:0}
  ];
  const clone = value => JSON.parse(JSON.stringify(value));
  function makeTrace(id) {
    const scene = scenes.find(s => s.id === id);
    if (!scene) throw new Error('Unknown animation action');
    const s = {counter:scene.count, projectBActive:scene.b, leds:[0,0,0,0,0,0], modes:scene.kind==='setup'?[0,0]:[+!scene.b,+scene.b], modeButton:'HIGH',stateA:0,stateB:0, i:null, printed:'',hold:0};
    if (!s.projectBActive) for(let i=0;i<5;i++) s.leds[5-i]=(s.counter>>i)&1;
    else s.leds=[0,0,1,0,0,0];
    if(scene.kind==='logic-idle'){s.leds=[1,1,0,1,1,0];s.stateA=1;s.stateB=1;}
    const steps=[];
    const add=(section,node,lines,text,path,patch={})=>{Object.assign(s,patch);steps.push({section,node,lines,text,path,state:clone(s)});};
    const indicators=(path)=>{
      s.modes[0]=+!s.projectBActive;add('indicators',0,[256],`Project A indicator ${s.modes[0]?'ON':'OFF'}.`,path);
      s.modes[1]=+s.projectBActive;add('indicators',1,[257],`Project B indicator ${s.modes[1]?'ON':'OFF'}.`,path);
      add('indicators',2,[258],'Return to the calling function.',path);
    };
    const clear=(path)=>{
      const pins=[12,11,10,9,8,7];
      add('clear',0,[367],'Start the loop that clears all six shared LEDs.',path,{i:0});
      for(let i=0;i<6;i++){
        add('clear',1,[367],`${i} < 6 is true: process output D${pins[i]}.`,path,{i});
        s.leds[pins[i]-7]=0;add('clear',2,[368],`Write LOW to D${pins[i]}.`,path);
        add('clear',3,[367],`Increase i to ${i+1}; check the loop again.`,path,{i:i+1});
      }
      add('clear',1,[367],'6 < 6 is false: leave the loop.',path,{i:6});
      add('clear',4,[370],'Return: the shared LEDs are now cleared.',path,{i:null});
    };
    const binary=(path)=>{
      add('binary',0,[281],'Clear old outputs before drawing the current count.',path);
      clear(path+' → turnOffDataLeds()');
      add('binary',1,[289],'Start at bit 0, the 1s position.',path,{i:0});
      for(let i=0;i<5;i++){
        const pin=12-i,bit=(s.counter>>i)&1;
        add('binary',2,[289],`${i} < 5 is true: read the ${2**i}s bit.`,path,{i});
        s.leds[pin-7]=bit;add('binary',3,[290],`bitRead(${s.counter}, ${i}) = ${bit}. Write ${bit?'HIGH':'LOW'} to D${pin}.`,path);
        add('binary',4,[289],`Increase i to ${i+1}; return to the loop test.`,path,{i:i+1});
      }
      add('binary',2,[289],'5 < 5 is false: all five bits have been drawn.',path,{i:5});
      add('binary',5,[292],`Return with ${s.counter} displayed in binary.`,path,{i:null});
    };
    const printLogic=(path)=>{
      const a=s.stateA,b=s.stateB,n=+!a,and=a&b,or=a|b,xor=a^b;
      const chunks=[`A=${a} B=${b}`,` | !A=${n}`,` | A&&B=${and}`,` | A||B=${or}`,` | (A&&!B)||(!A&&B)=${xor}`];
      const lines=[[344,345,347,348],[351,352],[354,355],[357,358],[360,361]];
      let output='';chunks.forEach((part,i)=>{output+=part;add('serial',i,lines[i],output,path,{printed:output});});
      add('serial',5,[362],'Return after the complete Serial Monitor line.',path);
    };
    const logic=(path,a,b,changed=true)=>{
      add('logic',0,[297,298],`Pressed means LOW at the pin. Logical inputs: A=${a}, B=${b}.`,path,{stateA:a,stateB:b});
      add('logic',1,[302],`NOT A = ${+!a}.`,path,{notA:+!a});
      add('logic',2,[306],`A AND B = ${a&b}.`,path,{andResult:a&b});
      add('logic',3,[310],`A OR B = ${a|b}.`,path,{orResult:a|b});
      add('logic',4,[315],`Exactly one input is true: XOR = ${a^b}.`,path,{xorExpression:a^b});
      const values=[a,b,+!a,a&b,a|b,a^b], labels=['A','B','NOT A','AND','OR','XOR'];
      values.forEach((v,i)=>{s.leds[i]=v;add('logic',5,[320+i],`${labels[i]}: write ${v?'HIGH':'LOW'} to D${7+i}. These are six separate statements.`,path);});
      add('logic',6,[329],changed?'First entry or an input changed: print the results.':'Inputs are unchanged and a line was already printed: skip printing.',path);
      if(changed){
        add('logic',7,[330],'Call printLogicStates().',path);
        printLogic(path+' → printLogicStates()');
        add('logic',7,[333,334,335],'Remember A and B, and mark this line as printed.',path);
      }
      add('logic',8,[337],'Return to loop().',path);
    };
    const mainStart=()=>add('main',0,[170],'The main loop checks the Mode button first.','loop()');
    const mainBranch=()=>add('main',1,[173],`projectBActive is ${s.projectBActive}: choose ${s.projectBActive?'logic mode':'the binary display'}.`,'loop()');
    const end=()=>add('main',4,[178],'The Arduino starts the next loop immediately. This animation pauses here.','loop()', {i:null});
    const buttonPress=()=>{
      add('button',0,[183],'Read LOW: the Mode button is physically pressed.','loop() → handleModeButton()',{modeButton:'LOW'});
      add('button',1,[187,188,189],'The reading changed: remember when it changed.','loop() → handleModeButton()');
      add('button',2,[194],'Repeated passes wait until the reading has stayed stable for more than 50 ms.','loop() → handleModeButton()');
      add('button',3,[195,196],'Accept LOW as the new stable button state.','loop() → handleModeButton()');
      add('button',4,[198,201,202],'Start timing this press; mark the hold as not handled.','loop() → handleModeButton()',{hold:0});
    };
    if(scene.kind==='setup'){
      add('globals',0,[73,74,75,79,80,90,100,104],'Define the button pins and the two different LED orders.','Global declarations');
      add('globals',1,[108,111],'Use a 5,000 ms mode hold and a 50 ms debounce interval.','Global declarations');
      add('globals',2,[115,118],'Start in Project A with counter = 0.','Global declarations');
      add('setup',0,[137],'Start Serial communication at 9600 baud.','setup()');
      add('setup',1,[140,141,142],'Enable the internal pull-ups for all three buttons.','setup()');
      add('setup',2,[145,146],'Configure the two mode indicators as outputs.','setup()');
      for(let i=0;i<6;i++){
        add('setup',3,[151],`${i} < 6 is true: initialize D${[12,11,10,9,8,7][i]}.`,'setup()',{i});
        add('setup',4,[152,153],'Set this pin to OUTPUT and turn its LED off.','setup()');
      }
      add('setup',3,[151],'6 < 6 is false: initialization loop is finished.','setup()',{i:6});
      add('setup',5,[158],'Set the indicators for Project A.','setup()',{i:null});indicators('setup() → updateModeIndicators()');
      add('setup',6,[161,162],'Print “Project A: Binary Counter” and “Counter: 0”.','setup()');
      add('setup',7,[163],'setup() finishes; the repeating loop begins.','setup()');mainStart();
    }else if(scene.kind==='idle'){
      mainStart();add('button',0,[183],'Read HIGH: the Mode button is released.','loop() → handleModeButton()');
      add('button',1,[187],'The reading is unchanged.','loop() → handleModeButton()');
      add('button',2,[194],'The debounce interval has elapsed.','loop() → handleModeButton()');
      add('button',3,[195],'No stable state change: skip press/release handling.','loop() → handleModeButton()');
      add('button',6,[215],'The button is not held: skip the long-hold block.','loop() → handleModeButton()');
      add('button',7,[223],'Return to the main loop.','loop() → handleModeButton()');mainBranch();
      add('main',3,[176],'Call showBinary(counter).','loop()');binary('loop() → showBinary()');end();
    }else if(scene.kind==='count'){
      mainStart();buttonPress();
      add('button',6,[215,216],'This is a short press: five seconds have not elapsed.','loop() → handleModeButton()');
      add('button',0,[183],'On a later loop pass, release the button: read HIGH.','loop() → handleModeButton()',{modeButton:'HIGH'});
      add('button',1,[187,188,189],'The release changed the reading; restart the debounce timer.','loop() → handleModeButton()');
      add('button',2,[194],'Wait for the released reading to stay stable for more than 50 ms.','loop() → handleModeButton()');
      add('button',3,[195,196],'Accept HIGH as the new stable state.','loop() → handleModeButton()');
      add('button',5,[198,206,207],'Released in Project A, with no long hold handled: increment once.','loop() → handleModeButton()');
      const p='loop() → handleModeButton() → incrementCounter()';
      add('counter',0,[262],`Add one: ${s.counter} becomes ${s.counter+1}.`,p,{counter:s.counter+1});
      add('counter',1,[266],`${s.counter} > 31 is ${s.counter>31}.`,p);
      if(s.counter>31)add('counter',2,[267],'The count exceeded 31: reset it to zero.',p,{counter:0});
      add('counter',3,[271],'Draw the updated count.',p);binary(p+' → showBinary()');
      add('counter',4,[274,275],`Print “Counter: ${s.counter}” to the Serial Monitor.`,p,{printed:`Counter: ${s.counter}`});
      add('counter',5,[276],'Return to the Mode button handler.',p);
      add('button',6,[215],'The button is released: no long-hold action.','loop() → handleModeButton()');
      add('button',7,[223],'Return to loop().','loop() → handleModeButton()');mainBranch();
      add('main',3,[176],'The normal loop draws the same count again.','loop()');binary('loop() → showBinary()');end();
    }else if(scene.kind==='toggle'){
      mainStart();buttonPress();
      add('button',6,[215,216],'Later loop passes: the stable press has now lasted at least 5,000 ms.','loop() → handleModeButton()',{hold:5000});
      add('button',6,[217],'Call toggleProjectMode() once.','loop() → handleModeButton()');
      const p='loop() → handleModeButton() → toggleProjectMode()';
      add('toggle',0,[228],`Flip projectBActive to ${!s.projectBActive}. The counter stays ${s.counter}.`,p,{projectBActive:!s.projectBActive});
      add('toggle',1,[232],'Clear outputs left over from the previous mode.',p);clear(p+' → turnOffDataLeds()');
      add('toggle',2,[235],'Update both mode indicator LEDs.',p);indicators(p+' → updateModeIndicators()');
      add('toggle',3,[237],`Select the ${s.projectBActive?'Project B':'Project A'} entry branch.`,p);
      if(s.projectBActive)add('toggle',4,[240,243,244],'Allow the first logic result to print, then print the Project B labels.',p);
      else{add('toggle',5,[247,248],`Print the Project A label and redraw the stored count ${s.counter}.`,p);binary(p+' → showBinary()');}
      add('toggle',6,[250],'Return to handleModeButton().',p);
      add('button',6,[220],'Mark this hold as handled, preventing another switch from the same hold.','loop() → handleModeButton()');
      add('button',7,[223],'Return to loop(); the newly selected mode runs.','loop() → handleModeButton()');mainBranch();
      if(s.projectBActive){add('main',2,[174],'Run the logical operators.','loop()');logic('loop() → runProjectB()',0,0);}
      else{add('main',3,[176],'Draw the preserved count.','loop()');binary('loop() → showBinary()');}
      add('button',5,[206],'On a later debounced release, modeHoldHandled is true: do not add a count.','loop() → handleModeButton()',{modeButton:'HIGH'});end();
    }else{
      mainStart();add('button',7,[183,187,194,195,215,223],'The Mode button is unchanged and released; return without an action.','loop() → handleModeButton()');mainBranch();
      add('main',2,[174],'Run the logic calculations for these two inputs.','loop()');logic('loop() → runProjectB()',scene.a,scene.c,scene.kind!=='logic-idle');end();
    }
    return {scene,steps};
  }
  const api={sections,scenes,makeTrace};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else window.ProjectTrace=api;
})();
