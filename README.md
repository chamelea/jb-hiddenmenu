# jb-hiddenmenu
A highly customizable ARIA "menubutton" widget with full keyboard functionality as defined by W3C at http://www.w3.org/TR/wai-aria-practices/#menubutton

## Steps to Try out the Demo Page
1. download the zip
2. unzip the files
3. browse to your local demo.html file

##Usage
 *  (markup - menu)        `<div data-cb-hiddenmenu="abc"><ul>...<li><a>Menu Item</a></li>...</ul></div>`
 *  (markup - trigger(s))  `<a data-cb-hiddenmenu-trigger="abc">Menu Trigger</a>`
 *  (js init)              `var myHiddenMenu = new CB.HiddenMenu(menu-object, menu-object-instance-id, opts);`
