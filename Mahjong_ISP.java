import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.lang.Math;
import javax.swing.*;
import java.util.ArrayList;
import java.util.Arrays;


public class Mahjong_ISP extends JFrame implements KeyListener {
	// sizes for drawing tiles
	final int TILE_SIZE = 20;
	final int MINI_TILE_SIZE = 15;

	// hold user's choice
	String choice;
	// hold the current turn number
	int turn;

	// game over condition
	boolean gameOver = false;
	boolean actionTaken = false;
	boolean delay = true;
    boolean input = false;

	int[] tiles = new int[136];

	ArrayList TILES = new ArrayList();
	ArrayList actions = new ArrayList();
	ArrayList playerHands = new ArrayList();
	ArrayList playerOpens = new ArrayList();
	ArrayList playedTiles = new ArrayList();
	ArrayList actionLog = new ArrayList();

	Color tileColor = new Color(139, 255, 255);
	Color tileTopColor = new Color(150, 225, 225);
	Color tableColor = new Color(0, 137, 65);
	Color tableEdgeColor = new Color(255, 233, 118);
	Color tableIndentColor = new Color(0, 84, 39);
	Color tableCenterColor = new Color(0, 108, 49);
	Color tableSelectedColor = new Color(0, 52, 18);
	Color bambooColor = new Color(113, 225, 13);

	Font actionLogFont = new Font("Arial", Font.PLAIN, 11);
	Font defaultFont = new Font("Arial", Font.PLAIN, 13);

	Integer lastPlayed;

	public Mahjong_ISP() {
        super("HK Mahjong");
        setDefaultCloseOperation(ABORT);
        setVisible(true);
        setContentPane(new MahjongPanel());
	}

    public void keyPressed(KeyEvent e) {
        if (input) input = false;
    }

    public void keyReleased(KeyEvent e) {}
    
    public void keyTyped(KeyEvent e) {
        if (!input) return;

    }

    class MahjongPanel extends JPanel {
        public void paintComponent(Graphics g) {
            if (choice.equals("1")) instructions();
            else if (choice.equals("2")) play();
            else if (choice.equals("3")) return;
        }
    }

	// 	// while the user does not want to exit
	// 	while (game.choice != 3) {
	// 		// show the main menu and get user input
	// 		game.mainMenu();

	// 		// options from main menu
	// 		if (game.choice == 1) // instructions
	// 		{
	// 			game.instructions();
	// 		}
	// 		// play game
	// 		else if (game.choice == 2) {
	// 			game.play();
	// 		} else if (game.choice == 9) {
	// 			game.delay = false;
	// 		}
	// 	}
	// 	// closing the program
	// 	game.goodbye();
	// }

    private int[] arrayListToArray(ArrayList tilesIn) {
		int[] out = new int[tilesIn.size()];

		for (int i = 0; i < tilesIn.size(); i++)
			out[i] = ((Integer) tilesIn.get(i)).intValue();
		return out;
	}

	private ArrayList arrayToArrayList(int[] arr) {
		ArrayList temp = new ArrayList();

		for (int i = 0; i < arr.length; i++)
			temp.add(new Integer(arr[i]));
		return temp;
	}

	private void drawDot(int x, int y, int size, Color[] cols) {
		for (int i = 0; i < 3; i++) {
			System.out.setColor(cols[Math.min(i, cols.length - 1)]);
			System.out.drawOval(x + i * size / 6, y + i * size / 6, size - (i * size / 3), size - (i * size / 3));
		}
	}

	private void drawBamboo(int x1, int y1, int x2, int y2, boolean large) {

		System.out.drawLine(x1, y1, x2, y2);

		if (large) {
			System.out.drawLine(x1 + 1, y1, x2 + 1, y2);
			System.out.drawLine(x1, y1 + 1, x2, y2 + 1);
			System.out.drawLine(x1 - 1, y1, x2 - 1, y2);
			System.out.drawLine(x1, y1 - 1, x2, y2 - 1);
		}
	}

