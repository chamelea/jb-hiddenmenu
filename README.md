# jb-hiddenmenu
A highly customizable ARIA "menubutton" widget with full keyboard functionality as defined by W3C at http://www.w3.org/TR/wai-aria-practices/#menubutton

Sometimes you just need a hidden menu component with baked in screen reader and keyboard
            accessibility.  You provide the HTML + CSS and drop in the JS + a couple custom data attributes to
            make it work.

***

## Steps to Try out the Demo Page
1. download the zip
2. unzip the files
3. browse to your local demo.html file

***

##Usage
 * Markup - Menu `<div data-jb-hiddenmenu="abc"><ul>...<li><a>Menu Item</a></li>...</ul></div>`
 * Markup - Trigger(s)  `<a data-jb-hiddenmenu-trigger="abc">Menu Trigger</a>`
 * JS Init            `var myHiddenMenu = new JB.HiddenMenu(menu-object, menu-object-instance-id, opts);`

***

## Mouse/Keyboard Functionality Matrix
As defined for ARIA Menu Button widgets by W3C at http://www.w3.org/TR/wai-aria-practices/#menubutton

<table>
    <tr>
        <th></th>
        <th>
         Button Trigger
         (Menu is Closed)
        </th>
        <th>
         Button Trigger
         (Menu is Open)
        </th>
        <th>Menu Item</th>
        <th>Document</th>
    </tr>
    <tr>
        <th>CLICK</th>
        <td>
           - Open Menu  
           - Leave Focus on Menu Button
        </td>
        <td>
            - Close Menu  
            - Leave Focus on Menu Button
        </td>
        <td>
            - Trigger Menu Item Action  
            - (opt) Close Menu  
            - (opt) Focus on Menu Button
        </td>
        <td>
            - Close Menu
        </td>
    </tr>
    <tr>
        <th>SPACE</th>
        <td>
           - Open Menu  
           - Leave Focus on Menu Button
        </td>
        <td>
            - Close Menu  
            - Leave Focus on Menu Button
         </td>
        <td>
            - Trigger Menu Item Action  
            - (opt) Close Menu  
            - (opt) Focus on Menu Button
        </td>
        <td>
            N/A
        </td>
    </tr>
    <tr>
        <th>ENTER</th>
        <td>
           - Open Menu  
           - Leave Focus on Menu Button
         </td>
        <td>
            - Close Menu  
            - Leave Focus on Menu Button
         </td>
        <td>
            - Trigger Menu Item Action  
            - (opt) Close Menu  
            - (opt) Focus on Menu Button
        </td>
        <td>
            N/A
        </td>
    </tr>
    <tr>
        <th>UP</th>
        <td>
            none
        </td>
        <td>
            none
        </td>
        <td>
            - Move Focus to Prev Enabled Menu Item OR  
            - Loop Focus to Last Enabled Menu Item
        </td>
        <td>
            N/A
        </td>
    </tr>
    <tr>
        <th>DOWN</th>
        <td>
            - Open Menu
            - Move Focus to First Enabled Menu Item
         </td>
        <td>
            N/A
        </td>
        <td>
            - Move Focus to Next Enabled Menu Item OR  
            - Loop Focus to First Enabled Menu Item
        </td>
        <td>
            N/A
        </td>
    </tr>
    <tr>
        <th>...letter...</th>
        <td>
            - Open Menu
            - Move Focus to First Enabled Menu Item that Starts with "letter"
         </td>
        <td>
            N/A
        </td>
        <td>
            - Move Focus to First Enabled Menu Item that Starts with "letter"
        </td>
        <td>
            N/A
        </td>
    </tr>
    <tr>
        <th>ESC</th>
        <td>none</td>
        <td>
            - Close Menu  
            - Leave Focus on Menu Button
         </td>
        <td>
            - Close Menu  
            - Move Focus to Menu Button
         </td>
        <td>N/A</td>
    </tr>
    <tr>
        <th>TAB</th>
        <td>
            - Move Focus to Next Element in Document Tab Order
         </td>
        <td>
            - Close Menu  
            - Move Focus to Next Element in Document Tab Order
         </td>
        <td>
            - Close Menu  
            - Move Focus to Next Element in Document Tab Order
         </td>
        <td>N/A</td>
    </tr>
</table>

***

##TBD
* Unit Tests
* Demo Page Online
* Perf Analysis
* Documentation
* Improve Type Ahead Function
* Improve A11y of Demo Page Examples
