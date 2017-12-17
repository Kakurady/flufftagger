module.exports = function(grunt) {
    grunt.initConfig({
        copy:{
            'webextension-polyfill': {
                files: [
                    {
                        src: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
                        dest: "chrome_ext/ext/webextension-polyfill/browser-polyfill.js"
                    },
                    {
                        src: "node_modules/webextension-polyfill/dist/browser-polyfill.js.map",
                        dest: "chrome_ext/ext/webextension-polyfill/browser-polyfill.js.map"
                    }
                ]
            }
        },
        browserify:{
            'node-ts-iptc': {
                files: [
                    {
                        src: "node_modules/ts-node-iptc/index.js",
                        dest: "chrome_ext/ext/ts-node-iptc/IptcReader.js"
                    }
                ],
                options: {
                    browserifyOptions:{
                        debug: true,
                        standalone: "IptcParser"
                    }
                }
            },
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['copy', 'browserify']);
}
