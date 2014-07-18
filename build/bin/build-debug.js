({
    baseUrl: "../",
    name:"../js/FE/main",
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
        mangle: true
    },
    skipModuleInsertion:true,
    cjsTranslate: false,
    useStrict: true,
    out: "../FE.debug.js",
    wrap: false
})