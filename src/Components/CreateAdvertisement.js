import React from 'react';
import Auth from '../Modules/Auth';
import axios from 'axios';

class CreateAdvertisement extends React.Component {
  constructor() {
    super();
    this.state = {
      book_title: '', 
      book_author: '',
      book_publication: '',
      comment: '', 
      status: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateAdvSubmit = this.handleCreateAdvSubmit.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const val = e.target.value;

    this.setState({
      [name]: val,
    });
  }

  handleCreateAdvSubmit(e, data) {
    e.preventDefault();
    axios.post(`http://localhost:3000/advertisements`, JSON.stringify(data), {
      headers: {
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`,
        'Content-Type': 'application/json',
      }
    }).then(response => {
      console.log(response);
      console.log("Anuncio feito com sucesso!");
    }).catch(err => {
      console.log(err);
      console.log("Erro ao criar anúncio");
    })
  }

  render() {
    return (
      <section id="createAdvForm"> 
        <div className="basic-form-wrapper">
          <form className="basic-form" onSubmit={(e) => this.handleCreateAdvSubmit(e, this.state)}>
            <h1 className="basic-form__title">Criar novo anúncio</h1>
            <span className="basic-form__instructions"> Os campos com * são obrigatórios. </span>

            <input 
              type="text"
              className="basic-form__input"
              name="book_title"
              placeholder="Nome do Livro *"
              value={this.state.book_title}
              onChange={this.handleChange}
            />

            <input 
              type="text"
              className="basic-form__input"
              name="book_author"
              placeholder="Autor do Livro *"
              value={this.state.book_author}
              onChange={this.handleChange}
            />

            <input 
              type="text"
              className="basic-form__input"
              name="book_publication"
              placeholder="Editora do Livro e Edição *"
              value={this.state.book_publication}
              onChange={this.handleChange}
            />

            <textarea 
              type="textarea"
              className="basic-form__textarea"
              name="comment"
              placeholder="Comentário sobre seu anúncio"
              value={this.state.comment}
              onChange={this.handleChange}
            />

            <button className="basic-form__btn">Anunciar</button>
          </form>
        </div>
      </section>
    )
  }
}

export default CreateAdvertisement;