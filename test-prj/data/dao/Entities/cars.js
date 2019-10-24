var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CARS",
	properties: [
		{
			name: "CAR_ID",
			column: "CAR_ID",
			type: "INTEGER",
			id: true,
		}, {
			name: "model",
			column: "MODEL",
			type: "VARCHAR",
		}, {
			name: "brand",
			column: "BRAND",
			type: "VARCHAR",
		}]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CARS",
		key: {
			name: "CAR_ID",
			column: "CAR_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CARS",
		key: {
			name: "CAR_ID",
			column: "CAR_ID",
			value: entity.CAR_ID
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CARS",
		key: {
			name: "CAR_ID",
			column: "CAR_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) FROM CARS");
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("test-prj/Entities/cars/" + operation).send(JSON.stringify(data));
}