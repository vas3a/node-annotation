var AnnotationReader = require('./Reader/Annotation.js');
var AnnotationParser = require('./Parser/Annotation.js');
var FileReader       = require('./Reader/File.js');

var fileReader = new FileReader();
var annotationParser = new AnnotationParser();

var annotation = function(path, callback) {

    fileReader.read(path, function(err, result) {
        if (err) {
            return callback(err, null);
        }

        annotationParser.parse(result, function(err, comments) {
            if(err) {
                return callback(err, null);
            }

            callback(null, new AnnotationReader(comments));
        });
    });
}

module.exports = annotation;