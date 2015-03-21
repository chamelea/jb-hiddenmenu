/**
 * Created by jbeach on 2015-03-16
 * Adapted From:    http://www.w3.org/TR/wai-aria-practices/#menubutton, http://www.oaa-accessibility.org/examplep/menubar1/
 * Description:     Accessible single-hierarchy hidden menu (menu button, not a full menubar).
 * Usage:
 *  (markup - menu)        <div data-jb-hiddenmenu="abc"><ul>...<li><a>Menu Item</a></li>...</ul></div>
 *  (markup - trigger(s))  <a data-jb-hiddenmenu-trigger="abc">Menu Trigger</a>
 *  (js init)              var myHiddenMenu = new jb.HiddenMenu(menu-object, menu-object-instance-id, opts);
 */
(function ($, JB, cbutil, undefined) {
    'use strict';
    JB.HiddenMenu = function(el, instanceId, opts) {
        var defaultOpts = {
            menuItemsSelector : 'li > a',
            menuItemsPresentationOnlySelector : 'ul, li', //will get role="presentation" for AT
            activeMenuItemsClass : 'active',
            menuItemCallback : function(menu) {
                document.location.href = encodeURI(menu.$activeMenuItem.attr('href')); //TODO: better uri encoding params?
            }
        };
        this.opts = $.extend(defaultOpts, opts);
        this.id = instanceId;
        this.$menu = $(el);
        this.friendlyName = this.$menu.attr('data-jb-hiddenmenu');
        this.init();
    };
    JB.HiddenMenu.prototype = {
        init : function() {
            this.$triggers = $(document.querySelectorAll('[data-jb-hiddenmenu-trigger="' + this.friendlyName + '"]'));
            this.$menuItems = this.$menu.find(this.opts.menuItemsSelector);
            this.$firstMenuItem = this.$menuItems.first();
            this.$activeMenuItem = this.$firstMenuItem;
            this.activeMenuItemIdx = 0;
            this.$lastMenuItem = this.$menuItems.last();
            this.$activeTrigger = this.$triggers.first();
            this.updateDom();
            this.bindHandlers();
        },
        showMenu : function() {
            var $doc = $(document),
                    docHeightClosed = $doc.height() + 1,
                    docHeightOpen;
            this.$menu.addClass('active')
                    .attr('aria-hidden', 'false');
            this.$triggers.addClass('active');
            docHeightOpen = $doc.height() + 1;
            //check if opening the menu made the page longer and scroll it into view
            if (docHeightOpen > docHeightClosed) {
                $('html, body').animate({scrollTop: this.$menu.offset().top});
            }
        },
        hideMenu : function() {
            this.$menu.removeClass('active')
                    .attr('aria-hidden', 'true');
            this.$triggers.removeClass('active');
            this.$menu.attr('aria-activedescendant', ''); //im setting tab index too, is this overkill?
        },
        toggleMenu : function($triggeredBy) {
            if (this.$menu.hasClass('active')) {
                this.hideMenu();
            } else {
                this.$activeTrigger = $triggeredBy;
                this.showMenu();
            }
        },
        setFocus : function($el) {
            this.$menu.attr('aria-activedescendant', $el.attr('id'));
            $el.focus();
        },
        navigateMenuItems : function(keycode) {
            //TODO: refactor & simplify this code
            var firstIdx = 0,
                lastIdx = this.$menuItems.length,
                prevIdx = this.activeMenuItemIdx - 1,
                nextIdx = this.activeMenuItemIdx + 1,
                letterIdx,
                $prevItem = this.$menuItems.eq(prevIdx),
                $nextItem = this.$menuItems.eq(nextIdx),
                $letterItem;
            if (keycode === cbutil.keys.up) {
                if ($prevItem.length && $prevItem.hasClass(this.opts.activeMenuItemsClass)) {
                    prevIdx --;
                    $prevItem = this.$menuItems.eq(prevIdx);
                }
                if ($prevItem.length) {
                    this.activeMenuItemIdx = prevIdx;
                    this.$activeMenuItem = $prevItem;
                } else {
                    prevIdx = lastIdx;
                    $prevItem = this.$menuItems.eq(prevIdx);
                    if ($prevItem.length && $prevItem.hasClass(this.opts.activeMenuItemsClass)) {
                        prevIdx = lastIdx - 1;
                        $prevItem = this.$menuItems.eq(prevIdx);
                    }
                    if ($prevItem.length) {
                        this.activeMenuItemIdx = prevIdx;
                        this.$activeMenuItem = $prevItem;
                    }
                }
            } else if (keycode === cbutil.keys.down) {
                if ($nextItem.length && $nextItem.hasClass(this.opts.activeMenuItemsClass)) {
                    nextIdx ++;
                    $nextItem = this.$menuItems.eq(nextIdx);
                }
                if ($nextItem.length) {
                    this.activeMenuItemIdx = nextIdx;
                    this.$activeMenuItem = $nextItem;
                } else {
                    nextIdx = firstIdx;
                    $nextItem = this.$menuItems.eq(nextIdx);
                    if ($nextItem.length && $nextItem.hasClass(this.opts.activeMenuItemsClass)) {
                        nextIdx = firstIdx + 1;
                        $nextItem = this.$menuItems.eq(nextIdx);
                    }
                    if ($nextItem.length) {
                        this.activeMenuItemIdx = nextIdx;
                        this.$activeMenuItem = $nextItem;
                    }
                }
            } else if (keycode >= 48 && keycode <= 90) { //letter nav
                if (this.menuItemsLetterKey.indexOf(keycode) + 1) {
                    letterIdx = this.menuItemsLetterKey.indexOf(keycode);
                    $letterItem = this.$menuItems.eq(letterIdx);
                    if ($letterItem.length && $letterItem.hasClass(this.opts.activeMenuItemsClass)) {
                        letterIdx = this.menuItemsLetterKey.indexOf(keycode, 1);
                        $letterItem = this.$menuItems.eq(letterIdx);
                    }
                    if ($letterItem.length) {
                        this.activeMenuItemIdx = letterIdx;
                        this.$activeMenuItem = $letterItem;
                    }
                }
            }
            this.setFocus(this.$activeMenuItem);
        },
        handleTriggerAction : function(e) {
            var $target = $(e.target);
            if (e.altKey || e.ctrlKey) { //modifier key
                return true; //continue propagation
            }
            if (e.type === 'click' || e.keyCode === cbutil.keys.enter || e.keyCode === cbutil.keys.space) { //click, space or enter
                e.preventDefault();
                this.toggleMenu($target);
                return false; //stop further propagation
            } else if (e.keyCode === cbutil.keys.down) {
                e.preventDefault();
                this.$activeTrigger = $target;
                this.showMenu();
                this.$activeMenuItem = this.$lastMenuItem; //hackish?
                this.activeMenuItemIdx = this.$menuItems.length; //hackish?
                this.navigateMenuItems(e.keyCode);
                return false; //stop further propagation
            } else if (e.keyCode === cbutil.keys.tab) {
                this.hideMenu();
                return true; //continue propagation
            } else if (e.keyCode === cbutil.keys.esc) {
                if (this.$menu.hasClass('active')) {
                    e.preventDefault();
                    this.hideMenu();
                    return false; //stop further propagation
                }
            } else if (e.keyCode >= 48 && e.keyCode <= 90) { //letter nav
                if (this.$menu.hasClass('active')) {
                    e.preventDefault();
                    this.navigateMenuItems(e.keyCode);
                    return false; //stop further propagation
                }
            }
        },
        handleMenuItemAction : function(e) {
            var $target = $(e.target);
            if (e.altKey || e.ctrlKey) { //modifier key
                return true; //continue propagation
            }
            if (e.type === 'click' || e.keyCode === cbutil.keys.enter || e.keyCode === cbutil.keys.space) { //click, space or enter
                e.preventDefault();
                if (!$target.hasClass(this.opts.activeMenuItemsClass)) {
                    this.$activeMenuItem = $target;
                    this.activeMenuItemIdx = this.$menuItems.index(e.target);
                    this.$menuItems.removeClass(this.opts.activeMenuItemsClass);
                    this.$activeMenuItem.addClass(this.opts.activeMenuItemsClass);
                    this.hideMenu();
                    this.setFocus(this.$activeTrigger);
                    this.opts.menuItemCallback(this);
                }
                return false; //stop further propagation
            } else if (e.keyCode === cbutil.keys.down || e.keyCode === cbutil.keys.up) { //up, down arrows
                e.preventDefault();
                this.navigateMenuItems(e.keyCode);
                return false; //stop further propagation
            } else if (e.keyCode === cbutil.keys.tab) {
                this.hideMenu();
                return true; //continue propagation
            } else if (e.keyCode === cbutil.keys.esc) {
                e.preventDefault();
                this.hideMenu();
                this.setFocus(this.$activeTrigger);
                return false; //stop further propagation
            } else if (e.keyCode >= 48 && e.keyCode <= 90) { //letter nav
                //TODO: make this more international
                //TODO: make this work even if the first char is markup (use first visible char)
                e.preventDefault();
                this.navigateMenuItems(e.keyCode);
                return false; //stop further propagation
            }
        },
        handleDocumentClick : function() {
            this.hideMenu();
        },
        updateDom : function() {
            var myObj = this;
            this.$triggers.attr('role', 'button')
                    .attr('aria-haspopup', true)
                    .attr('tabindex', 0);
            this.$menu.attr('role', 'menu')
                    .attr('aria-hidden', true)
                    .attr('aria-activedescendant', '');
            this.$menuItems.attr('role', 'menuitem')
                    .attr('tabindex', -1);
            this.menuItemsLetterKey = [];
            this.$menuItems.each(function(idx) {
                var $this = $(this),
                    myLetterKey = $this.text().charAt(0).toLowerCase();
                $this.attr('id', myObj.id + '-item' + idx);
                myObj.menuItemsLetterKey.push(cbutil.keys[myLetterKey]);
            });
            this.$menu.find(this.opts.menuItemsPresentationOnlySelector).attr('role','presentation');
        },
        bindHandlers : function() {
            this.eventNs = '.jb.HiddenMenu.' + this.id;
            var myObj = this;
            //triggers
            this.$triggers.on('click keydown' + this.eventNs, function (e) {
                return myObj.handleTriggerAction(e);
            });
            //menu items
            this.$menuItems.on('click keydown' + this.eventNs, function (e) {
                return myObj.handleMenuItemAction(e);
            });
            //document
            $(document).on('click' + this.eventNs, function (e) {
                return myObj.handleDocumentClick(e);
            });
        },
        keys : {
            tab     : 9,
            enter   : 13,
            esc     : 27,
            space   : 32,
            left    : 37,
            up      : 38,
            right   : 39,
            down    : 40,
            0       : 48,
            1       : 49,
            2       : 50,
            3       : 51,
            4       : 52,
            5       : 53,
            6       : 54,
            7       : 55,
            8       : 56,
            9       : 57,
            a       : 65,
            b       : 66,
            c       : 67,
            d       : 68,
            e       : 69,
            f       : 70,
            g       : 71,
            h       : 72,
            i       : 73,
            j       : 74,
            k       : 75,
            l       : 76,
            m       : 77,
            n       : 78,
            o       : 79,
            p       : 80,
            q       : 81,
            r       : 82,
            s       : 83,
            t       : 84,
            u       : 85,
            v       : 86,
            w       : 87,
            x       : 88,
            y       : 89,
            z       : 90
        }
    };
}(jQuery, window.JB = window.JB || {}));