    private void drawSymbol (int x, int y, int symbol, int size, int orientation)
    {
        // System.out.setColor (Color.black);
        // System.out.drawString ("" + symbol, x, y + size/2);
    
        /* ---------------------- DOTS ---------------------- */

        // 1 dot
        if (symbol == 0) drawDot (x + size / 6, y + 3 * (size - (3 * size / 4)) / 2, 3 * size / 4, new Color[]{Color.green, Color.black, Color.red});

        // 2 dots
        else if (symbol == 1) {
            drawDot (x + size / 3, y + 3 * size / 10, size / 3, new Color[]{Color.green});
            drawDot (x + size / 3, y + (3 * size / 2) - 3 * size / 5, size / 3, new Color[]{Color.blue});
        }

        // 3 dots
        else if (symbol == 2) {
            drawDot (x + size / 5, y + size / 4, size / 3, new Color[]{Color.green});
            drawDot (x + size / 3, y + 3 * size / 4 - size / 6, size / 3, new Color[]{Color.red});
            drawDot (x + (4 * size / 5) - (size / 3), y + 9 * size / 8 - size / 6, size / 3, new Color[]{Color.blue});
        }

        // 4 dots
        else if (symbol == 3) {
            drawDot (x + size / 4, y + size / 3, size / 5, new Color[]{Color.green});
            drawDot (x + 5 * size / 8, y + size / 3, size / 5, new Color[]{Color.blue});
            drawDot (x + size / 4, y + size, size / 5, new Color[]{Color.blue});
            drawDot (x + 5 * size / 8, y + size, size / 5, new Color[]{Color.green});
        }
        
        // 5 dots
        else if (symbol == 4) {
            drawDot (x + size / 4, y + size / 3, size / 5, new Color[]{Color.green});
            drawDot (x + 5 * size / 8, y + size / 3, size / 5, new Color[]{Color.blue});
            drawDot (x + size / 4, y + size, size / 5, new Color[]{Color.blue});
            drawDot (x + 5 * size / 8, y + size, size / 5, new Color[]{Color.green});
            drawDot (x + 7 * size / 16, y + 2 * size / 3, size / 5, new Color[]{Color.red});
        }
        
        // 6 dots
        else if (symbol == 5) {
            drawDot (x + size / 5 + 1, y + size / 4 + 1, size / 4, new Color[] {Color.green});
            drawDot (x + size / 2 + 1, y + size / 4 + 1, size / 4, new Color[] {Color.green});
            drawDot (x + size / 5 + 1, y + 2 * size / 3 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 2 + 1, y + 2 * size / 3 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 5 + 1, y + 11 * size / 12 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 2 + 1, y + 11 * size / 12 + 1, size / 4, new Color[] {Color.red});
        }

        // 7 dots
        else if (symbol == 6) {
            drawDot (x + size / 10 + 2, y + size / 5 + 0, size / 4, new Color[] {Color.green});
            drawDot (x + size / 3 + 1, y + 3 * size / 10 + 0, size / 4, new Color[] {Color.green});
            drawDot (x + 3 * size / 5 + 0, y + 2 * size / 5 + 0, size / 4, new Color[] {Color.green});
            drawDot (x + size / 5 + 1, y + 2 * size / 3 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 2 + 1, y + 2 * size / 3 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 5 + 1, y + 11 * size / 12 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 2 + 1, y + 11 * size / 12 + 1, size / 4, new Color[] {Color.red});
        }
        
        // 8 dots
        else if (symbol == 7) {
            drawDot (x + size / 5 + 1, y + size / 6 + 1, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 2 + 1, y + size / 6 + 1, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 5 + 1, y + size / 2, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 2 + 1, y + size / 2, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 5 + 1, y + 3 * size / 4 + 1, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 2 + 1, y + 3 * size / 4 + 1, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 5 + 1, y + size + 2, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 2 + 1, y + size + 2, size / 4, new Color[] {Color.blue});
        }
        
        // 9 dots
        else if (symbol == 8) {
            drawDot (x + size / 9, y + size / 6 + 1, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 3 + 1, y + size / 6 + 1, size / 4, new Color[] {Color.blue});
            drawDot (x + 3 * size / 5, y + size / 6 + 1, size / 4, new Color[] {Color.blue});
            drawDot (x + size / 9, y + 3 * size / 5 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 3 + 1, y + 3 * size / 5 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + 3 * size / 5, y + 3 * size / 5 + 1, size / 4, new Color[] {Color.red});
            drawDot (x + size / 9, y + size + 1, size / 4, new Color[] {Color.green});
            drawDot (x + size / 3 + 1, y + size + 1, size / 4, new Color[] {Color.green});
            drawDot (x + 3 * size / 5, y + size + 1, size / 4, new Color[] {Color.green});
        }

        // 1 bamboo (BIRD)
        else if (symbol == 9) {
            int xOffset = 0, yOffset = 0;
            double scaleFactor = 1;
            
            int[][] symbolX = {{21, 30, 40, 31, 33, 37, 40, 32, 39, 41, 45, 33, 31, 32, 28, 27, 26, 28, 34, 27, 22, 20, 18, 20, 26, 18, 15, 7, 14, 7, 9, 11, 16, 13, 17, 22, 24, 31, 27, 28, 24, 25, 22, 20, 17, 18, 29, 37, 35, 32, 28, 22, 22, 27, 28, 27, 26, 25, 27, 30, 30, 27, 8, 20, 18}};
            int[][] symbolY = {{9, 13, 10, 15, 19, 18, 24, 35, 35, 33, 37, 37, 49, 60, 50, 39, 51, 59, 66, 59, 49, 38, 38, 50, 61, 50, 40, 44, 38, 38, 34, 36, 36, 27, 20, 21, 26, 25, 35, 28, 35, 28, 28, 24, 28, 36, 38, 24, 21, 22, 14, 12, 18, 22, 21, 19, 20, 19, 18, 20, 23, 23, 15, 15, 12}};
            
            System.out.setColor (bambooColor);
            
            // adjusting the proportions
            for (int i = 0 ; i < symbolX.length ; i++) {
                for (int j = 0 ; j < symbolX [i].length ; j++) {
                    symbolX [i] [j] = (int) (symbolX [i] [j] * size * scaleFactor / 50 + x + xOffset);
                    symbolY [i] [j] = (int) (symbolY [i] [j] * size * scaleFactor / 50 + y + yOffset);
                }
            }
            
            for (int i = 0 ; i < symbolX.length ; i++) System.out.fillPolygon (symbolX [i], symbolY [i], symbolX [i].length);

        }

        /* ---------------------- BAMBOO ---------------------- */

        else if (symbol < 18) {
            int[][] symbolX = {}, symbolY = {};
            int xOffset = 0, yOffset = 0;
            double scaleFactor = 1;
            
            // 2 bamboo
            if (symbol == 10) {
                symbolX = new int[][] {{25, 25},{25, 25}};
                symbolY = new int[][] {{10, 33},{42, 65}};
            }
            
            // 3 bamboo
            else if (symbol == 11) {
                symbolX = new int[][] {{25, 25},{13, 13},{37, 37}};
                symbolY = new int[][] {{10, 35},{40, 65},{40, 65}};
            }
            
            // 4 bamboo
            else if (symbol == 12) {
                symbolX = new int[][] {{14, 14},{36, 36},{14, 14},{36, 36}};
                symbolY = new int[][] {{10, 35},{10, 35},{40, 65},{40, 65}};
            }
            
            // 5 bamboo
            else if (symbol == 13) {
                symbolX = new int[][] {{13, 13},{13, 13},{37, 37},{37, 37},{25, 25}};
                symbolY = new int[][] {{10, 35},{40, 65},{10, 35},{40, 65},{23, 47}};
            }
            
            // 6 bamboo
            else if (symbol == 14) {
                symbolX = new int[][] {{13, 13},{13, 13},{25, 25},{25, 25},{37, 37},{37, 37}};
                symbolY = new int[][] {{10, 35},{40, 65},{10, 35},{40, 65},{10, 35},{40, 65}};
            }
            
            // 7 bamboo
            else if (symbol == 15) {
                symbolX = new int[][] {{13, 13},{13, 13},{25, 25},{25, 25},{25, 25},{37, 37},{37, 37}};
                symbolY = new int[][] {{30, 45},{50, 65},{10, 25},{30, 45},{50, 65},{30, 45},{50, 65}};
            }
            
            // 8 bamboo
            else if (symbol == 16) {
                symbolX = new int[][] {{13, 13, 25, 37, 37},{13, 13, 25, 37, 37}};
                symbolY = new int[][] {{10, 35, 23, 35, 10},{65, 40, 52, 40, 65}};
            }
            
            // 9 bamboo
            else if (symbol == 17) {
                symbolX = new int[][] {{13, 13},{13, 13},{13, 13},{25, 25},{25, 25},{25, 25},{37, 37},{37, 37},{37, 37}};
                symbolY = new int[][] {{10, 22},{30, 43},{53, 65},{10, 22},{30, 43},{53, 65},{10, 22},{30, 43},{53, 65}};
            }
            
            System.out.setColor (bambooColor);
            
            // adjusting the proportions
            for (int i = 0 ; i < symbolX.length ; i++) {
                for (int j = 0 ; j < symbolX [i].length ; j++) {
                    symbolX [i][j] = (int) (symbolX [i] [j] * size * scaleFactor / 50 + x + xOffset);
                    symbolY [i][j] = (int) (symbolY [i] [j] * size * scaleFactor / 50 + y + yOffset);
                }
            }
            
            for (int i = 0; i < symbolX.length; i++) {
                for (int j = 0; j < symbolX [i].length - 1; j++) {
                    drawBamboo (symbolX [i][j], symbolY [i][j], symbolX [i][j+1], symbolY [i][j+1], size >= TILE_SIZE-1);
                }
            }
        }

        else if (symbol < 27) {
            double scaleFactor = 1;
            int xOffset = 0, yOffset = 0;
            
            int[][] symbolX = {}, symbolY = {};
            
            // Maan (ten thousand symbol)
            int[][] tSymbolX = {{18, 19, 21, 21, 24, 24, 21, 21, 20, 15, 12, 15, 19},{30, 31, 33, 32, 36, 38, 38, 31, 29, 28, 29, 26, 26, 29, 30},{13, 16, 16, 24, 24, 23, 26, 26, 36, 39, 39, 38, 37, 36, 34, 31, 35, 36, 35, 26, 26, 29, 28, 31, 33, 32, 31, 30, 21, 19, 18, 20, 24, 24, 16, 16, 15, 14, 12, 11, 14},{24, 24, 20, 19, 26, 20, 21, 20, 26, 26, 30, 30, 31, 32, 34, 35, 32, 21, 18, 17, 16, 16, 17, 19, 20, 20},{19, 28, 31, 31, 19}};
            int[][] tSymbolY = {{31, 31, 32, 36, 35, 36, 37, 40, 38, 39, 37, 37, 36},{30, 29, 31, 34, 33, 34, 35, 36, 39, 40, 36, 36, 35, 35, 34},{53, 54, 55, 54, 50, 42, 42, 53, 51, 54, 56, 63, 66, 67, 67, 63, 64, 55, 54, 55, 58, 57, 55, 56, 59, 61, 61, 58, 62, 60, 59, 59, 58, 55, 56, 66, 65, 57, 57, 55, 55},{51, 49, 49, 43, 42, 41, 42, 49, 49, 51, 50, 51, 51, 50, 43, 42, 40, 42, 42, 41, 41, 42, 43, 51, 52, 51},{46, 44, 45, 46, 47}};
            
            // adjusting the proportions
            for (int i = 0 ; i < tSymbolX.length ; i++) {
                for (int j = 0 ; j < tSymbolX [i].length ; j++) {
                    tSymbolX [i][j] = (int) (tSymbolX [i] [j] * size * scaleFactor / 50 + x + xOffset);
                    tSymbolY [i][j] = (int) (tSymbolY [i] [j] * size * scaleFactor / 50 + y + yOffset);
                }
            }
            
            // drawing the symbol
            System.out.setColor (Color.red);
            for (int i = 0 ; i < tSymbolX.length ; i++) System.out.fillPolygon (tSymbolX [i], tSymbolY [i], tSymbolX [i].length);
            
            // 10 thousand
            if (symbol == 18) {
                symbolX = new int[][] {{11, 37, 39, 39, 35, 20, 14}};
                symbolY = new int[][] {{21, 18, 20, 21, 21, 22, 23}};
                xOffset = 1;
                yOffset = -1;
            }
            
            // 20 thousand
            else if (symbol == 19) {
                symbolX = new int[][] {{14, 17, 34, 36, 35, 17},{9, 11, 36, 40, 39, 25, 13}};
                symbolY = new int[][] {{11, 9, 7, 9, 11, 13},{22, 20, 18, 20, 22, 22, 24}};
                for (int i = 0; i < symbolY[0].length; i++) symbolY[0][i] += 2;
                xOffset = 1;
            }
            
            // 30 thousand
            else if (symbol == 20) {
                symbolX = new int[][] {{17, 30, 32, 32, 27, 19},{18, 30, 31, 31, 27, 20},{11, 37, 39, 39, 35, 20, 14}};
                symbolY = new int[][] {{10, 8, 9, 10, 11, 11},{15, 13, 14, 15, 16, 16},{21, 18, 20, 21, 21, 22, 23}};
                for (int i = 0; i < tSymbolY[1].length; i++) tSymbolY[1][i] += 3;
                for (int i = 0; i < tSymbolY[2].length; i++) tSymbolY[2][i] += 2;
                xOffset = 1;
            }
            
            // 40 thousand
            else if (symbol == 21) {
                symbolX = new int[][] {{12, 8, 17, 20, 19, 27, 30, 34, 40, 43, 34, 14, 14, 20, 19, 23, 23, 26, 26, 30, 33, 32, 29, 29, 33, 36, 36, 32, 30, 27, 23, 18, 14, 14}};
                symbolY = new int[][] {{7, 10, 25, 25, 23, 22, 26, 26, 14, 11, 3, 10, 13, 10, 18, 14, 9, 8, 16, 18, 16, 14, 15, 8, 7, 9, 12, 21, 20, 19, 19, 20, 13, 10}};
            }
            
            // 50 thousand
            else if (symbol == 22) {
                symbolX = new int[][] {{19, 23, 19, 20, 18, 16, 17, 17, 11, 9, 19, 17},{24, 28, 32, 35, 35, 32, 29, 32, 35, 32, 36, 40, 40, 38, 34, 27, 22, 20, 20, 28, 31, 28, 25, 23, 25, 22, 22, 26, 28, 25}};
                symbolY = new int[][] {{6, 10, 16, 25, 27, 26, 22, 18, 21, 20, 10, 8},{8, 8, 5, 7, 8, 9, 14, 13, 16, 21, 20, 23, 25, 25, 23, 24, 26, 25, 23, 21, 15, 16, 23, 23, 17, 18, 16, 15, 10, 10}};
            }
            
            // 60 thousand
            else if (symbol == 23) {
                symbolX = new int[][] {{12, 23, 23, 21, 23, 29, 27, 27, 34, 38, 37, 32, 24, 15},{13, 18, 18, 20, 24, 19},{26, 29, 32, 37, 35}};
                symbolY = new int[][] {{15, 13, 10, 8, 5, 8, 10, 13, 10, 13, 16, 15, 15, 19},{28, 22, 20, 18, 21, 26},{20, 16, 19, 24, 27}};
                scaleFactor = 0.85;
                xOffset = size/10;
                yOffset = size/15;
            }
            
            // 70 thousand
            else if (symbol == 24) {
                symbolX = new int[][] {{14, 15, 16, 16, 4, 1, 1, 3, 5, 16, 17, 18, 19, 22, 25, 33, 35, 35, 33, 32, 31, 28, 23, 20, 19, 19, 30, 35, 36, 34, 32, 31, 19, 19, 20, 18, 15}};
                symbolY = new int[][] {{2, 4, 10, 17, 22, 23, 24, 25, 25, 19, 24, 27, 29, 31, 31, 30, 29, 28, 21, 26, 27, 28, 28, 27, 25, 19, 15, 14, 13, 12, 11, 11, 17, 7, 4, 2, 1}};
                scaleFactor = 0.65;
                xOffset = size/4;
                yOffset = size/8;
            }
            
            // 80 thousand
            else if (symbol == 25) {
                symbolX = new int[][] {{16, 15, 15, 11, 5, 8, 13, 18},{20, 19, 22, 30, 33, 38, 39, 32, 23, 22}};
                symbolY = new int[][] {{6, 5, 8, 16, 23, 22, 18, 8},{1, 2, 4, 22, 23, 23, 21, 19, 2, 1}};
                xOffset = size/10;
                yOffset = size/10;
            }
            
            // 90 thousand
            else if (symbol == 26) {
                symbolX = new int[][] {{6, 9, 14, 17, 19, 24, 22, 22, 23, 27, 32, 36, 38, 37, 34, 32, 26, 24, 24, 26, 16, 15, 25, 20, 21, 22, 21, 18, 17, 18, 17, 10, 7, 8, 11, 17, 15, 12, 8}};
                symbolY = new int[][] {{34, 33, 29, 24, 17, 16, 24, 29, 32, 34, 35, 33, 31, 25, 30, 32, 31, 30, 25, 19, 16, 15, 13, 16, 9, 8, 7, 5, 6, 9, 17, 19, 19, 20, 21, 18, 24, 28, 32}};
                xOffset = 2 * size / 7;
                scaleFactor = 0.75;
            }
            
            // adjusting the proportions
            for (int i = 0 ; i < symbolX.length ; i++) {
                for (int j = 0 ; j < symbolX [i].length ; j++) {
                    symbolX[i][j] = (int) (symbolX [i] [j] * size * scaleFactor / 50 + x + xOffset);
                    symbolY[i][j] = (int) (symbolY [i] [j] * size * scaleFactor / 50 + y + yOffset);
                }
            }

            System.out.setColor (Color.black);
            
            // drawing the shapes
            for (int i = 0 ; i < symbolX.length ; i++) System.out.fillPolygon (symbolX [i], symbolY [i], symbolX [i].length);

        }
        // White Dragon (Ba Baan)
        // (special case: easier to just draw than to make a polygon)
        else if (symbol == 33) {
            System.out.setColor (Color.blue);
            System.out.drawRect (x + size/4, y + size/4, size/2, size);
            System.out.drawRect (x + size/4 + 1, y + size/4 + 1, size/2 - 2, size - 2);
        }
        
        else if (symbol >= 27) {
            int[] [] symbolX = {};
            int[] [] symbolY = {};
            double scaleFactor = 1;
            int xOffset = 0, yOffset = 0;

            // East (Doong)
            if (symbol == 27) {
                symbolX = new int[][]{{20, 25, 24, 25, 30, 33, 32, 24, 23, 30, 40, 46, 47, 39, 37, 33, 23, 23, 24, 23, 22, 20, 20, 21, 21, 12, 7, 5, 3, 17, 21, 22, 17, 15, 14, 22, 22},{12, 14, 32, 37, 37, 35, 32, 30, 30, 16, 15, 14, 11, 9, 9, 11, 12, 13, 16, 20, 21, 23, 30, 32, 31, 28, 13},{16, 17, 19, 28, 29, 21, 19}};
                symbolY = new int[][]{{15, 18, 22, 23, 21, 22, 23, 25, 40, 45, 50, 51, 52, 54, 54, 52, 43, 51, 55, 58, 60, 58, 56, 52, 44, 51, 54, 55, 55, 45, 40, 25, 26, 26, 25, 23, 20},{31, 31, 27, 29, 30, 34, 41, 41, 40, 41, 42, 41, 33, 31, 30, 30, 31, 32, 39, 39, 40, 38, 38, 31, 30, 31, 32},{35, 36, 37, 35, 34, 34, 35}};
                System.out.setColor (Color.blue);
            }
            
            // South (Laam)
            else if (symbol == 28) {
                symbolX = new int[][] {{19, 22, 19, 20, 25, 29, 28, 25, 22, 24, 26, 30, 34, 44, 40, 37, 29, 28, 26, 30, 32, 35, 30, 26, 29, 29, 26, 29, 30, 25, 24, 22, 21, 18, 18, 21, 21, 18, 18, 22, 23, 21, 20, 15, 17, 15, 12, 9, 14, 16, 15, 18, 20, 15, 20, 22}};
                symbolY = new int[][] {{18, 16, 25, 29, 25, 24, 33, 29, 35, 36, 31, 34, 34, 39, 41, 54, 60, 56, 52, 54, 53, 40, 37, 40, 41, 42,  44, 45, 48, 49, 57, 56, 50, 49, 47, 47, 45, 45, 43, 43, 38, 37, 41, 41, 55, 56, 53, 38, 40, 39, 34, 36, 32, 30, 28, 20}};
                System.out.setColor (Color.blue);
            }
            
            // West (Suy)
            else if (symbol == 29) {
                symbolX = new int[][] {{15, 29, 35, 19},{18, 20, 21, 25, 25, 27, 29, 37, 44, 38, 32, 30, 30, 27, 20, 19, 24, 30, 31, 35, 37, 37, 29, 28, 32, 34, 32, 27, 25, 25, 22, 21, 19, 18, 19, 16, 14, 17, 20, 19, 14, 8, 13, 18}};
                symbolY = new int[][] {{28, 17, 22, 25},{30, 31, 37, 36, 26, 26, 34, 34, 39, 52, 58, 57, 55, 53, 54, 53, 50, 50, 53, 50, 43, 38, 38, 42, 43, 45, 46, 45, 43, 38, 39, 46, 49, 48, 41, 40, 42, 53, 55, 57, 54, 40, 40, 38}};
                System.out.setColor (Color.blue);
            }
            
            // North (Buk)
            else if (symbol == 30) {
                symbolX = new int[][] {{25, 28, 35, 32, 32, 35, 35, 41, 32, 33, 37, 40, 44, 42, 36, 30, 27, 27, 21, 20, 18, 16, 12, 7, 7, 10, 14, 10, 8, 10, 13, 16, 16, 13, 12, 15, 20, 20, 27, 27}};
                symbolY = new int[][] {{20, 16, 23, 24, 39, 37, 33, 38, 43, 49, 49, 47, 50, 54, 55, 52, 47, 34, 43, 54, 55, 50, 55, 53, 50, 50, 46, 44, 41, 39, 42, 43, 34, 34, 32, 29, 33, 39, 33, 22}};
                System.out.setColor (Color.blue);
            }
            
            // Red Dragon (Hoong Joong)
            else if (symbol == 31) {
                symbolX = new int[][] {{20, 22, 25, 28, 29, 30, 28, 27, 27, 26, 25, 24, 23, 23, 21},{5, 8, 12, 19, 18, 15, 9},{13, 28, 38, 37, 14},{38, 39, 40, 45, 45, 44, 43, 38, 37, 35, 32, 32, 34, 36},{18, 33, 32, 19}};
                symbolY = new int[][] {{10, 8, 8, 10, 12, 16, 17, 38, 59, 65, 68, 65, 60, 17, 12},{27, 26, 27, 42, 44, 44, 32},{30, 25, 21, 24, 32},{21, 21, 22, 27, 29, 30, 29, 39, 41, 42, 41, 39, 35, 30},{40, 37, 39, 42}};
                System.out.setColor (Color.red);
                scaleFactor = 0.85;
                xOffset = size/15 + Math.max((2 - size/14), 0) * size/10;
                yOffset = size/10;
            }
            
            // Green Dragon (Faat Choi)
            else if (symbol == 32) {
                symbolX = new int [][]{{12, 18, 21, 15, 12, 9, 7, 5, 13, 10, 12, 13, 14, 15, 17, 18, 17, 14},{15, 20, 21, 22, 19, 20, 16, 15, 14, 13, 17, 18, 19, 19, 18, 18, 17, 16, 15, 11, 14, 15, 16, 17, 17, 16, 14, 11, 10, 10, 13, 13, 15, 17, 18, 19, 18},{22, 25, 37, 40, 44, 40, 39, 37, 34, 30, 35, 37, 34, 33, 31, 29, 27, 31, 30, 28, 28, 27, 26, 24, 23},{23, 24, 24, 23, 21, 23, 25, 26, 28, 29, 29, 30, 32, 35, 34, 30, 30, 31, 29, 26, 25},{23, 30, 33, 33, 30, 34, 35, 35, 28, 27, 25, 22, 20, 27, 27, 23, 28, 29, 30, 29, 25}};
                symbolY = new int [][]{{24, 22, 24, 34, 37, 39, 40, 41, 33, 29, 29, 30, 31, 30, 28, 25, 24, 25},{35, 33, 34, 35, 38, 39, 40, 40, 41, 43, 43, 43, 44, 45, 46, 50, 53, 54, 55, 51, 52, 51, 49, 47, 45, 44, 44, 47, 46, 45, 41, 38, 39, 39, 38, 37, 35},{23, 25, 38, 38, 37, 36, 35, 34, 32, 28, 26, 24, 22, 25, 27, 28, 25, 21, 20, 20, 21, 23, 24, 22, 22},{33, 35, 38, 40, 42, 41, 39, 35, 34, 35, 40, 41, 41, 40, 39, 38, 36, 33, 32, 34, 33},{44, 42, 44, 45, 49, 52, 54, 55, 51, 52, 53, 54, 54, 50, 49, 46, 48, 47, 45, 44, 45}};
                System.out.setColor (Color.green);
                scaleFactor = 1.2;
                xOffset = -size/15;
                yOffset = -size/8;
            }

            /* ---------- DRAWING THE TILE ---------- */
            
            // adjusting the proportions
            for (int i = 0 ; i < symbolX.length ; i++) {
                for (int j = 0 ; j < symbolX [i].length ; j++) {
                    symbolX [i] [j] = (int) (symbolX [i] [j] * size * scaleFactor / 50 + x + xOffset);
                    symbolY [i] [j] = (int) (symbolY [i] [j] * size * scaleFactor / 50 + y + yOffset);
                }
            }

            // drawing the shapes
            for (int i = 0 ; i < symbolX.length ; i++) System.out.fillPolygon (symbolX [i], symbolY [i], symbolX [i].length);
        }
    }

