import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

interface Empleado {
  _id: number;
  nombre: string;
  edad: number;
  pais: string;
  cargo: string;
  anios: number;
}

const URL:string = "https://deploy-mern-it-back.onrender.com"

function App() {
  const [nombre, setNombre] = useState<string>("");
  const [edad, setEdad] = useState<number>(0);
  const [pais, setPais] = useState<string>("");
  const [cargo, setCargo] = useState<string>("");
  const [anios, setAnios] = useState<number>(0);
  const [id, setId] = useState<number>(0);
  const [empleadosList, setEmpleadosList] = useState<Empleado[]>([]);
  const [editar, setEditar] = useState<boolean>(false);

  const add = () => {
    axios
      .post(`${URL}/create`, {
        nombre,
        edad,
        pais,
        cargo,
        anios,
      })
      .then(() => {
        getEmpleados();
        limpiarCampos();
        Swal.fire({
          title: `${nombre} agregado!`,
          icon: "success",
          draggable: true,
          timer: 3000,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.stringify(err.message) + ": intente más tarde!",
        });
      });
  };

  const update = () => {
    axios
      .put(`${URL}/update`, {
        id,
        nombre,
        edad,
        pais,
        cargo,
        anios,
      })
      .then(() => {
        getEmpleados();
        limpiarCampos();
        Swal.fire({
          title: `${nombre} actualizado!`,
          icon: "success",
          draggable: true,
          timer: 3000,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.stringify(err.message) + ": intente más tarde!",
        });
      });
  };

  const deleteEmpleado = (val: Empleado) => {
    Swal.fire({
      title: "Confirmar eliminado?",
      text: `Realmente desea eliminar a ${val.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${URL}/delete/${val._id}`)
          .then(() => {
            getEmpleados();
            limpiarCampos();
            Swal.fire({
              title: "Eliminado!",
              text: `${val.nombre} ha sido eliminado!`,
              icon: "success",
              timer: 3000,
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No se logró eliminar el empleado!",
              footer: JSON.stringify(err.message),
            });
          });
      }
    });
  };

  const limpiarCampos = () => {
    setNombre("");
    setEdad(0);
    setCargo("");
    setPais("");
    setAnios(0);
    setId(0);
    setEditar(false);
  };

  const editarEmpleado = (val: Empleado) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAnios(val.anios);
    setId(val._id);
  };

  const getEmpleados = () => {
    axios.get(`${URL}/empleados`).then((response) => {
      setEmpleadosList(response.data);
    });
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestión de empleados MODIFICADO EN VIVO</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text">Nombre:</span>
            <input
              type="text"
              onChange={(e) => setNombre(e.target.value)}
              className="form-control"
              placeholder="Ingresa el nombre y apellido"
              value={nombre}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Edad:</span>
            <input
              type="number"
              onChange={(e) => setEdad(Number(e.target.value) || 0)}
              className="form-control"
              placeholder="Ingresa la edad (tiene que ser un número)"
              value={edad === 0 ? "" : edad}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">País:</span>
            <input
              type="text"
              onChange={(e) => setPais(e.target.value)}
              className="form-control"
              placeholder="Ingresa el país de nacimiento"
              value={pais}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Cargo:</span>
            <input
              type="text"
              onChange={(e) => setCargo(e.target.value)}
              className="form-control"
              placeholder="Ingresa el cargo"
              value={cargo}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Años de experiencia:</span>
            <input
              type="number"
              onChange={(e) => setAnios(Number(e.target.value) || 0)}
              className="form-control"
              placeholder="Ingresa los años de experiencia (tiene que ser un número)"
              value={anios === 0 ? "" : anios}
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {editar ? (
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-warning" onClick={update}>
                Actualizar
              </button>
              <button className="btn btn-danger" onClick={limpiarCampos}>
                Cancelar
              </button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={add}>
              Registrar
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped mt-5">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>País</th>
            <th>Cargo</th>
            <th>Experiencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((item, key) => (
            <tr key={item._id}>
              <th>{key + 1}</th>
              <td>{item.nombre}</td>
              <td>{item.edad}</td>
              <td>{item.pais}</td>
              <td>{item.cargo}</td>
              <td>{item.anios}</td>
              <td>
                <div className="btn-group">
                  <button type="button" onClick={() => editarEmpleado(item)} className="btn btn-info">
                    Editar
                  </button>
                  <button type="button" onClick={() => deleteEmpleado(item)} className="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;