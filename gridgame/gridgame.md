# GRIDGAME

Coding Instructions
- JMP   N
- JMK   K
### Moves instruction pointer to index K, or index (register at N) without changing stack
- JSR   N
- JSK   K
### Adds current address to the top of the stack, and moves instruction pointer to index K, or index (register at N)

- RET
### Returns instruction pointer to the address at the top of the stack

- NOP
### No instruction


Math Operations:
- OP    N   M
- OPK   N   K
### Applies the corresponding operation from register M or from K to register N
> ADD / ADK     add
> SUB / SBK     subtract
> MUL / MLK     multiply
> DVI / DVK     divide (integer)
> DIF / DFK     divide (float)

- MOV   N   M
- MVK   N   K
### Moves value at register M into register N, or K into register N

- CLR   N
### Sets register N to 0


Comparisons:
- OP    N   M
- OPK   N   K
### Compares register N to register M or K; if false, then skips the next instruction
> EQL / EQK     equal
> NEQ / NEK     not equal
> LTH / LTK     less than
> GTH / GTK     greater than
> LEQ / LEK     less than or equal to
> GEQ / GEK     greater than or equal to




Loop example:

for i in range(5):
    player_x += i
    player_y -= 1

CLR 1
ADK 1  1
ADD 10 1
SBK 11 1
LQK 1  5
JMK 2



Register Layout:

    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0
                                                                   Map   
    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0
 PlayerX PlayerY  Value  
    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0

# 30
                                                           KEYS
    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0
  KeyQ    KeyW    KeyE    KeyR    KeyT    KeyY    KeyU    KeyI    KeyO    KeyP    KeyA    KeyS    KeyD    KeyF    KeyG    KeyH
    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0
  KeyJ    KeyK    KeyL    KeyZ    KeyX    KeyC    KeyV    KeyB    KeyN    KeyM    Key0    Key1    Key2    Key3    Key4    Key5
    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0
  Key6    Key7    Key8    Key9    MINUS   EQUAL   COMMA   PERIOD  SHIFT   CTRL    SPACE   ENTER   LEFT    RIGHT    UP     DOWN

# 60
                                                        Key Lockouts
    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0
  KeyQ    KeyW    KeyE    KeyR    KeyT    KeyY    KeyU    KeyI    KeyO    KeyP    KeyA    KeyS    KeyD    KeyF    KeyG    KeyH
    0       0       0       0       0       0       0       0       0       0       0       0       0       0       0       0
  KeyJ    KeyK    KeyL    KeyZ    KeyX    KeyC    KeyV    KeyB    KeyN    KeyM    Key0    Key1    Key2    Key3    Key4    Key5
    0       0       0       0     
  Key6    Key7    Key8    Key9

                                                        Constants
                                    20      0       0       0       0       0       0       0       0       0       0       0
                                 Lockout 

# 90

