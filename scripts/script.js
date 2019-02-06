var mnRm = [];

function makeLiHtml(v, ul) {
    var li = document.createElement("li");
    li.id = v.id;
    var a = document.createElement("a");
    a.menu = v;
    a.title = v.title;
    if (v.target.length > 0) {
        a.href = v.target;
    }

    a.innerHTML = v.title;
    a.onclick = function (ev) {
        if (ev && (ev.shiftKey || ev.ctrlKey))
            return;

        var qsa = this.parentElement.parentElement.querySelectorAll('li[class*=active]');
        for (var i = 0; i < qsa.length; i++) {
            var x = qsa[i];
            if (x == this.parentElement)
                continue;

            x.classList.remove('semi-active');
            x.classList.remove('active');
        };

        console.info("ta aki dentro")
        var status = this.parentElement.classList.toggle('active');
        if (!status) {
            var qsa = this.parentElement.querySelectorAll('li.active')
            for (var i = 0; i < qsa.length; i++) {
                var x = qsa[i];
                x.classList.remove('active');
                x.classList.remove('semi-active');
            };
        }
        if (document.querySelector(".menu-float-active"))
            showMenus(this.menu.id, ev);

    }

    li.appendChild(a);
    if (ul)
        li.appendChild(ul);

    return li;
}

function makeHtml(id) {
    id = id || 0;
    var lis = [];
    var item = mnRm.filter(function (x) { return x.parentId == id });
    var ul = null;

    item.forEach(function (v, i) {
        var children = makeHtml(v.id);

        if (children.length > 0) {
            ul = document.createElement("ul");
            var fh = children.forEach(function (x) {
                ul.appendChild(x);
            });
        } else
            ul = null;

        var li = makeLiHtml(v, ul);

        lis.push(li);
    });

    return lis;
}

function generateMenu() {
    var mr = document.querySelector('.menu-root');
    mr.innerHTML = '';

    makeHtml('idRoot').forEach(function (x) {
        mr.appendChild(x);
    });
}

function search(key) {
    var lis = [];

    mnRm.filter(function (v) {
        return v.target != "" && RegExp(key, "ig").test(v.title);
    }).forEach(function (v) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = v.target;
        a.innerHTML = "<i class='" + v.icon + "'></i> " + v.title
        a.setAttribute('data-href', v.target);
        a.onclick = function (ev) {
            if (ev && (ev.shiftKey || ev.ctrlKey))
                return;

            showLoading(true);
            goTo(this.getAttribute('data-href'));
            return false;
        }
        li.appendChild(a);
        lis.push(li);
    });

    return lis;
}

function filterMenu(key) {
    if (key == '')
        generateMenu();
    else {
        var rs = search(mRegex(key));
        if (rs.length == 0)
            document.querySelector('.menu-root').innerHTML = "<div style='padding: 10px;'> " + key + " , not found in menu</div>";
        else {
            document.querySelector('.menu-root').innerHTML = '';

            rs.forEach(function (v) {
                document.querySelector('.menu-root').appendChild(v);
            });
        }
    }
}

function mRegex(value) {
    var accents = {
        a: 'àáâãäåæ',
        c: 'ç',
        e: 'èéêëæ',
        i: 'ìíîï',
        n: 'ñ',
        o: 'òóôõöø',
        s: 'ß',
        u: 'ùúûü',
        y: 'ÿ'
    },
        chars = /[aceinosuy]/g;
    return value.replace(chars, function (c) {
        return '[' + c + accents[c] + ']';
    });
}

var menuStyle = 'box-large';
var currentShowMenu = 'mnuRoot';
function showMenus(id, ev) {
    id = id || currentShowMenu;
    currentShowMenu = id;
    var items = mnRm.filter(function (x) { return x.parentId == id });

    if (items.length == 0) {
        var item = mnRm.filter(function (x) { return x.id == id })[0];


        if (!(ev && (ev.shiftKey || ev.ctrlKey))) {
            document.body.classList.remove('menu-float-active');
            showLoading(true);
        }

        goTo(item.target, ev);
        return;
    }
};

function getMenuTreeParents(id) {
    var item = mnRm.filter(function (x) { return x.id == id });
    if (item.length > 0 && item[0].parentId != null)
        item = item.concat(getMenuTreeParents(item[0].parentId));

    return item;
}

function goTo(url, ev) {
    //workaround to bug <base /> (EDGE)
    var base = "/";
    //var hb = document.getElementsByTagName("base")[0];
    var hb = document.getElementById("base");
    if (hb)
        base = hb.href + hb.getAttribute("data-entity") + "/";

    ev = ev || event || window.event;
    if (ev && (ev.shiftKey || ev.ctrlKey)) {
        window.open(base + url, ev.ctrlKey ? '_blank' : null);
    } else {
        setTimeout(function () {
            document.location.href = base + url;
        }, 100);
    }
}

function resetMenu() {
    generateMenu();
}

function LoadMenu() {
    mnRm = [
        { "id": "idRoot", "title": "Helps", "target": "", "icon": null, "parentId": null },
        { "id": "idMenu1", "title": "Menu 1", "target": "", "icon": "fa fa-file", "parentId": "idRoot" },
        { "id": "idSubMenu1", "title": "Sub Menu", "target": "Reports/B941Report/Index", "icon": "fa fa-file", "parentId": "idMenu1" },
        { "id": "idMenu2", "title": "Menu 2", "target": "", "icon": "fa fa-file", "parentId": "idRoot" },
        { "id": "idSubMenu2", "title": "Sub Menu 2", "target": "Reports/AnalyticByDepartment/Index", "icon": "fa fa-file", "parentId": "idMenu2" },
        { "id": "idSubMenu3", "title": "Sub Menu 3", "target": "Reports/AnalyticByDepartment/Index", "icon": "fa fa-file", "parentId": "idMenu2" },
        { "id": "idMenu3", "title": "Menu 3", "target": "Reports/AnalyticPayPeriod/Index", "icon": "fa fa-file", "parentId": "idRoot" },
    ]
    resetMenu();
}