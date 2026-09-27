from pathlib import Path
import hashlib
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from pypdf import PdfReader
import pypdfium2 as pdfium

OUT=Path(__file__).resolve().parent
SOURCE=OUT.parent/'Binary_Counter_Only.ino'
before=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
W,H=A4
pdf=OUT/'Binary_Counter_Only_Flowcharts.pdf'
c=canvas.Canvas(str(pdf),pagesize=A4)
c.setTitle('Binary Counter Only - Program Flowcharts')
c.setAuthor('Harry Bartos')
INK=HexColor('#213547');EDGE=HexColor('#586d7e');TEAL=HexColor('#236754')
PROCESS=HexColor('#f0f6f3');DECISION=HexColor('#fff6df');WHITE=HexColor('#ffffff')

def text(x,top,lines,size=10,bold=False,align='center',color=INK,leading=None):
    if isinstance(lines,str):lines=lines.split('\n')
    leading=leading or size*1.26
    c.setFillColor(color);c.setFont('Helvetica-Bold' if bold else 'Helvetica',size)
    for j,line in enumerate(lines):
        y=H-top-j*leading
        if align=='center':c.drawCentredString(x,y,line)
        elif align=='right':c.drawRightString(x,y,line)
        else:c.drawString(x,y,line)

def block(x,top,w,h,lines,kind='process',size=10):
    c.setStrokeColor(EDGE);c.setLineWidth(1.05)
    c.setFillColor(DECISION if kind=='decision' else PROCESS if kind in ['process','subroutine'] else WHITE)
    if kind=='decision':
        p=c.beginPath();p.moveTo(x,H-top);p.lineTo(x+w/2,H-top-h/2);p.lineTo(x,H-top-h);p.lineTo(x-w/2,H-top-h/2);p.close();c.drawPath(p,fill=1,stroke=1)
    else:
        c.roundRect(x-w/2,H-top-h,w,h,h/2 if kind=='terminal' else 4,fill=1,stroke=1)
        if kind=='subroutine':
            for xx in [x-w/2+7,x+w/2-7]:c.line(xx,H-top,xx,H-top-h)
    if isinstance(lines,str):lines=lines.split('\n')
    leading=size*1.23
    # Baseline-based placement with optical correction for Helvetica capitals.
    first=top+h/2-(len(lines)-1)*leading/2+size*.34
    text(x,first,lines,size=size,leading=leading,bold=kind=='terminal')

def arrow(points,head=True):
    c.setStrokeColor(EDGE);c.setFillColor(EDGE);c.setLineWidth(1.05)
    p=c.beginPath();p.moveTo(points[0][0],H-points[0][1])
    for x,y in points[1:]:p.lineTo(x,H-y)
    c.drawPath(p)
    if head:
        (x0,y0),(x,y)=points[-2:]
        dx,dy=x-x0,y-y0;length=(dx*dx+dy*dy)**.5;ux,uy=dx/length,dy/length
        a=(x-ux*6-uy*2.5,y-uy*6+ux*2.5)
        b=(x-ux*6+uy*2.5,y-uy*6-ux*2.5)
        p=c.beginPath();p.moveTo(x,H-y);p.lineTo(a[0],H-a[1]);p.lineTo(b[0],H-b[1]);p.close();c.drawPath(p,fill=1,stroke=0)

def label(x,top,s):text(x,top,s,size=8.5,color=TEAL)
def header(title,subtitle,page):
    text(38,36,'MAKR 100  /  PROJECT 1  /  HARRY BARTOS',size=8.5,bold=True,align='left',color=TEAL)
    text(38,65,title,size=20,bold=True,align='left')
    text(38,85,subtitle,size=9.5,align='left',color=EDGE)
    c.setStrokeColor(HexColor('#dce5e9'));c.line(38, H-799, W-38,H-799)
    text(38,815,'Source: Binary_Counter_Only.ino',size=8,align='left',color=EDGE)
    text(W-38,815,f'{page} / 2',size=8,align='right',color=EDGE)