	private void drawTile(int x, int y, int symbol, int size) {
		System.out.setColor(tileColor);
		System.out.fillRect(x, y, size, 3 * size / 2);

		if (symbol >= 0) {
			System.out.setColor(tileTopColor);
			System.out.drawRect(x + 1, y + 1, size - 2, 3 * size / 2 - 2);
			System.out.setColor(Color.white);
			System.out.fillRect(x + 2, y + 2, size - 4, 3 * size / 2 - 4);
			drawSymbol(x, y, symbol, size, 0);
		}
	}

	private void drawTile(boolean highlighted, int x, int y, int symbol, int size) {
		System.out.setColor(tileColor);
		System.out.fillRect(x - 3, y - 3, size + 6, 3 * size / 2 + 6);

		if (symbol >= 0) {
			System.out.setColor(tileTopColor);
			System.out.drawRect(x + 1, y + 1, size - 2, 3 * size / 2 - 2);
			System.out.setColor(Color.white);
			System.out.fillRect(x + 2, y + 2, size - 4, 3 * size / 2 - 4);
			drawSymbol(x, y, symbol, size, 0);
		}
	}

	private void drawTile(int x, int y, int size, int symbol, int orientation) {
		System.out.setColor(tileColor);

		if (orientation % 2 == 1) {
			System.out.fillRect(x, y, 3 * size / 2, size);
		} else {
			System.out.fillRect(x, y, size, 3 * size / 2);
		}

		if (symbol >= 0) {
			System.out.setColor(tileTopColor);
			System.out.drawRect(x + 1, y + 1, size - 2, 3 * size / 2 - 2);
			System.out.setColor(Color.white);
			System.out.fillRect(x + 2, y + 2, size - 4, 3 * size / 2 - 4);
			drawSymbol(x, y, symbol, size, orientation);
		}
	}

