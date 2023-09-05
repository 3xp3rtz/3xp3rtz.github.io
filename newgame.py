import pygame
from math import *
from random import random
pygame.init()

screenwidth, screenheight = 1000, 800
borderwidth = 100
pullstrength = 0.1
divfactor = 10000
gravityfactor = 0.95
idealdist = 125
nodesize = 20
fontsize = nodesize
EPSILON = 1e-10

hidesidebar = False

screen = pygame.display.set_mode((screenwidth,screenheight))

nodes = []
globalbuttons = []
sidebarbuttons = []

class Vector:
    # self.mode = "xy"
    # self.mode = "vec"
    def __init__(self, x=0, y=0, mag=None, theta=None) -> None:
        self.x = x
        self.y = y
        if mag != None and theta != None:
            self.x = cos(theta)*mag
            self.y = sin(theta)*mag

    def add(self, vec):
        self.x += vec.x
        self.y += vec.y

    def mag(self):
        # print(self.x,self.y)
        return sqrt(self.x**2 + self.y**2)

    def dir(self):
        return atan2(self.y, self.x)
    
    def dist(self, vec):
        return abs(sqrt(abs(self.x - vec.x)**2 + abs(self.y - vec.y)**2))

    def __add__(self, vec):
        return Vector(vec.x + self.x, vec.y + self.y)

    def __sub__(self, vec):
        return Vector(vec.x - self.x, vec.y - self.y)
    
    def scale(self, factor=None):
        if factor == None: factor = self.mag()
        if factor < EPSILON:
            return Vector(0,0)
        self.x *= factor
        self.y *= factor
        return self
    
    def __str__(self) -> str:
        return f"{(self.x, self.y)}"
    
    def tuple(self):
        return (self.x, self.y)

class Node:
    def __init__(self, x=0, y=0) -> None:
        self.loc = Vector(x,y)
        self.vel = Vector()
        self.id = len(nodes)

    def __str__(self) -> str:
        return f"{self.loc} {self.vel}"
    
    def dist(self, node) -> int:
        return sqrt(abs(self.loc.x - node.loc.x)**2 + abs(self.loc.y - node.loc.y)**2)

    def iter(self):
        self.vel = Vector()
        for node in nodes:
            dist = node.loc - self.loc
            # try:
            # print("MAG", dist.mag())
            # self.vel += (j := dist.scale(abs(pow(10,-(dist.mag())/100))))
            self.vel += (j := dist.scale(pullstrength*(-log10(dist.mag() + 1) + log10(idealdist))))
            # self.vel += (j := dist.scale(-(dist.mag()-idealdist)/divfactor))
            # self.vel += (j := dist.scale(-(dist.mag()-idealdist)*1/115))
            # print("self.loc, node.loc", self.loc, node.loc)
            # print("dist, j", dist, j)
            # print('vel', self.vel)

            # print()
            # except:
            #     pass
        self.vel.scale(gravityfactor)

    def randloc(self):
        self.loc = Vector(random()*(screenwidth - borderwidth*2), random()*(screenheight - borderwidth*2))
    
    def update(self):
        self.loc += self.vel
        if self.loc.mag() > screenwidth*screenheight: return False
        return True
    
class Button:
    def __init__(self, x1, y1, x2, y2, id) -> None:
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.id = id
    
    def colliding(self, x, y):
        return (self.x1 <= x <= (self.x1 + self.x2)) and (self.y1 <= y <= (self.y1 + self.y2))

def init():
    global font
    font = pygame.font.Font('PixelFont.ttf', fontsize)
    # add button
    sidebarbuttons.append(Button(screenwidth-175, 175, 50, 50, 0))
    # add button
    sidebarbuttons.append(Button(screenwidth-175, 250, 50, 50, 2))

    # hide sidebar button
    globalbuttons.append(Button(screenwidth-50, 150, 50, 50, 1))

