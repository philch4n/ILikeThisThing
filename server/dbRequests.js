var db = require('./db');
var config = require('../knexfile.js');
var env =  process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]);


exports.lookupWork = function(req){
  console.log('inside lookupWork ', req)
	var title = req.title;
	var type = req.type;

	return knex.select('*').from(type).where('title', title)
	        .then(function(result){
            if (result.length === 0){
              throw new Error('No such work found');
            }
            console.log('result inside of lookup Work ', result)
	          return result; // => returns an array with the object of the found work inside
	        })
};
 
//called after an apirequest
exports.addWork = function(apiRes){
  console.log('Inside addWork, heres the apiRes sent in: ', apiRes)

  //set the title, depending on work type (API response format)
  var title;
  var type = apiRes.type;
  if (type === 'Books'){
    title = apiRes.title;
  }

  return knex.insert({'title': title, 'type': type}).returning('id').into('Works')
        .then(function(result){
          console.log("after insert, inside .then. this is result: ", result)
          if (type === 'Books'){
            return knex.insert({'id': result[0],
                                'title': title,
                                'author': JSON.stringify(apiRes.authors), //an array - could be more than one
                                'image': apiRes.largeImage,
                                'data': JSON.stringify(apiRes),
                                'database': "true"})
                .returning('*')
                .into('Books')
                .then(function(result){
                  console.log('result from adding a book', result)
                  return result[0];
                })
          }
        })
      .catch(function(error){
        console.error("inserting into Works has failed: ", error);
      })
};


exports.findWorks = function(req){
	var tagsArr = req.tags // => must be array

  //first find the tag_ids
  return knex.select('id')
                   .from('Tags')
                   .whereIn('tag', tagsArr)
                   .map(function(rows){
                      return rows.id
                   })
                   .then(function(tagIds){
                  console.log('these are tagIds : ', tagIds);
                  return knex('WorkTag')
                          .select(['Tags.tag', 'WorkTag.count', 'Works.title', 'Works.type',
                                    'Books.author', 'Books.image as bookImage', 'Books.data as bookData'])
                          .fullOuterJoin('Works', 'Works.id', 'WorkTag.work_id')
                          .leftJoin('Books', 'Books.id', 'WorkTag.work_id')
                          .fullOuterJoin('Tags', 'Tags.id', 'WorkTag.tag_id')
                          .whereIn('tag_id', tagIds)
                          .catch(function(err){
                            console.log('error in WorkTag ', err)
                          })
                          .then(function(results){
                            console.log('results of join: ', results)
                            if (results.length <= 1){
                              throw new Error('No other matching works found')
                            }
                            console.log('results of join table ', results)
                            return results;
                          })

                  })
};

//checks to see what tags a given work already has
exports.findTags = function(req){
  var title = req.title

  //first find the works id
  return knex.select('id')
            .from('Works')
            .where('title', title)
            .then(function(result){
              console.log('found id ', result[0].id)
              //then update the counts for each of the tags
              var workId = result[0].id;
              return knex('WorkTag')
                          .where('work_id', workId)
                          .increment('count', 1)
                          .then(function(){
                            return knex.select('tag_id')
                                     .from('WorkTag')
                                     .where('work_id', workId)
                                     .map(function(row){
                                      // console.log('inside first map ', row)
                                      return row.id;
                                     })
                                     .then(function(tagIds){
                                      console.log('tagIds array ', tagIds)
                                      return knex.select('tag').from('Tags').whereIn('id', tagIds);
                                     })
                                     .map(function(row){
                                      return row.tag; //=> should be returning a flat array of tagnames to filter against users passed in tags
                                     })
                          })
      })
};

exports.addTags = function(req){
  console.log("inside addTags: ", req);
	var title = req.title; // => should be a string of a single work
  var tagNames = req.tags;
  //finds id for the given title
  return knex.select('id').from('Works').where('title', title)
        .then(function(row){
          return row[0].id
        })
        .then(function(workId){
          //add to Tags -- then add to WorkTag
          tagNames.forEach(function(tagName){
            knex.select('id')
                .from('Tags')
                .where('tag', tagName)
                .then(function(row){
                  console.log('right before insert into WorkTag ', row[0].id)
                  var tagId = row[0].id;
                  knex.insert({'work_id': workId,
                               'tag_id': tagId,
                               'count': 1})
                  .returning("*")
                  .into('WorkTag')
                  .then(function(rows){
                    console.log('put into WorkTag ', rows)
                  })
                  .catch(function(err){
                    console.error("there was an error in insert into WorkTag ", err)
                  })
                })
          });
        })
}
  // exports.signUp = function(req) {
  //   return knex.insert({userName:req.username, password:req.password}).returning('id').into('Users')
  //     .then(function(id){
  //       return id;
  //     })
  //     .catch(function(err){
  //       console.error("signup error!", err)
  //     })
  // }

  // exports.signIn = function(req) {
  //   return knex.select('Users').where({userName:req.username, password:req.password})
  //     .then(function(id){
  //       return id;
  //     })
  //     .catch(function(err){
  //       console.error("signin error!", err)
  //     })
  // }

  exports.getRev = function(req) {
    // console.log("GET REV REQ", req)
    return knex.select('*').from('Reviews').where({worktitle: req.workTitle})
      .then(function(row) {
        console.log('getRev', row)
        return row;
      })
      .catch(function(err) {
        console.error("review error!", err)
        throw new Error(err);
      })
  }

  exports.postRev = function(req) {
    var title = req.title
    var body = req.body
    var username = req.username
    var book = req.workTitle
    // console.log("POST REV REQ", req)
    return knex.insert({'worktitle':book, 'username':username, 'reviewbody': body, 'reviewtitle':title}).returning('id').into('Reviews')
      .then(function(res) {
        // console.log("POST REV SUCCESS res", res)
        return res.id;
      })
      .catch(function(err) {
        console.error("post review error!", err)
        throw new Error(err);
      })
  }