	public void instructions() {
		int pageNum = 1;
		char input;

		while (pageNum != 0) {
			try {
                JLabel instruc = new JLabel();
				System.out.print("", 31);
				System.out.println("How to Play Mahjong");
				System.out.println();
				System.out.print("", 13);
				System.out.println("Press the corresponding number to go to the page listed:");
				System.out.println();
				System.out.println();
				System.out.print("", 32);
				System.out.println("Rules of Mahjong");
				System.out.println();
				System.out.print("", 18);
				System.out.println("1) Contents of the Game");
				System.out.print("", 18);
				System.out.println("2) Goal of the Game");
				System.out.print("", 18);
				System.out.println("3) On Your Turn [1]");
				System.out.print("", 18);
				System.out.println("4) On Your Turn [2]");
				System.out.print("", 18);
				System.out.println("5) Capturing Tiles");
				System.out.print("", 18);
				System.out.println("6) Winning the Game");
				System.out.print("", 18);
				System.out.println("7) Game End");
				System.out.println();
				System.out.print("", 25);
				System.out.println("Interface and User Interaction");
				System.out.println();
				System.out.print("", 18);
				System.out.println("8) How to Use");
				System.out.println();
				System.out.print("", 18);
				System.out.println("0) Return to Main Menu");

				for (int i = 23; i < 28; i++)
					drawTile((i - 16) * 50 + 25, 200, 50, i - 5, 0);

				System.out.setCursor(20, 21);
				input = System.out.getChar();
				pageNum = Integer.parseInt(input + "");

				if (pageNum < 0 || pageNum > 8)
					throw new IllegalArgumentException();
				else if (pageNum != 0)
					instructions(pageNum);
			} catch (IllegalArgumentException e) {}
		}
	}

