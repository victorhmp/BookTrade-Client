import React from 'react';
import axios from 'axios';
import Auth from '../Modules/Auth';
import {Link} from 'react-router-dom';

import placeholder from '../images/placeholder.png'

class AdvertisementCard extends React.Component {
  constructor() {
    super();
    this.state = {
      adv: {
        id: 0,
        book_title: '', 
        book_author: '',
        book_publication: '',
        comment: '', 
        status: 0,
        user: {
          username: ''
        }
      }
    }
    this.closeAdv = this.closeAdv.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.formatStatus = this.formatStatus.bind(this);
  }

  componentDidMount() {
    this.setState({
      adv: this.props.adv
    });
  }

  formatStatus(status) {
    switch(status) {
      case 'open':
        return 'Aberto'
      case 'closed':
        return 'Fechado'
      default:
        return 'Indefinido'
    }
  }

  formatDate(d) {
    this.date = new Date(d);
    // Sums 3 to hour due to timezone
    // Sums 1 to month because of Javascript implementation (month starts at 0)
    this.formattedDate = 
      (this.date.getHours() + 3)+":"+this.date.getMinutes()+" de "+
      this.date.getDate()+"/"+(this.date.getMonth() + 1)+"/"+this.date.getFullYear();

    return this.formattedDate;
  }

  closeAdv(e) {
    e.preventDefault();
    this.url = 'http://localhost:3000/advertisements/close/';

    axios.post(this.url, JSON.stringify({id: this.state.adv.id, advertisement: this.state.adv}), {
      headers: {
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`,
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log(response.data);
      alert('Anúncio fechado com sucesso');

      this.setState({
        adv: response.data.advertisement
      });

    }).catch((err) => {
      console.log(err);
      alert('Não foi possível fechar este anúncio. Tente novamente mais tarde.');
    });
  }

  render() {
    const FEED = 1;
    const MANAGE = 2;

    switch(this.props.type) {
      case FEED:
        return(
          <div id={this.state.adv.id} className='card-adv'>
            <img src={placeholder} alt='Imagem do livro anunciado' className="card-adv__book-image" />
            <div className='card-adv__card-info col'>
              <h2 className='title'>{this.state.adv.book_title}</h2>
              <p className='author'> <b>Autor:</b> {this.state.adv.book_author}</p>
              <p className='publication'> <b>Editora:</b> {this.state.adv.book_publication}</p>
              <p className='comment'> <b>Comentário do Usuário:</b> {this.state.adv.comment}</p>
            </div>
            <div className='card-adv__right-info'>
              <p className='created-at'> <b>Criado às:</b> {this.formatDate(this.state.adv.created_at)} </p>
              <p className='username'> <b>Por:</b> {this.state.adv.user.username}</p>
              <Link to={'http://localhost:8080/new-offer/' + this.state.adv.id}>
                <button className="btn btn-blue">Ofertar</button>
              </Link>
            </div>
          </div>
        );
      
      case MANAGE:
        return(
          <div id={this.state.adv.id} className='card-adv'>
            <div className='card-adv__card-info row'>
              <h2 className='title'>{this.state.adv.book_title}</h2>
              <p className='author'> <b>Autor:</b> {this.state.adv.book_author}</p>
              <p className='publication'> <b>Editora:</b> {this.state.adv.book_publication}</p>
              <p className='comment'> <b>Comentário:</b> {this.state.adv.comment}</p>
              <p className='created-at'> <b>Criado às:</b> {this.formatDate(this.state.adv.created_at)} </p>
              <p className='status'> <b>Status:</b> {this.formatStatus(this.state.adv.status)} </p>
                {this.state.adv.status === 'open' ? 
                  <div className='card-adv__right-info'>
                    <button className="btn-lg btn-blue">Editar</button>
                    <button className="btn btn-blue" onClick={() => {if(window.confirm('Deseja fechar o anúncio?')) {this.closeAdv};}}>Fechar anúncio</button>
                  </div>
                  :
                  <div className='card-adv__right-info'>
                    <button className="btn-lg btn-disabled" disabled>Editar</button>
                    <button className="btn btn-disabled" disabled>Anúncio fechado</button>
                  </div>
                }
              </div>
            
          </div>
        );
      
      default:
        return(<div class="loader" />);
    }
  };
}

export default AdvertisementCard;