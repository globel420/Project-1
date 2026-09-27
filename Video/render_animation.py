#!/usr/bin/env python3
"""Render the narration-matched, silent MAKR 100 explainer to 1080p MP4."""
from __future__ import annotations

import argparse
import json
import math
from functools import lru_cache
from pathlib import Path
import subprocess

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
EXPORTS = ROOT / "Exports"
WORK = ROOT / "render_work"
FFMPEG = "/opt/homebrew/bin/ffmpeg"
FFPROBE = "/opt/homebrew/bin/ffprobe"
W, H, FPS = 1920, 1080, 24
BG = "#0b1422"
PANEL = "#142338"
PANEL2 = "#1b2d43"
WHITE = "#f1f6fc"
MUTED = "#a5b7ca"
DIM = "#536a81"
MINT = "#66e2be"
AMBER = "#ffd07b"
OFF = "#26394d"
BLUE = "#6bbaff"
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


@lru_cache(maxsize=64)
def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)


def text(d, xy, value, size=48, color=WHITE, bold=False, anchor="mm"):
    d.text(xy, str(value), font=font(size, bold), fill=color, anchor=anchor)


def fit_text(d, xy, value, max_width, size=62, color=WHITE, bold=True, anchor="mm"):
    while d.textlength(str(value), font=font(size, bold)) > max_width:
        size -= 1
    text(d, xy, value, size, color, bold, anchor)


def multiline(d, xy, lines, size=45, gap=65, color=WHITE, bold=False):
    for i, line in enumerate(lines):
        text(d, (xy[0], xy[1] + gap*i), line, size, color, bold)


def rr(d, box, radius=28, fill=PANEL, outline=None, width=2):
    d.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def ease(p):
    p = max(0, min(1, p))
    return p*p*(3-2*p)


