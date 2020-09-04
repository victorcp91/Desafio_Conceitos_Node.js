const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  let error = "";
  const { title, url, techs } = request.body;
  if (!title) {
    error += "Required title. ";
  }
  if (!url) {
    error += "Required url. ";
  }
  if (!techs || !Array.isArray(techs)) {
    error += "At technology list is needed";
  }
  if (error) {
    return response.status(400).json({ error });
  }

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  return response.status(200).json(repositories[repositoryIndex]);
});

app.patch("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title:
      typeof title !== "undefined"
        ? title
        : repositories[repositoryIndex].title,
    url: typeof url !== "undefined" ? url : repositories[repositoryIndex].url,
    techs: Array.isArray(techs) ? techs : repositories[repositoryIndex].techs,
  };

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  repositories[repositoryIndex].likes += 1;
  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
