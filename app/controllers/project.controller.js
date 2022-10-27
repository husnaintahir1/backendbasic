const db = require("../models");
const config = require("../config/auth.config");
const Project = db.project;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.createProject = async (req, res) => {
    // Save User to Database
    try {
        // console.log(req,"RERERE")
      const project = await Project.create({
        name: req.body.name,
        CID: req.body.CID,
        userId:req.body.userId,
        type:req.body.type,
        count:req.body.count,
        size:req.body.size
      });
  
     
        
        if (project) res.send({ ...project});
      
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  exports.getAllProject = async (req, res) => {
    // Save User to Database
    try {
        // console.log(req,"RERERE")
      const project = await Project.findAll()
  
     
        
        if (project) res.send(project);
      
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

exports.deleteProject= async (req,res) => {

  try {
    const project = await Project.destroy({
      where: {
        CID: req.params.cid,
      }
    })

    if(project){
      res.status(200).send({message: "Your project has been deleted successfully", project})
    }else{
      res.status(500).send({message: "Error", project: project })
    }
  } catch (error) {
    res.status(500).send({message : error.message})
  }
  // const params = req.params.cid
  
  // res.status(200).json(params)
}
