import React from "react";
import { Link, useHistory } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

import { useFormik } from "formik";
import * as Yup from "yup";

import { MdCheckCircle, MdError } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../services/api";

import "./styles.css";

import logoImg from "../../assets/logo.svg";
import herosImg from "../../assets/heroes.png";

export default function Logon() {
  const history = useHistory();

  const signInSchema = Yup.object({
    id: Yup.string().required("O ID da Ong é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      try {
        const response = await api.post("/sessions", { id: values.id });

        localStorage.setItem("ongId", values.id);
        localStorage.setItem("ongName", response.data.name);

        notifyUser(`Seja bem vindo(a), ${response.data.name}`);

        setTimeout(() => {
          history.push("/profile");
        }, 2000);
      } catch (err) {
        notifyUser("Ong não encontrada!", true);
      }
    },
  });

  function notifyUser(message, isError = false) {
    if (isError) {
      toast.error(
        <>
          <div className="menssage-toast">
            <MdError size={26} /> {message}
          </div>
        </>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } else {
      toast.success(
        <>
          <div className="menssage-toast">
            <MdCheckCircle size={26} /> {message}
          </div>
        </>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <img src={logoImg} alt="Be The Hero" />

        <form onSubmit={formik.handleSubmit}>
          <h1>Faça seu logon</h1>

          <div className="input-group-props">
            <input
              name="id"
              placeholder="Sua ID"
              onChange={formik.handleChange}
              value={formik.values.id}
            />
            {formik.errors.id && formik.touched.id ? (
              <small>{formik.errors.id}</small>
            ) : null}
          </div>

          <button className="button" type="submit">
            Entrar
          </button>

          <Link className="back-link" to="/register">
            <FiLogIn size={16} color="#E02041" />
            Não tenho cadastro
          </Link>
        </form>
      </section>

      <img src={herosImg} alt="Heroes" />
      <ToastContainer />
    </div>
  );
}
