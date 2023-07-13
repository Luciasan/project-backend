const { Router } = require("express");

const router = Router();
const { get, run } = require("./../db");
const { patchValidator } = require("../middlewares/validators");

router.get("/", async (req, res, next) => {
  try {
    const toDos = await get("SELECT * FROM todos");
    console.log(toDos);
    const data = toDos.map((toDo) => {
      return {
        id: toDo.id,
        title: toDo.title,
        description: toDo.description,
        isDone: Boolean(toDo.isDone),
        create_at: toDo.create_at,
        //update_at: toDo.update_at,
      };
    });
    res
      .status(200)
      .json({ message: "To-dos refrierved succeefully", data: toDos });
  } catch (error) {
    res.status(500).json({ message: "error en el servidor", error });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const data = await run(
      "INSERT INTO todos (title, description) VALUES (?,?)",
      [title, description]
    );
    const getDate = await get("SELECT create_at FROM todos");
    console.log(getDate);
    console.log(data.lastID);
    res.status(200).json({
      message: "To-dos created successfully",
      toDos: {
        id: data.lastID,
        title,
        description,
        isDone: false,
        create_at: getDate[getDate.length - 1].create_at,
        //update_at: data.update_at,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor", error });
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const toDo = await get("SELECT * FROM todos WHERE id = ?", [id]);
    if (toDo.length === 0) {
      return res
        .status(404)
        .json({ message: `el ID no se encuentra en la db` });
    }
    let { title, description, isDone } = req.body;
    if (typeof isDone == "undefined") {
      isDone = toDo[0].isDone;
    }
    if (typeof title == "undefined") {
      title = toDo[0].title;
    }
    if (typeof description == "undefined") {
      description = toDo[0].description;
    }

    const isDoneNumber = Number(isDone);
    await run(
      "UPDATE todos SET title =?, description =?, isDone =?, update_at =  CURRENT_TIMESTAMP WHERE id = ?",
      [title, description, isDoneNumber, id]
    );
    const newtoDo = await get("SELECT * FROM todos WHERE id = ?", [id]);
    res.status(200).json({
      message: "To-dos updated successfully",
      toDos: {
        id,
        title,
        description,
        isDone: Boolean(isDone),
        create_at: newtoDo[0].create_at,
        update_at: newtoDo[0].update_at,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor", error });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const toDos = await get("SELECT * FROM todos WHERE id = ?", [id]);
    if (toDos.length === 0) {
      return res
        .status(404)
        .json({ message: `el ID no se encuentra en la db` });
    }
    await run("DELETE FROM todos WHERE id = ?", [id]);

    res.status(200).json({
      message: "To-dos deleted successfully",
      toDos: {
        id: toDos[0].id,
        title: toDos[0].title,
        description: toDos[0].description,
        isDone: Boolean(toDos[0].isDone),
        create_at: toDos[0].create_at,
        update_at: toDos[0].update_at,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor", error });
  }
});
module.exports = router;