header('Binary counter: main program','One completed press and release adds 1. The counter cycles from 0 to 31.',1)
x=273
# Central path and explicit return branches.
for a,b in [(128,143),(206,231),(265,284),(332,350),(388,408),(456,477),(511,532),(582,601),(632,650),(696,726)]:arrow([(x,a),(x,b)])
arrow([(x,760),(x,779),(552,779),(552,248),(383,248)])
for y in [308,432,557]:arrow([(391,y),(552,y)],head=False)
arrow([(391,673),(412,673)])
arrow([(468,689),(468,743),(383,743)])
block(x,103,112,25,'START',kind='terminal',size=10)
block(x,143,278,63,['Startup (once)','counter = 0; lastButtonState = HIGH','Serial: 9600 baud; D2: INPUT_PULLUP','Configure five LED outputs; call displayCount()'],size=9.2)
block(x,231,220,34,['Read the button on D2','buttonState = digitalRead(BUTTON_PIN)'],size=9.3)
block(x,284,236,48,['Did the button','reading change?'],kind='decision',size=10)
block(x,350,220,38,['Wait 50 ms, then read D2 again','delay(50); re-read buttonState'],size=9.5)
block(x,408,236,48,['Is the reading still different','from lastButtonState?'],kind='decision',size=9.4)
block(x,477,220,34,'lastButtonState = buttonState',size=10)
block(x,532,236,50,['buttonState == HIGH?','Button released?'],kind='decision',size=10)
block(x,601,220,31,'counter++',size=11)
block(x,650,236,46,'counter > 31?',kind='decision',size=11)
block(468,657,112,32,'counter = 0',size=10)
block(x,726,220,34,['Call displayCount()','See page 2'],kind='subroutine',size=10)
label(289,343,'Yes');label(289,468,'Yes');label(290,594,'Yes');label(289,715,'No')
label(415,299,'No');label(415,423,'No');label(440,548,'No - still pressed');label(402,664,'Yes')
c.saveState();c.translate(566,H-544);c.rotate(90);text(0,H,'Return to the next loop() pass',size=8.2,color=EDGE);c.restoreState()
c.showPage()

header('displayCount(): choose each LED','Called once at startup, then after each increment or reset.',2)
x=214
for a,b in [(137,166),(200,226),(284,316),(361,395),(440,474),(534,566)]:arrow([(x,a),(x,b)])
arrow([(x,600),(x,617),(54,617),(54,255),(96,255)])
arrow([(332,255),(404,255)])
arrow([(475,280),(475,325)])
block(x,110,192,27,'displayCount()',kind='terminal',size=11)
block(x,166,230,34,'i = 0',size=11)
block(x,226,236,58,['i < LED_COUNT?','(i < 5)'],kind='decision',size=11)
block(x,316,230,45,['Read bit i from counter','bitRead(counter, i)','The result is 0 or 1.'],size=10)
block(x,395,230,45,['Select the LED pin','LED_PINS[i]'],size=10.5)
block(x,474,250,60,['Write that bit to the selected LED','digitalWrite(LED_PINS[i],','bitRead(counter, i));','1 = ON     0 = OFF'],size=9.4)
block(x,566,230,34,'i++',size=11)
block(475,231,142,49,['Print the counter','to Serial Monitor'],size=10)
block(475,325,142,40,['RETURN','to the caller'],kind='terminal',size=9.6)
label(230,303,'Yes');label(366,246,'No')
text(77,454,'Repeat',size=8.5,color=EDGE)
text(475,410,['The count does not change','inside this function.','Only the display updates.'],size=9,color=EDGE,leading=13)

text(42,650,'Each loop iteration uses the same position in the LED array.',size=10,bold=True,align='left')
left=42;top=667;col0=140;cw=65;rh=25
rows=[['i (bit index)','0','1','2','3','4'],['LED pin','D12','D11','D10','D9','D8'],['Position value','1','2','4','8','16']]
for row_index,row in enumerate(rows):
    yy=top+row_index*rh
    c.setFillColor(PROCESS if row_index%2==0 else WHITE);c.rect(left,H-yy-rh,col0+5*cw,rh,fill=1,stroke=0)
    text(left+10,yy+17,row[0],size=9.4,bold=True,align='left')
    for j,value in enumerate(row[1:]):text(left+col0+(j+.5)*cw,yy+17,value,size=10)
text(42,766,'Example: counter = 13 lights the 8, 4, and 1 positions (01101).',size=10,align='left',color=TEAL)
c.save()

reader=PdfReader(pdf)
assert len(reader.pages)==2
assert 'counter > 31?' in reader.pages[0].extract_text()
assert 'bitRead(counter, i)' in reader.pages[1].extract_text()
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()==before
rendered=pdfium.PdfDocument(str(pdf))
for i,name in enumerate(['Binary_Counter_Main_Flowchart.png','Binary_Counter_LED_Loop.png']):
    rendered[i].render(scale=2.3).to_pil().save(OUT/name)
print('Saved 2-page PDF and two PNGs. Source sketch unchanged.')
print(pdf)