	private void instructions(int page) {
		System.out.clear();
		System.out.print("", 31);
		System.out.println("How to Play Mahjong");
		System.out.println();

		if (page == 1) {
			System.out.print("", 27);
			System.out.println("Contents of the Game + Setup");
			System.out.println();
			System.out.println();
			System.out.print("", 5);
			System.out.println("The game of Mahjong is played with 4 players and a deck of 136 tiles.");
			System.out.print("", 5);
			System.out.println("There are 3 suits of tiles, namely Ten Thousands, Bamboos and Dots,");
			System.out.print("", 5);
			System.out.println("each with tiles numbered from 1 to 9. There are also 4 different wind");
			System.out.print("", 5);
			System.out.println("wind tiles and 3 different dragon tiles. Each of these 34 distinct tiles");
			System.out.print("", 5);
			System.out.println("have 4 copies in the deck of 136.");
			System.out.println();
			System.out.print("", 5);
			System.out.println("Each player receives 13 tiles, with the dealer starting with an extra");
			System.out.print("", 5);
			System.out.println("14th tile. The dealer then begins play by playing a tile from their");
			System.out.print("", 5);
			System.out.println("hand into the center.");

			for (int i = 0; i < 34; i++)
				drawTile(30 * (i % 17) + 50, 300 + 50 * (i / 17), i, 29);
		} else if (page == 2) {
			System.out.print("", 32);
			System.out.println("Goal of the Game");
			System.out.println();
			System.out.print("", 6);
			System.out.println("The goal of the game is to get a MAHJONG, which consists of getting");
			System.out.print("", 6);
			System.out.println("all 14 of your tiles into four triples and one pair. A pair consists");
			System.out.print("", 6);
			System.out.println("of two identical tiles. A triple can be a \"set\", which contains three");
			System.out.print("", 6);
			System.out.println("identical tiles, or a \"run\", made up of three consecutive numbers in");
			System.out.print("", 6);
			System.out.println("the same suit. A single tile cannot be used in more than one set at");
			System.out.print("", 6);
			System.out.println("once, meaning all tiles must be part of a triplet or pair.");

			System.out.setColor(Color.black);

			for (int i = 3; i <= 5; i++)
				drawTile((i - 1) * 50, 250, i, 39);
			System.out.drawString("Example Run", 130, 345);

			for (int i = 3; i <= 5; i++)
				drawTile((i - 1) * 50 + 300, 250, 7, 39);
			System.out.drawString("Example Set", 430, 345);
		} else if (page == 3) {
			System.out.print("", 34);
			System.out.println("On Your Turn [1]");
			System.out.println();
			System.out.print("", 5);
			System.out.println("For the most recently discarded tile, the first priority goes to any");
			System.out.print("", 5);
			System.out.println("player who can claim the discarded tile to complete a MAHJONG. A player");
			System.out.print("", 5);
			System.out.println("who can do this claims the tile, and therefore wins the game.");
			System.out.println();
			System.out.print("", 5);
			System.out.println("If no player claims the tile for a Mahjong, any player can then claim");
			System.out.print("", 5);
			System.out.println("the discarded tile to complete their set. The player claims \"set\",");
			System.out.print("", 5);
			System.out.println("and then reveals the two matching tiles that match the discarded tile.");
			System.out.print("", 5);
			System.out.println("For example, if the discarded tile was the 7 of bamboo, and the player");
			System.out.print("", 5);
			System.out.println("claiming set held at least two more copies of the 7 of bamboo in their");
			System.out.print("", 5);
			System.out.println("hand, they would be allowed to take the set. They would put those tiles");
			System.out.print("", 5);
			System.out.println("into their designated captured tiles area.");
			System.out.println();
			System.out.print("", 5);
			System.out.println("If no one calls Mahjong or asks for a set, the next player in line may");
			System.out.print("", 5);
			System.out.println("instead capture a run using the previous tile instead of drawing a tile,");
			System.out.print("", 5);
			System.out.println("revealing two other tiles in their hand which, together with the last");
			System.out.print("", 5);
			System.out.println("tile played, form a run.");
		} else if (page == 4) {
			System.out.print("", 34);
			System.out.println("On Your Turn [2]");
			System.out.println();
			System.out.print("", 5);
			System.out.println("If you took a tile from the center or it is your turn to draw a tile,");
			System.out.print("", 5);
			System.out.println("you draw a tile (if applicable) and must to discard a tile by playing");
			System.out.print("", 5);
			System.out.println("it into the center. The only exception would be calling a Mahjong using");
			System.out.print("", 5);
			System.out.println("the extra given tile, which immediately ends the game.");

		} else if (page == 5) {
			System.out.print("", 34);
			System.out.println("Capturing Tiles");
			System.out.println();
			System.out.print("", 5);
			System.out.println("To capture a set, you must hold at least two more copies of the tile you");
			System.out.print("", 5);
			System.out.println("wish to capture in your hand. To capture a set, you need to have tiles");
			System.out.print("", 5);
			System.out.println("in your hand which, when combined with the last played tile, form a run");
			System.out.print("", 5);
			System.out.println("of three consecutive numbers which share the same suit.");
			System.out.print("", 5);
			System.out.println("");

		} else if (page == 6) {
			System.out.print("", 32);
			System.out.println("Winning the Game");
			System.out.println();
			System.out.print("", 5);
			System.out.println("To achieve a Mahjong, you must hold 14 tiles in your hand and captured");
			System.out.print("", 5);
			System.out.println("tiles area which make up 4 valid triplets and a pair of tiles, or the");
			System.out.print("", 5);
			System.out.println("special case with 13 distinct tiles. Without the special case or the");
			System.out.print("", 5);
			System.out.println("4 triples, 2 doubles pattern, you are unable to call Mahjong and win");
			System.out.print("", 5);
			System.out.println("the game.");
			System.out.println();
			System.out.print("", 5);
			System.out.println("If there is still no winner by the time the deck runs out of tiles to");
			System.out.print("", 5);
			System.out.println("draw, the game ends in a tie.");
		} else if (page == 7) {
			System.out.print("", 36);
			System.out.println("Game End");
			System.out.println();
			System.out.print("", 5);
			System.out.println("Once someone calls Mahjong, the game is over, and will display a large");
			System.out.print("", 5);
			System.out.println("screen with either the winner of the game or a message saying the game");
			System.out.print("", 5);
			System.out.println("ended in a tie.");
		} else if (page == 8) {
			System.out.print("", 35);
			System.out.println("How to Use");
			System.out.println();
			System.out.println();
			System.out.print("", 7);
			System.out.println("Whenever you see a bright outline or white outline, it means you are");
			System.out.print("", 7);
			System.out.println("able to change which option you would like to select.");
			System.out.println();
			System.out.println();
			System.out.print("", 15);
			System.out.println("Navigate using A and D to move left and right, and");
			System.out.print("", 15);
			System.out.println("Select option with spacebar");
		}

		System.out.setCursor(22, 16);
		System.out.println("Press any key to return to the instructions page:");
		pauseProgram();
	}

	public void mainMenu() {
		System.out.clear();
		System.out.setFont(defaultFont);
		System.out.print("", 36);
		System.out.println("Main Menu");
		System.out.println();
		System.out.print("", 25);
		System.out.println("Welcome to the Mahjong Player!");
		System.out.print("", 13);
		System.out.println("Press the number corresponding the option to select it:");
		System.out.println();
		System.out.print("", 30);
		System.out.println("1) Instructions");
		System.out.print("", 30);
		System.out.println("2) Play Mahjong");
		System.out.print("", 30);
		System.out.println("3) Exit Program");
		System.out.println();

		for (int j = 0; j < 4; j++)
			for (int i = 0; i < 14; i++)
				drawTile(40 * i + 50, 200 + 70 * j, (int)(Math.random() * 34), 39);

		while (true) {
			try {
				choice = Integer.parseInt(System.out.getChar() + "");

				// error trapping invalid selection
				if ((choice < 1 || choice > 3) && choice != 9)
					throw new IllegalArgumentException();
				break;
			} catch (IllegalArgumentException e) {}
		}

	}

	private int drawFromStack() {
		int rand = (int)(Math.random() * tiles.length);
		int tileRet = tiles[rand];
		TILES.remove(rand);
		tiles = arrayListToArray(TILES);
		return tileRet;
	}

	private void drawPlayerHandArea(int player) {
		System.out.setColor(player == turn ? tableSelectedColor :
			tableIndentColor);

		if (player == 0)
			System.out.fillRect(100, 420, 300, 50); // seat 0
		else if (player == 1)
			System.out.fillRect(420, 100, 50, 300); // seat 1
		else if (player == 2)
			System.out.fillRect(105, 30, 300, 50); // seat 2
		else
			System.out.fillRect(30, 105, 50, 300); // seat 3
	}

	private void drawTable() {
		// drawing the actual table
		System.out.setColor(tableEdgeColor);
		System.out.fillRect(0, 0, 500, 500);
		System.out.setColor(tableColor);
		System.out.fillRect(25, 25, 450, 450);

		// drawing the player hand areas
		System.out.setColor(tableIndentColor);

		for (int i = 0; i < 4; i++)
			drawPlayerHandArea(i);

		// drawing the played tile areas
		System.out.setColor(tableCenterColor);
		System.out.fillRect(125, 115, 250, 275);

		// drawing the player action selection area
		System.out.setColor(new Color(235, 235, 235));
		System.out.fillRect(510, 420, 150, 100);
	}

