'use strict'

const {getTasks, addTask, updateTask, deleteTask} = require("./db");
exports.list = async function (req, res) {
    const data = await getTasks();
    res.send(data);
};

exports.add = async function (req, res) {
    const data = await addTask(req.body)
    res.send(data);
};

exports.update = async function (req, res) {
    const data = await updateTask(req.body)
    res.send(data);
};

exports.delete = async function (req, res) {
    const id = req.params.id;
    const data = await deleteTask(id)
    res.send({'message': `Deleted ${id}`});
};