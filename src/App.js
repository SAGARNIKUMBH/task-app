import "./App.css";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { API_URL } from "./contants/constant";

function App() {
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [task, setTask] = useState({ title: "" });
  const [isEditTask, setEditTask] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (page) => {
    try {
      const response = await axios.get(`${API_URL}getTodoList/${page}/${5}`);
      const { tasks, totalPages } = response.data;
      setTasks(tasks);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const handleChange = (event) => {
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (task.title === "") return;
    if (task._id) {
      // Update operation
      try {
        await axios.patch(`${API_URL}tasks/${task._id}`, { title: task.title });
        fetchTasks(currentPage);
        setEditTask(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Insert operation
      try {
        const response = await axios.post(`${API_URL}tasks`, task);
        const newData = [...tasks, { ...response.data }];
        setTasks(newData);
        setTask({ title: "" });
        setEditTask(false);
      } catch (error) {
        console.log(error);
      }
    }

    setTask({ id: "", title: "" });
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`${API_URL}tasks/${taskId}`)
      .then(function (response) {
        const newData = tasks.filter((task) => task._id !== taskId);
        setTasks(newData);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleEditTask = (taskId) => {
    const itemToEdit = tasks.find((task) => task._id === taskId);
    setTask(itemToEdit);
    setEditTask(true);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const loadingStyleObj = {
    border: "1px solid",
    height: "500px",
    width: "202%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div className="App">
      <Container maxWidth="xl">
        <Grid container={true} justifyContent="center" sx={{ m: 2 }}>
          <TextField
            variant="outlined"
            name="title"
            value={task.title}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={handleSubmit}
          >
            {isEditTask ? "Edit" : "Add"}
          </Button>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 &&
                tasks.map((task) => (
                  <TableRow
                    key={task._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditTask(task._id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "contained" : "outlined"}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          )}
        </TableContainer>
      </Container>
    </div>
  );
}

export default App;