	//private method to play a tile from a player's hand

	private void playTile(int player, int tileNum) {
		ArrayList currHand = arrayToArrayList((int[]) playerHands.get(player));
		playedTiles.add((Integer) currHand.get(tileNum));
		lastPlayed = (Integer) currHand.get(tileNum);
		drawPlayerHandArea(player);
		drawHand(player, -1);
		// drawTile (240, 234, ((Integer) currHand.get (tileNum)).intValue (), TILE_SIZE-1);
		currHand.remove((Integer) currHand.get(tileNum));
		playerHands.set(player, (int[])(arrayListToArray(currHand)));
	}

	// drawing the played tiles
	private void drawPlayedTiles() {
		for (int i = 0; i < playedTiles.size(); i++)
			drawTile(140 + (i % 11) * TILE_SIZE, 130 + (i / 11) * 3 * TILE_SIZE / 2, ((Integer)(playedTiles.get(i))).intValue(), TILE_SIZE - 1);
	}

	// private method to show the user's possible actions

	private void showActions(boolean[] runs) {
		char selection = '-';
		int ind = 0;

		while (selection != ' ') {
			for (int i = 0; i < actions.size(); i++) {
				System.out.setColor(ind == i ? Color.red :
					new Color(235, 235, 235));
				System.out.fillRect(520 + i * 40, 450, 30, 30);
				System.out.setColor(tableIndentColor);
				System.out.fillRect(525 + i * 40, 455, 20, 20);
				System.out.setColor(Color.black);
				String actionName;

				if (((Integer)(actions.get(i))).intValue() == 0)
					actionName = "Pass";
				else if (((Integer)(actions.get(i))).intValue() == 1)
					actionName = "Capture Set";
				else if (((Integer)(actions.get(i))).intValue() == 2)
					actionName = "Capture Run";
				else
					actionName = "Call Mahjong";
				System.out.drawString(actionName, 515 + i * 20 + actionName.length(), 495 - 50 * (i % 2));
			}

			selection = System.out.getChar();

			if (selection == 'd')
				ind = Math.min(ind + 1, actions.size() - 1);
			else if (selection == 'a')
				ind = Math.max(ind - 1, 0);
			else
				continue;
		}

		// clearing action menu
		System.out.setColor(new Color(235, 235, 235));
		System.out.fillRect(510, 420, 150, 100);

		int tempInd = 0;
		int[] possibilities = { 0 };

		if (((Integer) actions.get(ind)).intValue() == 2) {

			// stores how many possible run options there are
			ArrayList temp = new ArrayList();
			int posRuns = 0;

			for (int i = 0; i < runs.length; i++)
				if (runs[i]) {
					posRuns++;
					temp.add(new Integer(i));
				}

			possibilities = new int[temp.size()];

			for (int i = 0; i < temp.size(); i++)
				possibilities[i] = ((Integer) temp.get(i)).intValue();

			int len = possibilities.length;
			tempInd = 0;
			selection = '-';

			while (selection != ' ') {
				for (int i = 0; i < len; i++) {
					System.out.setColor(tempInd == i ? Color.red :
						new Color(235, 235, 235));
					System.out.fillRect(520 + i * 40, 450, 30, 30);
					System.out.setColor(tableIndentColor);
					System.out.fillRect(525 + i * 40, 455, 20, 20);
					System.out.setColor(Color.black);

					for (int j = 0; j < 3; j++)
						drawTile(515 + j * 13 + i * 40, 430, lastPlayed.intValue() - possibilities[i] + j, 13);
				}

				selection = System.out.getChar();

				if (selection == 'a')
					tempInd = Math.max(tempInd - 1, 0);
				else if (selection == 'd')
					tempInd = Math.min(tempInd + 1, len - 1);
			}
		}

		// clearing action menu
		System.out.setColor(new Color(235, 235, 235));
		System.out.fillRect(510, 420, 150, 100);

		performAction(0, ((Integer) actions.get(ind)).intValue(), possibilities[tempInd]);

	}

	// ~~takes the last played tile and two of the players' tiles to form a set/run~~

	//                                   run = 0, set = 1
	private void captureSet(int player, int captureType, int tile1, int tile2) {
		ArrayList hand = arrayToArrayList((int[]) playerHands.get(player));
		ArrayList captured = (ArrayList) playerOpens.get(player);

		// remove two of the tiles from the player's hand
		hand.remove(new Integer(tile1));
		hand.remove(new Integer(tile2));

		// add three of the tile to the player's captured tiles
		int[] temporaryCaptureSet = {
			lastPlayed.intValue(), tile1, tile2
		};
		Arrays.sort(temporaryCaptureSet);

		captured.add((int[]) temporaryCaptureSet);

		playerHands.set(player, arrayListToArray(hand));
		playerOpens.set(player, captured);

		// remove the last tile from the center (played tiles)
		playedTiles.remove(playedTiles.size() - 1);

		// draws over the tile in the center
		System.out.setColor(tableCenterColor);
		System.out.fillRect(140 + (playedTiles.size() % 11) * TILE_SIZE, 130 + (playedTiles.size() / 11) * 3 * TILE_SIZE / 2, TILE_SIZE, 3 * TILE_SIZE / 2);
	}

	//private method to perform an action for a player

	/*

	Variable Name           Type            Use
	player                  int             Holds the number of the player's hand to change

	action                  int             Holds what kind of action to take:
	                                        1 = set
	                                        2 = run
	                                        3 = Mahjong

	place                   int             For capturing run: tells whether the last tile
	                                        played is the lowest, middle, or highest tile
	                                        in the run

	hand                    ArrayList       Holds the players updated hand

	insert                  ArrayList       Holds the players updated open tiles

	lastPlayedInt           int             Holds the int value of the last played tile

	*/

	private void performAction(int player, int action, int place) {
		ArrayList hand = arrayToArrayList((int[])(playerHands.get(player)));
		ArrayList insert = (ArrayList)(playerOpens.get(player));

		// set of 3
		if (action == 1) {
			captureSet(player, 1, lastPlayed.intValue(), lastPlayed.intValue());
			actionLog.add(new String("Player " + (player + 1) + " captured set"));

			while (turn % 4 != player)
				turn++;
		}

		// run of 3
		else if (action == 2) {
			// saving the integer value of the last played tile for convenience
			int lastPlayedInt = lastPlayed.intValue();
			int tile1 = -1, tile2 = 2;

			if (place == 0)
				tile1 = 1;
			else if (place == 1)
				tile2 = 1;
			else if (place == 2)
				tile2 = -2;
			captureSet(player, 0, lastPlayedInt + tile1, lastPlayedInt + tile2);
			actionLog.add(new String("Player " + player + " captured run"));

			// hand.remove (new Integer (lastPlayedInt + 2 - (int) Math.round (4 * place / 3.0)));
			// hand.remove (new Integer (lastPlayedInt + 1 - (int) Math.round (4 * place / 3.0)));
			// int[] temp = new int[3];
			// temp[0] = lastPlayedInt;
			// temp[1] = lastPlayedInt + 2 - (int) Math.round (4 * place / 3.0);
			// temp[2] = lastPlayedInt + 1 - (int) Math.round (4 * place / 3.0);
			// Arrays.sort (temp);
			// insert.add (temp);
			// playerHands.set (player, arrayListToArray (hand));
			// playerOpens.set (player, insert);
		}

		// call mahjong
		else if (action == 3) {
			gameOver = true;

			while (turn % 4 != player)
				turn++;
		}

		actionTaken = action != 0;

		if (action != 0)
			drawPlayedTiles();
	}

