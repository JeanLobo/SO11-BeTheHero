import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";

import Swal from "sweetalert2";

import api from "../../services/api";

import logoImg from "../../assets/logo.svg";

import "./styles.css";

export default function Profile() {
  const history = useHistory();

  const [incidents, setIncidents] = useState([]);

  const ongId = localStorage.getItem("ongId");
  const ongName = localStorage.getItem("ongName");

  useEffect(() => {
    api
      .get("profile", {
        headers: {
          Authorization: ongId,
        },
      })
      .then((response) => {
        setIncidents(response.data);
      });
  }, [ongId]);

  function handleLogout() {
    localStorage.clear();
    history.push("/");
  }

  function handleDeleteIncident(id) {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, pode remover!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          await api.delete(`incidents/${id}`, {
            headers: {
              Authorization: ongId,
            },
          });

          Swal.fire(
            "Removido!",
            "O caso foi removido com sucesso .",
            "success"
          );

          setIncidents(incidents.filter((incident) => incident.id !== id));
        } catch (err) {
          Swal.fire("Erro!", "Não foi possível remover o caso.", "error");
        }
      }
    });
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem vindo(a), {ongName}</span>
        <Link className="button" to="/incidents/new">
          Cadastrar novo caso
        </Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size={18} color="#E02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul>
        {incidents.map((incident) => (
          <li>
            <strong>CASO:</strong>
            <p>{incident.title}</p>
            <strong>DESCRIÇÃO:</strong>
            <p>{incident.description}</p>
            <strong>VALOR:</strong>
            <p>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(incident.value)}
            </p>

            <button
              type="button"
              onClick={() => handleDeleteIncident(incident.id)}
            >
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