def draw():
    run = True
    visible = True
    while run:
        # if pygame.event.get(): print(pygame.event.get())
        for event in pygame.event.get():
            if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE):
                run = False
                break
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_BACKSPACE:
                    removeNode()
                if event.key == pygame.K_SPACE:
                    visible = not visible
                if event.key == pygame.K_0:
                    print([str(node) for node in nodes])
                if event.key == pygame.K_n:
                    createNode(*pygame.mouse.get_pos())
            if event.type == pygame.KEYUP:
                pass
            if event.type == pygame.MOUSEBUTTONDOWN:
                mousePressed(*pygame.mouse.get_pos())
        if not visible: continue
        iter()
        for nd in range(len(nodes)):
            node = nodes[nd]
            # print(node.loc)
            pygame.draw.circle(screen, (255,255,255), node.loc.tuple(), nodesize)
            text = font.render(str(nd), False, (0,0,0))
            textloc = node.loc.tuple()
            screen.blit(text, (textloc[0] - fontsize/2, textloc[1] - fontsize/2))
        if not hidesidebar: sidebar()
        globals()

        pygame.display.flip()


def iter():
    screen.fill((0,0,0))
    for node in nodes:
        node.iter()
        tocenter = (Vector() - node.loc)
        node.vel += tocenter.scale(5*pullstrength*(-log(tocenter.mag() + 1) - log(pullstrength)))
    for node in range(len(nodes)):
        try:
            if not nodes[node].update():
                nodes.pop(node)
                node -= 1
        except:
            print("error removing node", node)

def globals():
    pygame.draw.rect(screen, (127, 127, 127), (globalbuttons[0].x1, globalbuttons[0].y1, globalbuttons[0].x2, globalbuttons[0].y2))
    pygame.draw.polygon(screen, (91, 91, 91), ((screenwidth-15, 160), (screenwidth-15, 190), (screenwidth-35, 175)) if hidesidebar else ((screenwidth-35, 160), (screenwidth-35, 190), (screenwidth-15, 175)))

def sidebar():
    pygame.draw.rect(screen, (191, 191, 191), (screenwidth-200, 150, 200, 500))
    for button in sidebarbuttons:
        pygame.draw.rect(screen, (127, 127, 127), (button.x1, button.y1, button.x2, button.y2))
    pygame.draw.polygon(screen, (127, 255, 127), ((screenwidth-170, 195), (screenwidth-170, 205), (screenwidth-155, 205), (screenwidth-155, 220), (screenwidth-145, 220), (screenwidth-145, 205), (screenwidth-130, 205), (screenwidth-130, 195), (screenwidth-145, 195), (screenwidth-145, 180), (screenwidth-155, 180), (screenwidth-155, 195)))
    pygame.draw.polygon(screen, (255, 127, 127), ((screenwidth-170, 270), (screenwidth-170, 280), (screenwidth-130, 280), (screenwidth-130, 270)))
    

def createNode(x=None,y=None):
    if x == None:
        x, y = randonscreen()
    print("Create Node", len(nodes))
    n = Node(x,y)
    # n.randloc()
    nodes.append(n)

def removeNode(ind=-1):
    if len(nodes): nodes.pop(ind)

def checkbuttons(x, y, buttonlist):
    for button in buttonlist:
        if button.colliding(x,y):
            buttonClicked(button.id)

def mousePressed(x, y):
    checkbuttons(x, y, globalbuttons)
    if not hidesidebar:
        checkbuttons(x, y, sidebarbuttons)

def buttonClicked(id):
    global hidesidebar
    if id == 0: # new node
        createNode()
    if id == 1:
        hidesidebar = not hidesidebar
    if id == 2:
        removeNode()
    if id == 3:
        pass

def randonscreen():
    return random()*((screenwidth-2*borderwidth)-(0 if hidesidebar else 200))+borderwidth, random()*(screenheight-2*borderwidth)+borderwidth

init()
draw()

pygame.quit()