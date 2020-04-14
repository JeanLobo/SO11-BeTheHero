import React from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import { useFormik } from "formik";
import * as Yup from "yup";

import Swal from "sweetalert2";

import "./styles.css";
import logoImg from "../../assets/logo.svg";
import api from "../../services/api";

export default function NewIncident() {
  const history = useHistory();

  const ongId = localStorage.getItem("ongId");

  const newCaseSchema = Yup.object({
    title: Yup.string().required("O título é obrigatório!"),
    description: Yup.string().required("A descrição é obrigatória!"),
    value: Yup.number("O valor precisa ser um número!")
      .positive("O valor não pode ser negativo!")
      .required("O valor é obrigatório!"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      value: "",
    },
    validationSchema: newCaseSchema,
    onSubmit: async (values) => {
      const newCase = {
        title: values.title,
        description: values.description,
        value: values.value,
      };

      try {
        await api.post("/incidents", newCase, {
          headers: {
            Authorization: ongId,
          },
        });

        Swal.fire("Cadastrado!", "Caso cadastrado com sucesso!", "success");

        history.push("/profile");
      } catch (err) {
        Swal.fire("Erro!", "Não foi possível cadastrar o caso.", "error");
      }
    },
  });

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          <h1>Cadastrar novo caso</h1>
          <p>
            Descreva o caso detalhadamente para encontrar um herói para resolver
            isso.
          </p>

          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar para a home
          </Link>
        </section>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group-props">
            <input
              placeholder="Título do caso"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            {formik.errors.title && formik.touched.title ? (
              <small>{formik.errors.title}</small>
            ) : null}
          </div>

          <div className="input-group-props">
            <textarea
              placeholder="Descrição"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
            />
            {formik.errors.description && formik.touched.description ? (
              <small>{formik.errors.description}</small>
            ) : null}
          </div>

          <div className="input-group-props">
            <input
              placeholder="Valor em reais"
              name="value"
              onChange={formik.handleChange}
              value={formik.values.value}
            />

            {formik.errors.value && formik.touched.value ? (
              <small>{formik.errors.value}</small>
            ) : null}
          </div>

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
