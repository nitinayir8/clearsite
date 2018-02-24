var Model = require("./Base"),
	crypto = require("crypto"),
	model = new Model();
var ContentModel = model.extend({
	insert: function(data, callback,cms_module) {
		data.ID = crypto.randomBytes(20).toString('hex'); 
		this.collection(cms_module).insert(data, {}, callback || function(){ });
	},
	update: function(data, callback,cms_module) {
		this.collection(cms_module).update({ID: data.ID}, data, {}, callback || function(){ });	
	},
	getlist: function(callback, query) {
		this.collection().find(query || {}).toArray(callback);
	},
	remove: function(ID, callback) {
		this.collection(cms_module).findAndModify({ID: ID}, [], {}, {remove: true}, callback);
	}
});
module.exports = ContentModel;