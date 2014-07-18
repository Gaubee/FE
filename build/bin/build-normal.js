({
    // appDir: "../js/",
    baseUrl: "../",
    // mainConfigFile: '../js/editor.js',
    name:"FE.debug",
    optimize: "uglify2",
    uglify2: {
        //Example of a specialized config. If you are fine
        //with the default options, no need to specify
        //any of these properties.
        output: {
            beautify: true
        },
        compress: {
            sequences: false,
            global_defs: {
                DEBUG: false
            }
        },
        warnings: true,
        mangle: false
    },
    // useStrict: true,

    //In 2.0.12+: by setting "out" to "stdout", the optimized output is written
    //to STDOUT. This can be useful for integrating r.js with other commandline
    //tools. In order to avoid additional output "logLevel: 4" should also be used.
    out: "../FE.js",

    //Wrap any build bundle in a start and end text specified by wrap.
    //Use this to encapsulate the module code so that define/require are
    //not globals. The end text can expose some globals from your file,
    //making it easy to create stand-alone libraries that do not mandate
    //the end user use requirejs.
    wrap: {
        start: "(function() {",
        end: "}());"
    },
})