	public void play() {
		// clearing screen
		System.out.clear();
		drawTable();

		// preparing for new game
		TILES.clear(); // reset deck
		for (int i = 0; i < 34; i++)
			for (int j = 0; j < 4; j++)
				TILES.add(new Integer(i)); // refresh deck
		tiles = arrayListToArray(TILES); // reset deck
		playerHands.clear(); // clearing hands
		playerOpens.clear(); // clearing hands
		playedTiles.clear(); // clearing played tiles
		actionLog.clear();

		// resetting game over condition
		gameOver = false;

		int[] temp;
		int ind = 0;
		turn = 0;
		ArrayList currPlayerHand = new ArrayList();

		// preparing player hands
		for (int i = 0; i < 4; i++) {
			temp = new int[13];

			for (int j = 0; j < temp.length; j++)
				temp[j] = drawFromStack();
			playerHands.add(temp);
			playerOpens.add(new ArrayList());
		}

		// main game loop
		while (!gameOver) {

			// turn format:

			// check action
			// draw tile
			// draw hand
			// play tile
			// draw hand again
			for (int i = 0; i < 4; i++) {
				drawPlayerHandArea(i);
				drawHand(i, -1);
			}

			currPlayerHand = arrayToArrayList((int[]) playerHands.get(turn % 4));

			actionTaken = false;

			// checking for win condition for previous tile if there is at least one tile in the discard pile
			if (turn != 0 && playedTiles.size() > 0) {

				// getting the last played tile
				lastPlayed = (Integer) playedTiles.get(playedTiles.size() - 1);

				int loopCounter = 0;
				// checking each player
				for (int j = (turn + 3) % 4; loopCounter < 4; j = (j + 3) % 4) {

					// incrementing the loop counter
					loopCounter++;

					// int version of the last played tile for convenience
					int lastPlayedInt = lastPlayed.intValue();

					// don't check actions if the last tile was played by the same person/CPU
					if (j == (turn - 1) % 4)
						continue;

					// checking for actions
					ArrayList freq = new ArrayList();
					ArrayList distinct = new ArrayList();

					// clearing actions and adding a draw/cancel option
					actions.clear();
					actions.add(new Integer(0));

					// getting a temporary copy of the hand for the checkWin() method
					ArrayList handCheck = arrayToArrayList((int[]) playerHands.get(j));

					// getting arrays for the distinct tiles and frequencies of each
					for (int i = 0; i < handCheck.size(); i++) {
						// getting the current tile in the hand
						Integer elem = (Integer)(handCheck.get(i));

						// if a repetition of a previous tile
						if (distinct.contains(elem)) {
							// adds one to the frequency
							freq.set(distinct.indexOf(elem), new Integer(((Integer) freq.get(distinct.indexOf(elem))).intValue() + 1));
						}
						// else it is not a previously seen tile
						else {
							// add a count of 1 to the frequency array
							freq.add(new Integer(1));
							// add to distinct array
							distinct.add((Integer)(handCheck.get(i)));
						}
					}
					// checking for possible capture set option
					// if the hand contains the last played tile and the frequency of that tile is 2 or more
					if (handCheck.contains(lastPlayed) && ((Integer) freq.get(distinct.indexOf(lastPlayed))).intValue() >= 2) {

						// add a "capture set" option to the list of possible actions
						actions.add(new Integer(1));
					}

					// array for capture run option
					boolean[] streak = new boolean[3];

					// checking for possible capture run option
					if (j == (turn % 4) && lastPlayedInt  <  27) {
						streak[0] = handCheck.contains(new Integer(lastPlayedInt + 1)) && handCheck.contains(new Integer(lastPlayedInt + 2)) && lastPlayedInt % 9  <  7;
						streak[1] = handCheck.contains(new Integer(lastPlayedInt - 1)) && handCheck.contains(new Integer(lastPlayedInt + 1)) && (lastPlayedInt + 1) % 9 >= 2;
						streak[2] = handCheck.contains(new Integer(lastPlayedInt - 2)) && handCheck.contains(new Integer(lastPlayedInt - 1)) && (lastPlayedInt) % 9 >= 2;
					}

					boolean addRunAction = false;
					ArrayList posRuns = new ArrayList();

					for (int i = 0; i < 3; i++)
						if (streak[i]) {
							addRunAction = true;
							posRuns.add(new Integer(i));
						}

					if (addRunAction)
						actions.add(new Integer(2));

					// checking for win option
					handCheck.add(lastPlayed);

					if (checkWin(arrayListToArray(handCheck)))
						actions.add(new Integer(3));

					// checking player options
					if (j == 0) {
						// if (actions.size () > 1) showActions (actions.contains (new Integer (2)) ? streak : new int[] {});
						if (actions.size() > 1)
							showActions(streak);
						else
							performAction(0, 0, 0);

						// checking computer actions
					} else {

						// picking a random action to perform
						int randAction = (int)(Math.random() * actions.size());

						// win the game if possible
						if (actions.contains(new Integer(3)))
							performAction(j, 3, 0);

						// if random action is to draw tile
						else if (randAction == 0 && turn % 4 == j)
							performAction(j, 0, 0);
						// if random action is to do a set
						else if (actions.contains(new Integer(1)) && randAction > 0) {
							performAction(j, 1, 0);

							while (turn % 4 != j)
								turn++;
						}
						// if random action is to do a run
						else if (actions.contains(new Integer(2)) && randAction > 0) {
							performAction(j, 2, ((Integer) posRuns.get((int)(Math.random() * posRuns.size()))).intValue());
						}
					}
				}
			}

			if (gameOver)
				break;

			// draw a tile if action was not taken
			if (!actionTaken) {
				currPlayerHand.add(new Integer(drawFromStack()));
				playerHands.set(turn % 4, (arrayListToArray(currPlayerHand)));
			}

			// getting the current player's hand
			temp = (int[]) playerHands.get(turn % 4);
			// getting the player's hand as an ArrayList
			currPlayerHand = arrayToArrayList(temp);

			// drawing the current player's hand
			drawPlayerHandArea(turn % 4);
			drawHand(turn % 4, -1);

			// drawing action log
			System.out.setColor(new Color(230, 230, 230));
			System.out.fillRect(525, 100, 100, 100);
			// drawing actions
			System.out.setColor(Color.black);
			System.out.setFont(actionLogFont);
			// displaying up to 3 of the last actions
			for (int i = actionLog.size() - 1; i >= 0 && i >= actionLog.size() - 3; i--) {
				// drawing the string
				System.out.drawString((String) actionLog.get(i), 525, 100 + (actionLog.size() - i) * 25);
			}

			System.out.setFont(defaultFont);
			// drawing the tiles in the center
			drawPlayedTiles();

			temp = arrayListToArray(currPlayerHand);
			playerHands.set(turn % 4, temp);

			// check for winning hand
			gameOver = gameOver || checkWin(turn % 4);

			if (gameOver)
				break;

			for (int h = 1; h < playerHands.size(); h++)
				drawHand(h, 0);

			try {
				Thread.sleep(delay && turn % 4 != 0 ? 1000 :
					1);
			} catch (Exception e) {}

			// player's turn
			if (turn % 4 == 0) {
				ind = Math.max(0, Math.min(((int[]) playerHands.get(0)).length - 1, ind));
				char currAction = '_';

				while (currAction != ' ') {
					drawPlayerHandArea(0);
					drawHand(0, ind);
					currAction = System.out.getChar();

					if (currAction == 'a' || currAction == 'A')
						ind = Math.max(0, ind - 1);

					if (currAction == 'd' || currAction == 'D')
						ind = Math.min(((int[]) playerHands.get(0)).length - 1, ind + 1);
				}

				playTile(0, ind);
			}

			// non-player turn
			else {
				// select random tile
				playTile(turn % 4, (int)(Math.random() * (currPlayerHand.size() - 1)));
			}

			// redrawing the tiles in the center
			drawPlayedTiles();

			drawPlayerHandArea(turn % 4);
			drawHand(turn % 4, -1);

			turn++;

			if (tiles.length == 0)
				turn = -1;
			gameOver = gameOver || tiles.length == 0;

			try {
				Thread.sleep(delay ? 1000 :
					1);
			} catch (Exception e) {}

		}

		if (turn > -1 && ((int[]) playerHands.get(turn % 4)).length != 14) {
			ArrayList tempTiles = arrayToArrayList((int[]) playerHands.get(turn % 4));
			tempTiles.add(lastPlayed);
			playerHands.set(turn % 4, arrayListToArray(tempTiles));
		}

		System.out.clear();

		// displaying final winner message
		System.out.setColor(Color.black);
		System.out.setFont(new Font("Courier New", Font.BOLD, 30));
		System.out.drawString(turn < 0 ? "It was a tie!" :
			"Player " + (turn % 4 + 1) + " Wins!", 180, 200);

		if (turn >= 0) {
			int[] currHand = ((int[]) playerHands.get(turn % 4));
			ArrayList currOpens = ((ArrayList) playerOpens.get(turn % 4));

			for (int i = 0; i < currHand.length; i++)
				drawTile(50 + i * 40, 300, currHand[i], 39);

			for (int i = 0; i < currOpens.size(); i++) {
				int[] currTiles = ((int[]) currOpens.get(i));

				for (int j = 0; j < currTiles.length; j++) {
					drawTile(50 + (currHand.length + i * 3 + j) * 40, 300, currTiles[j], 39);
				}
			}
		}

		pauseProgram();
	}

	private boolean checkWin(int player) {
		return checkWin((int[]) playerHands.get(player));
	}

