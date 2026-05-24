import Project from "../models/Project.js";

export const createProject = async (req, res, next) => {
  try {
    const { title, description, deadLine, members } = req.body;

    const project = await Project.create({
      title,
      description,
      deadLine,
      members,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
