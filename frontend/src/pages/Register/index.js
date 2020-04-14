import React from "react";
import { Link, useHistory } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import { FiArrowLeft } from "react-icons/fi";

import Swal from "sweetalert2";

import api from "../../services/api";

import "./styles.css";

import logoImg from "../../assets/logo.svg";

export default function Register() {
  const history = useHistory();

  const newOngSchema = Yup.object({
    name: Yup.string().required("O nome é obrigatório"),
    email: Yup.string()
      .email("Informe um e-mail válido!")
      .required("O e-mail é obrigatório!"),
    whatsapp: Yup.string().required("O número de WhatsApp é obrigatório"),
    city: Yup.string().required("A cidade é obrigatória"),
    uf: Yup.string().required("A UF é obrigatória"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      whatsapp: "",
      city: "",
      uf: "",
    },
    validationSchema: newOngSchema,
    onSubmit: async (values) => {
      const newOng = {
        name: values.name,
        email: values.email,
        whatsapp: values.whatsapp,
        city: values.city,
        uf: values.uf,
      };

      try {
        const response = await api.post("/ongs", newOng);

        Swal.fire(
          "Ong cadastrada!",
          `Seu ID de acesso é ${response.data.id}`,
          "success"
        );

        history.push("/");
      } catch (err) {
        Swal.fire("Erro!", "Não foi possível cadastrar a Ong.", "error");
      }
    },
  });

  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          <h1>Cadastro</h1>
          <p>
            Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem
            os casos da sua ONG.
          </p>

          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar para o logon
          </Link>
        </section>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-group-props">
            <input
              name="name"
              placeholder="Nome da ONG"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name && formik.touched.name ? (
              <small>{formik.errors.name}</small>
            ) : null}
          </div>

          <div className="input-group-props">
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              onChange={formik.handleChange}
              value={formik.values.email}
            />

            {formik.errors.email && formik.touched.email ? (
              <small>{formik.errors.email}</small>
            ) : null}
          </div>

          <div className="input-group-props">
            <input
              name="whatsapp"
              placeholder="WhatsApp"
              onChange={formik.handleChange}
              value={formik.values.whatsapp}
            />

            {formik.errors.whatsapp && formik.touched.whatsapp ? (
              <small>{formik.errors.whatsapp}</small>
            ) : null}
          </div>

          <div className="input-group">
            <div className="input-group-props">
              <input
                name="city"
                placeholder="Cidade"
                onChange={formik.handleChange}
                value={formik.values.city}
              />
              {formik.errors.city && formik.touched.city ? (
                <small>{formik.errors.city}</small>
              ) : null}
            </div>

            <div className="input-group-props">
              <input
                name="uf"
                placeholder="UF"
                style={{ width: 80, marginLeft: 8 }}
                onChange={formik.handleChange}
                value={formik.values.uf}
              />

              {formik.errors.uf && formik.touched.uf ? (
                <small style={{ marginLeft: 8 }}>{formik.errors.uf}</small>
              ) : null}
            </div>
          </div>

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
