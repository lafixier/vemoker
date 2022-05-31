const debug = {
    projectFile: {
        used_app_version: "0.1.0",
        materials: {
            chaban_background: {
                base64: "data:image/jpeg;base64,",
            },
            tada_person: {
                base64: "data:image/png;base64,",
            },
        },
        layers: [
            {
                number: 0,
                elements: [
                    {
                        activeTime: {
                            start: 0,
                            end: 60,
                        },
                        isMaterialUsed: true,
                        type: "image",
                        material_name: "chaban_background",
                        position: { x: "0px", y: "0px" },
                        size: { height: "" },
                    },
                ],
            },
            {
                number: 1,
                elements: [
                    {
                        activeTime: {
                            start: 0,
                            end: 60,
                        },
                        isMaterialUsed: true,
                        type: "image",
                        material_name: "tada_person",
                        position: {
                            x: "5%",
                            y: "20%",
                        },
                        size: { height: "200px" },
                    },
                ],
            },
            {
                number: 2,
                elements: [
                    {
                        activeTime: {
                            start: 0,
                            end: 2,
                        },
                        isMaterialUsed: false,
                        type: "text",
                        text: {
                            body: "こんにちは",
                            font_name: "Meiryo",
                            font_size: "30px",
                        },
                        position: {
                            x: "39%",
                            y: "75%",
                        },
                        size: { height: "" },
                    },
                    {
                        activeTime: {
                            start: 2,
                            end: 5,
                        },
                        isMaterialUsed: false,
                        type: "text",
                        text: {
                            body: "これはテロップです！！！！！！！！！",
                            font_name: "Meiryo",
                            font_size: "30px",
                        },
                        position: {
                            x: "19%",
                            y: "75%",
                        },
                        size: { height: "" },
                    },
                ],
            },
        ],
    },
};

const app = new Vue({
    el: "#app",
    data: {
        emptyElement: {
            activeTime: {
                start: -1,
                end: -1,
            },
            isMaterialUsed: false,
            type: "",
            position: { x: "0px", y: "0px" },
            size: { height: "" },
        },
        redrawIntervalSecond: 0.01,
        redrawIntervalObject: null,
        currentTimeSecond: 0,
        isPlaying: false,
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
        main: {
            upper: {
                canvas: {
                    layers: [
                        {
                            number: 0,
                            element: {
                                position: {},
                            },
                        },
                        {
                            number: 1,
                            element: {
                                position: {},
                            },
                        },
                        {
                            number: 2,
                            element: {
                                position: {},
                            },
                        },
                    ],
                },
            },
        },
        externalStorage: {
            projectFile: {
                materials: {},
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
        this.openProjectFile(); // debug
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
                case " ":
                    if (this.isPlaying) {
                        this.pauseCanvas();
                    } else {
                        this.playCanvas();
                    }
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
        openProjectFile: function () {
            // Debug
            this.externalStorage.projectFile = debug.projectFile;
            this.playCanvas();
            setTimeout(this.stopCanvas, this.redrawIntervalSecond * 1000);
        },
        openVersionInformation: function () {},
        playCanvas: function () {
            this.isPlaying = true;
            this.redrawIntervalObject = setInterval(
                this.redrawCanvas,
                this.redrawIntervalSecond * 1000
            );
        },
        pauseCanvas: function () {
            this.isPlaying = false;
            clearInterval(this.redrawIntervalObject);
        },
        stopCanvas: function () {
            this.pauseCanvas();
            this.currentTimeSecond = 0;
        },
        redrawCanvas: function () {
            this.currentTimeSecond += this.redrawIntervalSecond;
            for (const layer of this.externalStorage.projectFile.layers) {
                let isElementUpdated = false;
                for (const element of layer.elements) {
                    if (
                        this.currentTimeSecond >= element.activeTime.start &&
                        this.currentTimeSecond <= element.activeTime.end
                    ) {
                        this.main.upper.canvas.layers[layer.number].element =
                            JSON.parse(JSON.stringify(element));
                        isElementUpdated = true;
                    } else if (!isElementUpdated) {
                        this.main.upper.canvas.layers[layer.number].element =
                            this.emptyElement;
                    }
                }
            }
        },
    },
});
