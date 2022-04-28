const app = new Vue({
    el: "#app",
    data: {
        header: {
            menuBar: {
                menus: [
                    { name: "ファイル", subMenuId: "file" },
                    { name: "その他", subMenuId: "other" },
                ],
            },
            subMenus: {
                isShown: false,
                shownSubMenuId: null,
                file: [
                    {
                        shownName: "プロジェクトファイルを開く",
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
        },
    },
    mounted: function () {},
    methods: {
        switchSubMenuShown: function (event) {
            const subMenuId = event.target.id.split("__")[1];
            console.log("openSubMenu");
            if (
                this.header.subMenus.isShown &&
                this.header.subMenus.shownSubMenuId === subMenuId
            ) {
                this.header.subMenus.isShown = false;
            } else {
                this.header.subMenus.isShown = true;
                this.header.subMenus.shownSubMenuId = subMenuId;
            }
        },
        openProjectFile: function () {},
        openVersionInformation: function () {},
    },
});
