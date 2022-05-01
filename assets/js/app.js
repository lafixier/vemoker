const app = new Vue({
    el: "#app",
    data: {
        isCoverShown: false,
        header: {
            menuBar: {
                isMouseDowned: false,
                isClicked: false,
                menus: [
                    { name: "ファイル", subMenusId: "file" },
                    { name: "その他", subMenusId: "other" },
                ],
            },
            subMenus: {
                isShown: false,
                shownSubMenusId: null,
                position: { top: 0, left: 0 },
            },
        },
    },
    mounted: function () {
        document.body.addEventListener("keydown", this.keyDowned);
        this.header.subMenus = {
            ...this.header.subMenus,
            ...{
                file: [
                    {
                        shownName: "プロジェクトを開く",
                        executedFunction: this.openProjectFile,
                    },
                    {
                        shownName: "上書き保存",
                        executedFunction: this.openProjectFile,
                    },
                    {
                        shownName: "名前を付けて保存",
                        executedFunction: this.openProjectFile,
                    },
                    {
                        shownName: "プロジェクトを閉じる",
                        executedFunction: this.openProjectFile,
                    },
                ],
                other: [
                    {
                        shownName: "バージョン情報",
                        executedFunction: this.openVersionInformation,
                    },
                ],
            },
        };
    },
    methods: {
        keyDowned: function (event) {
            const keyName = event.key;
            switch (keyName) {
                case "Escape":
                    this.closeSubMenus();
                    break;
                case "Alt":
                    this.switchMenuSelected(
                        this.header.menuBar.menus[0].subMenusId
                    );
                default:
                    break;
            }
            event.stopPropagation();
            event.preventDefault();
            return false;
        },
        coverClicked: function () {
            this.closeSubMenus();
        },
        showCover: function () {
            this.isCoverShown = true;
        },
        hideCover: function () {
            this.isCoverShown = false;
        },
        switchMenuSelected: function (subMenusId) {
            if (
                this.header.subMenus.shownSubMenusId !== null ||
                this.header.subMenus.isShown
            ) {
                this.closeSubMenus();
            } else {
                this.header.subMenus.shownSubMenusId = subMenusId;
            }
        },
        openSubMenus: function (subMenusId) {
            this.header.subMenus.position.top = 0;
            this.header.subMenus.position.left = 0;
            this.header.subMenus.shownSubMenusId = subMenusId;
            this.setSubMenusPosition(subMenusId);
            this.showCover();
            this.header.subMenus.isShown = true;
        },
        closeSubMenus: function () {
            this.header.menuBar.isClicked = false;
            this.header.menuBar.isMouseDowned = false;
            this.header.subMenus.isShown = false;
            this.header.subMenus.shownSubMenusId = null;
            this.hideCover();
        },
        setSubMenusPosition: function (subMenusId) {
            const menus = this.$refs.menu;
            this.header.subMenus.position.top = menus[0].offsetHeight + 1;
            for (const menu of menus) {
                if (menu.id.split("__")[1] === subMenusId) {
                    break;
                } else {
                    this.header.subMenus.position.left +=
                        menu.getBoundingClientRect().width;
                }
            }
        },
        menuClicked: function () {
            if (this.header.menuBar.isClicked) {
                this.header.menuBar.isClicked = false;
                this.closeSubMenus();
            } else {
                this.header.menuBar.isClicked = true;
            }
        },
        menuMouseDowned: function (event) {
            const subMenusId = event.target.id.split("__")[1];
            this.openSubMenus(subMenusId);
            this.header.menuBar.isMouseDowned = true;
        },
        menuMouseOver: function (event) {
            if (
                this.header.menuBar.isMouseDowned &&
                this.header.menuBar.isClicked
            ) {
                const subMenusId = event.target.id.split("__")[1];
                this.openSubMenus(subMenusId);
            }
        },
        openProjectFile: function () {},
        openVersionInformation: function () {},
    },
});
