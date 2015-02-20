/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package juice;

import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.StringTokenizer;
import java.util.Comparator;

/**
 *
 * @author fpm.moysa
 */
public class Description implements Comparator {
    
    ArrayList <String> components = new ArrayList ();
    int priority;
    
    Description () {}
    
    Description (String s) {
        StringTokenizer st = new StringTokenizer (s);
        while (st.hasMoreTokens()) {
            components.add(st.nextToken());
        }
    }
    
    boolean include (Description juice) {
        for (String s : juice.components)
            if (!components.contains(s))
                return false;
        return true;
    }
    
    void setPriority (int p) {
        priority = p;
    }
    
    @Override
    public int compare (Object n, Object m) {
        Description a = (Description)n;
        Description b = (Description)m;
        if (a.components.size() != b.components.size())
            return a.components.size() - b.components.size();
        else
            return a.priority - b.priority;
    }
}
