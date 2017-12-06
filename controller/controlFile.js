module.exports = {

    upload: (req, res) => {
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        var fs = require('fs');
        var path = require('path');

        form.parse(req, (err, fields, files) => {
            console.log(files);
            for (const key in files) {
                var f = files[key];
                var oldpath = f.path;
                var name = fields.name ? fields.name + '.' + f.name.split('.')[1] : f.name;
                var newpath = path.resolve('public', name);
                fs.rename(oldpath, newpath, function (err) {
                    if (err) res.status(404).send({ err })
                });
            }
            res.status(200).send({ estado: 'File uploaded and moved!' });
        })
    },

    listFiles: (req, res, next) => {
        var fileName = req.query.id;
        var fs = require('fs');
        var path = require('path');
        fs.readdir(path.resolve('public'), (err, files) => {
            files.forEach(file => {
                if (file.indexOf(fileName) > -1) {
                    var f = path.resolve('public', file);                   
                    res.sendFile(f, null, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            console.log('Sent:', fileName);
                        }
                    });
                }
            });
        })
    }
};