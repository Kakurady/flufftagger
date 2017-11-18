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
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.registerTask('default', ['copy']);
}
