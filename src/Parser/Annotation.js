var AnnotationParser = function() {

}

AnnotationParser.prototype.parse = function(dataString, callback) {
    var comments = this.matchComments(dataString);

    callback(null, comments);
}

AnnotationParser.prototype.matchComments = function(dataString) {
    var regex   = /\/\*[\s\S]*?\*\/[\r\n][^\r\n]*/g;
    var matches = [], match;

    while (match = this.getMatches(regex, dataString)) {
        if (match) {
            matches.push(match[0].replace(/(\*|[\r\n])/g, ''));
        }
    }

    var comments = this.parseComments(matches);

    return comments;
}

AnnotationParser.prototype.getMatches = function(regex, dataString) {
    var result = regex.exec(dataString);

    if (result) {
        return result;
    }

    return false;
}

AnnotationParser.prototype.parseComments = function(comments) {
    var commentList = [], match;

    for (var i in comments) {
        var subComments = comments[i].split(';').slice(0, -1),
            reference = comments[i].split(';').slice(-1)[0].trim()
        ;

        if(match = reference.match(/class\ (\w+)/)) {
            commentList.push({key: "Class", value: match[1]});
        } else if (match = reference.match(/(\w+)\ *\(.*?\)/)) {
            commentList.push({key: "Method", value: match[1]});
        }

        for (var j in subComments) {
            var regex = /@(.*)\((.*)\)/g;

            while (match = this.getMatches(regex, subComments[j])) {
                if (match) {
                    var value = (match[2]) ? match[2] : false;

                    var obj = {
                        "key": match[1],
                        "value": /\{.*\}/.test(value) ? JSON.parse(value) : value
                    };

                    commentList.push(obj);
                }
            }
        }
    }

    return commentList;
}

module.exports = AnnotationParser;