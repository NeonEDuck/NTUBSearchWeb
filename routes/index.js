var express = require('express');
var router = express.Router();
var csv = require('csv-parser');
const fs = require('fs');

var webShow = function(req, res, next) {

    var type = req.params.type;
    var clas = req.params.class;
    console.log(type);
    console.log(clas);
    
    var data = [];
    var table = [];
    var clasList = [];

    fs.createReadStream('./private/csv/科系.csv')
        .on('error', () => {
            // handle error
        })
        .pipe(csv())
        .on('data', (row) => {
            // use row data

            data.push( row['class'] );
        })

        .on('end', () => {
            // console.log('Done');
            // console.log(data);
            if ( data.includes( type ) ) {

                fs.createReadStream('./private/csv/未完成名單.csv')
                    .pipe(csv())
                    .on('data', (row) => {
                        // use row data
                        if ( row['學生班級'].indexOf( type ) !== -1 && !clasList.includes( row['學生班級'] ) ) {
                            clasList.push( row['學生班級'] );
                        }
                        if ( row['學生班級'] == clas ) {
                            table.push( { class:row['學生班級'], no:row['學號'], name:row['學生姓名'] } );
                        }
                    })

                    .on('end', () => {
                        // console.log('Done');
                        // console.log(table);
                        
                        res.render('index', { title: 'Express', data: data, table: table, type: type, clas:clas, clasList:clasList });
                    })
                
            }
            else {
                res.render('index', { title: 'Express', data: data, table: null, type: null, clas:clas, clasList:null });
            }
        })
        
}

/* GET home page. */
router.get('/type=:type&class=:class', webShow);
router.get('/type=:type&class=', webShow);
router.get('/type=:type', webShow);
router.get('/class=:class&type=:type', webShow);
router.get('/class=&type=:type', webShow);

/* GET home page. */
router.get('/', webShow);
module.exports = router;
