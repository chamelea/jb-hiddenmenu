# jb-hiddenmenu
A highly customizable ARIA "menubutton" widget with full keyboard functionality as defined by W3C at http://www.w3.org/TR/wai-aria-practices/#menubutton

## Steps to Try out the Demo Page
1. download the zip
2. unzip the files
3. browse to your local demo.html file

##Usage
 * Markup - Menu `<div data-jb-hiddenmenu="abc"><ul>...<li><a>Menu Item</a></li>...</ul></div>`
 * Markup - Trigger(s)  `<a data-jb-hiddenmenu-trigger="abc">Menu Trigger</a>`
 * JS Init            `var myHiddenMenu = new JB.HiddenMenu(menu-object, menu-object-instance-id, opts);`

##TBD
* Unit Tests
* Demo Page Online
* Perf Analysis
* Documentation
* Improve Type Ahead Function
* Improve A11y of Demo Page Examples
