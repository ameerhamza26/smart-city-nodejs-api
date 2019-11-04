var mysql = require('promise-mysql');
var config = require('../config');
var moment = require('moment');

class DB {
    constructor() {
        this.sql = ''
    }

    select() {
        this.sql = 'select '
        var totalArguments = arguments.length
        if (totalArguments > 0 ) {
            var columns = ''
            var i = 0
            for(var arg in arguments) {
                if (i == totalArguments -1) {
                    columns += arguments[i] 
                } else {
                    columns += arguments[i] + ', '
                }
                i++
            }
            this.sql += columns
        } else {
            this.sql = '*'
        }
        return this
    }

    from(tableName ) {
        this.sql += ' from '+ tableName
        return this
    }

    where(column, value) {
        if (typeof(value) == 'string') {
            this.sql += ` where `+ column +` = '`+value+`'` 
        } else {
            this.sql += ` where `+ column +` = `+value 
        }
        return this
    }

    and(column, value) {
        if (typeof(value) == 'string') {
            this.sql += ` and `+ column +` = '`+value+`'` 
        } else {
            this.sql += ` and `+ column +` = `+value 
        }
        return this
    }

    insertInto(table) {
        this.sql = `insert into ` + table
        return this
    }

    columns() {
        var totalArguments = arguments.length
        if (totalArguments > 0 ) {
            var columns = '('
            var i = 0
            for(var arg in arguments) {
                if (i == totalArguments -1) {
                    columns += arguments[i] + ')'
                } else {
                    columns += arguments[i] + ', '
                }
                i++
            }
            this.sql += columns
        }
        return this
    }

    values() {
        var totalArguments = arguments.length
        if (totalArguments > 0 ) {
            this.sql += `values (`
            var columns = ''
            var i = 0
            for(var arg in arguments) {
                if (i == totalArguments -1) {
                    if (typeof(arguments[i])== 'string') {
                        columns += `'`+arguments[i]+`')`
                    } else {
                        columns += arguments[i] +`)`
                    }
                } else {
                    if (typeof(arguments[i])== 'string') {
                        columns += `'`+arguments[i]+`'`
                    } else {
                        columns += arguments[i]
                    }
                }
                i++
            }
            this.sql += columns
        }
        return this
    }

    one() {
        var connection;
        return new Promise((resolve, reject)=> {
            mysql.createConnection(config.dbConfig).then(conn => {
                connection = conn;
                var result = connection.query(this.sql);
                connection.end();
                return result
            }).then((result)=> {
                resolve(result[0])
            }).catch(err => {
                reject(err)
            });
        })
    }
}

exports.buildQuery = DB