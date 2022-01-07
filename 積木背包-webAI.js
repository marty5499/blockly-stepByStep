(function () {
    function initCopyPaste() {
        var ctrlDown = false,
            ctrlKey = 17,
            cmdKey = 91,
            vKey = 86,
            xKey = 88,
            cKey = 67;
        $(document).keydown(function (e) {
            if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
        }).keyup(function (e) {
            if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
        });
        $(".no-copy-paste").keydown(function (e) {
            if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
        });
        // Document Ctrl + C/V/X
        $(document).keydown(function (e) {
            if (ctrlDown && (e.keyCode == cKey || e.keyCode == xKey)) {
                var xml = document.createElement('xml')
                xml.appendChild(Blockly.clipboardXml_);
                var xmlText = Blockly.Xml.domToPrettyText(xml);
                localStorage.setItem("Blockly.xml", xmlText);
                console.log("Copy:", Blockly.clipboardXml_);
            }
            if (ctrlDown && (e.keyCode == vKey)) {
                var xmlText = localStorage.getItem("Blockly.xml");
                if (xmlText) {
                    xmlDom = Blockly.Xml.textToDom(xmlText);
                    Blockly.Xml.domToWorkspace(xmlDom, Blockly.mainWorkspace);
                    console.log("Paste:", xmlDom);
                }
            }
        });
    }
    (function () {
        if (typeof jQuery != 'undefined') {
            initCopyPaste();
        } else {
            // Load the script
            const script = document.createElement("script");
            script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            script.type = 'text/javascript';
            script.addEventListener('load', () => {
                console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
                initCopyPaste();
            });
            document.head.appendChild(script);
        }
    })();
}());