def base(section, title, subtitle=None):
    im = Image.new("RGB", (W,H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle((100, 84, 146, 91), fill=MINT)
    text(d, (169, 88), section.upper(), 30, MINT, True, "lm")
    fit_text(d, (100, 180), title, 1720, 68, WHITE, True, "lm")
    if subtitle:
        fit_text(d, (100, 253), subtitle, 1720, 38, MUTED, False, "lm")
    return im, d


def footer(d, label=None):
    d.line((100, 1005, 1820, 1005), fill=PANEL2, width=2)
    text(d, (100, 1038), "MAKR 100  /  PROJECT 1", 24, DIM, False, "lm")
    if label:
        text(d, (1820, 1038), label, 24, MUTED, False, "rm")


def arrow(d, a, b, color=MUTED, width=5, head=16):
    d.line((a,b), fill=color, width=width)
    theta = math.atan2(b[1]-a[1], b[0]-a[0])
    l=(b[0]-head*math.cos(theta-.55), b[1]-head*math.sin(theta-.55))
    r=(b[0]-head*math.cos(theta+.55), b[1]-head*math.sin(theta+.55))
    d.polygon((b,l,r), fill=color)


def led(d, x, y, on, radius=73, focus=False, phase=0, value=True):
    if on:
        d.ellipse((x-radius-12,y-radius-12,x+radius+12,y+radius+12), fill="#17453f")
        d.ellipse((x-radius-5,y-radius-5,x+radius+5,y+radius+5), fill="#296d60")
    d.ellipse((x-radius,y-radius,x+radius,y+radius), fill=MINT if on else OFF,
              outline="#b2f5df" if on else DIM, width=3)
    if value:
        text(d, (x, y+1), "1" if on else "0", 69, BG if on else MUTED, True)
    if focus:
        r=radius+23+3*math.sin(phase*2*math.pi)
        d.ellipse((x-r,y-r,x+r,y+r), outline=AMBER, width=7)


def binary_row(d, number, y=520, highlight=None, reveal=None, t=0):
    xs=[350,655,960,1265,1570]
    text(d,(100,y-164),"LED VALUE",25,MUTED,True,"lm")
    for idx, (x, place) in enumerate(zip(xs,[16,8,4,2,1])):
        text(d,(x,y-164),place,61,AMBER if highlight==idx else WHITE,True)
        bit = bool(number & place)
        if reveal is not None and idx not in reveal:
            bit = False
        led(d,x,y,bit,83,highlight==idx,t)
        text(d,(x,y+143),"ON" if bit else "OFF",34,MINT if bit else DIM,True)
    return xs


def buttons(d,a,b,y=372):
    for x,label,state in [(700,"A",a),(1220,"B",b)]:
        rr(d,(x-185,y-69,x+185,y+69),24,PANEL2,MINT if state else DIM,3)
        text(d,(x-85,y),label,57,WHITE,True)
        text(d,(x+50,y),1 if state else 0,65,MINT if state else MUTED,True)
        text(d,(x,y+104),"PRESSED" if state else "RELEASED",28,MINT if state else DIM,True)


def logic_states(a,b):
    return [a,b,not a,a and b,a or b,(a and not b) or (not a and b)]


def logic_row(d,a,b,y=644,highlight=None,t=0):
    xs=[245,531,817,1103,1389,1675]
    labels=["A","B","NOT A","AND","OR","XOR"]
    for idx,(x,label,on) in enumerate(zip(xs,labels,logic_states(a,b))):
        text(d,(x,y-126),label,40,AMBER if idx==highlight else WHITE,True)
        led(d,x,y,on,64,idx==highlight,t)
        text(d,(x,y+111),"ON" if on else "OFF",31,MINT if on else DIM,True)
    return xs


def rule_result(d, label, state, y=721, t=0):
    rr(d,(572,y-102,1348,y+104),30,PANEL)
    text(d,(715,y),label,59,WHITE,True,"lm")
    led(d,1195,y,state,65,True,t)


def banner(d, value, y=844, color=WHITE, size=64):
    fit_text(d,(960,y),value,1660,size,color,True)


def save_probe(path):
    raw=subprocess.check_output([FFPROBE,"-v","error","-show_entries","format=duration,size:stream=codec_name,width,height,r_frame_rate,pix_fmt","-of","json",str(path)])
    result=json.loads(raw)
    (path.with_suffix(".probe.json")).write_text(json.dumps(result,indent=2))
    return result


def get_phase(phases,t):
    elapsed=0
    for phase in phases:
        if t < elapsed + phase["seconds"]:
            return phase,t-elapsed
        elapsed += phase["seconds"]
    return phases[-1],phases[-1]["seconds"]


def render_scene(scene,t):
    kind=scene["kind"]
    v=scene["visual"]
    duration=scene["duration_seconds"]
    if kind=="intro":
        im,d=base("Two modes. One Arduino.",v["title"],v["subtitle"])
        for x,title,line,color in [(515,"Binary counter","A number becomes five bits",MINT),(1405,"Logical operators","A rule becomes true or false",BLUE)]:
            rr(d,(x-415,353,x+415,914),36,PANEL)
            text(d,(x,422),title,53,color,True)
            text(d,(x,495),line,36,MUTED)
        text(d,(515,610),"13",99,MINT,True)
        text(d,(515,682),"LED VALUES",23,MUTED,True)
        for i,weight in enumerate([16,8,4,2,1]):
            x=279+i*118
            text(d,(x,715),weight,29,WHITE,True)
            led(d,x,797,bool(13 & weight),43,value=True)
        text(d,(1405,607),"A OR B",70,BLUE,True)
        text(d,(1405,707),"1 = true = ON",51,WHITE,True)
        led(d,1405,833,True,47,True,t*.5)
        footer(d,"A closer look at the main functions")

    elif kind=="binary_weights":
        im,d=base("Binary counter",v["title"],"Moving one position to the left doubles the value.")
        current=min(4,int(max(0,t-.6)/1.9))
        highlight=4-current
        xs=binary_row(d,0,highlight=highlight,t=t*.5)
        banner(d,"16   ←   8   ←   4   ←   2   ←   1",size=67)
        if current>0:
            start=(xs[highlight+1]-40,749)
            end=(xs[highlight]+40,749)
            arrow(d,start,end,AMBER,5)
            text(d,((start[0]+end[0])/2,707),"× 2",35,AMBER,True)
        footer(d,"Place values")

    elif kind=="binary_sum":
        im,d=base("Binary counter","How 13 becomes five lights","Add the values of the lights that are ON.")
        illuminated_values=v.get("illuminate_order",[8,4,1])
        on_order=[[16,8,4,2,1].index(weight) for weight in illuminated_values]
        phase=min(3,int(max(0,t-.8)/2.0)+1) if t>=.8 else 0
        reveal=on_order[:phase]
        highlight=on_order[phase-1] if phase and t<7.5 else None
        binary_row(d,13,highlight=highlight,reveal=reveal,t=t*.5)
        eq=" + ".join(str(weight) for weight in illuminated_values[:phase])
        if phase==3: eq=v.get("equation",eq+" = 13")
        banner(d,eq,color=MINT,size=85)
        footer(d,"1 = ON    0 = OFF")

    elif kind=="binary_functions":
        im,d=base("The main functions","One short press adds one","The new number determines the next LED pattern.")
        phase=0 if t<3.5 else (1 if t<7 else 2)
        labels=[("Short press + release","Count button"),("incrementCounter()","12 + 1 = 13"),("showBinary()","Read the five bits")]
        for i,(title,detail) in enumerate(labels):
            x=370+i*590
            rr(d,(x-270,318,x+270,466),24,PANEL,AMBER if phase==i else PANEL2,4)
            text(d,(x,365),title,40,AMBER if phase==i else WHITE,True)
            text(d,(x,420),detail,34,MUTED)
            if i<2: arrow(d,(x+279,393),(x+303,393),AMBER if phase>i else DIM,4,10)
        number=12 if t<7 else 13
        binary_row(d,number,y=682,highlight=4 if phase==2 and t<10 else None,t=t*.5)
        stored_count=12 if t<3.5 else 13
        text(d,(960,942),f"Count: {stored_count}",60,MINT,True)
        footer(d,"A short press counts when the button is released")

    elif kind=="binary_math_intro":
        im,d=base("The math inside bitRead",v["title"],"bitRead(value, bit) = (value >> bit) & 0x01")
        for center,count in [(510,2),(1410,13)]:
            rr(d,(center-410,326,center+410,944),30,PANEL)
            text(d,(center,394),f"Count {count}: {count:05b}",58,WHITE,True)
            shifted=count >> 1
            result=(count >> 1) & 1
            text(d,(center,475),"SHIFT RIGHT BY 1",28,AMBER,True)
            text(d,(center,534),f"{count:05b} >> 1 = {shifted:05b}",44,WHITE,True)
            if t>=3:
                text(d,(center,625),"BITWISE AND: KEEP THE LAST BIT",26,AMBER,True)
                text(d,(center,684),f"{shifted:05b} & 00001 = {result:05b}",39,WHITE,True)
            if t>=6:
                text(d,(center,792),f"digitalWrite(11, {result})",43,WHITE,True)
                text(d,(center-57,873),f"D11 {'ON' if result else 'OFF'}",55,MINT if result else MUTED,True)
                led(d,center+195,873,result,39,True,t*.5)
        footer(d,"5-bit binary shown    |    0x01 = 1")

    elif kind=="binary_bit":
        w=v["weight"];result=v["result"];i=v["bit_index"];pin=12-i
        names={1:"ones",2:"twos",4:"fours",8:"eights",16:"sixteens"}
        im,d=base("Shift, mask, write",f"Read the {names[w]} position",f"bitRead(13, {i}) = (13 >> {i}) & 0x01     |     LED pin D{pin}")
        # Physical LEDs and written binary both use highest value on the left.
        # The array visits bit 0 at the far right, then moves left as i increases.
        binary_row(d,13,y=493,highlight=4-v["bit_index"],t=t*.5)
        shifted=v["count"] >> i
        text(d,(100,735),"WRITTEN",25,MUTED,True,"lm")
        text(d,(100,770),"BINARY",25,MUTED,True,"lm")
        text(d,(960,735),f"01101 >> {i} = {shifted:05b}",57,WHITE,True)
        if t>=2.2:
            text(d,(960,814),f"{shifted:05b} & 00001 = {result:05b}",57,WHITE,True)
        if t>=4.4:
            result_text=f"digitalWrite({pin}, {result}) → {'ON' if result else 'OFF'}"
            text(d,(960,909),result_text,60,MINT if result else MUTED,True)
        footer(d,"Written binary: highest place on the left    |    0x01 = 1")

    elif kind=="binary_rollover":
        phase,local=get_phase(v["phases"],t)
        count=phase["count"]
        im,d=base("Binary counter","Five bits can display 0 through 31","Each short press adds one. After 31, the counter resets.")
        binary_row(d,count,t=t*.5)
        banner(d,phase["label"],color=MINT,size=80)
        footer(d,"32 possible values: 0–31")

    elif kind=="logic_intro":
        a,b=(0,0) if t<6 else (1,0)
        im,d=base("Logical operators","Buttons become true or false","runProjectB() reads A and B.")
        buttons(d,a,b)
        logic_row(d,a,b,y=673,t=t*.5)
        banner(d,"Released = false = 0" if t<6 else "Pressed = true = 1",y=900,color=MINT if t>=6 else WHITE,size=62)
        footer(d,"The A and B lights show the button states")

    elif kind=="logic_rule":
        phase,local=get_phase(v["states"],t)
        a,b=phase["a"],phase["b"]
        rule=v["rule"];index={"NOT A":2,"AND":3,"OR":4,"XOR":5}[rule]
        im,d=base("Logical operators",f"{rule}: {v['question']}","A true result turns the matching LED on.")
        buttons(d,a,b)
        states=logic_states(a,b)
        logic_row(d,a,b,y=672,highlight=index,t=t*.5)
        outcome="TRUE  →  ON" if states[index] else "FALSE  →  OFF"
        banner(d,f"{rule} = {outcome}",y=899,color=MINT if states[index] else MUTED,size=64)
        footer(d,"XOR = exclusive OR" if rule=="XOR" else "1 = true    0 = false")

    elif kind=="logic_combination":
        a,b=v["a"],v["b"]
        im,d=base("All six outputs",v["title"],"Same two inputs. Each output follows its own rule.")
        buttons(d,a,b)
        on=[i for i,s in enumerate(logic_states(a,b)) if s]
        interval=(duration-1.5)/len(on)
        idx=min(len(on)-1,int(max(0,t-.4)/interval))
        highlight=on[idx] if t<duration-.8 else None
        logic_row(d,a,b,y=672,highlight=highlight,t=t*.5)
        labels=["A","B","NOT A","AND","OR","XOR"]
        lit="  +  ".join(labels[i] for i in on)
        banner(d,f"ON: {lit}",y=899,color=MINT,size=61)
        footer(d,"XOR = exclusive OR")

    elif kind=="closing":
        im,d=base("The repeating loop","Read. Calculate. Update. Repeat.","digitalWrite sends each result to the matching LED.")
        nodes=[(420,467,"READ","The buttons"),(960,467,"CALCULATE","The results"),(1500,467,"UPDATE","The LEDs")]
        active=int(t/2.3)%3
        for i,(x,y,head,body) in enumerate(nodes):
            rr(d,(x-235,y-105,x+235,y+105),28,PANEL,AMBER if active==i else PANEL2,4)
            text(d,(x,y-30),head,47,AMBER if active==i else WHITE,True)
            text(d,(x,y+42),body,37,MUTED)
            if i<2: arrow(d,(x+246,y),(x+290,y),AMBER if active==i else DIM,5,14)
        d.line(((1500,590),(1500,665),(420,665),(420,590)),fill=DIM,width=4)
        arrow(d,(420,633),(420,590),DIM,4,14)
        # A pulse travels along the return path to make the repeated loop visible.
        travel=(t/4)%1
        path_len=75+1080+75
        pos=travel*path_len
        if pos<75: px,py=1500,590+pos
        elif pos<1155: px,py=1500-(pos-75),665
        else: px,py=420,665-(pos-1155)
        d.ellipse((px-10,py-10,px+10,py+10),fill=MINT)
        text(d,(960,708),"REPEAT",32,MUTED,True)
        text(d,(960,844),"True = LED on     False = LED off",67,MINT,True)
        footer(d,"The display updates as the buttons change")
    else:
        raise ValueError(f"Unknown scene kind: {kind}")

    return im


def validate_contract(contract):
    if "led_display_order" in contract:
        assert contract["led_display_order"]["values"]==[16,8,4,2,1]
        assert contract["led_display_order"]["bit_indices"]==[4,3,2,1,0]
        assert contract["led_display_order"]["pins"]==[8,9,10,11,12]
    expected_start=0
    for scene in contract["scenes"]:
        assert scene["start_seconds"]==expected_start,scene["id"]
        assert scene["end_seconds"]-scene["start_seconds"]==scene["duration_seconds"],scene["id"]
        expected_start=scene["end_seconds"]
        v=scene["visual"]
        if scene["kind"]=="binary_bit":
            assert v["result"]==((v["count"] >> v["bit_index"]) & 1)
            assert v["weight"]==2**v["bit_index"]
            if "pin" in v: assert v["pin"]==12-v["bit_index"]
            if "input_binary" in v: assert int(v["input_binary"],2)==v["count"]
            if "shifted_binary" in v: assert int(v["shifted_binary"],2)==v["count"] >> v["bit_index"]
            if "mask_binary" in v: assert int(v["mask_binary"],2)==1
            if "mask_result_binary" in v: assert int(v["mask_result_binary"],2)==v["result"]
        if scene["kind"]=="binary_math_intro" and "comparisons" in v:
            for c in v["comparisons"]:
                assert int(c["binary"],2)==c["count"]
                assert int(c["shifted_binary"],2)==c["count"] >> v["shift_bit_index"]
                assert c["result"]==((c["count"] >> v["shift_bit_index"]) & 1)
                assert int(c["mask_result_binary"],2)==c["result"]
                assert c["pin"]==12-v["shift_bit_index"]
        if "outputs" in v:
            assert [int(s) for s in logic_states(v["a"],v["b"])]==v["outputs"]
        for key in ["states","phases"]:
            if key in v: assert sum(p["seconds"] for p in v[key])==scene["duration_seconds"]
    assert expected_start==contract["total_duration_seconds"]


def render_preview(contract):
    qa=EXPORTS/"QA_Stills"
    qa.mkdir(parents=True,exist_ok=True)
    for n,scene in enumerate(contract["scenes"]):
        im=render_scene(scene,scene["duration_seconds"]*.65)
        im.save(qa/f"{n+1:02d}_{scene['id']}.png")
    thumbs=[]
    for n,scene in enumerate(contract["scenes"]):
        im=render_scene(scene,scene["duration_seconds"]*.65)
        im.thumbnail((480,270))
        thumbs.append(im)
    contact=Image.new("RGB",(480*3,300*math.ceil(len(thumbs)/3)),BG)
    d=ImageDraw.Draw(contact)
    for n,im in enumerate(thumbs):
        x=(n%3)*480;y=(n//3)*300
        contact.paste(im,(x,y))
        text(d,(x+14,y+285),f"{n+1:02d}  {contract['scenes'][n]['id']}",17,MUTED,False,"lm")
    contact.save(qa/"00_contact_sheet.jpg",quality=93)


def render_clip(scene,index):
    out=WORK/f"{index+1:02d}_{scene['id']}.mp4"
    total_frames=round(scene["duration_seconds"]*FPS)
    cmd=[FFMPEG,"-hide_banner","-loglevel","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","pipe:0","-an","-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p","-movflags","+faststart",str(out)]
    process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for frame in range(total_frames):
            process.stdin.write(render_scene(scene,frame/FPS).tobytes())
        process.stdin.close()
        code=process.wait()
        if code: raise RuntimeError(f"ffmpeg failed with {code}")
    except Exception:
        process.kill()
        raise
    print(f"Rendered {index+1:02d}: {scene['id']} ({scene['duration_seconds']} seconds)",flush=True)
    return out


def combine(clips,name):
    manifest=WORK/f"{name}.concat.txt"
    # Every generated filename is controlled by the scene ids, with no quote characters.
    manifest.write_text("".join(f"file '{p.as_posix()}'\n" for p in clips))
    out=EXPORTS/f"{name}.mp4"
    subprocess.run([FFMPEG,"-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",str(manifest),"-c","copy","-movflags","+faststart",str(out)],check=True)
    return out


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--preview-only",action="store_true")
    parser.add_argument("--reuse-clips",action="store_true")
    parser.add_argument("--binary-only",action="store_true",help="Re-render binary scenes and preserve the existing logic MP4.")
    args=parser.parse_args()
    EXPORTS.mkdir(exist_ok=True);WORK.mkdir(exist_ok=True)
    contract=json.loads((ROOT/"animation_narration.json").read_text())
    validate_contract(contract)
    render_preview(contract)
    if args.preview_only:
        print("Preview stills ready.");return
    clips=[]
    for i,scene in enumerate(contract["scenes"]):
        path=WORK/f"{i+1:02d}_{scene['id']}.mp4"
        if args.binary_only and scene["start_seconds"]>=contract["binary_end_seconds"]:
            if not path.exists(): raise FileNotFoundError(f"Existing logic clip required: {path}")
        elif not args.reuse_clips or not path.exists(): path=render_clip(scene,i)
        clips.append(path)
    binary=[p for p,s in zip(clips,contract["scenes"]) if s["end_seconds"]<=contract["binary_end_seconds"]]
    logic=[p for p,s in zip(clips,contract["scenes"]) if s["start_seconds"]>=contract["binary_end_seconds"]]
    logic_output=EXPORTS/"Logic_Operators_Animation.mp4"
    if not args.binary_only:
        logic_output=combine(logic,"Logic_Operators_Animation")
    elif not logic_output.exists():
        raise FileNotFoundError(f"Existing logic export required: {logic_output}")
    outputs=[combine(clips,"Project_1_LED_Animation"),combine(binary,"Binary_Counter_Animation"),logic_output]
    probes={p.name:save_probe(p) for p in outputs}
    for p in outputs:
        subprocess.run([FFMPEG,"-hide_banner","-v","error","-i",str(p),"-f","null","-"],check=True)
    (EXPORTS/"render_validation.json").write_text(json.dumps({"contract_duration_seconds":contract["total_duration_seconds"],"binary_explanation":"actual bitRead expansion: (value >> bit) & 0x01", "led_display_order":contract.get("led_display_order"),"decoded_without_errors":True,"videos":probes},indent=2))
    print(json.dumps({p.name:probes[p.name]["format"]["duration"] for p in outputs},indent=2))


if __name__ == "__main__":
    main()