	private boolean checkWin(int[] hand) {
		Arrays.sort(hand);
		ArrayList temp = new ArrayList();
		ArrayList distinct = new ArrayList();

		for (int i = 0; i < hand.length; i++) {
			Integer elem = new Integer(hand[i]);

			// gets an frequency arraylist of the tiles in hand
			if (distinct.contains(elem)) {
				// adds one if element exists
				temp.set(distinct.indexOf(elem), new Integer(((Integer) temp.get(distinct.indexOf(elem))).intValue() + 1));
			} else {
				// else create element
				temp.add(new Integer(1));
				distinct.add(new Integer(hand[i]));
			}
		}

		if (!(temp.contains(new Integer(2)) || temp.contains(new Integer(3)) || temp.contains(new Integer(4))))
			return false;

		// checking special hands

		/* ---------- UNIQUE 13 ---------- */
		// all 1s, 9s, winds, and dragons + any 1 duplicate
		ArrayList UNIQUE_13 = new ArrayList();

		// adding the values to the hand
		for (int i = 0; i < 6; i++)
			UNIQUE_13.add(new Integer(((i + 1) / 2) * 9 - i % 2));

		for (int i = 27; i < 34; i++)
			UNIQUE_13.add(new Integer(i));

		// actual check for special hand
		if (distinct == UNIQUE_13)
			return true;

		return checkWinRecursive(hand, arrayListToArray(temp), arrayListToArray(distinct));
	}

	// recursive check to check for a winning hand
	private boolean checkWinRecursive(int[] hand, int[] freq, int[] distinct) {

		// if the last tiles are a pair
		if (hand.length == 2)
			return hand[0] == hand[1];
		// if there is a triple to remove from the hand
		if (arrayToArrayList(freq).contains(new Integer(3)) || arrayToArrayList(freq).contains(new Integer(4))) {

			// check each tile in the hand
			for (int i = 0; i < distinct.length; i++) {

				// if that tile has 3 or 4 duplicates
				if (freq[i] >= 3) {

					// getting temporary ArrayList versions of the hand array and distinct tiles array
					ArrayList tempHand = arrayToArrayList(hand);
					ArrayList tempDistinct = arrayToArrayList(distinct);

					// removing 3 of the selected tile from the temporary hand
					for (int j = 0; j < 3; j++)
						tempHand.remove(new Integer(distinct[i]));

					// subtracting 3 from the frequency array at that tile's index
					freq[i] -= 3;

					// getting a temporary ArrayList copy of the frequency array
					ArrayList tempFreq = arrayToArrayList(freq);

					// checking if there are no more of that tile in the current hand
					if (freq[i] == 0) { // if there are none left
						// remove the tile from the temporary distinct and frequency ArrayLists
						tempDistinct.remove(new Integer(distinct[i]));
						tempFreq.remove(new Integer(0));
					}

					// returning true if the recursive call is true
					if (checkWinRecursive(arrayListToArray(tempHand), arrayListToArray(tempFreq), arrayListToArray(tempDistinct))) {
						return true;
					}
					// returning the frequency array to normal
					freq[i] += 3;
				}
			}
		}

		// checking for possible runs
		int[] lastTiles = { -2, -2 };

		// checking each distinct tile in the hand
		for (int i = 0; i < distinct.length; i++) {

			// if the three tiles in the array are consecutive numbers
			if (distinct[i] - 1 == lastTiles[1] && lastTiles[1] - 1 == lastTiles[0]) {

				// accounting for suit changes
				// - does not count if the numbers cross the 9 numbers in a tile suit
				// - e.g. 8 dots, 9 dots, 1 bamboo : NOT a run
				// checking if the last suit matches the current tile's suit
				if (lastTiles[1] > -2 && (distinct[i]) / 9 != lastTiles[1] / 9) {
					// setting the last suit to the current tile's suit

					// replacing the previous tiles with values that cannot contribute to a run
					lastTiles = new int[] {
						-2, -2
					};
					continue;
				}

				// accounting for specials (winds/dragons)
				// - cannot be put into runs, must be triples
				if (distinct[i] >= 27)
					break; // once the current tile is the first special or more, there are only specials afterward, so break out of the loop
				ArrayList tempHand = arrayToArrayList(hand);
				ArrayList tempDistinct = arrayToArrayList(distinct);

				// removing the tiles in the run from the hand
				tempHand.remove(new Integer(lastTiles[0]));
				tempHand.remove(new Integer(lastTiles[1]));
				tempHand.remove(new Integer(distinct[i]));

				// subtracting one of each tile from the frequency array
				int[] idxs = new int[3];
				idxs[0] = tempDistinct.indexOf(new Integer(lastTiles[0]));
				idxs[1] = tempDistinct.indexOf(new Integer(lastTiles[1]));
				idxs[2] = tempDistinct.indexOf(new Integer(distinct[i]));

				// subtracting from the frequency array
				for (int j = 0; j < 3; j++)
					freq[idxs[j]]--;

				// temporary ArrayList copy of the frequency array
				ArrayList tempFreq = arrayToArrayList(freq);

				// removing distinct tiles if there are none of them left
				if (freq[idxs[0]] == 0)
					tempDistinct.remove(new Integer(lastTiles[0]));

				if (freq[idxs[1]] == 0)
					tempDistinct.remove(new Integer(lastTiles[1]));

				if (freq[idxs[2]] == 0)
					tempDistinct.remove(new Integer(distinct[i]));

				// removing any 0s from the frequency ArrayList
				while (tempFreq.contains(new Integer(0)))
					tempFreq.remove(new Integer(0));

				// returning true if the recursive call is true
				if (checkWinRecursive(arrayListToArray(tempHand), arrayListToArray(tempFreq), arrayListToArray(tempDistinct)))
					return true;

				// resetting the frequency array
				for (int j = 0; j < 3; j++)
					freq[idxs[j]]++;

			}

			lastTiles[0] = lastTiles[1];
			lastTiles[1] = distinct[i];
		}

		return false;
	}

	// drawing the players hands (and captured tiles)
	private void drawHand(int handNum, int tileHighlighted) {
		int[] hand = (int[]) playerHands.get(handNum);

		Arrays.sort(hand);

		// player hand
		if (handNum == 0) {

			// non-highlighted tiles
			for (int i = 0; i < hand.length; i++)
				if (tileHighlighted != i)
					drawTile(110 + i * TILE_SIZE, 430, hand[i], TILE_SIZE - 1);
			// highlighted
			if (tileHighlighted >= 0 && tileHighlighted  <  hand.length)
				drawTile(true, 110 + tileHighlighted * TILE_SIZE, 430, hand[tileHighlighted], TILE_SIZE - 1);

			// CPU 1
		} else if (handNum == 1) {
			for (int i = 0; i < hand.length; i++)
				drawTile(430, 370 - i * TILE_SIZE, TILE_SIZE - 1, -1, handNum);

			// CPU 2
		} else if (handNum == 2) {
			for (int i = 0; i < hand.length; i++)
				drawTile(380 - i * TILE_SIZE, 40, TILE_SIZE - 1, -1, handNum);

			// CPU 3
		} else if (handNum == 3) {
			for (int i = 0; i < hand.length; i++)
				drawTile(40, 115 + i * TILE_SIZE, TILE_SIZE - 1, -1, handNum);
		}

		// open (captured) tiles
		for (int k = 0; k < 4; k++) {
			System.out.setColor(Color.lightGray);
			System.out.fillRect(510 + (k % 2) * 70, 210 + (k / 2) * 100, 60, 80);
			System.out.setColor(Color.black);
			System.out.drawString("Player " + (k + 1), 520 + (k % 2) * 70, 305 + (k / 2) * 100);

			ArrayList currOpens = (ArrayList) playerOpens.get(k);

			for (int i = 0; i < currOpens.size(); i++) {
				int[] currTriple = ((int[]) currOpens.get(i));

				for (int j = 0; j < currTriple.length; j++) {
					drawTile(520 + j * MINI_TILE_SIZE + ((k % 2) * 70),
						220 + i * (3 * MINI_TILE_SIZE / 2) + ((k / 2) * 100),
						currTriple[j],
						MINI_TILE_SIZE - 1);
				}
			}
		}
	}

	public void goodbye() {
		System.out.clear();
		System.out.print("", 21);
		System.out.println("Thank you for using the Mahjong Player!");
		System.out.println();
		System.out.print("", 23);
		System.out.println("Press any key to close the program.");
		pauseProgram();
		System.out.close();
	}

	// main method
	public static void main(String[] args) {
		Mahjong_ISP game = new Mahjong_ISP();

		// while the user does not want to exit
		while (!game.choice.equals("3")) {
			// show the main menu and get user input
            game.repaint();
		}
		// closing the program
		game.goodbye();
	}
}