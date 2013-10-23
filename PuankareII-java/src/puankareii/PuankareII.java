/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package puankareii;

import java.awt.*;
import java.awt.event.*;
import javax.swing.JPanel;
/**
 *
 * @author user
 */
public class PuankareII extends Frame{

    PuankareII(String s) {
        super(s);
    }

    public void paint(Graphics g) {
        g.setFont(new Font("Serif", Font.ITALIC | Font.BOLD, 30));
        //g.drawString("Hello, XXI century World!", 20, 100);
        //g.drawLine(10, 10, 20, 30);
        g.drawArc(30, 30, 660, 660, 45, 200);
        g.fillArc(300, 300, 4, 4, 0, 360);
    }

    public static void main(String[] args) {
        Frame f = new PuankareII("Разбиение Л2 на n-угольники по r-сходящиеся.");
        //NewJPanel panel = new NewJPanel();
        //panel.setSize(300, 300);
        f.setSize(700, 700);
        f.setVisible(true);
        f.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent ev) {
                System.exit(0);
            }
        });
    }
}
