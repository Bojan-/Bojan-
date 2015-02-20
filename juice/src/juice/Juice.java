/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package juice;

import java.util.Scanner;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.Iterator;
import java.io.FileWriter;
import java.lang.InterruptedException;

/**
 *
 * @author fpm.moysa
 */
public class Juice {

    ArrayList <Description> juices = new ArrayList ();
    
    ArrayList <String> fruits = new ArrayList ();
    
    boolean notMet (String s) {
        if (fruits.contains(s))
            return true;
        else
            return false;
    }
    
    void addFruits (Juice J, StringTokenizer st) {
        String s;
        while (st.hasMoreTokens()) {
            s = st.nextToken();
            if (!J.notMet(s))
                J.fruits.add(s);
        }
    }
    
    void printFruits(FileWriter fw) {
        Iterator it = fruits.iterator();
        try {
            while (it.hasNext()) {
                fw.write(it.next().toString() + "\r\n");
            }
            fw.close();
        } catch (IOException e) {};
    }
    
    void setAllPriority() {
        int count;
        for (int i = 0; i < juices.size(); i++) {
            count = 0;
            for (int j = i; j >= 0; j--) {
                if (juices.get(i).components.size() == juices.get(j).components.size() + 1)
                    if (juices.get(i).include(juices.get(j)))
                        count += juices.get(j).priority + 1;
                else
                    if (juices.get(i).components.size() > juices.get(j).components.size() + 1)
                        break;
            }
            juices.get(i).setPriority(count);
        }
    }
    
    int count () {
        boolean flag;
        int count = 1;
        Description juice = juices.get(0);
        while (!juices.isEmpty()) {
            flag = false;
            for (Description j : juices) {
                if (j.include(juice)) {
                    juice = j;
                    juices.remove(j);
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                juice = juices.get(0);
                count++;
            }
        }
        return count;
    }
    
    public static void main(String[] args) {
        
        Juice J = new Juice ();
        
        try {
            Scanner sc = new Scanner (new File ("juice.in"));
            StringTokenizer st;
            String s;
            while (sc.hasNextLine()) {
                s = sc.nextLine();
                st = new StringTokenizer (s);
                J.juices.add(new Description (s));
                J.addFruits(J, st);
            }
            
            J.printFruits(new FileWriter ("juice1.out"));
            
            Thread t = new Thread(){
                public void run() {
                   J.fruits.sort((a, b) -> a.compareTo(b));
                }
            };

            t.start();
            t.join();
            
            J.printFruits(new FileWriter ("juice2.out"));
            
            J.juices.sort((a, b) -> a.components.size() - b.components.size());
            
            J.setAllPriority();
            
            J.juices.sort(new Description ());
            
            FileWriter fw = new FileWriter ("juice3.out");
            fw.write("Минимальное количество раз, которое придется помыть емкость для сока = " + Integer.toString(J.count()));
            fw.close();
            
        } catch (IOException e) {} catch (InterruptedException e) {}

    }
    
}
